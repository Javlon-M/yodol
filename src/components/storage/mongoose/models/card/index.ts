import mongoose, { Schema, Document } from "mongoose"


export interface CardDocument extends Document {
    deck_id: string
    front: string
    back: string
    level: number
    duration: number
    create_at: number
    last_level_update: number
}

const CardSchema = new Schema<CardDocument>(
    {
        deck_id: {
            type: String,
            required: true
        },
        front: {
            type: String,
            required: true
        },
        back: {
            type: String,
            required: true
        },
        level: {
            type: Number,
            required: true
        },
        duration: {
            type: Number,
            required: false
        },
        create_at: {
            type: Number,
            required: true
        },
        last_level_update: {
            type: Number,
            required: false
        }
    }
)

export const CardModel = mongoose.model<CardDocument>("card", CardSchema)