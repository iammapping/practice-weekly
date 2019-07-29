class Levenshtein {

  static init(rows, cols){
    const distance = new Array(rows);
    for(let i = 0; i < rows; i++){
      distance[i] = new Array(cols);
    }

    let l = Math.max(rows, cols);
    while(l--){
      rows - 1 >= l && (distance[l][0] = l);
      cols - 1 >= l && (distance[0][l] = l);
    }
    return distance;
  }

  static getDistance(str1, str2){
    let i = 0;
    let j = 0;
    let temp = 0;
    const distance = this.init(str1.length+1, str2.length+1);
    while(i++ < str1.length){
      j = 0;
      while(j++ < str2.length){
        temp = str1.charAt(i-1) === str2.charAt(j-1) ? 0 : 1;
        distance[i][j] = Math.min(
          distance[i-1][j] + 1,
          distance[i][j-1] + 1,
          distance[i-1][j-1] + temp);
      }
    }
    return distance[i-1][j-1];
  }
}

/**
 * 邮箱正确后缀建议
 */
module.exports = class EmailSuggestion {
  constructor(suggestedSuffixes = []) {
    this.suggestedSuffixes = suggestedSuffixes;
    this.maxDistance = 5;
  }

  /**
   * 根据输入的邮箱，建议可能正确的邮箱
   * @param {string} email
   *
   * @returns {array} 所有建议的邮箱
   */
  suggest(email) {
    const [name, suffix] = email.split('@');
    const distance = this.suggestedSuffixes.map(value => ({
      'key': value,
      'weight': Levenshtein.getDistance(value, suffix)
    }));

    return distance
      .sort((a, b) => a.weight- b.weight)
      .filter(value => value.weight <= this.maxDistance)
      .map(value => `${name}@${value.key}`);
  }
}
