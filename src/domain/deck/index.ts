export class Deck {
    constructor(
        private id: string,
        private user_id: string,
        private title: string,
        private active: boolean,
        private description?: string
    ) {}

    public getId(): string {
        return this.id
    }

    public getUserId(): string {
        return this.user_id
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