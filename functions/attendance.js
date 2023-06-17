export const timeinChecker = (schedule, timeIn) => {
    const scheduleTime = new Date('1970-01-01 ' + schedule)
    const timeInTime = new Date('1970-01-01 ' + timeIn)
    const diffTime = timeInTime - scheduleTime
    const diffMinutes = Math.round(diffTime / 1000 / 60)
    const limits = 5

    if (diffMinutes <= 0 && diffMinutes >= -limits) {
        return { label: 'Ontime' }
    } else if (diffMinutes < 0) {
        const hoursUndertime = Math.floor((-diffMinutes - limits) / 60)
        const minutesUndertime = (-diffMinutes - limits) % 60
        return {
            label: 'Undertime',
            hours: hoursUndertime,
            minutes: minutesUndertime
        }
    } else {
        if (diffMinutes > limits) {
            const hoursLate = Math.floor((diffMinutes - limits) / 60)
            const minutesLate = (diffMinutes - limits) % 60
            return { label: 'Late', hours: hoursLate, minutes: minutesLate }
        } else {
            return { label: 'Ontime' }
        }
    }
}

export const timeoutChecker = (schedule, timeIn) => {
    const scheduleTime = new Date('1970-01-01 ' + schedule)
    const timeInTime = new Date('1970-01-01 ' + timeIn)
    const diffTime = timeInTime - scheduleTime
    const diffMinutes = Math.round(diffTime / 1000 / 60)
    const limits = 5

    if (diffMinutes <= 0 && diffMinutes >= -limits) {
        return { label: 'Ontime' }
    } else if (diffMinutes < 0) {
        const hoursUndertime = Math.floor((-diffMinutes - limits) / 60)
        const minutesUndertime = (-diffMinutes - limits) % 60
        return {
            label: 'Undertime',
            hours: hoursUndertime,
            minutes: minutesUndertime
        }
    } else {
        if (diffMinutes > limits) {
            const hoursOvertime = Math.floor((diffMinutes - limits) / 60)
            const minutesOvertime = (diffMinutes - limits) % 60
            return {
                label: 'Overtime',
                hours: hoursOvertime,
                minutes: minutesOvertime
            }
        } else {
            return { label: 'Ontime' }
        }
    }
}
