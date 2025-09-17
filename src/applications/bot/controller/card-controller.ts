import { Context, Markup, Telegraf } from "telegraf";
import { BotController } from ".";
import { BUTTONS } from "../constants/button.constant";
import { inject, injectable } from "inversify";
import { BotServiceSymbols } from "../services/dependency-symbols";
import { SessionService } from "../services/session";
import { MenuButtonService } from "../services/menu-button";
import { UseCaseSymbols } from "app/use-cases/dependency-symbols";
import { DeleteCardUseCase, GetDecksUseCase } from "app/use-cases";
import { MESSAGES } from "../constants/message.constant";
import { SessionStep } from "../services/session/session";

injectable()
export class CardController implements BotController {
    public lang: keyof typeof BUTTONS = 'en';

    constructor(
        @inject(BotServiceSymbols.Session)
        private sessionService: SessionService,
        @inject(BotServiceSymbols.MenuButton)
        private menuButtonService: MenuButtonService,
        @inject(UseCaseSymbols.DeleteCardUseCase)
        private DeleteCardUseCase: DeleteCardUseCase,
        @inject(UseCaseSymbols.GetDecksUseCase)
        private getDecksUseCase: GetDecksUseCase,
    ) {}


    public register(bot: Telegraf): void {
        bot.hears(BUTTONS[this.lang].NEW_CARD, (ctx) => {
          this.addCard(ctx);
        });
        bot.hears(BUTTONS[this.lang].EDIT_FRONT, (ctx) => {
            this.startEditCardFront(ctx);
        });
        bot.hears(BUTTONS[this.lang].EDIT_BACK, (ctx) => {
            this.startEditCardBack(ctx);
        });
    }

    public async addCard(ctx: Context) {
      const telegramId = ctx.from!.id;
      const session = await this.sessionService.getSession(telegramId);
      const decks = await this.getDecksUseCase.execute({ userId: session.userId.toString() })


      if (decks.decks.length === 0) {
        await ctx.reply(
          MESSAGES[this.lang].NO_DECKS,
          Markup.keyboard([[BUTTONS[this.lang].NEW_DECK], [BUTTONS[this.lang].BACK_TO_MAIN]]).resize()
        );
        return;
      }

      const deckButtons = decks.decks.map(deck => [`📚 ${deck.getTitle()}`]);
      deckButtons.push([BUTTONS[this.lang].CANCEL]);

      await ctx.reply(
        MESSAGES[this.lang].SELECT_DECK,
        Markup.keyboard(deckButtons).resize()
      );

      this.sessionService.updateSession(telegramId, { step: SessionStep.SELECTING_DECK_FOR_CARD });
    }

    public async startEditCardFront(ctx: Context): Promise<void> {
        const telegramId = ctx.from!.id;
        this.sessionService.updateSession(telegramId, { step: SessionStep.EDITING_CARD_FRONT });
    
        await ctx.reply(
          MESSAGES[this.lang].ENTER_NEW_FRONT,
          Markup.keyboard([[BUTTONS[this.lang].CANCEL]]).resize()
        );
    }

    async startEditCardBack(ctx: Context): Promise<void> {
        const telegramId = ctx.from!.id;
        this.sessionService.updateSession(telegramId, { step: SessionStep.EDITING_CARD_BACK });
    
        await ctx.reply(
            MESSAGES[this.lang].ENTER_NEW_BACK,
          Markup.keyboard([[BUTTONS[this.lang].CANCEL]]).resize()
        );
    }

    async deleteCard(ctx: Context): Promise<void> {
        const telegramId = ctx.from!.id;
        const session = await this.sessionService.getSession(telegramId);
    
        if (!session.editingCard) {
          await ctx.reply(MESSAGES[this.lang].NO_CARD_SELECTED);
          return;
        }
    
        try {
          await this.DeleteCardUseCase.execute({
            cardId: session.cardId
          });

          await ctx.reply(
            MESSAGES[this.lang].CARD_DELETED,
            this.menuButtonService.getMainMenuKeyboard()
          );

          this.sessionService.clearSession(telegramId);

        } catch (error) {
          await ctx.reply(MESSAGES[this.lang].ERROR_GENERIC);
        }
      }
    
}
