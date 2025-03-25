import * as Inversify from "inversify"
import * as Repositories from "../../repositories"

import { Deck } from "../../domain"
import { RepositorySymbols } from "../../repositories/dependency-symbols"

export interface RemoveDeckUseCase {
  execute(deckId: string): Promise<Deck>
}

@Inversify.injectable()
export class RemoveDeckUseCaseImpl implements RemoveDeckUseCase {
  constructor(
    @Inversify.inject(RepositorySymbols.DeckRepository) private deckRepository: Repositories.DeckRepository,
    ) {}

  public async execute(deckId: string): Promise<Deck> {
    const deck = await this.deckRepository.remove({id: deckId})

    if (!deck) {
      throw new Error('Deck not found')
    }

    return deck
  }
}
