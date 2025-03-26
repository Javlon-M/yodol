import * as Inversify from 'inversify';
import * as Repositories from '../../../repositories';

import { RepositorySymbols } from '../../../repositories/dependency-symbols';
import { Card } from '../../../domain';


export interface EditCardUseCase {
    execute(params: Repositories.EditParams): Promise<Card>
}

@Inversify.injectable()
export class EditCardUseCaseImpl implements EditCardUseCase {
    constructor(
      @Inversify.inject(RepositorySymbols.CardRepository) private cardRepository: Repositories.CardRepository,
      ) {}

    public async execute(params: Repositories.EditParams): Promise<Card> {
        const card = await this.cardRepository.update(params)

        return card
    }
}
