import { Context, Markup, Telegraf } from "telegraf";
import { BotController } from ".";
import { BUTTONS } from "../constants/button.constant";
import { inject } from "inversify";
import { BotServiceSymbols } from "../services/dependency-symbols";
import { SessionService } from "../services/session";
import { MenuButtonService } from "../services/menu-button";
import { UseCaseSymbols } from "app/use-cases/dependency-symbols";
import { CreateCardUseCase, DeleteCardUseCase, GetOneUserByTelegramIdUseCase } from "app/use-cases";
import { MESSAGES } from "../constants/message.constant";
import { SessionStep } from "../services/session/session";

export class DeckController implements BotController {
    public lang: keyof typeof BUTTONS = 'en';

    constructor(
        @inject(BotServiceSymbols.Session)
        private sessionService: SessionService,
        @inject(BotServiceSymbols.MenuButton)
        private menuButtonService: MenuButtonService,
        @inject(UseCaseSymbols.CreateCardUseCase)
        private createCardUseCase: CreateCardUseCase,
        @inject(UseCaseSymbols.GetOneUserByTelegramIdUseCase)
        private getOneUserByTelegramIdUseCase: GetOneUserByTelegramIdUseCase,
        @inject(UseCaseSymbols.DeleteCardUseCase)
        private DeleteCardUseCase: DeleteCardUseCase,
    ) {}


    public register(bot: Telegraf): void {
        bot.hears(BUTTONS[this.lang].NEW_DECK, (ctx) => {
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
        const user = await this.getOneUserByTelegramIdUseCase.execute({ telegramId: telegramId as unknown as string });
    
        if (!user || !session.editingDeck || !session.front || !session.back) {
          await ctx.reply(MESSAGES[this.lang].MISSING_INFO);
          return;
        }
    
        try {
          await this.createCardUseCase.execute({
            
            deckId: session.editingDeck,
            note: {
                front: session.front,
                back: session.back
            }
          });
    
          await ctx.reply(
            MESSAGES[this.lang].CARD_CREATED +`\n\n` +
            `Front: ${session.front}\n` +
            `Back: ${session.back}\n\n` +
            MESSAGES[this.lang].WHAT_TO_DO_NEXT,
            this.menuButtonService.getAfterActionKeyboard()
          );
    
          this.sessionService.clearSession(telegramId);
        } catch (error) {
          await ctx.reply(MESSAGES[this.lang].ERROR_CREATING_CARD);
        }
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
