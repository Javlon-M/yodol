import { ContainerModule, interfaces } from "inversify"

import * as Usecase from "../use-cases"

import { UseCaseSymbols } from "./dependency-symbols"


export const UseCaseContainerModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<Usecase.DeckUseCase>(UseCaseSymbols.DeckUseCase)
    .to(Usecase.DeckUseCaseImpl).inSingletonScope()
})