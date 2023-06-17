import { Schema, model, models } from 'mongoose'

const ScheduleSchema = new Schema(
    {
        timein: {
            type: String,
            default: ''
        },
        timeout: {
            type: String,
            default: ''
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

const Schedules = models.Schedules || model('Schedules', ScheduleSchema)

export default Schedules
