import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Repositories from "app/repositories"

import { RepositorySymbols } from "app/repositories/dependency-symbols"


export interface MarkUserSubmissionUseCase {
    execute(params: Params): Promise<Domain.Attendance>
}

@Inversify.injectable()
export class MarkUserSubmissionUseCaseImpl implements MarkUserSubmissionUseCase {
    constructor(
        @Inversify.inject(RepositorySymbols.AttendanceRepository) private attendanceRepository: Repositories.AttendanceRepository
    ){}
    
    public async execute(params: Params): Promise<Domain.Attendance> {
        const today = this.getToday()

        const attendance = await this.attendanceRepository.findOne({
            userId: params.userId.toString(),
            month: today.monthName,
            createdAtMonth: today.month 
        })

        if (!attendance) {
            return await this.attendanceRepository.upsert({
                userId: params.userId.toString(),
                month: today.monthName,
                attended: [today.dayNumber], 
                createdAtMonth: today.month,
                lastSubmitDay: today.day
            })
        }

        if (attendance.getLastSubmitDay() >= today.day) return
        
        const attended = attendance.getAttended()

        attended.push(today.dayNumber)
        
        return await this.attendanceRepository.markSubmit({
            id: attendance.getId(),
            attended,
            lastSubmitDay: today.day
        })
    }

    private getToday(): Today {
        const today = new Date()
        const hours = today.getTime() // (02.04.2025 10:45) => 1743572740000

        today.setHours(0, 0, 0, 0) 
        const day = today.getTime() // (02.04.2025 00:00) => 1743562740000
        const dayNumber = today.getDate() // 3 only day

        today.setDate(1)
        const month = today.getTime() // (01.04.2025 00:00) => 1742562740000
        const monthName = today.toLocaleString("default", { month: "long" }) // (01.04 00:00) => March

        return {
            hours,
            day,
            dayNumber,
            month,
            monthName
        }
    }
}

interface Params {
    userId: Domain.Identifier
}

interface Today {
    hours: number
    day: number
    dayNumber: number
    month: number
    monthName: string
}