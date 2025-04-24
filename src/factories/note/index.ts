import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Factories from "app/factories"

import { FactorySymbols } from "app/factories/dependency-symbols"


export interface NoteFactory {
    construct(params: Params): Domain.Note
}

@Inversify.injectable()
export class NoteFactoryImpl implements NoteFactory {
    constructor(
        @Inversify.inject(FactorySymbols.IdentifierFactory) private identifierFactory: Factories.IdentifierFactory
    ){}

    public construct(params: Params): Domain.Note {
        return new Domain.Note(
            this.identifierFactory.construct(params.id.toHexString()),
            this.identifierFactory.construct(params.cardId.toHexString()),
            this.identifierFactory.construct(params.deckId.toHexString()),
            params.createdAt,
            params.front,
            params.back
        )
    }
}

interface Params{
    id: Domain.StorageValue
    cardId: Domain.StorageValue
    deckId: Domain.StorageValue
    createdAt: number
    front: string
    back: string
}