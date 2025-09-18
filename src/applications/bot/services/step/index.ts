import { inject, injectable } from "inversify";
import { Context, Markup } from "telegraf";

import { UseCaseSymbols } from "app/use-cases/dependency-symbols";
import { BotServiceSymbols } from "../dependency-symbols";
import { CreateCardUseCase, CreateDeckUseCase, EditDeckUseCase, GetDecksUseCase } from "app/use-cases";

import { MenuButtonService } from "../menu-button";
import { SessionService } from "../session";
import { SessionStep } from "../session/session";
import { MESSAGES } from "../../constants/message.constant";
import { BUTTONS } from "../../constants/button.constant";

export interface StepService {
    handleStep(ctx: Context, text: string): Promise<void>
}

@injectable()
export class StepServiceImpl implements StepService {
    public lang: keyof typeof BUTTONS = 'en';

    constructor(
        @inject(BotServiceSymbols.Session)
        private readonly sessionService: SessionService,
        @inject(UseCaseSymbols.CreateDeckUseCase)
        private readonly createDeckUseCase: CreateDeckUseCase,
        @inject(BotServiceSymbols.MenuButton)
        private readonly menuButtonService: MenuButtonService,
        @inject(UseCaseSymbols.CreateCardUseCase)
        private createCardUseCase: CreateCardUseCase,
        @inject(UseCaseSymbols.GetDecksUseCase)
        private getDecksUseCase: GetDecksUseCase,
        @inject(UseCaseSymbols.EditDeckUseCase)
        private editDeckUseCase: EditDeckUseCase,
    ) {}

    public async handleStep(ctx: Context, text: string) {
        const telegramId = ctx.from!.id;
        const session = await this.sessionService.getSession(telegramId);

           switch (session.step) {
            case SessionStep.AWAITING_DECK_NAME:
                await this.processCreateDeck(ctx, text);
                break;
            case SessionStep.SELECTING_DECK_FOR_CARD:
                if (text.startsWith('📚 ')) {
                    const deckName = text.substring(3);
                    await this.processSelectDeckForCard(ctx, deckName);
                }
                break;
            case SessionStep.AWAITING_CARD_FRONT:
                this.sessionService.updateSession(telegramId, { front: text, step: SessionStep.AWAITING_CARD_BACK });

                await ctx.reply(
                    MESSAGES[this.lang].ENTER_CARD_BACK,
                    Markup.keyboard([[BUTTONS[this.lang].CANCEL]]).resize()
                );
                break;
            case SessionStep.AWAITING_CARD_BACK:
                this.sessionService.updateSession(telegramId, { back: text });
                await this.processAddCard(ctx, text);
                break;
            case SessionStep.BROWSING_DECKS:
                if (text.startsWith('📂 ')) {
                    const deckName = text.substring(3);
                    await this.processBrowseDeck(ctx, deckName);
                }
                break;
            case SessionStep.RENAMING_DECK:
                await this.processRenameDeck(ctx, text);
                break;
            default:
                // Handle main menu and other button presses
                // await this.handleButtonPress(ctx, text);
                break;
            }

    }

    public async processBrowseDeck(ctx: Context, deckName: string): Promise<void> {
        const telegramId = ctx.from!.id;
        const session = await this.sessionService.getSession(telegramId)
        const decks = await this.getDecksUseCase.execute({ userId: session.userId.toString() })

        const deck = decks.decks.find(d => d.getTitle() === deckName);

        if (!deck) {
            await ctx.reply(MESSAGES[this.lang].DECK_NOT_FOUND)
            return;
        }

        this.sessionService.updateSession(telegramId, { editingDeck: deck.getId().toString() });

        await ctx.reply(
            `📂 Deck: ${deck.getTitle()}\n\n` +
            // `📊 Cards: ${stats.total}\n` +
            // `🆕 New: ${stats.new}\n` +
            // `📚 Learning: ${stats.learning}\n` +
            // `🎯 Young: ${stats.young}\n` +
            // `⭐ Mature: ${stats.mature}\n\n` +
            `What would you like to do?`,
            Markup.keyboard([
                [BUTTONS[this.lang].RENAME_DECK, BUTTONS[this.lang].DELETE_DECK],
                [BUTTONS[this.lang].VIEW_CARDS, BUTTONS[this.lang].ADD_CARD],
                [BUTTONS[this.lang].BACK_TO_MAIN]
            ]).resize()
        );
    }


    public async processCreateDeck(ctx: Context, name: string): Promise<void> {
      const telegramId = ctx.from!.id;
      const session = await this.sessionService.getSession(telegramId)

      if (!session.userId) {
        await ctx.reply(MESSAGES[this.lang].USER_NOT_FOUND);
        return;
      }

      try {
        await this.createDeckUseCase.execute({
            title: name,
            userId: session.userId.toString(),
        });

        await ctx.reply(
          MESSAGES[this.lang].DECK_CREATED + '\n' +
          MESSAGES[this.lang].WHAT_TO_DO_NEXT,
          this.menuButtonService.getAddMenuKeyboard()
        );
        
        this.sessionService.clearSession(telegramId);
      } catch (error) {
        await ctx.reply(MESSAGES[this.lang].ERROR_CREATING_DECK);
      }
    }

    public async processRenameDeck(ctx: Context, newName: string): Promise<void> {
        const telegramId = ctx.from!.id;
        const session = await this.sessionService.getSession(telegramId);

        if (!session.editingDeck) {
            await ctx.reply(MESSAGES[this.lang].NO_DECK_SELECTED);
            return;
        }

        try {
            await this.editDeckUseCase.execute({
                deckId: session.editingDeck,
                title: newName
            });

            await ctx.reply(
                MESSAGES[this.lang].DECK_RENAMED,
                this.menuButtonService.getMainMenuKeyboard()
            );

            this.sessionService.clearSession(telegramId);

        } catch (error) {
            await ctx.reply(MESSAGES[this.lang].ERROR_GENERIC);
        }
    }


    public async processAddCard(ctx: Context, text: string) {
        const telegramId = ctx.from!.id;
        const session = await this.sessionService.getSession(telegramId);

        if (!session.userId || !session.editingDeck || !session.front || !(session.back || text)) {
          await ctx.reply(MESSAGES[this.lang].MISSING_INFO);
          return;
        }
    
        try {
          await this.createCardUseCase.execute({
            deckId: session.editingDeck,
            note: {
                front: session.front,
                back: session.back || text
            }
          });
    
          await ctx.reply(
            MESSAGES[this.lang].CARD_CREATED +`\n\n` +
            `Front: ${session.front}\n` +
            `Back: ${session.back || text}\n\n` +
            MESSAGES[this.lang].WHAT_TO_DO_NEXT,
            this.menuButtonService.getAddMenuKeyboard()
          );
    
          this.sessionService.clearSession(telegramId);
        } catch (error) {
          await ctx.reply(MESSAGES[this.lang].ERROR_CREATING_CARD);
        }
    }

    public async processSelectDeckForCard(ctx: Context, deckName: string): Promise<void> {
        const telegramId = ctx.from!.id;
        const session = await this.sessionService.getSession(telegramId)
        const decks = await this.getDecksUseCase.execute({ userId: session.userId.toString() })

        const deck = (decks.decks.filter(d => d.getTitle() == deckName))[0];
        if (!deck) {
            await ctx.reply(MESSAGES[this.lang].DECK_NOT_FOUND);
            return;
        }

        this.sessionService.updateSession(telegramId, { 
            editingDeck: deck.getId().toString(), 
            step: SessionStep.AWAITING_CARD_FRONT 
        });

        await ctx.reply(
            `🃏 Adding card to deck: "${deck.getTitle()}"\n\n` +
            MESSAGES[this.lang].ENTER_CARD_FRONT,
            Markup.keyboard([[BUTTONS[this.lang].CANCEL]]).resize()
        );
    }



}