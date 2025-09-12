import { Telegraf } from "telegraf";
import { BotControllerSymbols } from "./controller/dependency-symbols";
import { ComponentsSymbols } from "app/components/dependency-symbols";
import { DependenciesImpl } from "app/dependencies";
import type { BotController } from "./controller";
import type { Cache, Storage } from "app/infrastructure";

async function bootstrap() {
    const botContainer = DependenciesImpl.create();

    await botContainer.load();

    await botContainer
        .getItem<Storage>(ComponentsSymbols.MongooseStorage)
        .open();
    await botContainer.getItem<Cache>(ComponentsSymbols.Cache).open();

    const bot = new Telegraf(process.env.BOT_TOKEN);

    const controllers = botContainer.getAll<BotController>(
        BotControllerSymbols.All,
    );

    controllers.forEach((c) => c.register(bot));

    await bot.launch(() => {
        console.log("Bot started 🚀");
    });
}

bootstrap();
