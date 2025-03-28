import * as Domain from "app/domain";

export class User {
    constructor(
        private id: Domain.Identifier,
        private phone: string,
        private username: string,
        private name: string,
        private telegramId: string,
        private createdAt: number,
        private email: string,
    ){}

    public getId(): Domain.Identifier {
        return this.id
    }

    public getPhone(): string {
        return this.phone
    }

    public getUsername(): string {
        return this.username
    }

    public getName(): string {
        return this.name
    }
    
    public getTelegramId(): string {
        return this.telegramId
    }
    
    public getEmail(): string {
        return this.email
    }
    
    public getCreatedAt(): number {
        return this.createdAt
    }

}