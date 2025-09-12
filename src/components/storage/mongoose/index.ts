import * as Inversify from "inversify"
import { connect, Mongoose } from "mongoose"

import * as Models from "./models"
import * as Infrastructure from "app/infrastructure"


@Inversify.injectable()
export class MongooseStorageImpl implements Infrastructure.Storage {
    private client: Mongoose

    private async init(): Promise<void> {
        if (!this.client){
            this.client = await connect(process.env.DB_URI, {
                appName: "yodol",
                dbName: process.env.DB_NAME,
                auth: {
                    username: process.env.DB_USER_NAME,
                    password: process.env.DB_USER_PASSWORD
                }
            })
        }
    }

    public async open(): Promise<void> {

        try {
            console.log("DB connecting...")
            await this.init()
            console.log("DB connected")
        }
        catch(error) {
            throw new Error("MongoDB: Connecting error: ", error)
        }
    }

    public async close(): Promise<void> {
        try {
            this.client.disconnect()
        }
        catch(error) {
            throw new Error("MongoDB: Disconnecting error: ", error)
        }
    }

    public getCardsCollection(): typeof Models.CardModel {
        return Models.CardModel
    }

    public getDecksCollection(): typeof Models.DeckModel {
        return Models.DeckModel
    }

    public getUsersCollection(): typeof Models.UserModel {
        return Models.UserModel
    }

    public getNotesCollection(): typeof Models.NoteModel {
        return Models.NoteModel
    }

    public getAttendancesCollection(): typeof Models.AttendanceModel {
        return Models.AttendanceModel
    }
}
