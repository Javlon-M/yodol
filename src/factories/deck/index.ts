import * as Inversify from "inversify"

import * as Domain from "app/domain"

export interface DeckFactory {
    construct(params: Params): Domain.Deck
}

@Inversify.injectable()
export class DeckFactoryImpl implements DeckFactory {
    construct(params: Params): Domain.Deck {
        return new Domain.Deck(
            params.id,
            params.userId,
            params.title,
            params.active,
            params.configurations,
            params.description
        )
    }
}

export interface Params {
    id: string
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