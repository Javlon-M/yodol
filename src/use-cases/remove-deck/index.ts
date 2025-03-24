import { Deck } from "../../domain"
import { DeckRepository } from "../../repositories"
import { BaseInterfaceForUseCases } from "../base-interface"

export class RemoveDeckUseCase implements BaseInterfaceForUseCases<string, Deck> {
  constructor(private deckRepository: DeckRepository) {}

  public async execute(deckId: string): Promise<Deck> {
    const deck = await this.deckRepository.remove({id: deckId})

    if (!deck) {
      throw new Error('Deck not found')
    }

    return deck
  }
}
