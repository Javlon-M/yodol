import { ContainerModule, interfaces } from "inversify"

import * as Repositories from "../repositories"

import { RepositorySymbols } from "./dependency-symbols"


export const RepositoryContainerModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<Repositories.CardRepository>(RepositorySymbols.CardRepository)
    .to(Repositories.CardRepositoryImpl).inSingletonScope()

    bind<Repositories.DeckRepository>(RepositorySymbols.DeckRepository)
    .to(Repositories.DeckRepositoryImpl).inSingletonScope()
})