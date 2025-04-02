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
}