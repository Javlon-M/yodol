import { ContainerModule } from "inversify";
import { BotServiceSymbols } from "./dependency-symbols";
import { SessionService, SessionServiceImpl } from "./session";

export const BotServicesModule = new ContainerModule((bind) => {
    bind<SessionService>(BotServiceSymbols.Session).to(SessionServiceImpl);
});
