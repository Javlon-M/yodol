import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as UseCases from "app/use-cases"
import * as Factories from "app/factories"
import * as Repositories from "app/repositories"
import * as Infrastructure from "app/infrastructure"

import { UseCaseSymbols } from "app/use-cases/dependency-symbols"
import { FactorySymbols } from "app/factories/dependency-symbols"
import { RepositorySymbols } from "app/repositories/dependency-symbols"
import { ComponentsSymbols } from "app/components/dependency-symbols"


export interface ManageAndGetCardUseCase {
    execute(params: Params): Promise<Response>
}

@Inversify.injectable()
export class ManageAndGetCardUseCaseImpl implements ManageAndGetCardUseCase {
    constructor(
        @Inversify.inject(ComponentsSymbols.Cache) private cache: Infrastructure.Cache,
        @Inversify.inject(FactorySymbols.IdentifierFactory) private identifierFactory: Factories.IdentifierFactory,
        @Inversify.inject(RepositorySymbols.DeckRepository) private deckRepository: Repositories.DeckRepository,
        @Inversify.inject(RepositorySymbols.UserRepository) private userRepository: Repositories.UserRepository,
        @Inversify.inject(UseCaseSymbols.GetCardsUseCase) private getCardsUseCase: UseCases.GetCardsUseCase,
    ) {}

    public async execute(params: Params): Promise<Response> {
        const { user, deck } = await this.getDeckAndUser(params.userId, params.deckId)
        const session: Session = JSON.parse(await this.cache.get(user.getId().toString()))

        const card = await this.getCard(user.getId(), deck)
        if (card) {
            session.reps += 1
            
            const expireInSeconds = this.getOptions().sessionTimeOutMinutes * 60

            await this.cache.set(user.getId().toString(), JSON.stringify(session), expireInSeconds)
        }

        return card
    }

    private async getDeckAndUser(userId: string, deckId: string): Promise<{ user: Domain.User, deck: Domain.Deck }> {
        const user = await this.userRepository.findById(this.identifierFactory.construct(userId))
        if (!user) {
            throw new Error(`User was not found. User id ${userId}`)
        }

        const deck = await this.deckRepository.findById(this.identifierFactory.construct(deckId))
        if (!deck) {
            throw new Error(`Deck was not found. Deck id ${deckId}`)
        }

        return {
            user, 
            deck
        }
    }

    private async getCard(userId: Domain.Identifier, deck: Domain.Deck): Promise<CardWithNote> {
        let card = await this.getLrnCard(userId, deck.getId())
        if (card) {
            return card
        }
        
        if (this.isTimeForNew(userId)) {
            card = await this.getNewCard(userId, deck)
            if (card) {
                return card
            }
        }

        card = await this.getRevCard(userId, deck)
        if (card) {
            return card
        }

        card = await this.getNewCard(userId, deck)
        if (card) {
            return card
        }

        return await this.getLrnCard(userId, deck.getId(), true)
    }

    private getNewCardModulus(queue: Queue): number {
        if (!queue.new.length) return 0

        const newCount = queue.new.length
        const revCount = queue.rev.length

        let newCardModulus = Math.floor((newCount + revCount) / newCount)

        if (revCount) {
            newCardModulus = Math.max(2, newCardModulus)
        }

        return newCardModulus
    }

    private async isTimeForNew(userId: Domain.Identifier): Promise<boolean> {
        const session: Session = JSON.parse(await this.cache.get(userId.toString()))

        const newCardModulus = this.getNewCardModulus(session.queue)

        if (!newCardModulus || !session.reps) return false

        return session.reps % newCardModulus === 0
    }

    private async getNewCard(userId: Domain.Identifier, deck: Domain.Deck): Promise<CardWithNote> {
        const session = JSON.parse(await this.cache.get(userId.toString()))

        if (session.queue.new.length) return session.queue.new.pop()

        const options = this.getOptions()
        const limit = Math.min(deck.getConfigurations().new.perDay, options.queueLimit)
        const due = this.getDue(options.collapseTime)

        const newQueue = await this.getCardsUseCase.execute({
            deckId: deck.getId().toString(),
            queue: Domain.CardQueues.new,
            due: due,
            limit: limit
        })

        session.queue.new = newQueue
        const expireInSeconds = options.sessionTimeOutMinutes * 60

        await this.cache.set(userId.toString(), JSON.stringify(session), expireInSeconds)

        return newQueue.pop()
    }

    private async getLrnCard(userId: Domain.Identifier, deckId: Domain.Identifier, collapse?: boolean): Promise<CardWithNote> {
        const session: Session = JSON.parse(await this.cache.get(userId.toString()))

        if (session.queue.lrn.length) return session.queue.lrn.pop()

        const options = this.getOptions()
        const due = this.getDue(options.collapseTime, collapse)

        const lrnQueue = await this.getCardsUseCase.execute({
            deckId: deckId.toString(),
            queue: Domain.CardQueues.lrn,
            due: due,
            limit: options.reportLimit
        })

        session.queue.lrn = lrnQueue
        const expireInSeconds = options.sessionTimeOutMinutes * 60

        await this.cache.set(userId.toString(), JSON.stringify(session), expireInSeconds)

        return lrnQueue.pop()
    }

    private async getRevCard(userId: Domain.Identifier, deck: Domain.Deck): Promise<CardWithNote> {
        const session: Session = JSON.parse(await this.cache.get(userId.toString()))

        if (session.queue.rev.length) return session.queue.rev.pop()

        const options = this.getOptions()
        const limit = Math.min(deck.getConfigurations().rev.perDay, options.queueLimit)
        const due = this.getDue(options.collapseTime)

        const revQueue = await this.getCardsUseCase.execute({
            deckId: deck.getId().toString(),
            queue: Domain.CardQueues.rev,
            due: due,
            limit: limit
        })

        session.queue.rev = revQueue
        const expireInSeconds = options.sessionTimeOutMinutes * 60

        await this.cache.set(userId.toString(), JSON.stringify(session), expireInSeconds)

        return revQueue.pop()
    }

    private getDue(collapseTime: number, collapse?: boolean): number {
        return collapse ? (new Date()).getTime() + collapseTime : (new Date()).getTime()
    }

    private getOptions(): Options {
        return {
            queueLimit: parseInt(process.env.QUEUE_LIMIT),
            reportLimit: parseInt(process.env.REPORT_LIMIT),
            collapseTime: parseInt(process.env.COLLAPSE_TIME),
            sessionTimeOutMinutes: parseInt(process.env.SESSION_TIMEOUT_MINUTES),
        }
    }
}

interface Params {
    deckId: string
    userId: string
}

type Response = CardWithNote

interface CardWithNote {
    card: Domain.Card
    note: Domain.Note
}

interface Session {
    reps: number
    queue: Queue
}

interface Queue {
    lrn: CardWithNote[],
    new: CardWithNote[],
    rev: CardWithNote[]
}

interface Options {
    queueLimit: number
    reportLimit: number
    collapseTime: number
    sessionTimeOutMinutes: number
}
