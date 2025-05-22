import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Factories from "app/factories"
import * as Repositories from "app/repositories"

import { RepositorySymbols } from "app/repositories/dependency-symbols"
import { FactorySymbols } from "app/factories/dependency-symbols"


export interface AnswerCardUseCase {
    execute(params: Params): Promise<Response>
}

@Inversify.injectable()
export class AnswerCardUseCaseImpl implements AnswerCardUseCase {
    constructor(
        @Inversify.inject(RepositorySymbols.CardRepository) private cardRepository: Repositories.CardRepository,
        @Inversify.inject(RepositorySymbols.DeckRepository) private deckRepository: Repositories.DeckRepository,
        @Inversify.inject(RepositorySymbols.NoteRepository) private noteRepository: Repositories.NoteRepository,
        @Inversify.inject(FactorySymbols.IdentifierFactory) private identifierFactory: Factories.IdentifierFactory,
    ) {}

    public async execute(params: Params): Promise<Response> {
        const { card, deck } = await this.validateInput(params)
        const updatedCard = await this.incRepetitions(card)

        if (updatedCard.getQueue() === Domain.CardQueues.new) {
            await this.answerNewCard(updatedCard, deck)
        }
        else if ([Domain.CardQueues.lrn, Domain.CardQueues.suspend].includes(updatedCard.getQueue())) {
            await this.answerLrnCard(updatedCard, deck, params.ease)
        }
        else {
            await this.answerRevCard(updatedCard, deck)
        }

        return {
            cardId: updatedCard.getId()
        }
    }

    private async incRepetitions(card: Domain.Card): Promise<Domain.Card> {
        const reps = card.getRepetitions() + 1

        return await this.cardRepository.update({
            id: card.getId(),
            repetitions: reps
        })
    }

    private async answerNewCard(card: Domain.Card, deck: Domain.Deck): Promise<Domain.Card> {
        const conf = this.getConf(card, deck)

        return await this.cardRepository.update({
            id: card.getId(),
            queue: 1,
            type: 1,
            left: conf.delays.length
        })
    }

    private async answerLrnCard(card: Domain.Card, deck: Domain.Deck, ease: number): Promise<Domain.Card> {
        const conf = this.getConf(card, deck)

        if (ease === 4) {
            return await this.rescheduleAsRev(card, conf, true)
        }
        else if (ease === 3) {
            if (card.getLeft() - 1 <= 0) {
                return await this.rescheduleAsRev(card, conf, false)
            }
            else {
                return await this.moveToNextStep(card, conf)
            }
        }
        else if (ease == 2) {
            return await this.repeatStep(card, conf)
        }
        else {
            return await this.moveToFirstStep(card, conf)
        }
    }

    private async rescheduleAsRev(card: Domain.Card, conf: Conf, early: boolean): Promise<Domain.Card> {
        const lapse = card.getType() === Domain.CardTypes.Review

        if (lapse) {
            return await this.rescheduleGraduatingLapse(card)
        }
        else {  
            return await this.rescheduleNew(card, conf as ConfNew, early)
        }
    }

    private async rescheduleGraduatingLapse(card: Domain.Card): Promise<Domain.Card> {
        const today = new Date()
        today.setDate(today.getDate() + card.getInterval())

        const due = today.getTime()

        return await this.cardRepository.update({
            id: card.getId(),
            due,
            type: Domain.CardTypes.Review,
            queue: Domain.CardQueues.rev
        })
    }

    private async rescheduleNew(card: Domain.Card, conf: ConfNew, early: boolean): Promise<Domain.Card> {
        const ivl = this.graduatingInv(card, conf, early)

        const today = new Date()
        today.setDate(today.getDate() + ivl)

        const due = today.getTime()
        const factor = conf.initialFactor

        return await this.cardRepository.update({
            id: card.getId(),
            interval: ivl,
            due,
            factor,
            type: Domain.CardTypes.Review,
            queue: Domain.CardQueues.rev
        })
    }

    private graduatingInv(card: Domain.Card, conf: ConfNew, early: boolean): number {
        if ([Domain.CardTypes.Relearning, Domain.CardTypes.Review].includes(card.getType())) {
            return card.getInterval()
        }

        if (early) {
            return conf.ints[1]
        }

        return conf.ints[0]
    }

    private async moveToNextStep(card: Domain.Card, conf: Conf): Promise<Domain.Card> {
        const left = card.getLeft() - 1
        const delay = conf.delays[-left] * 60

        const updatedCard = await this.cardRepository.update({
            id: card.getId(),
            left
        })

        return await this.rescheduleLrnCard(updatedCard, conf, delay)
    }

    private async repeatStep(card: Domain.Card, conf: Conf): Promise<Domain.Card> {
        const delay1 = conf.delays[-card.getLeft()] * 60
        const delay2 = conf.delays[-card.getLeft() - 1] * 60
        const avg = Math.floor((delay1 + Math.max(delay1, delay2)) / 2)

        return await this.rescheduleLrnCard(card, conf, avg)
    }

    private async moveToFirstStep(card: Domain.Card, conf: Conf): Promise<Domain.Card> {
        const left = conf.delays.length
        const updatedCard = await this.cardRepository.update({
            id: card.getId(),
            left
        })

        if (updatedCard.getType() == Domain.CardTypes.Relearning) {
            await this.updateRevIvlOnFail(updatedCard, conf as ConfLapse)
        }

        return this.rescheduleLrnCard(updatedCard, conf)
    }

    private async updateRevIvlOnFail(card: Domain.Card, conf: ConfLapse): Promise<Domain.Card> {
        const ivl = Math.max(1, conf.minInt, card.getInterval() * conf.mult)

        return await this.cardRepository.update({
            id: card.getId(),
            interval: ivl
        })
    }

    private async rescheduleLrnCard(card: Domain.Card, conf: Conf, delay?: number): Promise<Domain.Card> {
        if (!delay) {
            delay = conf.delays[-card.getLeft()] * 60
        }
        const due = (new Date()).getTime() + delay
        
        return await this.cardRepository.update({
            id: card.getId(),
            due,
            queue: Domain.CardQueues.lrn
        })
    }

    private async answerRevCard(card: Domain.Card, deck: Domain.Deck) {
        
    }

    private getConf(card: Domain.Card, deck: Domain.Deck): Conf {
        if (card.getType() === Domain.CardTypes.Review) {
            return deck.getConfigurations().lapse
        }
        else {
            return deck.getConfigurations().new
        }
    }

    private async validateInput(params: Params): Promise<{ card: Domain.Card, deck: Domain.Deck }> {
        if (params.ease < 1 || params.ease > 4) {
            throw new Error("Ease is not valid")
        }

        const card = await this.cardRepository.findOneById(this.identifierFactory.construct(params.cardId))
        if (!card) {
            throw new Error("Card was not found")
        }

        const deck = await this.deckRepository.findById(card.getDeckId())
        if (!deck) {
            throw new Error("Deck was not found")
        }

        return {
            card, 
            deck
        }
    }
}

interface Params {
    cardId: string
    ease: number
}

interface Response {
    cardId: Domain.Identifier
}

type Conf = ConfNew | ConfLapse

interface ConfNew {
    delays: number[]
    ints: number[]
    initialFactor: number
    perDay: number
}

interface ConfLapse {
    delays: number[]
    mult: number
    minInt: number
    leechFails: number
}