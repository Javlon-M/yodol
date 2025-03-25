import * as Inversify from "inversify"

import * as Domain from "../../domain"
import * as Factories from "../../factories"

import { FactorySymbols } from "../../factories/dependency-symbols"


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
            this.identifierFactory.construct(params.id),
            this.identifierFactory.construct(params.deckId),
            params.front,
            params.back,
            params.level,
            params.schedulePeriod,
            params.createAt,
            params.levelUpdatedAt
        )
    }
}

interface Params{
    id: string
    deckId: string
    front: string
    back: string
    level: Domain.CardLevels
    schedulePeriod: number
    createAt: number
    levelUpdatedAt: number
}