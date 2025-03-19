import { ContainerModule, interfaces } from "inversify"


export const RepositoryContainerModule = new ContainerModule((bind: interfaces.Bind) => {
    // bind<Repositories.CardRepository>(RepositorySymbols.CardFactory).to(Repositories.CardRepositoryImpl)
})