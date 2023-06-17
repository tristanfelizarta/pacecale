import { Schema, model, models } from 'mongoose'

const DeductionSchema = new Schema(
    {
        title: {
            type: String,
            default: ''
        },
        amount: {
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

const Deductions = models.Deductions || model('Deductions', DeductionSchema)

export default Deductions
