export const numberWithTwoDecimals = (price: number): string => price.toFixed(2)

export const formatPriceWithTwoDecimals = (price: number): string =>
  numberWithTwoDecimals(Math.floor(price * 100) / 100)

export const priceFromCentsToEuros = (price: number): string =>
  formatPriceWithTwoDecimals(price / 100)

export const priceFromEurosToCents = (price: number): number => Math.floor(price * 100)
