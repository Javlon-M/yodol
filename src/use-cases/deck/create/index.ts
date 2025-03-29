import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Factories from "app/factories"
import * as Repositories from "app/repositories"

import { RepositorySymbols } from "app/repositories/dependency-symbols"
import { FactorySymbols } from "app/factories/dependency-symbols"


export interface CreateDeckUseCase {
    execute(params: Params): Promise<Response>
}

@Inversify.injectable()
export class CreateDeckUseCaseImpl implements CreateDeckUseCase {
    constructor(
        @Inversify.inject(RepositorySymbols.DeckRepository) private deckRepository: Repositories.DeckRepository,
        @Inversify.inject(RepositorySymbols.UserRepository) private userRepository: Repositories.UserRepository,
        @Inversify.inject(FactorySymbols.IdentifierFactory) private identifierFactory: Factories.IdentifierFactory,
    ) {}

    public async execute(params: Params): Promise<Response> {
        const user = await this.userRepository.findById(this.identifierFactory.construct(params.userId))
        if (!user) throw new Error(`User was not found. User id: ${params.userId}`)
        
        const deck = await this.deckRepository.create({
            title: params.title,
            active: true,
            userId: params.userId,
            description: params.description
        })
        if (!deck) {
            console.log(`Deck was not created! User id ${params.userId}`)
        }

        return {
            deck
        }
    }
}

interface Params {
    userId: string
    title: string
    description?: string
}

interface Response {
    deck: Domain.Deck
}