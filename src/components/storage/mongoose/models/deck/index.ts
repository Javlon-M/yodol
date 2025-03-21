import mongoose, { Document, Schema } from "mongoose"

export interface DeckDocument extends Document {
    userId: string
    title: string
    description?: string
}

const DeckSchema = new Schema<DeckDocument>(
    {
        userId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        }
    }
)

export const DeckModel = mongoose.model<DeckDocument>("deck", DeckSchema)
