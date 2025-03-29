import { ContainerModule, interfaces } from "inversify"

import * as Usecases from "app/use-cases"

import { UseCaseSymbols } from "./dependency-symbols"


export const UseCaseContainerModule = new ContainerModule((bind: interfaces.Bind) => {
    // Deck
    bind<Usecases.RemoveDeckUseCase>(UseCaseSymbols.RemoveDeckUseCase)
    .to(Usecases.RemoveDeckUseCaseImpl).inSingletonScope()

    bind<Usecases.GetOneDeckUseCase>(UseCaseSymbols.GetOneDeckUseCase)
    .to(Usecases.GetOneDeckUseCaseImpl).inSingletonScope()

    bind<Usecases.GetDecksUseCase>(UseCaseSymbols.GetDecksUseCase)
    .to(Usecases.GetDecksUseCaseImpl).inSingletonScope()

    // Card
    bind<Usecases.CreateCardUseCase>(UseCaseSymbols.CreateCardUseCase)
    .to(Usecases.CreateCardUseCaseImpl).inSingletonScope()

    bind<Usecases.DeleteCardUseCase>(UseCaseSymbols.DeleteCardUseCase)
    .to(Usecases.DeleteCardUseCaseImpl).inSingletonScope()

    // User
    bind<Usecases.CreateUserUseCase>(UseCaseSymbols.CreateUserUseCase)
    .to(Usecases.CreateUserUseCaseImpl).inSingletonScope()
})