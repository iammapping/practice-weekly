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

  static levenshtein (a, b) {

    const matrix = [];

    let i;
    for(i = 0; i <= b.length; i++){
      matrix[i] = [i];
    }

    let j;
    for(j = 0; j <= a.length; j++){
      matrix[0][j] = j;
    }

    for(i = 1; i <= b.length; i++){
      for(j = 1; j <= a.length; j++){
        if(b.charAt(i-1) === a.charAt(j-1)){
          matrix[i][j] = matrix[i-1][j-1];
        } else {
          matrix[i][j] = Math.min(matrix[i-1][j-1] + 1,
            Math.min(matrix[i][j-1] + 1,
              matrix[i-1][j] + 1));
        }
      }
    }

    // console.log(matrix)
    return matrix[b.length][a.length];

  }
;
  /**
   * 根据输入的邮箱，建议可能正确的邮箱
   * @param {string} email
   *
   * @returns {array} 所有建议的邮箱
   */
  suggest(email) {
    const preffix = email.split('@')[0];
    const emailType = email.split('@')[1];
    // const suggestedEmails = [];
    const maxStep = 3;

    const emailsMap = new Map();
    this.suggestedSuffixes.forEach(suggestItem => {
      const index = EmailSuggestion.levenshtein(suggestItem, emailType);
      if (index < maxStep) {
        emailsMap.set(index,`${preffix}@${suggestItem}`);
      }
    });


    // const arrayObj=Array.from(map);
    // const arrayObj = [...map]
    // arrayObj.sort(function(a,b){return a[0]-b[0]});

    const suggestedEmails = new Map([...emailsMap.entries()].sort());

    return [ ...suggestedEmails.values() ];

    return distance
        .sort((a, b) => a.weight- b.weight)
        .filter(value => value.weight <= this.maxDistance)
        .map(value => `${name}@${value.key}`);
  }
};
