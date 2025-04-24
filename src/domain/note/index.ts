import * as Domain from "app/domain"


export class Note {
    constructor(
        private id: Domain.Identifier,
        private cardId: Domain.Identifier,
        private deckId: Domain.Identifier,
        private createdAt: number,
        private front: string,
        private back: string
    ){}

    public getId(): Domain.Identifier {
        return this.id
    }

    public getCardId(): Domain.Identifier {
        return this.cardId
    }

    public getDeckId(): Domain.Identifier {
        return this.deckId
    }

    public getBack(): string {
        return this.back
    }

    public getFront(): string {
        return this.front
    }
    
    public getCreatedAt(): number {
        return this.createdAt
    }
}
