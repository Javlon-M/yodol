import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Models from "app/components"
import * as Factories from "app/factories"
import * as Infrastructure from "app/infrastructure"

import { FactorySymbols } from "app/factories/dependency-symbols"
import { ComponentsSymbols } from "app/components/dependency-symbols"

export interface DeckRepository {
    create(params: CreateParams): Promise<Domain.Deck>
    remove(params: RemoveParams): Promise<Domain.Deck>
    findById(id: Domain.Identifier): Promise<Domain.Deck>
}

@Inversify.injectable()
export class DeckRepositoryImpl implements DeckRepository {
    constructor(
        @Inversify.inject(FactorySymbols.DeckFactory) private deckFactory: Factories.DeckFactory,
        @Inversify.inject(ComponentsSymbols.MongooseStorage) private storage: Infrastructure.Storage,
    ){}

    public async create(params: CreateParams): Promise<Domain.Deck> {
        const deck = await this.storage.getDecksCollection().insertOne({
            user_id: params.user_id,
            title: params.title,
            active: params.active,
            description: params.description
        })

        return this.toDomainEntity(deck)
    }

    public async remove(params: RemoveParams): Promise<Domain.Deck> {
        const deck = await this.storage.getDecksCollection().findOneAndDelete<Models.DeckDocument>({
            _id: params.id
        })

        return this.toDomainEntity(deck)
    }

    public async findById(id: Domain.Identifier): Promise<Domain.Deck> {
        const deck = await this.storage.getDecksCollection().findById<Models.DeckDocument>({
            _id: id.toStorageValue()
        })

        return this.toDomainEntity(deck)
    }

    private toDomainEntity(deck: Models.DeckDocument): Domain.Deck {
        if (!deck) return null

        return this.deckFactory.construct({
            id: deck.id,
            user_id: deck.user_id,
            title: deck.title,
            active: deck.active,
            description: deck.description
        })
    }
}

interface CreateParams {
    user_id: string
    title: string
    active: boolean
    description?: string
}

interface RemoveParams {
    id: string
}