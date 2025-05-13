import mongoose, { Document, Schema } from "mongoose"

export interface DeckDocument extends Document {
    user_id: string
    title: string
    active: boolean
    description?: string
    configurations: {
        new: {
            delays: []
            ints: []
            initialFactor: number
            perDay: number
        },
        rev: {
            perDay: number
            ease4: number
            maxIvl: number
            hardFactor: number
        },
        lapse: {
            delays: []
            mult: number
            minInt: number
            leechFails: number
        }
    }
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
        },
        configurations: {
            type: {
                new: {
                    delays: {
                        type: Array,
                        required: true
                    },
                    ints: {
                        type: Array,
                        required: true
                    },
                    initialFactor: {
                        type: Number,
                        required: true
                    },
                    perDay: {
                        type: Number,
                        required: true
                    }
                },
                rev: {
                    perDay: {
                        type: Number,
                        required: true
                    },
                    ease4: {
                        type: Number,
                        required: true
                    },
                    maxIvl: {
                        type: Number,
                        required: true
                    },
                    hardFactor: {
                        type: Number,
                        required: true
                    }
                },
                lapse: {
                    delays: {
                        type: Array,
                        required: true
                    },
                    mult: {
                        type: Number,
                        required: true
                    },
                    minInt: {
                        type: Number,
                        required: true
                    },
                    leechFails: {
                        type: Number,
                        required: true
                    }
                }
            },
            required: true
        }
    }
)

export const DeckModel = mongoose.model<DeckDocument>("deck", DeckSchema)
