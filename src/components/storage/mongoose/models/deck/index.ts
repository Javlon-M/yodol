import mongoose, { Document, Schema } from "mongoose"

export interface DeckDocument extends Document {
    user_id: string
    title: string
    active: boolean
    description?: string
}

const DeckSchema = new Schema<DeckDocument>(
    {
        user_id: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        active: {
            type: Boolean,
            required: true
        },
        description: {
            type: String,
            required: false
        }
    }
)

export const DeckModel = mongoose.model<DeckDocument>("deck", DeckSchema)
