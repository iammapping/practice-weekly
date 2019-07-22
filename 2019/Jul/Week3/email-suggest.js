/**
 * 邮箱正确后缀建议
 */

function getDistance(xAxisStr, yAxisStr) {
  const xAxisLength = xAxisStr.length;
  const yAxisLength = yAxisStr.length;
  const distanceArr = [];

  for(let i = 1; i <= xAxisLength; i += 1) {
    const yAxisDistance = [];
    const currentXalisValue = xAxisStr[i - 1];

    for(let j = 1; j <= yAxisLength; j += 1) {
      const currentYalisValue = yAxisStr[j - 1];
      const topValue = typeof yAxisDistance[j - 2] !== 'undefined' ? yAxisDistance[j - 2] : i;
      const leftValue = distanceArr[i - 2] ? distanceArr[i - 2][j - 1] : j;
      let topLeftValue = j - 1;
      if(distanceArr[i - 2]) {
        topLeftValue = typeof distanceArr[i - 2][j - 2] !== 'undefined' ? distanceArr[i - 2][j - 2] : i - 1;
      }

      yAxisDistance.push(Math.min(topValue + 1, leftValue + 1, currentXalisValue === currentYalisValue ? topLeftValue : topLeftValue + 1));
    }

    distanceArr.push(yAxisDistance);
  }

  const maxLen = Math.max(xAxisLength, yAxisLength);
  let distance = 0;
  distanceArr.forEach(item => {
    distance += Math.min(...item);
  });

  if(1 - distance / maxLen > 0 ) {
    return distance;
  }

  return false;
}

module.exports = class EmailSuggestion {
  constructor(suggestedSuffixes = []) {
    this.suggestedSuffixes = suggestedSuffixes;
    this.resultObj = {};
  }

  /**
   * 根据输入的邮箱，建议可能正确的邮箱
   * @param {string} email
   *
   * @returns {array} 所有建议的邮箱
   */
  suggest(email) {
    const emailArr = email.split('@');
    const emailSuffix = emailArr[1];
    const emailPrefix = emailArr[0];

    this.suggestedSuffixes.forEach(item => {
      const distance = getDistance(emailSuffix, item);
      if(distance !== false) {
        if(Array.isArray(this.resultObj[distance])) {
          this.resultObj[distance].push(`${emailPrefix}@${item}`);
        } else {
          this.resultObj[distance] = [`${emailPrefix}@${item}`];
        }
      }
    });

    let result = [];
    Object.keys(this.resultObj).forEach(key => {
      result = result.concat(this.resultObj[key]);
    });

    return result;
  }
}
