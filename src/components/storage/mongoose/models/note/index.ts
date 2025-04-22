import mongoose, { Schema, Document, Types } from "mongoose"


export interface NoteDocument extends Document {
    deck_id: Types.ObjectId
    card_id: Types.ObjectId
    front: string
    back: string
    created_at: number
}

const NoteSchema = new Schema<NoteDocument>(
    {
        deck_id: {
            type: Schema.ObjectId,
            required: true
        },
        card_id: {
            type: Schema.ObjectId,
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
        created_at: {
            type: Number,
            required: true
        }
    }
)

export const NoteModel = mongoose.model<NoteDocument>("note", NoteSchema)