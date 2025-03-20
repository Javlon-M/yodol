import mongoose, { Schema, Document } from "mongoose"


export interface CardDocument extends Document {
    deck_id: string
    front: string
    back: string
    level: number
    schedule_period: number
    created_at: number
    level_updated_at: number
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
        schedule_period: {
            type: Number,
            required: false
        },
        created_at: {
            type: Number,
            required: true
        },
        level_updated_at: {
            type: Number,
            required: false
        }
    }
)

export const CardModel = mongoose.model<CardDocument>("card", CardSchema)