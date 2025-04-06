import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Repositories from "app/repositories"

import { RepositorySymbols } from "app/repositories/dependency-symbols"


export interface GetUserStatsUseCase {
    execute(param: Params): Promise<Response>
}

@Inversify.injectable()
export class GetUserStatsUseCaseImpl implements GetUserStatsUseCase {
    constructor(
        @Inversify.inject(RepositorySymbols.AttendanceRepository) private attendanceRepository: Repositories.AttendanceRepository,
        @Inversify.inject(RepositorySymbols.CardRepository) private cardRepository: Repositories.CardRepository
    ){}

    public async execute(params: Params): Promise<Response> {
        const attendances = await this.getCalendar(params)
        const cards = await this.getCards(params.deckId)
        
        return {
            cards,
            attendances
        }
    }

    private async getCards(deckId: string): Promise<Domain.Card[]> {
        return await this.cardRepository.findByDeckId(deckId)
    }

    private async getCalendar(params: Params): Promise<Domain.Attendance[]> {
        const options = {
            limit: 12,
            sort: -1,
            skip: 0
        }

        if (params.limit) options.limit = params.limit

        if (params.skip) options.skip = params.skip

        if (params.sort) options.sort = params.sort

        return await this.attendanceRepository.findByUserId(params.userId, options)
    }
}

interface Params {
    userId: string
    deckId: string
    limit: number
    skip: number
    sort: number
}

interface Response {
    cards: Domain.Card[]
    attendances: Domain.Attendance[]
}