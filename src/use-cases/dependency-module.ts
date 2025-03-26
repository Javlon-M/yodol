import { ContainerModule, interfaces } from "inversify"

import * as Usecase from "../use-cases"

import { UseCaseSymbols } from "./dependency-symbols"


export const UseCaseContainerModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<Usecase.RemoveDeckUseCase>(UseCaseSymbols.RemoveDeckUseCase)
    .to(Usecase.RemoveDeckUseCaseImpl).inSingletonScope()

    bind<Usecase.EditCardUseCase>(UseCaseSymbols.EditCardUseCase)
    .to(Usecase.EditCardUseCaseImpl).inSingletonScope()
})