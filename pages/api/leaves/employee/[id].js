import connect from 'database/connect'
import Leaves from 'database/schemas/leaves'

export default async (req, res) => {
    const { id } = req.query
    await connect()

    try {
        const leaves = await Leaves.find({}).sort({ createdAt: -1 })
        const data = leaves.filter((leave) => leave.user.id === id)
        res.status(200).send(data)
    } catch (error) {
        return res.status(400).send('request failed.')
    }
}
