import { ContainerModule, interfaces } from "inversify"

import * as Infrastructure from "app/infrastructure"
import * as Components from "app/components"

import { ComponentsSymbols } from "./dependency-symbols"

export const ComponentsContainerModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<Infrastructure.Storage>(ComponentsSymbols.MongooseStorage).to(Components.MongooseStorageImpl)
})