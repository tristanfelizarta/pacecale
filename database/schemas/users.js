import { Schema, model, models } from 'mongoose'

const UserSchema = new Schema(
    {
        image: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            default: ''
        },
        resume: {
            type: String,
            default: ''
        },
        limit: {
            type: Number,
            default: 15
        },
        position: {
            title: {
                type: String,
                default: ''
            },
            rate: {
                type: Number,
                default: 0
            }
        },
        schedule: {
            timein: {
                type: String,
                default: ''
            },
            timeout: {
                type: String,
                default: ''
            }
        },
        hired_date: {
            type: String,
            default: ''
        },
        contract_end_date: {
            type: String,
            default: ''
        },
        role: {
            type: String,
            default: 'User'
        },
        status: {
            type: String,
            default: 'Active'
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

const Users = models.Users || model('Users', UserSchema)

export default Users
