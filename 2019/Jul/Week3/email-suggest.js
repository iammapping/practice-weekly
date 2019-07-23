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

/**
 * 邮箱正确后缀建议
 */
module.exports = class EmailSuggestion {
  constructor(suggestedSuffixes = []) {
    this.suggestedSuffixes = suggestedSuffixes;
  }

  /**
   * 根据输入的邮箱，建议可能正确的邮箱
   * @param {string} email
   *
   * @returns {array} 所有建议的邮箱
   */
  suggest(email) {
    const suff = email.split('@')[1];

    const degrees = this.suggestedSuffixes.map(sugSuf => {
      const table = initTable(sugSuf, suff);
      for (let i = 1; i < table.length; i++) {
        for (let j = 1; j < table[i].length; j++) {
          table[i][j] = Math.min(table[i - 1][j] + 1, table[i][j - 1] + 1, table[i - 1][j - 1] + (sugSuf[i - 1] === suff[j - 1] ? 0 : 1));
        }
      }

      const matchDegree = 1 - table[sugSuf.length][suff.length] / Math.max(sugSuf.length, suff.length);
      return {'degree' : matchDegree, 'sugSuf' : matchDegree === 0 ? undefined : sugSuf};
    });

    const orderDegrees = degrees.sort((degree1, degree2) => degree2.degree > degree1.degree);
    return orderDegrees.map(orderDegree => `${email.split('@')[0]}@${orderDegree.sugSuf}`);
  }
}
