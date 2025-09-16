import { inject, injectable } from "inversify";
import { Context } from "telegraf";

import { UseCaseSymbols } from "app/use-cases/dependency-symbols";
import { BotServiceSymbols } from "../dependency-symbols";
import { CreateDeckUseCase, GetOneUserByTelegramIdUseCase } from "app/use-cases";

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
        @inject(UseCaseSymbols.GetOneUserByTelegramIdUseCase)
        private readonly getOneUserByTelegramIdUseCase: GetOneUserByTelegramIdUseCase,
        @inject(UseCaseSymbols.CreateDeckUseCase)
        private readonly createDeckUseCase: CreateDeckUseCase,
        @inject(BotServiceSymbols.MenuButton)
        private readonly menuButtonService: MenuButtonService,
    ) {}

    public async handleStep(ctx: Context, text: string) {
        const telegramId = ctx.from!.id;
        const session = await this.sessionService.getSession(telegramId);

           switch (session.step) {
            case SessionStep.AWAITING_DECK_NAME:
                await this.createDeck(ctx, text);
                break;
            default:
                // Handle main menu and other button presses
                // await this.handleButtonPress(ctx, text);
                break;
            }

    }

    async createDeck(ctx: Context, name: string): Promise<void> {
      const telegramId = ctx.from!.id;
      const user = await this.getOneUserByTelegramIdUseCase.execute({ telegramId });
  
      if (!user) {
        await ctx.reply(MESSAGES[this.lang].USER_NOT_FOUND);
        return;
      }

      try {
        await this.createDeckUseCase.execute({
            title: name,
            userId: user.user.getId().toString(),
        });

        await ctx.reply(
          MESSAGES[this.lang].DECK_CREATED + '\n' +
          MESSAGES[this.lang].WHAT_TO_DO_NEXT,
          this.menuButtonService.getAddMenuKeyboard()
        );
        
        this.sessionService.clearSession(telegramId);
      } catch (error) {
        console.log('erroooorrrr',error)
        await ctx.reply(MESSAGES[this.lang].ERROR_CREATING_DECK);
      }
    }

}