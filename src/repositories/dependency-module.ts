import { ContainerModule, interfaces } from "inversify"

import * as Repositories from "app/repositories"

import { RepositorySymbols } from "./dependency-symbols"


export const RepositoryContainerModule = new ContainerModule((bind: interfaces.Bind) => {
    // Card
    bind<Repositories.CardRepository>(RepositorySymbols.CardRepository)
    .to(Repositories.CardRepositoryImpl).inSingletonScope()

    // Deck
    bind<Repositories.DeckRepository>(RepositorySymbols.DeckRepository)
    .to(Repositories.DeckRepositoryImpl).inSingletonScope()
})