import * as Inversify from "inversify"

import * as Domain from "../../domain"
import * as Models from "../../components"
import * as Factories from "../../factories"
import * as Infrastructure from "../../infrastructure"
import { FactorySymbols } from "../../factories/dependency-symbols"
import { ComponentsSymbols } from "../../components/dependency-symbols"

export interface DeckRepository {
    create(params: CreateParams): Promise<Domain.Deck>
}

@Inversify.injectable()
export class DeckRepositoryImpl implements DeckRepository {
    constructor(
        @Inversify.inject(FactorySymbols.DeckFactory) private deckFactory: Factories.DeckFactory,
        @Inversify.inject(ComponentsSymbols.MongooseStorage) private storage: Infrastructure.Storage,
    ){}

    public async create(params: CreateParams): Promise<Domain.Deck> {
        const deck = await this.storage.getDecksCollection().insertOne({
            user_id: params.userId,
            title: params.title,
            description: params.description
        })

        return this.toDomainEntity(deck)
    }

    private toDomainEntity(deck: Models.DeckDocument): Domain.Deck {
        if (!deck) return null

        return this.deckFactory.construct({
            id: deck.id,
            userId: deck.userId,
            title: deck.title,
            description: deck.description
        })
    }
}

interface CreateParams {
    userId: string
    title: string
    description?: string
}