import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Factories from "app/factories"

import { FactorySymbols } from "app/factories/dependency-symbols"


export interface DeckFactory {
    construct(params: Params): Domain.Deck
}

@Inversify.injectable()
export class DeckFactoryImpl implements DeckFactory {
    constructor(
        @Inversify.inject(FactorySymbols.IdentifierFactory) private identifierFactory: Factories.IdentifierFactory,
    ){}

    construct(params: Params): Domain.Deck {
        return new Domain.Deck(
            this.identifierFactory.construct(params.id.toHexString()),
            params.userId,
            params.title,
            params.active,
            params.configurations,
            params.description
        )
    }
}

export interface Params {
    id: Domain.StorageValue
    userId: string
    title: string
    active: boolean
    description?: string
    configurations: {
        new: {
            delay: []
            ints: []
            initialFactor: number
            perDay: number
        },
        rev: {
            perDay: number
            ease4: number
            maxIvl: number
            hardFactor: number
        },
        lapse: {
            delays: []
            mult: number
            minInt: number
            leechFails: number
        }
    }
}