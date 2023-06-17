import { Schema, model, models } from 'mongoose'

const AttendanceSchema = new Schema(
    {
        user: {
            type: String,
            default: ''
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
        timein: {
            time: {
                type: String,
                default: ''
            },
            status: {
                type: Object,
                default: {}
            }
        },
        timeout: {
            time: {
                type: String,
                default: ''
            },
            status: {
                type: Object,
                default: {}
            }
        },
        duration: {
            hours: {
                type: Number,
                default: 0
            },
            minutes: {
                type: Number,
                default: 0
            }
        },
        amount: {
            late: {
                type: Number,
                default: 0
            },
            overtime: {
                type: Number,
                default: 0
            },
            netpay: {
                type: Number,
                default: 0
            }
        },
        payed: {
            type: Boolean,
            default: false
        },
        date: {
            type: String,
            default: ''
        },
        extra: {
            employees: {
                type: Number,
                default: 0
            }
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

const Attendance = models.Attendance || model('Attendance', AttendanceSchema)

export default Attendance
