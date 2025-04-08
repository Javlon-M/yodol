import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Models from "app/components"
import * as Factories from "app/factories"
import * as Infrastructure from "app/infrastructure"

import { FactorySymbols } from "app/factories/dependency-symbols"
import { ComponentsSymbols } from "app/components/dependency-symbols"


export interface CardRepository {
    get(deckId: string): Promise<Domain.Card[]>
    create(params: CreateParams): Promise<Domain.Card>
    deleteById(id: Domain.Identifier): Promise<Domain.Card>
    update(params: EditParams): Promise<Domain.Card>
    findByDeckId(deckId: string): Promise<Domain.Card[]>
}

@Inversify.injectable()
export class CardRepositoryImpl implements CardRepository {
    constructor(
        @Inversify.inject(FactorySymbols.CardFactory) private cardFactory: Factories.CardFactory,
        @Inversify.inject(ComponentsSymbols.MongooseStorage) private storage: Infrastructure.Storage,
    ) {}

    public async get(deckId: string): Promise<Domain.Card[]> {
        const cards = await this.storage.getCardsCollection().find({ deck_id: deckId })

        return cards.map(this.toDomainEntity.bind(this));
    }

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

    public async deleteById(id: Domain.Identifier): Promise<Domain.Card> {
        const card = await this.storage.getCardsCollection().findByIdAndDelete<Models.CardDocument>({
            _id: id
        })  

        return this.toDomainEntity(card)
    }

    public async update(params: EditParams): Promise<Domain.Card> {
        const filter = { _id: params.id.toStorageValue() };

        const updateCard = {
            $set: params
        };

        const card = await this.storage.getCardsCollection().findOneAndUpdate(
            filter,
            updateCard,
            { returnOriginal: false }
        )

        return this.toDomainEntity(card)
    }

    public async findByDeckId(deckId: string): Promise<Domain.Card[]> {
        const cards = await this.storage.getCardsCollection().find<Models.CardDocument>({
            deck_id: deckId
        })

        return cards.map(this.toDomainEntity.bind(this))
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

interface EditParams extends Partial<CreateParams> {
    id: Domain.Identifier
}
