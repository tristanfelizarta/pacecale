import connect from 'database/connect'
import Users from 'database/schemas/users'
import Positions from 'database/schemas/positions'
import Schedules from 'database/schemas/schedules'

export default async (req, res) => {
    await connect()

    try {
        const { id, data } = req.body

        const position = await Positions.findById({ _id: data.position })
        const schedule = await Schedules.findById({ _id: data.schedule })

        await Users.findByIdAndUpdate(
            { _id: id },
            {
                name: data.name,
                position: {
                    title: position.title,
                    rate: position.rate
                },
                schedule: {
                    timein: schedule.timein,
                    timeout: schedule.timeout
                },
                role: 'Employee',
                hired_date: data.hired_date,
                contract_end_date: data.contract_end_date,
                updated: new Date().toLocaleString('en-US', {
                    timeZone: 'Asia/Manila'
                })
            }
        )

        res.status(200).send('request success.')
    } catch (error) {
        return res.status(400).send('request failed.')
    }
}
