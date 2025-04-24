import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Models from "app/components"
import * as Factories from "app/factories"
import * as Infrastructure from "app/infrastructure"

import { FactorySymbols } from "app/factories/dependency-symbols"
import { ComponentsSymbols } from "app/components/dependency-symbols"


export interface NoteRepository {
    create(params: CreateParams): Promise<Domain.Note>
    remove(params: RemoveParams): Promise<Domain.Note>
    updateByCardId(cardId: Domain.Identifier, params: UpdateParams): Promise<Domain.Note>
    findByCardId(id: Domain.Identifier): Promise<Domain.Note>
    findByCardIds(ids: Domain.StorageValue[]): Promise<Domain.Note[]>
}

@Inversify.injectable()
export class NoteRepositoryImpl implements NoteRepository {
    constructor(
        @Inversify.inject(FactorySymbols.NoteFactory) private noteFactory: Factories.NoteFactory,
        @Inversify.inject(ComponentsSymbols.MongooseStorage) private storage: Infrastructure.Storage,
    ){}

    public async create(params: CreateParams): Promise<Domain.Note> {
        const note = await this.storage.getNotesCollection().insertOne({
            deck_id: params.deckId.toStorageValue(),
            card_id: params.cardId.toStorageValue(),
            front: params.front,
            back: params.back,
            created_at: params.createdAt
        })

        return this.toDomainEntity(note)
    } 

    public async remove(params: RemoveParams): Promise<Domain.Note> {
        return await this.storage.getNotesCollection().findOneAndDelete({
            _id: params.id.toStorageValue()
        })
    }

    public async updateByCardId(cardId: Domain.Identifier, params: UpdateParams): Promise<Domain.Note> {
        const note = await this.storage.getNotesCollection().findOneAndUpdate<Models.NoteDocument>(
            {
                card_id: cardId.toStorageValue()
            }, 
            {
                $set: params
            }, 
            {
                returnOriginal: false 
            }
        )

        return this.toDomainEntity(note)
    }

    public async findByCardId(id: Domain.Identifier): Promise<Domain.Note> {
        const note = await this.storage.getNotesCollection().findOne<Models.NoteDocument>({
            "card_id": id.toStorageValue()
        })

        return this.toDomainEntity(note)
    }

    public async findByCardIds(ids: Domain.StorageValue[]): Promise<Domain.Note[]> {
        const notes = await this.storage.getNotesCollection().find<Models.NoteDocument>({
            "card_id": { $in: ids }
        })

        return notes.map(this.toDomainEntity.bind(this))
    }

    private toDomainEntity(note: Models.NoteDocument): Domain.Note {
        if (!note) return null

        return this.noteFactory.construct({
            id: note.id,
            cardId: note.card_id,
            deckId: note.deck_id,
            front: note.front,
            back: note.back,
            createdAt: note.created_at
        })
    }
}

interface CreateParams {
    deckId: Domain.Identifier
    cardId: Domain.Identifier
    front: string
    back: string
    createdAt: number
}

interface RemoveParams {
    id: Domain.Identifier
}

interface UpdateParams {
    front?: string,
    back?: string
}