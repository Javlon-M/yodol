import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Models from "app/components"
import * as Factories from "app/factories"
import * as Infrastructure from "app/infrastructure"

import { FactorySymbols } from "app/factories/dependency-symbols"
import { ComponentsSymbols } from "app/components/dependency-symbols"


export interface AttendanceRepository {
    upsert(params: CreateParams): Promise<Domain.Attendance>
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
            created_at: params.createdAt,
            month: params.month
        }

        const upsertParams = {
            user_id: params.userId,
            month: params.month,
            attended: params.attended,
            created_at: params.createdAt,
            last_submit_day: params.lastSubmitDay
        }

        const options = { upsert: true }

        const attendance = await this.storage.getAttendancesCollection().findOneAndUpdate(filter, upsertParams, options)

        return this.toDomainEntity(attendance)
    }

    private toDomainEntity(attendance: Models.AttendanceDocument): Domain.Attendance {
        if (!attendance) return null

        return this.attendanceFactory.construct({
            id: attendance.id,
            userId: attendance.user_id,
            month: attendance.month,
            attended: attendance.attended,
            createdAt: attendance.created_at
        })
    }
}

interface CreateParams {
    userId: string
    month: string
    attended: number[]
    createdAt: number
    lastSubmitDay: number
}