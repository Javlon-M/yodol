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
        this.validateEase(params.ease)

        const card = await this.cardRepository.findOneById(this.identifierFactory.construct(params.cardId))
        if (!card) {
            throw new Error("Card was not found")
        }

        const deck = await this.deckRepository.findById(card.getDeckId())
        if (!deck) {
            throw new Error("Deck was not found")
        }

        if (card.getQueue() === Domain.CardQueues.new) {
            await this.answerNewCard(card, deck)
        }
        else if ([Domain.CardQueues.lrn, Domain.CardQueues.suspend].includes(card.getQueue())) {
            await this.answerLrnCard(card, deck, params.ease)
        }
        else {
            await this.answerRevCard(card, deck)
        }

        return {
            cardId: card.getId()
        }
    }

    private async answerNewCard(card: Domain.Card, deck: Domain.Deck) {
        const reps = card.getRepetitions() + 1
        const conf = this.getConf(card, deck)

        await this.cardRepository.update({
            id: card.getId(),
            repetitions: reps,
            queue: 1,
            type: 1,
            left: conf.delays.length
        })
    }

    private async answerLrnCard(card: Domain.Card, deck: Domain.Deck, ease: number) {
        const conf = this.getConf(card, deck)

        if (ease === 4) {
            await this.reschaduleAsRev(card, conf, true)
        }
        else if (ease === 3) {
            if (card.getLeft() - 1 <= 0) {
                await this.reschaduleAsRev(card, conf, true)
            }
            else {
                await this.moveToNextStep(card, conf)
            }
        }
        else if (ease == 2) {
            await this.repeatStep(card, conf)
        }
        else {
            await this.moveToFirstStep(card, conf)
        }
    }

    private async reschaduleAsRev(card: Domain.Card, conf: Conf, early: boolean) {

    }

    private async moveToNextStep(card: Domain.Card, conf: Conf) {

    }

    private async repeatStep(card: Domain.Card, conf: Conf) {

    }

    private async moveToFirstStep(card: Domain.Card, conf: Conf) {

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

    private async validateEase(ease: number): Promise<void> {
        if (ease < 1 || ease > 4) {
            throw new Error("Ease is not valid")
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