import { ContainerModule, interfaces } from "inversify"

import * as Factories from "app/factories"

import { FactorySymbols } from "./dependency-symbols"

import { UserFactoryImpl, UserFactory } from "app/factories/user";

export const FactoryContainerModule = new ContainerModule((bind: interfaces.Bind) => {
    // Note
    bind<Factories.NoteFactory>(FactorySymbols.NoteFactory)
    .to(Factories.NoteFactoryImpl).inSingletonScope()

    // Card
    bind<Factories.CardFactory>(FactorySymbols.CardFactory)
    .to(Factories.CardFactoryImpl).inSingletonScope()

    // Deck
    bind<Factories.DeckFactory>(FactorySymbols.DeckFactory)
    .to(Factories.DeckFactoryImpl).inSingletonScope()

    //User
    bind<UserFactory>(FactorySymbols.UserFactory)
    .to(UserFactoryImpl).inSingletonScope()

    // Identifier
    bind<Factories.IdentifierFactory>(FactorySymbols.IdentifierFactory)
    .to(Factories.IdentifierFactoryImpl).inSingletonScope()

    // Attendance
    bind<Factories.AttendanceFactory>(FactorySymbols.AttendanceFactory)
    .to(Factories.AttendanceFactoryImpl).inSingletonScope()
})