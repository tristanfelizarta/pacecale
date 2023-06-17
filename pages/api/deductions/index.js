import connect from 'database/connect'
import Deductions from 'database/schemas/deductions'

export default async (req, res) => {
    const { method } = req
    await connect()

    switch (method) {
        case 'GET':
            try {
                const data = await Deductions.find({}).sort({ createdAt: -1 })
                res.status(200).send(data)
            } catch (error) {
                return res.status(400).send('request failed.')
            }

            break

        case 'POST':
            try {
                const { data } = req.body

                await Deductions.create({
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
                const { id, data } = req.body

                await Deductions.findByIdAndUpdate(
                    { _id: id },
                    {
                        ...data,
                        updated: new Date().toLocaleString('en-US', {
                            timeZone: 'Asia/Manila'
                        })
                    }
                )

                res.status(200).send('request success.')
            } catch (error) {
                return res.status(400).send('request failed.')
            }

            break

        case 'DELETE':
            try {
                const { id } = req.body
                await Deductions.findByIdAndDelete({ _id: id })
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
