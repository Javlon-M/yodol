import { Container } from "inversify"

import { FactoryContainerModule } from "app/factories/dependency-module"
import { RepositoryContainerModule } from "app/repositories/dependency-module"
import { ComponentsContainerModule } from "app/components/dependency-module"
import { UseCaseContainerModule } from "app/use-cases/dependency-module"
import { BotServicesModule } from "app/applications/bot/services/dependency-module"
import { BotControllerModule } from "app/applications/bot/controller/dependency-module"


export interface Dependencies {
    load(): Promise<void>
    getItem<T>(symbol: symbol): T
    getAll<T>(symbol: symbol): T[]
}

export class DependenciesImpl implements Dependencies {
    private static _instance: Dependencies;
    private readonly container: Container;

    constructor() {
        this.container = new Container();
    }

    static create(): Dependencies {
        if (DependenciesImpl._instance == null) {
            DependenciesImpl._instance = new DependenciesImpl();
        }

        return DependenciesImpl._instance;
    }

    public async load(): Promise<void> {
        this.container.load(ComponentsContainerModule)
        this.container.load(FactoryContainerModule)
        this.container.load(RepositoryContainerModule)
        this.container.load(UseCaseContainerModule)
        this.container.load(BotServicesModule)
        this.container.load(BotControllerModule)
    }

    getItem<T>(symbol: symbol): T {
        return this.container.get<T>(symbol);
    }

    getAll<T>(symbol: symbol): T[] {
        return this.container.getAll<T>(symbol)
    }
}
