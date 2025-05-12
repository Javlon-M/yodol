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

        if (card.getType() === Domain.CardTypes.New) {
            await this.answerNewCard(card)
        }
        else if ([Domain.CardTypes.Learning, Domain.CardTypes.Relearning].includes(card.getType())) {
            await this.answerLrnCard(params)
        }
        else {
            await this.answerRevCard(params)
        }

        return {
            cardId: card.getId()
        }
    }

    private async answerNewCard(card: Domain.Card) {
        const reps = card.getRepetitions() + 1
        const left = 0

        await this.cardRepository.update({
            id: card.getId(),
            repetitions: reps,
            queue: 1,
            type: 1,
            left: left
        })
    }

    private async answerLrnCard(params: Params) {
        
    }

    private async answerRevCard(params: Params) {
        
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