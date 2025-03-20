import { ContainerModule, interfaces } from "inversify"

import * as Factories from "../factories/"

import { FactorySymbols } from "./dependency-symbols"

export const FactoryContainerModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<Factories.CardFactory>(FactorySymbols.CardFactory)
    .to(Factories.CardFactoryImpl).inSingletonScope()
})