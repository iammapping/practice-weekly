function getStrDistance(s1, s2){
  const len1 = s1.length;
  const len2 = s2.length;

  const matrix = [];
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [];
    for (let j = 0; j <= len2; j++) {
      if (i === 0) {
        matrix[i][j] = j;
      } else if (j === 0) {
        matrix[i][j] = i;
      } else {
        let cost = 0;
        if (s1[i - 1] !== s2[j - 1]) {
          cost = 1;
        }
        matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost)
      }
    }
  }
  return matrix[len1][len2];
}

function getEmailUser(email) {
  const idx = (email || '').lastIndexOf('@');
  let user = email;
  if(idx > -1) {
    user = email.substr(0, idx);
  }
  return user;
}

function getEmailServer(email) {
  const idx = (email || '').lastIndexOf('@');
  let server = email;
  if(idx > -1) {
    server = email.substr(idx + 1);
  }
  return server;
}

/**
 * 邮箱正确后缀建议
 */
module.exports = class EmailSuggestion {
  constructor(suggestedSuffixes = []) {
    this.suggestedSuffixes = suggestedSuffixes;
    this.thresholdValue = 4;
  }

  getSuggestList(email) {
    const emailUser = getEmailUser(email);
    const inputServer = getEmailServer(email);
    let suggestList = [];
    this.suggestedSuffixes.map(emailServer => {
      const score = getStrDistance(inputServer, emailServer);
      if(score <= this.thresholdValue) {
        suggestList.push({
          email: `${emailUser}@${emailServer}`,
          score,
        });
      }
      return true;
    });

    suggestList = suggestList.sort((e1, e2) => e1.score - e2.score );

    return suggestList;
  }

  /**
   * 根据输入的邮箱，建议可能正确的邮箱
   * @param {string} email
   *
   * @returns {array} 所有建议的邮箱
   */
  suggest(email) {
    return this.getSuggestList(email).map(e => e.email);
  }
}
