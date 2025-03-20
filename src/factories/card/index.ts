import * as Inversify from "inversify"

import * as Domain from "../../domain"

export interface CardFactory {
    construct(params: Params): Domain.Card
}

@Inversify.injectable()
export class CardFactoryImpl implements CardFactory {
    public construct(params: Params): Domain.Card {
        return new Domain.Card(
            params.id,
            params.deckId,
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