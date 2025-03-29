export class Deck {
    constructor(
        private id: string,
        private userId: string,
        private title: string,
        private active: boolean,
        private description?: string
    ) {}

    public getId(): string {
        return this.id
    }

    public getUserId(): string {
        return this.userId
    }

    public getTitle(): string {
        return this.title
    }

    public getActive(): boolean {
        return this.active
    }

    public getDescription(): string {
        return this.description
    }
}