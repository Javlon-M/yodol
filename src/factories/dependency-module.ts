import { ContainerModule, interfaces } from "inversify"

import * as Factories from "../factories/"

import { FactorySymbols } from "./dependency-symbols"

export const FactoryContainerModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<Factories.CardFactory>(FactorySymbols.CardFactory)
    .to(Factories.CardFactoryImpl).inSingletonScope()

    bind<Factories.DeckFactory>(FactorySymbols.DeckFactory)
    .to(Factories.DeckFactoryImpl).inSingletonScope()

    bind<Factories.IdentifierFactory>(FactorySymbols.IdentifierFactory)
    .to(Factories.IdentifierFactoryImpl).inSingletonScope()
})