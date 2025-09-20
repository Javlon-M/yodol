import { ContainerModule } from "inversify";
import { BotServiceSymbols } from "./dependency-symbols";
import { SessionService, SessionServiceImpl } from "./session";
import { MenuButtonService } from "./menu-button";
import { StepService, StepServiceImpl } from "./step";

export const BotServicesModule = new ContainerModule((bind) => {
    bind<SessionService>(BotServiceSymbols.Session).to(SessionServiceImpl);
    bind<MenuButtonService>(BotServiceSymbols.MenuButton).to(MenuButtonService);
    bind<StepService>(BotServiceSymbols.Step).to(StepServiceImpl);
});
