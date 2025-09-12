import { ContainerModule } from "inversify";
import { BotControllerSymbols } from "./dependency-symbols";
import { UserController } from "./user-controller";

export const BotControllerModule = new ContainerModule((bind) => {
    bind(BotControllerSymbols.User).to(UserController);

    bind(BotControllerSymbols.All).toService(BotControllerSymbols.User);
});
