import { Context, Markup, Telegraf } from "telegraf";
import { BotController } from ".";
import { BUTTONS } from "../constants/button.constant";
import { SessionService } from "../services/session";
import { BotServiceSymbols } from "../services/dependency-symbols";
import { inject } from "inversify";
import { SessionStep } from "../services/session/session";
import { MESSAGES } from "../constants/message.constant";
import { UseCaseSymbols } from "app/use-cases/dependency-symbols";
import { RemoveDeckUseCase } from "app/use-cases";
import { MenuButtonService } from "../services/menu-button";

export class DeckController implements BotController {
    public lang: keyof typeof BUTTONS = 'en';

    constructor(
        @inject(BotServiceSymbols.Session)
        private sessionService: SessionService,
        @inject(BotServiceSymbols.MenuButton)
        private menuButtonService: MenuButtonService,
        @inject(UseCaseSymbols.RemoveDeckUseCase)
        private removeDeckUseCase: RemoveDeckUseCase,
    ) {}

    register(bot: Telegraf): void {
        bot.hears(BUTTONS[this.lang].NEW_DECK, (ctx) => {
            this.addDeck(ctx);
        });
        bot.hears(BUTTONS[this.lang].RENAME_DECK, (ctx) => {
            this.editDeck(ctx);
        });
        bot.hears(BUTTONS[this.lang].DELETE_DECK, (ctx) => {
            this.editDeck(ctx);
        });
    }

    async addDeck(ctx: Context) {
        const telegramId = ctx.from!.id;
        this.sessionService.updateSession(telegramId, {
          step: SessionStep.AWAITING_DECK_NAME,
        });
    
        await ctx.reply(
            MESSAGES[this.lang].ENTER_DECK_NAME,
            Markup.keyboard([[BUTTONS[this.lang].CANCEL]]).resize(),
        );
    }

    async editDeck(ctx: Context) {
        const telegramId = ctx.from!.id;
        this.sessionService.updateSession(telegramId, {
          step: SessionStep.RENAMING_DECK,
        });
    
        await ctx.reply(
            MESSAGES[this.lang].ENTER_NEW_DECK_NAME,
          Markup.keyboard([[BUTTONS[this.lang].CANCEL]]).resize(),
        );
    }

    async deleteDeck(ctx: Context) {
        const telegramId = ctx.from!.id;
    
        await ctx.reply(
            MESSAGES[this.lang].CONFIRM_DELETE_DECK,
          Markup.keyboard([
            [BUTTONS[this.lang].CONFIRM_DELETE, BUTTONS[this.lang].CANCEL],
          ]).resize(),
        );
    
        this.sessionService.updateSession(telegramId, {
          step: SessionStep.CONFIRMING_DECK_DELETE,
        });
    }

    async confirmDeleteDeck(ctx: Context): Promise<void> {
        const telegramId = ctx.from!.id;
        const session = await this.sessionService.getSession(telegramId);
  
        if (!session.editingDeck) {
          await ctx.reply(MESSAGES[this.lang].NO_DECK_SELECTED);
          return;
        }

        try {
            // Delete the deck
            await this.removeDeckUseCase.remove({ deckId: session.editingDeck });
    
            await ctx.reply(
                MESSAGES[this.lang].DECK_DELETED,
                this.menuButtonService.getMainMenuKeyboard()
            );
            this.sessionService.clearSession(telegramId);
        } catch (error) {
            await ctx.reply(MESSAGES[this.lang].ERROR_GENERIC);
        }
      }


}