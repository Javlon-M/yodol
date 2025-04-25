import * as Inversify from "inversify"

import * as UseCases from "app/use-cases"

import { UseCaseSymbols } from "app/use-cases/dependency-symbols"


export interface ManageAndGetCarsUseCase {
    execute(params: Params): Promise<Response>
}

@Inversify.injectable()
export class ManageAndGetCarsUseCaseImpl implements ManageAndGetCarsUseCase {
    constructor( 
        @Inversify.inject(UseCaseSymbols.GetCardsUseCase) private getCardsUseCase: UseCases.GetCardsUseCase
    ){}

    public async execute(params: Params): Promise<Response> {
        let card = await this.getLrnCard()
        if (card) {
            return card
        }

        if (this.isTimeForNew()) {
            card = await this.getNewCard()
            if (card) {
                return card
            }
        }

        card = await this.getRevCard()
        if (card) {
            return card
        }

        card = await this.getNewCard()
        if (card) {
            return card
        }

        return await this.getLrnCard({ collapse: true }) 
    }

    private isTimeForNew(): boolean {
        return
    }

    private async getNewCard(): Promise<{}> {
        return
    }

    private async getLrnCard(options?: { collapse: boolean }): Promise<{}> {
        return 
    }

    private async getRevCard(): Promise<{}> {
        return
    }

    private getOptions(): Options {
        return {
            queueLimit: parseInt(process.env.QUEUE_LIMIT),
            reportLimit: parseInt(process.env.REPORT_LIMIT),
            collapseTime: parseInt(process.env.COLLAPSE_TIME)
        }
    }
}

interface Params {

}

interface Response {

}

interface Options {
    queueLimit: number
    reportLimit: number
    collapseTime: number
}