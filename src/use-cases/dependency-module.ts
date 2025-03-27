import { ContainerModule, interfaces } from "inversify"

import * as Usecase from "app/use-cases"

import { UseCaseSymbols } from "./dependency-symbols"


export const UseCaseContainerModule = new ContainerModule((bind: interfaces.Bind) => {
    // Deck
    bind<Usecase.RemoveDeckUseCase>(UseCaseSymbols.RemoveDeckUseCase)
    .to(Usecase.RemoveDeckUseCaseImpl).inSingletonScope()

    // Card
    bind<Usecase.CreateCardUseCase>(UseCaseSymbols.CreateCardUseCase)
    .to(Usecase.CreateCardUseCaseImpl).inSingletonScope()
})