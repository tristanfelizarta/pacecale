export const currency = (amount) => {
    return new Intl.NumberFormat('en-us', {
        currency: 'PHP',
        style: 'currency'
    }).format(amount)
}
