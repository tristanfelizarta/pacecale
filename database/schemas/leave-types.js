import { Schema, model, models } from 'mongoose'

const LeaveTypeSchema = new Schema(
    {
        name: {
            type: String,
            default: ''
        },
        payed: {
            type: Boolean,
            default: false
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

const LeaveTypes = models.LeaveTypes || model('LeaveTypes', LeaveTypeSchema)

export default LeaveTypes
