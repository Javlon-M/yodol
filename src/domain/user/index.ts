export class User {
    constructor(
        private id: string,
        private phone: string,
        private username: string,
        private name: string,
        private telegramId: string,
        private createdAt: number,
        private email?: string,
    ){}

    public getId(): string {
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
    
    public getEmail(): string | undefined {
        return this.email
    }
    
    public getCreatedAt(): number {
        return this.createdAt
    }

}