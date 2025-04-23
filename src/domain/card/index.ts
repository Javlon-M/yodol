import * as Domain from "app/domain"


export class Card {
    constructor(
        private id: Domain.Identifier,
        private deckId: Domain.Identifier,
        private createdAt: number,
        private type: number,
        private queue: number,
        private interval: number,
        private factor: number,
        private repetitions: number,
        private lapses: number,
        private left: number,
        private due: number
    ){}

    public getId(): Domain.Identifier {
        return this.id
    }

    public getDeckId(): Domain.Identifier {
        return this.deckId
    }

    public getType(): CardTypes {
        return this.type
    }

    public getQueue(): CardQueues {
        return this.queue
    }
    
    public getInterval(): number {
        return this.interval
    }
    
    public getFactor(): number {
        return this.factor
    }
    
    public getCreatedAt(): number {
        return this.createdAt
    }
    
    public getRepetitions(): number {
        return this.repetitions
    }
    
    public getLapses(): number {
        return this.lapses
    }

    public getLeft(): number {
        return this.left
    }
    
    public getDue(): number {
        return this.due
    }
}

export enum CardTypes {
    New = 0,
    Learning = 1,
    Review = 2,
    Relearning = 3
}

export enum CardQueues {
    suspend = -1,
    new = 0,
    lrn = 1,
    rev = 2
}