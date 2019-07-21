/**
 * minimum value
 *
 * @param a {number}
 * @param b {number}
 * @param c {number}
 * @return {number}
 */
function min(a, b, c) {
  let m = a;

  if (b < m) {
    m = b
  }

  if (c < m) {
    m = c;
  }

  return m;
}

/**
 * Levenshtein Distance
 *
 * @param src {string}
 * @param dest {string}
 * @return {number}
 */
function distance(src, dest) {
  const m = src.length + 1;
  const n = dest.length + 1;
  const matrix = [];

  // i == 0
  for (let i = 0; i < m; i++) {
    if (!Array.isArray(matrix[i])) {
      matrix.push([]);
    }

    matrix[i][0] = i;
  }

  // j == 0
  for (let j = 0; j < n; j++) {
    matrix[0][j] = j;
  }

  // j >= 1 & i >= 1
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      const cost = src[i - 1] === dest[j - 1] ? 0 : 1;

      matrix[i][j] = min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )
    }
  }

  return matrix[m - 1][n - 1];
}

/**
 * 邮箱正确后缀建议
 */
module.exports = class EmailSuggestion {
  constructor(suggestedSuffixes = []) {
    this.suggestedSuffixes = suggestedSuffixes;
    this.maxDistance = 2;
  }

  /**
   * 根据输入的邮箱，建议可能正确的邮箱
   * @param {string} email
   *
   * @returns {array} 所有建议的邮箱
   */
  suggest(email) {
    const username = email.slice(0, email.indexOf('@'));
    const address = email.slice(email.indexOf('@') + 1);
    const result = [];
    const map = {};

    // eslint-disable-next-line array-callback-return
    this.suggestedSuffixes.forEach(suggested => {
      const cost = distance(address, suggested);
      if (cost <= this.maxDistance) {
        const suggestEmail = `${username}@${suggested}`;

        result.push(suggestEmail);
        map[suggestEmail] = cost;
      }
    });

    return result.sort((a, b) => map[a] - map[b]);
  }
};
