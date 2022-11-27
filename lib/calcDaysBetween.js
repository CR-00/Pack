const calcDaysBetween = (dayOne, dayTwo) => {
    let dOne = new Date(dayOne);
    let dTWo = new Date(dayTwo);
    let diff = dOne.getTime() - dTWo.getTime();
    return Math.abs(Math.ceil(diff / (1000 * 3600 * 24)));
}

export default calcDaysBetween;