import { ContainerModule, interfaces } from "inversify"

import * as Usecases from "app/use-cases"

import { UseCaseSymbols } from "./dependency-symbols"


export const UseCaseContainerModule = new ContainerModule((bind: interfaces.Bind) => {
    // Deck
    bind<Usecases.RemoveDeckUseCase>(UseCaseSymbols.RemoveDeckUseCase)
    .to(Usecases.RemoveDeckUseCaseImpl).inSingletonScope()

    bind<Usecases.GetOneDeckUseCase>(UseCaseSymbols.GetOneDeckUseCase)
    .to(Usecases.GetOneDeckUseCaseImpl).inSingletonScope()

    // Card
    bind<Usecases.CreateCardUseCase>(UseCaseSymbols.CreateCardUseCase)
    .to(Usecases.CreateCardUseCaseImpl).inSingletonScope()
})