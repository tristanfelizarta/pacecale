import connect from 'database/connect'
import Users from 'database/schemas/users'
import Leaves from 'database/schemas/leaves'
import sgMail from '@sendgrid/mail'

export default async (req, res) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    await connect()

    try {
        const { id, data } = req.body
        const leave = await Leaves.findById({ _id: id })
        const user = await Users.findById({ _id: leave.user.id })

        await Leaves.findByIdAndUpdate(
            { _id: id },
            {
                status: 'approved',
                ...data,
                updated: new Date().toLocaleString('en-US', {
                    timeZone: 'Asia/Manila'
                })
            }
        )

        const msg = {
            to: user.email,
            from: process.env.EMAIL_FROM,
            subject: 'Your Leave is Approved!',
            html: `<p>Download here: <a href="${data.approved.file.url}" target="_blank">${data.approved.file.url}</a></p>`
        }

        sgMail.send(msg)
        res.status(200).send('request success.')
    } catch (error) {
        return res.status(400).send('request failed.')
    }
}
