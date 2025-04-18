import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Models from "app/components"
import * as Factories from "app/factories"
import * as Infrastructure from "app/infrastructure"

import { FactorySymbols } from "app/factories/dependency-symbols"
import { ComponentsSymbols } from "app/components/dependency-symbols"


export interface DeckRepository {
    create(params: CreateParams): Promise<Domain.Deck>
    update(params: EditParams): Promise<Domain.Deck>
    remove(params: RemoveParams): Promise<Domain.Deck>
    findByUserId(userId: Domain.Identifier): Promise<Domain.Deck[]>
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
            user_id: params.userId,
            title: params.title,
            active: params.active,
            description: params.description,
            configurations: {
                new: params.configurations.new,
                rev: params.configurations.rev,
                lapse: params.configurations.lapse
            }
        })

        return this.toDomainEntity(deck)
    }

    public async update(params: EditParams): Promise<Domain.Deck> {
        const filter = { _id: params.id.toStorageValue() }

        const updateDeck = {
            $set: params
        }

        const deck = await this.storage.getDecksCollection().findOneAndUpdate<Models.DeckDocument>(
            filter,
            updateDeck,
            { returnOriginal: false }
        )

        return this.toDomainEntity(deck)
    }

    public async remove(params: RemoveParams): Promise<Domain.Deck> {
        const deck = await this.storage.getDecksCollection().findOneAndDelete<Models.DeckDocument>({
            _id: params.id.toStorageValue()
        })

        return this.toDomainEntity(deck)
    }

    public async findById(id: Domain.Identifier): Promise<Domain.Deck> {
        const deck = await this.storage.getDecksCollection().findById<Models.DeckDocument>({
            _id: id.toStorageValue()
        })

        return this.toDomainEntity(deck)
    }

    public async findByUserId(userId: Domain.Identifier): Promise<Domain.Deck[]> {
        const decks = await this.storage.getDecksCollection().find<Models.DeckDocument>({
            user_id: userId.toStorageValue()
        })

        return decks.map(this.toDomainEntity.bind(this))
    }

    private toDomainEntity(deck: Models.DeckDocument): Domain.Deck {
        if (!deck) return null

        return this.deckFactory.construct({
            id: deck.id,
            userId: deck.user_id,
            title: deck.title,
            active: deck.active,
            description: deck.description,
            configurations: deck.configurations
        })
    }
}

interface CreateParams {
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

interface EditParams extends Partial<CreateParams> {
    id: Domain.Identifier
}

interface RemoveParams {
    id: Domain.Identifier
}