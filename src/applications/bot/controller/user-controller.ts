import { Context, Markup, NarrowedContext, Telegraf } from "telegraf";
import { inject, injectable } from "inversify";
import { UseCaseSymbols } from "app/use-cases/dependency-symbols";
import { BotServiceSymbols } from "../services/dependency-symbols";
import type { BotController } from ".";
import type { CreateUserUseCase, UpdateUserUseCase } from "app/use-cases";
import type { Update, Message } from "telegraf/types";
import type { SessionService } from "../services/session";

@injectable()
export class UserController implements BotController {
    private readonly defaultPhone = "998998888888";
    private readonly defaultEmail = "default@default.com";

    constructor(
        @inject(BotServiceSymbols.Session)
        private sessionService: SessionService,
        @inject(UseCaseSymbols.CreateUserUseCase)
        private createUserUsecase: CreateUserUseCase,
        @inject(UseCaseSymbols.UpdateUserUseCase)
        private updateUserUsecase: UpdateUserUseCase,
    ) {}

    public register(bot: Telegraf): void {
        bot.command("user_register", (ctx) => {
            this.userRegister(ctx);
        });
        bot.on("contact", (ctx) => {
            this.updateUser(ctx);
        });
    }

    private async userRegister(ctx: Context) {
        const result = await this.createUserUsecase.execute({
            name: ctx.from.first_name,
            username: ctx.from.username!,
            phone: this.defaultPhone,
            telegramId: ctx.chat.id.toString(),
            email: this.defaultEmail,
        });

        await this.sessionService.updateSession(ctx.chat.id, {
            userId: result.user.getId().toString(),
        });

        await ctx.reply(
            `What's up ${result.user.getName()}!\n Please provide your phone to continue register...`,
            Markup.keyboard([Markup.button.contactRequest("📱 Share contact")])
                .oneTime()
                .resize(),
        );
    }

    private async updateUser(
        ctx: NarrowedContext<
            Context<Update>,
            {
                message: Update.New &
                    Update.NonChannel &
                    Message.ContactMessage;
                update_id: number;
            }
        >,
    ) {
        const contact = ctx.message.contact;
        if (!contact) {
            await ctx.reply("Too much time has passed maybe try again?");

            return;
        }

        const result = await this.updateUserUsecase.execute({
            id: (await this.sessionService.getSession(ctx.chat.id)).userId!,
            telegramId: ctx.chat.id.toString(),
            phone: contact.phone_number,
        });

        await ctx.reply(
            `Thank you for completing registration ${result.user.getName()}`,
        );
    }
}
