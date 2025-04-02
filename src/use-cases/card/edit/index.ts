import * as Inversify from 'inversify';

import * as Repositories from 'app/repositories';
import * as Domain from 'app/domain';
import * as Factories from "app/factories"

import { RepositorySymbols } from 'app/repositories/dependency-symbols';
import { FactorySymbols } from 'app/factories/dependency-symbols';


export interface EditCardUseCase {
    execute(params: EditParams): Promise<Domain.Card>
}

@Inversify.injectable()
export class EditCardUseCaseImpl implements EditCardUseCase {
    constructor(
      @Inversify.inject(RepositorySymbols.CardRepository) private cardRepository: Repositories.CardRepository,
      @Inversify.inject(FactorySymbols.IdentifierFactory) private identifierFactory: Factories.IdentifierFactory,
      ) {}

    public async execute(params: EditParams): Promise<Domain.Card> {
        const card = await this.cardRepository.update({
            ...params,
            id: this.identifierFactory.construct(params.id)
        })

        if (!card) {
            throw new Error("Card not found");
        }

        return card
    }
}

interface EditParams {
    id: string
    deckId?: string
    front?: string
    back?: string
    level?: Domain.CardLevels
    schedulePeriod?: number
    createAt?: number
    levelUpdatedAt?: number
}