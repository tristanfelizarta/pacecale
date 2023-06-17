import { Schema, model, models } from 'mongoose'

const PositionSchema = new Schema(
    {
        title: {
            type: String,
            default: ''
        },
        rate: {
            type: Number,
            default: 0
        },
        created: {
            type: String,
            default: ''
        },
        updated: {
            type: String,
            default: ''
        }
    },
    { timestamps: true }
)

const Positions = models.Positions || model('Positions', PositionSchema)

export default Positions
