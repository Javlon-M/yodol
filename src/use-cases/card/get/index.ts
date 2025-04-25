import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Factories from "app/factories"
import * as Repositories from "app/repositories"

import { RepositorySymbols } from "app/repositories/dependency-symbols"
import { FactorySymbols } from "app/factories/dependency-symbols"


export interface GetCardsUseCase {
    execute(params: Params): Promise<Response>
}

@Inversify.injectable()
export class GetCardsUseCaseImpl implements GetCardsUseCase {
    constructor(
        @Inversify.inject(RepositorySymbols.NoteRepository) private noteRepository: Repositories.NoteRepository,
        @Inversify.inject(RepositorySymbols.CardRepository) private cardRepository: Repositories.CardRepository,
        @Inversify.inject(RepositorySymbols.DeckRepository) private deckRepository: Repositories.DeckRepository,
        @Inversify.inject(FactorySymbols.IdentifierFactory) private identifierFactory: Factories.IdentifierFactory
    ) {}

    public async execute(params: Params): Promise<Response> {
        await this.checkDeck(params.deckId)

        const cards = await this.cardRepository.findByFilter({
            deckId: this.identifierFactory.construct(params.deckId),
            queue: params.queue,
            due: params.due,
            sort: params.sort,
            limit: params.limit
        })

        const ids = cards.map((card) => card.getId().toStorageValue())
        const notes = await this.noteRepository.findByCardIds(ids)

        return this.getCardWithNote(cards, notes)
    }

    private getCardWithNote(cards: Domain.Card[], notes: Domain.Note[]): CardWithNote[] {
        const cardWithNote: CardWithNote[] = []

        for (const card of cards) {
            const note = notes.find((n) => n.getCardId().toString() === card.getId().toString())

            cardWithNote.push({
                card,
                note
            })
        }

        return cardWithNote
    }

    private async checkDeck(deckId: string): Promise<void> {
        const deck = await this.deckRepository.findById(this.identifierFactory.construct(deckId))

        if (!deck) {
            throw new Error(`Deck was not found. Deck id ${deckId}`)
        }
    }
}

interface Params {
    deckId: string
    queue: Domain.CardQueues
    due: number
    limit: number
    sort: Repositories.Sort
}

type Response = CardWithNote[]

interface CardWithNote {
    card: Domain.Card
    note: Domain.Note
}