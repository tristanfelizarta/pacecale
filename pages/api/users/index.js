import connect from 'database/connect'
import Users from 'database/schemas/users'

export default async (req, res) => {
    const { method } = req
    await connect()

    switch (method) {
        case 'GET':
            try {
                const data = await Users.find({}).sort({ createdAt: -1 })
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

                await Users.findByIdAndUpdate(
                    {
                        _id: id
                    },
                    {
                        name: data.name,
                        password: data.password,
                        position: {
                            title: data.position.split('-')[0].trim(),
                            rate: Number(data.position.split('-')[1].trim())
                        },
                        schedule: {
                            timein: data.schedule.split('-')[0].trim(),
                            timeout: data.schedule.split('-')[1].trim()
                        },
                        hired_date: data.hired_date,
                        contract_end_date: data.contract_end_date,
                        role: data.role,
                        status: data.status,
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
