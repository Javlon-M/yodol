import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Factories from "app/factories"
import * as Repositories from "app/repositories"

import { RepositorySymbols } from "app/repositories/dependency-symbols"
import { FactorySymbols } from "app/factories/dependency-symbols"


export interface CreateCardUseCase {
    execute(params: Params): Promise<Response>
}

@Inversify.injectable()
export class CreateCardUseCaseImpl implements CreateCardUseCase {
    constructor(
        @Inversify.inject(RepositorySymbols.CardRepository) private cardRepository: Repositories.CardRepository,
        @Inversify.inject(RepositorySymbols.DeckRepository) private deckRepository: Repositories.DeckRepository,
        @Inversify.inject(RepositorySymbols.NoteRepository) private noteRepository: Repositories.NoteRepository,
        @Inversify.inject(FactorySymbols.IdentifierFactory) private identifierFactory: Factories.IdentifierFactory,
    ) {}

    public async execute(params: Params): Promise<Response> {
        await this.checkDeck(params.deckId)
        
        const now = new Date()
        const initCard = {
            deckId: this.identifierFactory.construct(params.deckId),
            type: Domain.CardTypes.New,
            queue: Domain.CardQueues.new,
            interval: 0,
            factor: 2.5,
            reps: 0,
            lapses: 0,
            left: 0,
            due: now.getTime()
        }

        const card = await this.cardRepository.create({
            deckId: initCard.deckId,
            createdAt: now.getDate(),
            type: initCard.type,
            queue: initCard.queue,
            interval: initCard.interval,
            factor: initCard.factor,
            repetitions: initCard.reps,
            lapses: initCard.lapses,
            left: initCard.left,
            due: initCard.due
        })

        const note = await this.noteRepository.create({
            deckId: initCard.deckId,
            cardId: card.getId(),
            front: params.note.front,
            back: params.note.back,
            createdAt: now.getTime()
        })

        return {
            card,
            note
        }
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
    note: {
        front: string
        back: string
    }
}

interface Response {
    card: Domain.Card,
    note: Domain.Note
}