import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Factories from "app/factories"
import * as Repositories from "app/repositories"

import { RepositorySymbols } from "app/repositories/dependency-symbols"
import { FactorySymbols } from "app/factories/dependency-symbols"


export interface GetOneDeckUseCase {
    execute(params: Params): Promise<Response>
}

@Inversify.injectable()
export class GetOneDeckUseCaseImpl implements GetOneDeckUseCase {
    constructor(
        @Inversify.inject(RepositorySymbols.DeckRepository) private deckRepository: Repositories.DeckRepository,
        @Inversify.inject(FactorySymbols.IdentifierFactory) private identifierFactory: Factories.IdentifierFactory,
    ) {}

    public async execute(params: Params): Promise<Response> {
        const deck = await this.deckRepository.findById(this.identifierFactory.construct(params.deckId))
        if (!deck) throw new Error("Deck was not found")

        return {
            deck
        }
    }
}

interface Params {
    deckId: string
}

interface Response {
    deck: Domain.Deck
}