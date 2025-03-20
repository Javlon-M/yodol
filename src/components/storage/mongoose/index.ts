import * as Inversify from "inversify"
import mongoose, { Connection } from "mongoose"

import * as Infrastructure from "../../../infrastructure"


@Inversify.injectable()
export class MongooseStorageImpl implements Infrastructure.Storage {
    private client: Connection

    private init(): void {
        if (!this.client){
            this.client = mongoose.createConnection(process.env.DB_URI, {
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
        this.init()

        try {
            this.client.on("connected", () => {
                console.log("MongoDB: Connected")
            })
            
            this.client.on("open", () => {
                console.log("MongoDB: Connection opened")
            })
        }
        catch(error) {
            throw new Error("MongoDB: Connecting error: ", error)
        }
    }

    public async close(): Promise<void> {
        try {
            this.client.on("close", () => {
                console.log("MongoDB: Connections closed")
            })

            this.client.on("disconnected", () => {
                console.log("MongoDB: Disconnected")
            })
        }
        catch(error) {
            throw new Error("MongoDB: Disconnecting error: ", error)
        }
    }
}