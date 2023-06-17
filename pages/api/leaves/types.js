import connect from 'database/connect'
import LeaveTypes from 'database/schemas/leave-types'

export default async (req, res) => {
    const { method } = req
    await connect()

    switch (method) {
        case 'GET':
            try {
                const data = await LeaveTypes.find({}).sort({ createdAt: -1 })
                res.status(200).send(data)
            } catch (error) {
                return res.status(400).send('request failed.')
            }

            break

        case 'POST':
            try {
                const { data } = req.body

                await LeaveTypes.create({
                    ...data,
                    created: new Date().toLocaleString('en-US', {
                        timeZone: 'Asia/Manila'
                    }),
                    updated: new Date().toLocaleString('en-US', {
                        timeZone: 'Asia/Manila'
                    })
                })

                res.status(200).send('request success.')
            } catch (error) {
                return res.status(400).send('request failed.')
            }

            break

        case 'PATCH':
            try {
                res.status(200).send('request success.')
            } catch (error) {
                return res.status(400).send('request failed.')
            }

            break

        case 'DELETE':
            try {
                const { id } = req.body
                await LeaveTypes.findByIdAndDelete({ _id: id })
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
