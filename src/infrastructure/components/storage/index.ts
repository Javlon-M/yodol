import * as Models from "../../../components/"


export interface Storage {
    open(): Promise<void>

    close(): Promise<void>

    getCardsCollection(): typeof Models.CardModel

    getDecksCollection(): typeof Models.DeckModel
}