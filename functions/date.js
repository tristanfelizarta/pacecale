export const convert = (date) => {
    return `${parseInt(date.split('-')[1])}/${parseInt(
        date.split('-')[2]
    )}/${parseInt(date.split('-')[0])}`
}
