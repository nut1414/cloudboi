export const CURRENCY = {
  CODE: 'CBC',
  SYMBOL: 'CBC',
  NAME: 'CloudBoi Digital Currency',
  FORMAT: (amount: number): string => {
    const formatted = +amount === Math.floor(+amount) ? amount.toString() : `${+amount}`
    return `${formatted} ${CURRENCY.SYMBOL}`
  },
  FORMAT_HOURLY: (amount: number): string => `${amount.toFixed(4)} ${CURRENCY.SYMBOL}/hour`
}