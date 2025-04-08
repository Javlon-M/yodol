import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Factories from "app/factories"
import * as Repositories from "app/repositories"

import { RepositorySymbols } from "app/repositories/dependency-symbols"
import { FactorySymbols } from "app/factories/dependency-symbols"


export interface EditDeckUseCase {
    execute(params: Params): Promise<Response>
}

@Inversify.injectable()
export class EditDeckUseCaseImpl implements EditDeckUseCase {
    constructor(
        @Inversify.inject(RepositorySymbols.DeckRepository) private deckRepository: Repositories.DeckRepository,
        @Inversify.inject(FactorySymbols.IdentifierFactory) private identifierFactory: Factories.IdentifierFactory,
    ){}

    public async execute(params: Params): Promise<Response> {
        await this.checkDeck(params.deckId)

        const deck = await this.deckRepository.update({
            id: this.identifierFactory.construct(params.deckId),
            title: params?.title,
            active: params?.active,
            description: params?.description
        })

        return {
            deck
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
    title?: string
    active?: boolean
    description?: string
}

interface Response {
    deck: Domain.Deck
}