import mongoose, {Document, Schema} from "mongoose"

export interface UserDocument extends Document {
    phone: string
    username: string
    name: string
    telegram_id: string
    created_at: number
    email?: string
}

const UserSchema = new Schema<UserDocument>(
    {
        phone: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        telegram_id: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: false
        },
        created_at: {
            type: Number,
            required: true
        }
    }
)

export const UserModel = mongoose.model<UserDocument>("user", UserSchema)
