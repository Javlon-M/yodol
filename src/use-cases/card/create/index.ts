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
        @Inversify.inject(FactorySymbols.IdentifierFactory) private identifierFactory: Factories.IdentifierFactory,
    ) {}

    public async execute(params: Params): Promise<Response> {
        await this.checkDeck(params.deckId)

        const level = Domain.CardLevels.New
        const now = new Date()
        const schedulePeriod = 300

        const card = await this.cardRepository.create({
            deckId: params.deckId,
            front: params.front,
            back: params.back,
            level: level,
            schedulePeriod: schedulePeriod,
            createAt: now.getTime(),
            levelUpdatedAt: now.getTime()
        })

        return {
            card
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
    front: string
    back: string
}

interface Response {
    card: Domain.Card
}