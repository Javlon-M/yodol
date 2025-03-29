import * as Domain from "app/domain"


export class Attendance {
    constructor(
        private id: Domain.Identifier,
        private month: string,
        private userId: string,
        private attended: number[]
    ){}

    public getId(): Domain.Identifier {
        return this.id
    }

    public getUserId(): string {
        return this.userId
    }
    
    public getMonth(): string {
        return this.month
    }
    
    public getAttended(): number[] {
        return this.attended
    }
}