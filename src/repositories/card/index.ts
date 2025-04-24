import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Models from "app/components"
import * as Factories from "app/factories"
import * as Infrastructure from "app/infrastructure"

import { FactorySymbols } from "app/factories/dependency-symbols"
import { ComponentsSymbols } from "app/components/dependency-symbols"


export interface CardRepository {
    create(params: CreateParams): Promise<Domain.Card>
    deleteById(id: Domain.Identifier): Promise<Domain.Card>
    update(params: EditParams): Promise<Domain.Card>
    findOneById(id: Domain.Identifier): Promise<Domain.Card>
    findByDeckId(deckId: Domain.Identifier): Promise<Domain.Card[]>
    findByFilter(filter: Filter): Promise<Domain.Card[]>
}

@Inversify.injectable()
export class CardRepositoryImpl implements CardRepository {
    constructor(
        @Inversify.inject(FactorySymbols.CardFactory) private cardFactory: Factories.CardFactory,
        @Inversify.inject(ComponentsSymbols.MongooseStorage) private storage: Infrastructure.Storage,
    ) {}

    public async findOneById(id: Domain.Identifier): Promise<Domain.Card> {
        const card = await this.storage.getCardsCollection().findOne({ id: id.toStorageValue() })

        return this.toDomainEntity(card)
    }

    public async create(params: CreateParams): Promise<Domain.Card> {
        const card = await this.storage.getCardsCollection().insertOne({
            deck_id: params.deckId.toStorageValue(),
            created_at: params.createdAt,
            type: params.type,
            queue: params.queue,
            interval: params.interval,
            repetitions: params.repetitions,
            factor: params.factor,
            lapses: params.lapses,
            left: params.left,
            due: params.due
        })

        return this.toDomainEntity(card)
    }

    public async deleteById(id: Domain.Identifier): Promise<Domain.Card> {
        const card = await this.storage.getCardsCollection().findByIdAndDelete<Models.CardDocument>({
            _id: id.toStorageValue()
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

    public async findByDeckId(deckId: Domain.Identifier): Promise<Domain.Card[]> {
        const cards = await this.storage.getCardsCollection().find<Models.CardDocument>({
            deck_id: deckId.toStorageValue()
        })

        return cards.map(this.toDomainEntity.bind(this))
    }

    public async findByFilter(filter: Filter): Promise<Domain.Card[]> {
        const cards = await this.storage.getCardsCollection().find<Models.CardDocument>({
            deck_id: filter.deckId.toStorageValue(),
            due: { $lte: filter.due }
        }, 
        {
            sort: filter.sort,
            limit: filter.limit
        })

        return cards.map(this.toDomainEntity.bind(this))
    }

    private toDomainEntity(card: Models.CardDocument): Domain.Card {
        if (!card) return null

        return this.cardFactory.construct({
            id: card.id,
            deckId: card.deck_id,
            createdAt: card.created_at,
            type: card.type,
            queue: card.queue,
            interval: card.interval,
            factor: card.factor,
            repetitions: card.repetitions,
            lapses: card.lapses,
            left: card.left,
            due: card.due
        })
    }
}

interface CreateParams {
    deckId: Domain.Identifier
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

interface EditParams extends Partial<CreateParams> {
    id: Domain.Identifier
}

interface Filter {
    deckId: Domain.Identifier
    due: number
    limit: number
    sort: Sort
}

export enum Sort {
    Ascending = -1,
    Descending = 1
}