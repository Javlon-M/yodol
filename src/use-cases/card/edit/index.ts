import * as Inversify from 'inversify';
import * as Repositories from 'app/repositories';
import * as Domain from 'app/domain';

import { RepositorySymbols } from 'app/repositories/dependency-symbols';


export interface EditCardUseCase {
    execute(params: EditParams): Promise<Domain.Card>
}

@Inversify.injectable()
export class EditCardUseCaseImpl implements EditCardUseCase {
    constructor(
      @Inversify.inject(RepositorySymbols.CardRepository) private cardRepository: Repositories.CardRepository,
      ) {}

    public async execute(params: EditParams): Promise<Domain.Card> {
        const card = await this.cardRepository.update(params)
        if (!card) {
            throw new Error("Card not found");
        }
        return card
    }
}

export interface EditParams {
    id: string
    deckId?: string
    front?: string
    back?: string
    level?: Domain.CardLevels
    schedulePeriod?: number
    createAt?: number
    levelUpdatedAt?: number
}