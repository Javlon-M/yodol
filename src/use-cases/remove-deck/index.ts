import { Deck } from "../../domain"
import { DeckRepository } from "../../repositories"

export class RemoveDeckUseCase {
  constructor(private deckRepository: DeckRepository) {}

  async execute(deckId: string): Promise<Deck> {
    const deck = await this.deckRepository.remove({id: deckId})

    if (!deck) {
      throw new Error('Deck not found')
    }

    return deck
  }
}