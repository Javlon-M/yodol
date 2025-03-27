import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Factories from "app/factories"
import * as Repositories from "app/repositories"

import { RepositorySymbols } from "app/repositories/dependency-symbols"
import { FactorySymbols } from "app/factories/dependency-symbols"


export interface GetDecksUseCase {
    execute(params: Params): Promise<Response>
}

@Inversify.injectable()
export class GetDecksUseCaseImpl implements GetDecksUseCase {
    constructor(
        @Inversify.inject(RepositorySymbols.DeckRepository) private deckRepository: Repositories.DeckRepository,
        @Inversify.inject(RepositorySymbols.UserRepository) private userRepository: Repositories.UserRepository,
        @Inversify.inject(FactorySymbols.IdentifierFactory) private identifierFactory: Factories.IdentifierFactory,
    ) {}

    public async execute(params: Params): Promise<Response> {
        const user = await this.userRepository.findById(this.identifierFactory.construct(params.userId))
        if (!user) throw new Error("User was not found")
        
        const decks = await this.deckRepository.findByUserId(this.identifierFactory.construct(params.userId))
        if (!decks) {
            console.log(`Decks were not found! User id ${params.userId}`)
        }

        return {
            decks
        }
    }
}

interface Params {
    userId: string
}

interface Response {
    decks: Domain.Deck[]
}