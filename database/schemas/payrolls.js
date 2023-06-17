import { Schema, model, models } from 'mongoose'

const PayrollSchema = new Schema(
    {
        user: {
            type: String,
            default: ''
        },
        position: {
            type: Object,
            default: {}
        },
        schedule: {
            type: Object,
            default: {}
        },
        amount: {
            pay: {
                type: Number,
                default: 0
            },
            overtime: {
                type: Number,
                default: 0
            },
            grosspay: {
                type: Number,
                default: 0
            },
            leaves: {
                type: Number,
                default: 0
            },
            deductions: {
                type: Number,
                default: 0
            },
            netpay: {
                type: Number,
                default: 0
            }
        },
        attendances: {
            type: Array,
            default: []
        },
        leaves: {
            type: Array,
            default: []
        },
        deductions: {
            type: Array,
            default: []
        },
        status: {
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

const Payrolls = models.Payrolls || model('Payrolls', PayrollSchema)

export default Payrolls
