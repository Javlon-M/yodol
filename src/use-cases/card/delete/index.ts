import * as Inversify from "inversify"

import * as Factories from "app/factories"
import * as Repositories from "app/repositories"

import { RepositorySymbols } from "app/repositories/dependency-symbols"
import { FactorySymbols } from "app/factories/dependency-symbols"


export interface DeleteCardUseCase {
    execute(params: Params): Promise<Response>
}

@Inversify.injectable()
export class DeleteCardUseCaseImpl implements DeleteCardUseCase {
    constructor(
        @Inversify.inject(RepositorySymbols.CardRepository) private cardRepository: Repositories.CardRepository,
        @Inversify.inject(FactorySymbols.IdentifierFactory) private identifierFactory: Factories.IdentifierFactory,
    ) {}

    public async execute(params: Params): Promise<Response> {
        const deck = await this.cardRepository.deleteById(this.identifierFactory.construct(params.cardId))
        
        return {
            seccuess: !!deck
        }
    }
}

interface Params {
    deckId?: string
    cardId: string
}

interface Response {
    seccuess: boolean
    message?: string
}