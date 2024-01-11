export const getRandomValueWithinRange = (min: number, max: number) => {
    if (min > max) {
        throw Error('Incorrect range given: max value should be equal to or greater than min value')
    }

    return Math.round(Math.random() * (max - min)) + min;
}