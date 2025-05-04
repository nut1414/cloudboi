export const CURRENCY = {
  CODE: 'CBC',
  SYMBOL: 'CBC',
  NAME: 'CloudBoi Digital Currency',
  FORMAT: (amount: number): string => {
    // Round to handle floating point precision issues (like 689.1999999999999)
    const roundedAmount = parseFloat(amount.toFixed(6));
    // If it's an integer, return as a whole number
    // Otherwise return the floating point with no trailing zeros
    const formatted = roundedAmount === Math.floor(roundedAmount)
      ? Math.floor(roundedAmount).toString()
      : roundedAmount.toString();
    return `${formatted} ${CURRENCY.SYMBOL}`
  },
  FORMAT_HOURLY: (amount: number): string => `${amount.toFixed(4)} ${CURRENCY.SYMBOL}/hour`
}