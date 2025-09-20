import { Context, Telegraf } from "telegraf";
import { BotController } from ".";
import { inject, injectable } from "inversify";
import { UseCaseSymbols } from "app/use-cases/dependency-symbols";
import {
    GetOneUserByTelegramIdUseCase,
    GetUserStatsUseCase,
} from "app/use-cases";
import { BUTTONS } from "../constants/button.constant";

@injectable()
export class StatController implements BotController {
    public lang: keyof typeof BUTTONS = "en";

    constructor(
        @inject(UseCaseSymbols.GetUserStatsUseCase)
        private getUserStatsUsecase: GetUserStatsUseCase,
        @inject(UseCaseSymbols.GetOneUserByTelegramIdUseCase)
        private getOneUserByTelegramIdUsecase: GetOneUserByTelegramIdUseCase,
    ) {}

    public register(bot: Telegraf): void {
        bot.hears(BUTTONS[this.lang].STATS, (ctx) => {
            this.getUserStats(ctx);
        });
    }

    private async getUserStats(ctx: Context): Promise<void> {
        const telegramId = ctx.from!.id;
        const user = await this.getOneUserByTelegramIdUsecase.execute({
            telegramId,
        });

        const result: string[] = [];
        const stats = await this.getUserStatsUsecase.execute({
            userId: user.user.getId().toString(),
            deckId: "",
            limit: 0,
            skip: 0,
            sort: -1,
        });

        for (const attendance of stats.attendances) {
            result.push(`In ${new Date(attendance.getCreatedAtMonth()).toLocaleString("en-US", { month: "long" })}\r\n${attendance.getAttended().length} days\r\nthe last active day ${new Date(attendance.getLastSubmitDay()).toLocaleString("en-US", { weekday: "long" })}
            `);
        }

        await ctx.reply(result.join("\n"));
    }
}
