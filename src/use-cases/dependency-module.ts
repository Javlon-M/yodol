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

    bind<Usecases.CreateDeckUseCase>(UseCaseSymbols.CreateDeckUseCase)
    .to(Usecases.CreateDeckUseCaseImpl).inSingletonScope()

    // Card
    bind<Usecases.CreateCardUseCase>(UseCaseSymbols.CreateCardUseCase)
    .to(Usecases.CreateCardUseCaseImpl).inSingletonScope()

    bind<Usecases.DeleteCardUseCase>(UseCaseSymbols.DeleteCardUseCase)
    .to(Usecases.DeleteCardUseCaseImpl).inSingletonScope()

    bind<Usecases.EditCardUseCase>(UseCaseSymbols.EditCardUseCase)
    .to(Usecases.EditCardUseCaseImpl).inSingletonScope()

    bind<Usecases.GetCardsUseCase>(UseCaseSymbols.GetCardsUseCase)
    .to(Usecases.GetCardsUseCaseImpl).inSingletonScope()

    bind<Usecases.ManageAndGetCardUseCase>(UseCaseSymbols.ManageAndGetCardUseCase)
    .to(Usecases.ManageAndGetCardUseCaseImpl).inSingletonScope()

    bind<Usecases.AnswerCardUseCase>(UseCaseSymbols.AnswerCardUseCase)
    .to(Usecases.AnswerCardUseCaseImpl).inSingletonScope()

    // User
    bind<Usecases.CreateUserUseCase>(UseCaseSymbols.CreateUserUseCase)
    .to(Usecases.CreateUserUseCaseImpl).inSingletonScope()

    bind<Usecases.UpdateUserUseCase>(UseCaseSymbols.UpdateUserUseCase)
    .to(Usecases.UpdateUserUseCaseImpl).inSingletonScope()

    bind<Usecases.GetOneUserUseCase>(UseCaseSymbols.GetOneUserUseCase)
    .to(Usecases.GetOneUserUseCaseImpl).inSingletonScope()

    // Attendance 
    bind<Usecases.MarkUserSubmissionUseCase>(UseCaseSymbols.MarkUserSubmissionUseCase)
    .to(Usecases.MarkUserSubmissionUseCaseImpl).inSingletonScope()

    bind<Usecases.GetUserStatsUseCase>(UseCaseSymbols.GetUserStatsUseCase)
    .to(Usecases.GetUserStatsUseCaseImpl).inSingletonScope()
})