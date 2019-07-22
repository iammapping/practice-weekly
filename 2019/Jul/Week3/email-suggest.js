/**
 * 邮箱正确后缀建议
 */
function getMin(m1, m2, m3) {
  const min = Math.min(m1, m2);
  return Math.min(min, m3);
}

function levenshtein(str1, str2) {
  const len1 = str1.length + 1;
  const len2 = str2.length + 1;

  if (len1 === 0 || len2 === 0) return 0;

  const matrix = [];

  for (let i = 0; i < len1; i++) {
    matrix[i] = [];
    matrix[i][0] = i;
  }

  for (let j = 0; j < len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i < len1; i++) {
    const c1 = str1[i - 1];

    for (let j = 1; j < len2; j++) {
      const c2 = str2[j - 1];
      const sub = c1 === c2 ? 0 : 1;

      const tv = matrix[i - 1][j] + 1;
      const lv = matrix[i][j - 1] + 1;
      const mv = matrix[i - 1][j - 1] + sub;

      matrix[i][j] = getMin(tv, lv, mv);
    }
  }

  return 1 - matrix[len1 - 1][len2 - 1] / Math.max(len1, len2);
}

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
    const result = [];
    const minLv = 0.5;
    const em = email.split('@');
    const name = em[0];
    const suffix = em[1];

    this.suggestedSuffixes.forEach(suggested => {
      const ls = levenshtein(suffix, suggested);

      if (ls > minLv) {
        result.push([name, "@", suggested].join(''));
      }
    });

    return result;
  }
}
