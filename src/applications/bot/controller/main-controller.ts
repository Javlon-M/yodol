import { inject, injectable } from "inversify";
import { BotController } from ".";
import { Context, Markup, Telegraf } from "telegraf";
import { BUTTONS } from "../constants/button.constant";
import { MESSAGES } from "../constants/message.constant";
import { BotServiceSymbols } from "../services/dependency-symbols";
import { MenuButtonService } from "../services/menu-button";
import { SessionService } from "../services/session";

@injectable()
export class MainController implements BotController {
    public lang: keyof typeof BUTTONS = 'en';

    constructor(
        @inject(BotServiceSymbols.MenuButton)
        private menuButtonService: MenuButtonService,
        @inject(BotServiceSymbols.Session)
        private sessionService: SessionService,
    ) {}

    register(bot: Telegraf): void {
        bot.hears(BUTTONS[this.lang].MORE, (ctx) => {
            this.getMoreMenu(ctx);
        });
        bot.hears(BUTTONS[this.lang].BACK_TO_MAIN, (ctx) => {
            this.goToMainMenu(ctx);
        });
        bot.hears(BUTTONS[this.lang].CANCEL, (ctx) => {
            this.goToMainMenu(ctx);
        });
        bot.hears(BUTTONS[this.lang].ADD, (ctx) => {
            this.getAddActions(ctx);
        });
    }

    public async getMoreMenu(ctx: Context) {
        await ctx.reply(
            MESSAGES[this.lang].MORE_OPTIONS,
            this.menuButtonService.getMoreMenuKeyboard(),
        );
    }

    public async goToMainMenu(ctx: Context): Promise<void> {
        const telegramId = ctx.from!.id;
        this.sessionService.clearSession(telegramId);

        await ctx.reply(
            MESSAGES[this.lang].BACK_TO_MAIN,
            this.menuButtonService.getMainMenuKeyboard()
        );
    }

    public async getAddActions(ctx: Context): Promise<void> {
        const telegramId = ctx.from!.id;
        this.sessionService.clearSession(telegramId);

        await ctx.reply(
            MESSAGES[this.lang].ADD_MENU,
            Markup.keyboard([
                [BUTTONS[this.lang].NEW_DECK, BUTTONS[this.lang].NEW_CARD],
                [BUTTONS[this.lang].BACK_TO_MAIN]
            ]).resize()
        );
    }


}