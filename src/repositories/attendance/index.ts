import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Models from "app/components"
import * as Factories from "app/factories"
import * as Infrastructure from "app/infrastructure"

import { FactorySymbols } from "app/factories/dependency-symbols"
import { ComponentsSymbols } from "app/components/dependency-symbols"


export interface AttendanceRepository {
    upsert(params: CreateParams): Promise<Domain.Attendance>
    markSubmit(params: MarkSubmitParams): Promise<Domain.Attendance>
    findOne(filter: FindOneParams): Promise<Domain.Attendance>
    findByUserIdAndDeckId(userId: string, deckId: string, options: Options): Promise<Domain.Attendance[]>
}

@Inversify.injectable()
export class AttendanceRepositoryImpl implements AttendanceRepository {
    constructor(
        @Inversify.inject(FactorySymbols.AttendanceFactory) private attendanceFactory: Factories.AttendanceFactory,
        @Inversify.inject(ComponentsSymbols.MongooseStorage) private storage: Infrastructure.Storage,
    ) { }

    public async upsert(params: CreateParams): Promise<Domain.Attendance> {
        const filter = {
            user_id: params.userId,
            created_at_month: params.createdAtMonth,
            month: params.month
        }

        const upsertParams = {
            user_id: params.userId,
            month: params.month,
            attended: params.attended,
            created_at_month: params.createdAtMonth,
            last_submit_day: params.lastSubmitDay
        }

        const options = { upsert: true }

        const attendance = await this.storage.getAttendancesCollection().findOneAndUpdate(filter, upsertParams, options)

        return this.toDomainEntity(attendance)
    }

    public async markSubmit(params: MarkSubmitParams): Promise<Domain.Attendance> {
        const attendance = await this.storage.getAttendancesCollection().findByIdAndUpdate<Models.AttendanceDocument>({
            _id: params.id.toStorageValue()
        }, {
            attended: params.attended,
            last_submit_day: params.lastSubmitDay
        })

        return this.toDomainEntity(attendance)
    }

    public async findOne(filter: FindOneParams): Promise<Domain.Attendance> {
        const attendance = await this.storage.getAttendancesCollection().findOne<Models.AttendanceDocument>(filter)

        return this.toDomainEntity(attendance)
    }

    public async findByUserIdAndDeckId(userId: string, deckId: string, options: Options): Promise<Domain.Attendance[]> {
        const attendances = await this.storage.getAttendancesCollection().find<Models.AttendanceDocument>({
            user_id: userId,
            deck_id: deckId
        }, options)

        return attendances.map(this.toDomainEntity.bind(this))
    }

    private toDomainEntity(attendance: Models.AttendanceDocument): Domain.Attendance {
        if (!attendance) return null

        return this.attendanceFactory.construct({
            id: attendance.id,
            userId: attendance.user_id,
            month: attendance.month,
            attended: attendance.attended,
            createdAtMonth: attendance.created_at_month,
            lastSubmitDay: attendance.last_submit_day,
            deckId: attendance.deck_id
        })
    }
}

interface CreateParams {
    userId: string
    month: string
    attended: number[]
    createdAtMonth: number
    lastSubmitDay: number
}

interface MarkSubmitParams {
    id: Domain.Identifier
    attended: number[]
    lastSubmitDay: number
}

interface FindOneParams {
    userId: string
    month: string
    createdAtMonth: number
}

interface Options {
    limit: number, 
    sort: number, 
    skip: number
}