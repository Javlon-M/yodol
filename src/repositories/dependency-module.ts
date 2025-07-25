import { ContainerModule, interfaces } from "inversify"

import * as Repositories from "app/repositories"

import { RepositorySymbols } from "./dependency-symbols"


export const RepositoryContainerModule = new ContainerModule((bind: interfaces.Bind) => {
    // Card
    bind<Repositories.CardRepository>(RepositorySymbols.CardRepository)
    .to(Repositories.CardRepositoryImpl).inSingletonScope()

    // Note
    bind<Repositories.NoteRepository>(RepositorySymbols.NoteRepository)
    .to(Repositories.NoteRepositoryImpl).inSingletonScope()

    // Deck
    bind<Repositories.DeckRepository>(RepositorySymbols.DeckRepository)
    .to(Repositories.DeckRepositoryImpl).inSingletonScope()

    // User
    bind<Repositories.UserRepository>(RepositorySymbols.UserRepository)
    .to(Repositories.UserRepositoryImpl).inSingletonScope()
    
    // Attendance
    bind<Repositories.AttendanceRepository>(RepositorySymbols.AttendanceRepository)
    .to(Repositories.AttendanceRepositoryImpl).inSingletonScope()
})