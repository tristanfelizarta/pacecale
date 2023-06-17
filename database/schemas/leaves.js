import { Schema, model, models } from 'mongoose'

const LeaveSchema = new Schema(
    {
        user: {
            id: {
                type: String,
                default: ''
            }
        },
        type: {
            type: String,
            default: ''
        },
        from: {
            type: String,
            default: ''
        },
        to: {
            type: String,
            default: ''
        },
        days: {
            type: Number,
            default: 0
        },
        payed: {
            type: Boolean,
            default: false
        },
        file: {
            url: {
                type: String,
                default: ''
            },
            name: {
                type: String,
                default: ''
            },
            size: {
                type: Number,
                default: 0
            }
        },
        approved: {
            by: {
                type: String,
                default: ''
            },
            date: {
                type: String,
                default: ''
            },
            file: {
                url: {
                    type: String,
                    default: ''
                },
                name: {
                    type: String,
                    default: ''
                },
                size: {
                    type: Number,
                    default: 0
                }
            }
        },
        rejected: {
            by: {
                type: String,
                default: ''
            },
            date: {
                type: String,
                default: ''
            },
            message: {
                type: String,
                default: ''
            }
        },
        cancelled: {
            date: {
                type: String,
                default: ''
            }
        },
        status: {
            type: String,
            default: 'waiting'
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

const Leaves = models.Leaves || model('Leaves', LeaveSchema)

export default Leaves
