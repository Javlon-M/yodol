import mongoose, { Schema, Document, Types } from "mongoose"


export interface CardDocument extends Document {
    deck_id: Types.ObjectId
    created_at: number
    type: number,
    queue: number,
    interval: number,
    factor: number,
    repetitions: number,
    lapses: number,
    left: number,
    due: number
}

const CardSchema = new Schema<CardDocument>(
    {
        deck_id: {
            type: Schema.ObjectId,
            required: true
        },
        created_at: {
            type: Number,
            required: true
        },
        type: {
            type: Number,
            required: true
        },
        queue: {
            type: Number,
            required: false
        },
        interval: {
            type: Number,
            required: false
        },
        factor: {
            type: Number,
            required: false
        },
        repetitions: {
            type: Number,
            required: true
        },
        lapses: {
            type: Number,
            required: false
        },
        left: {
            type: Number,
            required: false
        },
        due: {
            type: Number,
            required: false
        }
    }
)

export const CardModel = mongoose.model<CardDocument>("card", CardSchema)