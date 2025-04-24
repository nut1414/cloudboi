export const CURRENCY = {
  CODE: 'CBC',
  SYMBOL: 'CBC',
  NAME: 'CloudBoi Digital Currency',
  FORMAT: (amount: number): string => `${Number.isInteger(amount) ? amount.toString() : amount.toFixed(2)} ${CURRENCY.SYMBOL}`,
  FORMAT_HOURLY: (amount: number): string => `${amount.toFixed(4)} ${CURRENCY.SYMBOL}/hour`
}