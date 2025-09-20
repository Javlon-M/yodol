import { Telegraf } from "telegraf";

export interface BotController {
    register(bot: Telegraf): void;
}
