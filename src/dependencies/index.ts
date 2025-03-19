import { Container } from "inversify"

import { FactoryContainerModule } from "../factories/dependency-module"
import { RepositoryContainerModule } from "../repositories/dependency-module"


export interface Dependencies {
    load(): Promise<void>
    getItem<T>(symbol: symbol): T
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
        this.container.load(FactoryContainerModule)
        this.container.load(RepositoryContainerModule)
    }

    getItem<T>(symbol: symbol): T {
        return this.container.get<T>(symbol);
    }
}