import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Factories from "app/factories"
import * as Repositories from "app/repositories"

import { RepositorySymbols } from "app/repositories/dependency-symbols"
import { FactorySymbols } from "app/factories/dependency-symbols"


export interface GetCardsUseCase {
    execute(params: Params): Promise<Response>
}

@Inversify.injectable()
export class GetCardsUseCaseImpl implements GetCardsUseCase {
    constructor(
        @Inversify.inject(RepositorySymbols.CardRepository) private cardRepository: Repositories.CardRepository,
        @Inversify.inject(RepositorySymbols.DeckRepository) private deckRepository: Repositories.DeckRepository,
        @Inversify.inject(FactorySymbols.IdentifierFactory) private identifierFactory: Factories.IdentifierFactory,
    ) {}

    public async execute(params: Params): Promise<Response> {
        await this.checkDeck(params.deckId)

        const cards = await this.cardRepository.get(this.identifierFactory.construct(params.deckId))

        return {
            cards
        }
    }

    private async checkDeck(deckId: string): Promise<void> {
        const deck = await this.deckRepository.findById(this.identifierFactory.construct(deckId))

        if (!deck) {
            throw new Error(`Deck was not found. Deck id ${deckId}`)
        }
    }
}

interface Params {
    deckId: string
}

interface Response {
    cards: Domain.Card[]
}