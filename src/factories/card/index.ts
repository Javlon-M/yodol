import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Factories from "app/factories"

import { FactorySymbols } from "app/factories/dependency-symbols"



export interface CardFactory {
    construct(params: Params): Domain.Card
}

@Inversify.injectable()
export class CardFactoryImpl implements CardFactory {
    constructor(
        @Inversify.inject(FactorySymbols.IdentifierFactory) private identifierFactory: Factories.IdentifierFactory
    ){}

    public construct(params: Params): Domain.Card {
        return new Domain.Card(
            this.identifierFactory.construct(params.id.toHexString()),
            this.identifierFactory.construct(params.deckId.toHexString()),
            params.createdAt,
            params.type,
            params.queue,
            params.interval,
            params.factor,
            params.repetitions,
            params.lapses,
            params.left,
            params.due
        )
    }
}

interface Params{
    id: Domain.StorageValue
    deckId: Domain.StorageValue
    createdAt: number
    type: number
    queue: number
    interval: number
    factor: number
    repetitions: number
    lapses: number
    left: number
    due: number
}