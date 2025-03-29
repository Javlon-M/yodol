import mongoose, { Schema, Document } from "mongoose"


export interface AttendanceDocument extends Document {
    user_id: string
    month: string
    attended: number[]
    created_at: number
}

const AttendanceSchema = new Schema<AttendanceDocument>(
    {
        user_id: {
            type: String,
            required: true
        },
        month: {
            type: String,
            required: true
        },
        attended: {
            type: [Number],
            required: true
        },
        created_at: {
            type: Number,
            required: true
        }
    }
)

export const AttendanceModel = mongoose.model<AttendanceDocument>("attendance", AttendanceSchema)