import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as UseCases from "app/use-cases"
import * as Factories from "app/factories"
import * as Repositories from "app/repositories"

import { UseCaseSymbols } from "app/use-cases/dependency-symbols"
import { FactorySymbols } from "app/factories/dependency-symbols"
import { RepositorySymbols } from "app/repositories/dependency-symbols"


export interface ManageAndGetCarsUseCase {
    execute(params: Params): Promise<Response>
}

@Inversify.injectable()
export class ManageAndGetCarsUseCaseImpl implements ManageAndGetCarsUseCase {
    private lrnQueue: CardWithNote[]
    private newQueue: CardWithNote[]
    private revQueue: CardWithNote[]
    private reps: number = 0

    constructor(
        @Inversify.inject(FactorySymbols.IdentifierFactory) private identifierFactory: Factories.IdentifierFactory,
        @Inversify.inject(RepositorySymbols.DeckRepository) private deckRepository: Repositories.DeckRepository,
        @Inversify.inject(UseCaseSymbols.GetCardsUseCase) private getCardsUseCase: UseCases.GetCardsUseCase,
    ) {
        this.reset()
    }

    public async execute(params: Params): Promise<Response> {
        const deck = await this.deckRepository.findById(this.identifierFactory.construct(params.deckId))
        if (!deck) {
            throw new Error(`Deck was not found. Deck id ${params.deckId}`)
        }
        
        const card = await this.getCard(deck)
        if (card) {
            this.reps += 1
        }

        return card
    }

    private reset(): void {
        this.lrnQueue = []
        this.newQueue = []
        this.revQueue = []
    }

    private async getCard(deck: Domain.Deck): Promise<CardWithNote> {
        let card = await this.getLrnCard(deck.getId())
        if (card) {
            return card
        }
        
        if (this.isTimeForNew()) {
            card = await this.getNewCard(deck)
            if (card) {
                return card
            }
        }

        card = await this.getRevCard(deck)
        if (card) {
            return card
        }

        card = await this.getNewCard(deck)
        if (card) {
            return card
        }

        return await this.getLrnCard(deck.getId(), true)
    }

    private getNewCardModulus(): number {
        if (!this.newQueue.length) return 0

        const newCount = this.newQueue.length
        const revCount = this.revQueue.length

        let newCardModulus = Math.floor((newCount + revCount) / newCount)

        if (revCount) {
            newCardModulus = Math.max(2, newCardModulus)
        }

        return newCardModulus
    }

    private isTimeForNew(): boolean {
        const newCardModulus = this.getNewCardModulus()

        if (!newCardModulus || !this.reps) return false

        return this.reps % newCardModulus === 0
    }

    private async getNewCard(deck: Domain.Deck): Promise<CardWithNote> {
        if (this.newQueue.length) return this.newQueue.pop()

        const options = this.getOptions()
        const limit = Math.min(deck.getConfigurations().new.perDay, options.queueLimit)
        const due = this.getDue(options.collapseTime)

        this.newQueue = await this.getCardsUseCase.execute({
            deckId: deck.getId().toString(),
            queue: Domain.CardQueues.new,
            due: due,
            limit: limit
        })

        return this.newQueue.pop()
    }

    private async getLrnCard(deckId: Domain.Identifier, collapse?: boolean): Promise<CardWithNote> {
        if (this.lrnQueue.length) return this.lrnQueue.pop()

        const options = this.getOptions()
        const due = this.getDue(options.collapseTime, collapse)

        this.lrnQueue = await this.getCardsUseCase.execute({
            deckId: deckId.toString(),
            queue: Domain.CardQueues.lrn,
            due: due,
            limit: options.reportLimit
        })

        return this.lrnQueue.pop()
    }

    private async getRevCard(deck: Domain.Deck): Promise<CardWithNote> {
        if (this.revQueue.length) return this.revQueue.pop()

        const options = this.getOptions()
        const limit = Math.min(deck.getConfigurations().rev.perDay, options.queueLimit)
        const due = this.getDue(options.collapseTime)

        this.revQueue = await this.getCardsUseCase.execute({
            deckId: deck.getId().toString(),
            queue: Domain.CardQueues.rev,
            due: due,
            limit: limit
        })

        return this.revQueue.pop()
    }

    private getDue(collapseTime: number, collapse?: boolean): number {
        return collapse ? (new Date()).getTime() + collapseTime : (new Date()).getTime()
    }

    private getOptions(): Options {
        return {
            queueLimit: parseInt(process.env.QUEUE_LIMIT),
            reportLimit: parseInt(process.env.REPORT_LIMIT),
            collapseTime: parseInt(process.env.COLLAPSE_TIME)
        }
    }
}

interface Params {
    deckId: string
}

interface Response {

}

interface Options {
    queueLimit: number
    reportLimit: number
    collapseTime: number
}

interface CardWithNote {
    card: Domain.Card
    note: Domain.Note
}