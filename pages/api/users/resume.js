import connect from 'database/connect'
import Users from 'database/schemas/users'

export default async (req, res) => {
    await connect()

    try {
        const { id, data } = req.body

        await Users.findByIdAndUpdate(
            { _id: id },
            {
                resume: data.resume,
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
