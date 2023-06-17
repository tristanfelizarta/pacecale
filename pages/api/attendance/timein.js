import connect from 'database/connect'
import Users from 'database/schemas/users'
import Attendance from 'database/schemas/attendance'
import Payrolls from 'database/schemas/payrolls'
import { timeinChecker } from 'functions/attendance'

export default async (req, res) => {
    await connect()

    try {
        const { data } = req.body
        const users = await Users.find({})
        const user = await Users.findOne({ username: data.username })
        const payrolls = await Payrolls.find({})
        const attendance = await Attendance.find({})

        const time = () => {
            let today = new Date()
                .toLocaleString('en-US', { timeZone: 'Asia/Manila' })
                .split(',')[1]
                .trim()

            if (Number(today.split(' ')[0].split(':')[0]) < 9) {
                return `0${today.split(' ')[0].split(':')[0]}:${
                    today.split(' ')[0].split(':')[1]
                } ${today.includes('AM') ? 'AM' : 'PM'}`
            } else {
                return `${today.split(' ')[0].split(':')[0]}:${
                    today.split(' ')[0].split(':')[1]
                } ${today.includes('AM') ? 'AM' : 'PM'}`
            }
        }

        const create = async () => {
            await Attendance.create({
                user: user._id,
                position: {
                    title: user.position.title,
                    rate: user.position.rate
                },
                schedule: user.schedule,
                timein: {
                    time: time(),
                    status: timeinChecker(user.schedule.timein, time())
                },
                extra: {
                    employees: users.filter((user) => user.role === 'Employee')
                        .length
                },
                date: new Date()
                    .toLocaleString('en-US', { timeZone: 'Asia/Manila' })
                    .split(',')[0]
                    .trim(),
                created: new Date().toLocaleString('en-US', {
                    timeZone: 'Asia/Manila'
                }),
                updated: new Date().toLocaleString('en-US', {
                    timeZone: 'Asia/Manila'
                })
            })
        }

        if (user) {
            if (user.password === data.password) {
                if (
                    attendance.filter((a) => a.user === user._id.toString())
                        .length === 0
                ) {
                    create()
                } else {
                    if (
                        attendance.filter(
                            (a) =>
                                a.user === user._id.toString() &&
                                a.date ===
                                    new Date()
                                        .toLocaleString('en-US', {
                                            timeZone: 'Asia/Manila'
                                        })
                                        .split(',')[0]
                                        .trim()
                        ).length === 0
                    ) {
                        create()
                    } else {
                        return res.status(401).send({
                            type: 'timein',
                            message: 'You are already time in.'
                        })
                    }
                }

                const payroll = payrolls.filter(
                    (payroll) =>
                        payroll.user === user._id.toString() && !payroll.status
                ).length

                if (payroll === 0) {
                    await Payrolls.create({
                        user: user._id,
                        position: user.position,
                        schedule: user.schedule,
                        created: new Date().toLocaleString('en-US', {
                            timeZone: 'Asia/Manila'
                        }),
                        updated: new Date().toLocaleString('en-US', {
                            timeZone: 'Asia/Manila'
                        })
                    })
                }
            } else {
                return res.status(401).send({
                    type: 'password',
                    message: 'The password is incorrect.'
                })
            }
        } else {
            return res.status(401).send({
                type: 'username',
                message: 'The username does not exist.'
            })
        }

        res.status(200).send('request success.')
    } catch (error) {
        return res.status(400).send('request failed.')
    }
}
