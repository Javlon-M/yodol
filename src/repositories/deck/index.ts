import * as Inversify from "inversify"

import * as Domain from "../../domain"
import * as Models from "../../components"
import * as Factories from "../../factories"
import * as Infrastructure from "../../infrastructure"
import { FactorySymbols } from "../../factories/dependency-symbols"
import { ComponentsSymbols } from "../../components/dependency-symbols"

export interface DeckRepository {
    create(params: CreateParams): Promise<Domain.Deck>
    remove(params: RemoveParams): Promise<Domain.Deck>
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
        const deck = await this.storage.getDecksCollection().findOneAndDelete({
            _id: params.id
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