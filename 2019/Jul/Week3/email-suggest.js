function initTable(sugSuf, suff) {
  const table = [];
  for (let i = 0; i <= sugSuf.length; i++) {
    const row = [];
    for (let j = i; j <= suff.length + i; j++) {
      if (i === 0 || i === j) { 
        row.push(j);
      } else {
        row.push(0);
      }
    }
    table.push(row);
  }
  return table;
}

function getMatchDegree(str1, str2) {
  const table = initTable(str1, str2);
  for (let i = 1; i < table.length; i++) {
    for (let j = 1; j < table[i].length; j++) {
      table[i][j] = Math.min(table[i - 1][j] + 1, table[i][j - 1] + 1, table[i - 1][j - 1] + (str1[i - 1] === str2[j - 1] ? 0 : 1));
    }
  }
  return 1 - table[str1.length][str2.length] / Math.max(str1.length, str2.length);
}

/**
 * 邮箱正确后缀建议
 */
module.exports = class EmailSuggestion {
  constructor(suggestedSuffixes = []) {
    this.suggestedSuffixes = suggestedSuffixes;
    this.minMatchDegree = 0.5;
  }

  /**
   * 根据输入的邮箱，建议可能正确的邮箱
   * @param {string} email
   *
   * @returns {array} 所有建议的邮箱
   */
  suggest(email) {
    const [pre, suff] = email.split('@');

    const degrees = this.suggestedSuffixes.map(sugSuf => {
      const matchDegree = getMatchDegree(sugSuf, suff);
      return {'degree' : matchDegree, 'sugSuf' : matchDegree === 0 ? undefined : sugSuf};
    });

    const orderDegrees = degrees.filter(degree => degree.degree >= this.minMatchDegree).sort((degree1, degree2) => {
      if (degree2.degree > degree1.degree) {
        return 1;
      }  
      if (degree2.degree < degree1.degree) {
        return -1;
      }
      return 0;
    });

    return orderDegrees.map(orderDegree => `${pre}@${orderDegree.sugSuf}`);
  }
}
