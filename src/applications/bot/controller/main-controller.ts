import { inject, injectable } from "inversify";
import { BotController } from ".";
import { Context, Markup, Telegraf } from "telegraf";
import { BUTTONS } from "../constants/button.constant";
import { MESSAGES } from "../constants/message.constant";
import { BotServiceSymbols } from "../services/dependency-symbols";
import { MenuButtonService } from "../services/menu-button";

@injectable()
export class MainController implements BotController {
    public lang: keyof typeof BUTTONS = 'en';

    constructor(
        @inject(BotServiceSymbols.MenuButton)
        private menuButtonService: MenuButtonService,
    ) {}

    register(bot: Telegraf): void {
        bot.hears(BUTTONS[this.lang].MORE, (ctx) => {
            this.getMoreMenu(ctx);
        });
    }

    public async getMoreMenu(ctx: Context) {
        await ctx.reply(
            MESSAGES[this.lang].MORE_OPTIONS,
            this.menuButtonService.getMoreMenuKeyboard(),
        );
    }
}