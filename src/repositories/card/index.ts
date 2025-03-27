import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Models from "app/components"
import * as Factories from "app/factories"
import * as Infrastructure from "app/infrastructure"

import { FactorySymbols } from "app/factories/dependency-symbols"
import { ComponentsSymbols } from "app/components/dependency-symbols"


export interface CardRepository {
    create(params: CreateParams): Promise<Domain.Card>
}

@Inversify.injectable()
export class CardRepositoryImpl implements CardRepository {
    constructor(
        @Inversify.inject(FactorySymbols.CardFactory) private cardFactory: Factories.CardFactory,
        @Inversify.inject(ComponentsSymbols.MongooseStorage) private storage: Infrastructure.Storage,
    ) { }

    public async create(params: CreateParams): Promise<Domain.Card> {
        const card = await this.storage.getCardsCollection().insertOne({
            deck_id: params.deckId,
            front: params.front,
            back: params.back,
            level: params.level,
            schedule_period: params.schedulePeriod,
            created_at: params.createAt,
            level_updated_at: params.levelUpdatedAt
        })

        return this.toDomainEntity(card)
    }

    private toDomainEntity(card: Models.CardDocument): Domain.Card {
        if (!card) return null

        return this.cardFactory.construct({
            id: card.id,
            deckId: card.deck_id,
            front: card.front,
            back: card.back,
            level: card.level,
            schedulePeriod: card.schedule_period,
            createAt: card.created_at,
            levelUpdatedAt: card.level_updated_at
        })
    }
}

interface CreateParams {
    deckId: string
    front: string
    back: string
    level: Domain.CardLevels
    schedulePeriod: number
    createAt: number
    levelUpdatedAt: number
}