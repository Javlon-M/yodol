import * as Inversify from "inversify"
import * as Factories from "app/factories"
import * as Repositories from "app/repositories"

import { RepositorySymbols } from "app/repositories/dependency-symbols"
import { FactorySymbols } from "app/factories/dependency-symbols"

export interface RemoveDeckUseCase {
  remove(params: Params): Promise<Response>
}

@Inversify.injectable()
export class RemoveDeckUseCaseImpl implements RemoveDeckUseCase {
  constructor(
    @Inversify.inject(RepositorySymbols.DeckRepository) private deckRepository: Repositories.DeckRepository,
    @Inversify.inject(FactorySymbols.IdentifierFactory) private identifierFactory: Factories.IdentifierFactory,
    ) {}

  public async remove(params: Params): Promise<Response> {
    const deck = await this.deckRepository.remove({id: this.identifierFactory.construct(params.deckId)})

    if (!deck) {
      throw new Error('Deck not found')
    }

    return { success: true }
  }
}

interface Params {
  deckId: string
}

interface Response {
  success: boolean
  message?: string
}