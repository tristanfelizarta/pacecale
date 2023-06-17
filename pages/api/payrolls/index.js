import connect from 'database/connect'
import Attendance from 'database/schemas/attendance'
import Payrolls from 'database/schemas/payrolls'
import sgMail from '@sendgrid/mail'
import Users from 'database/schemas/users'
import { currency } from 'functions/currency'

export default async (req, res) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const { method } = req
    await connect()

    switch (method) {
        case 'GET':
            try {
                const data = await Payrolls.find({}).sort({ createdAt: -1 })
                res.status(200).send(data)
            } catch (error) {
                return res.status(400).send('request failed.')
            }

            break

        case 'POST':
            try {
                res.status(200).send('request success.')
            } catch (error) {
                return res.status(400).send('request failed.')
            }

            break

        case 'PATCH':
            try {
                const { id, data } = req.body

                await Payrolls.findByIdAndUpdate(
                    { _id: id },
                    {
                        ...data,
                        updated: new Date().toLocaleString('en-US', {
                            timeZone: 'Asia/Manila'
                        })
                    }
                )

                data.attendances.map(async (att) => {
                    await Attendance.findByIdAndUpdate(
                        { _id: att._id },
                        {
                            payed: true,
                            updated: new Date().toLocaleString('en-US', {
                                timeZone: 'Asia/Manila'
                            })
                        }
                    )
                })

                const payroll = await Payrolls.findById({ _id: id })
                const user = await Users.findById({ _id: payroll.user })

                const msg = {
                    to: user.email,
                    from: process.env.EMAIL_FROM,
                    subject: 'Samgyup Salamat Payroll Report',
                    html: `<table style="width: 100%; border-collapse: collapse;">
								<tr>
									<td>Date</td>
									<td>${payroll.updated}</td>
								</tr>			
								
								<tr>
									<td>Name</td>
									<td>${user.name}</td>
								</tr>

								<tr>
									<td>Position</td>
									<td>${payroll.position.title}</td>
								</tr>

								<tr>
									<td>Rate</td>
									<td>${currency(payroll.position.rate)}</td>
								</tr>

								<tr>
									<td>Schedule</td>
									<td>${payroll.schedule.timein} - ${payroll.schedule.timeout}</td>
								</tr>

								<tr>
									<td colspan="2"></td>
								</tr>

								<tr>
									<td>Pay</td>
									<td>${currency(payroll.amount.pay)}</td>
								</tr>

								<tr>
									<td>Leave</td>
									<td>${currency(payroll.amount.leaves)}</td>
								</tr>

								<tr>
									<td>Overtime</td>
									<td>${currency(payroll.amount.overtime)}</td>
								</tr>

								<tr>
									<td>Gross Pay</td>
									<td>${currency(payroll.amount.grosspay)}</td>
								</tr>

								<tr>
									<td>Deduction</td>
									<td>${currency(payroll.amount.deductions)}</td>
								</tr>

								<tr>
									<td>Net Pay</td>
									<td>${currency(payroll.amount.netpay)}</td>
								</tr>
							</table>`
                }

                sgMail
                    .send(msg)
                    .then(() => {
                        res.status(200).send('request success.')
                    })
                    .catch((error) => {
                        res.status(400).send('request failed.')
                    })

                res.status(200).send('request success.')
            } catch (error) {
                return res.status(400).send('request failed.')
            }

            break

        case 'DELETE':
            try {
                res.status(200).send('request success.')
            } catch (error) {
                return res.status(400).send('request failed.')
            }

            break

        default:
            res.status(400).send('request failed.')
            break
    }
}
