import { ContainerModule } from "inversify";
import { BotControllerSymbols } from "./dependency-symbols";
import { UserController } from "./user-controller";
import { MainController } from "./main-controller";
import { CardController } from "./card-controller";
import { DeckController } from "./deck-controller";
import { StatController } from "./stats-controller";

export const BotControllerModule = new ContainerModule((bind) => {
    bind(BotControllerSymbols.User).to(UserController);
    bind(BotControllerSymbols.Card).to(CardController);
    bind(BotControllerSymbols.Deck).to(DeckController);
    bind(BotControllerSymbols.Stats).to(StatController);

    bind(BotControllerSymbols.All).toService(BotControllerSymbols.User);
    bind(BotControllerSymbols.All).toService(BotControllerSymbols.Card);
    bind(BotControllerSymbols.All).toService(BotControllerSymbols.Deck);
    bind(BotControllerSymbols.All).toService(BotControllerSymbols.Stats);

    // It must bind last
    bind(BotControllerSymbols.Main).to(MainController);
    bind(BotControllerSymbols.All).toService(BotControllerSymbols.Main);
});
