import * as Models from "app/components"

export interface Storage {
    open(): Promise<void>

    close(): Promise<void>

    getCardsCollection(): typeof Models.CardModel

    getDecksCollection(): typeof Models.DeckModel

    getUsersCollection(): typeof Models.UserModel

    getNotesCollection(): typeof Models.NoteModel

    getAttendancesCollection(): typeof Models.AttendanceModel
}