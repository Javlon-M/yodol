import * as Inversify from 'inversify';

import * as Repositories from 'app/repositories';
import * as Domain from 'app/domain';
import * as Factories from "app/factories"

import { RepositorySymbols } from 'app/repositories/dependency-symbols';
import { FactorySymbols } from 'app/factories/dependency-symbols';


export interface EditCardUseCase {
    execute(params: Params): Promise<Response>
}

@Inversify.injectable()
export class EditCardUseCaseImpl implements EditCardUseCase {
    constructor(
      @Inversify.inject(RepositorySymbols.NoteRepository) private noteRepository: Repositories.NoteRepository,
      @Inversify.inject(RepositorySymbols.CardRepository) private cardRepository: Repositories.CardRepository,
      @Inversify.inject(FactorySymbols.IdentifierFactory) private identifierFactory: Factories.IdentifierFactory,
      ) {}

    public async execute(params: Params): Promise<Response> {
        const card = await this.cardRepository.findOneById(this.identifierFactory.construct(params.id))
        if (!card) {
            throw new Error("Card not found");
        }

        const note = await this.noteRepository.updateByCardId(card.getId(), params.note)
        if (!note) {
            throw new Error("Note not found");
        }

        return {
            card,
            note
        }
    }
}

interface Params {
    id: string
    note: {
        front?: string
        back?: string
    }
}

interface Response {
    card: Domain.Card
    note: Domain.Note
}