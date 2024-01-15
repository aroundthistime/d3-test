export const getRandomValueWithinRange = (min: number, max: number) => {
  if (min > max) {
    throw Error('Incorrect range given: max value should be equal to or greater than min value')
  }

  return Math.round(Math.random() * (max - min)) + min
}

export const ceilWithBiggestDigit = (num: number): number => {
  const biggestDigit = getBiggestDigit(num)
  return Math.floor(num / biggestDigit) * biggestDigit + biggestDigit
}

export const getBiggestDigit = (num: number): number => {
  return Math.pow(10, Math.floor(Math.log10(num)))
}
