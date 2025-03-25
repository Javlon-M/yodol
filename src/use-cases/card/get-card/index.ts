import * as Inversify from "inversify"
import * as Repositories from "../../../repositories"
import * as Domain from "../../../domain"

import { RepositorySymbols } from "../../../repositories/dependency-symbols"

export interface GetCardsUseCase {
    getCard(params: Params): Promise<Response>
}

@Inversify.injectable()
export class GetCardUseCaseImpl implements GetCardsUseCase {
    constructor(@Inversify.inject(RepositorySymbols.CardRepository) private cardRepository: Repositories.CardRepository) { }

    public async getCard(params: Params): Promise<Response> {
        const cards = await this.cardRepository.getCard({ deckId: params.deckId })

        if (cards.length === 0) {
            throw new Error("Cards no fond")
        }

        return {
            success: true,
            data: cards
        }
    }
}

interface Params {
    deckId: string
}

interface Response {
    success: boolean
    data: Domain.Card[]
}