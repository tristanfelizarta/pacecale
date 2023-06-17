import { Schema, model, models } from 'mongoose'

const MeetingSchema = Schema(
    {
        title: {
            type: String,
            default: ''
        },
        schedule: {
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

const Meetings = models.Meetings || model('Meetings', MeetingSchema)

export default Meetings
