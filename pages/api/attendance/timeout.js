import connect from 'database/connect'
import Users from 'database/schemas/users'
import Attendance from 'database/schemas/attendance'
import { timeoutChecker } from 'functions/attendance'

export default async (req, res) => {
    await connect()

    try {
        const { data } = req.body
        const user = await Users.findOne({ username: data.username })

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

        const totalTime = (startTime, endTime) => {
            let start = new Date('01/01/1999 ' + startTime)
            let end = new Date('01/01/1999 ' + endTime)
            let total = end - start

            let hours = Math.floor(total / (1000 * 60 * 60))
            let minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60))

            return { hours, minutes }
        }

        const amount = (attendance) => {
            let late = 0
            let overtime = 0
            let netpay = 0

            if (attendance.timein.status.label === 'Late') {
                late =
                    attendance.position.rate * attendance.timein.status.hours +
                    (attendance.position.rate / 60) *
                        attendance.timein.status.minutes
            }

            if (attendance.timeout.status.label === 'Overtime') {
                overtime =
                    attendance.position.rate * attendance.timeout.status.hours +
                    (attendance.position.rate / 60) *
                        attendance.timeout.status.minutes
            }

            netpay =
                attendance.position.rate *
                    totalTime(attendance.timein.time, time()).hours +
                (attendance.position.rate / 60) *
                    totalTime(attendance.timein.time, time()).minutes +
                overtime

            return { late, overtime, netpay }
        }

        if (user) {
            if (user.password === data.password) {
                const attendance = await Attendance.findOne({
                    user: user._id,
                    date: new Date()
                        .toLocaleString('en-US', { timeZone: 'Asia/Manila' })
                        .split(',')[0]
                        .trim()
                })

                if (attendance !== null) {
                    if (attendance.timeout.time === '') {
                        await Attendance.findByIdAndUpdate(
                            { _id: attendance._id },
                            {
                                timeout: {
                                    time: time(),
                                    status: timeoutChecker(
                                        user.schedule.timeout,
                                        time()
                                    )
                                },
                                duration: totalTime(
                                    attendance.timein.time,
                                    time()
                                ),
                                amount: amount(attendance),
                                updated: new Date().toLocaleString('en-US', {
                                    timeZone: 'Asia/Manila'
                                })
                            }
                        )
                    } else {
                        return res.status(401).send({
                            type: 'timeout',
                            message: 'You are already time out.'
                        })
                    }
                } else {
                    return res.status(401).send({
                        type: 'timeout',
                        message: 'You do not already time in.'
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
