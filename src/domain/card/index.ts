export class Card {
    constructor(
        private id: string,
        private deckId: string,
        private front: string,
        private back: string,
        private level: CardLevels,
        private duration: number
    ){}

    public getId(): string {
        return this.id
    }

    public getDeckId(): string {
        return this.deckId
    }

    public getFront(): string {
        return this.front
    }

    public getBack(): string {
        return this.back
    }
    
    public getLevel(): CardLevels {
        return this.level
    }
    
    public getDuration(): number {
        return this.duration
    }
}

export enum CardLevels {
    New = 0,
    Learning = 1,
    Young = 2,
    Mature = 3
}