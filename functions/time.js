export const h12 = (time) => {
    let hours = parseInt(time.substr(0, 2))
    let minutes = time.substr(3, 2)
    let ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12

    if (hours < 10) {
        hours = '0' + hours
    }

    return hours + ':' + minutes + ' ' + ampm
}

export const h24 = (time) => {
    let timeArr = time.split(' ')
    let hour = parseInt(timeArr[0].split(':')[0])
    let minutes = timeArr[0].split(':')[1]
    let ampm = timeArr[1].trim()

    if (ampm == 'PM') {
        hour += 12
    }

    if (hour < 10) {
        hour = '0' + hour
    }

    return hour + ':' + minutes
}
