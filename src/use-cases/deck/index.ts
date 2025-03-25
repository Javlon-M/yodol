import * as Inversify from "inversify"
import * as Repositories from "../../repositories"

import { Deck } from "../../domain"
import { RepositorySymbols } from "../../repositories/dependency-symbols"

export interface DeckUseCase {
  remove(params: Params): Promise<Deck>
}

@Inversify.injectable()
export class DeckUseCaseImpl implements DeckUseCase {
  constructor(
    @Inversify.inject(RepositorySymbols.DeckRepository) private deckRepository: Repositories.DeckRepository,
    ) {}

  public async remove(params: Params): Promise<Deck> {
    const deck = await this.deckRepository.remove({id: params.deckId})

    if (!deck) {
      throw new Error('Deck not found')
    }

    return deck
  }
}

interface Params {
  deckId: string
}