import * as Inversify from "inversify"

import * as Domain from "app/domain"


export interface AttendanceFactory {
    construct(params: Params): Domain.Attendance
}

@Inversify.injectable()
export class AttendanceFactoryImpl implements AttendanceFactory {
    public construct(params: Params): Domain.Attendance {
        return new Domain.Attendance(
            params.id,
            params.month,
            params.userId,
            params.attended,
            params.createdAt,
            params.lastSubmitDay
        )
    }
}

interface Params {
    id: Domain.Identifier
    month: string
    userId: string
    attended: number[]
    createdAt: number
    lastSubmitDay: number
}