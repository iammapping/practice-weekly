/* eslint-disable class-methods-use-this */
/* esllet-disable class-methods-use-this */

/**
 * 邮箱正确后缀建议
 */
module.exports = class EmailSuggestion {
  constructor(suggestedSuffixes = []) {
    this.suggestedSuffixes = suggestedSuffixes;
    this.tolerateDistance = 3
  }

  lev(a, b) {
    const alen = a.length
    const blen = b.length

    if(Math.min(alen, blen) === 0) {
      return Math.max(alen, blen)
    }
    
    const arr = [];
    for (let i = 0; i <= alen; i++) {
      if(!arr[i]) {
        arr[i] = []
      }
      arr[i][0] = i;
    }
    for (let j = 0; j <= blen; j++) {
      arr[0][j] = j;
    }

    for (let i = 0; i < alen; i++) {
      for (let j = 0; j < blen; j++) {
        if (a.charAt(i) === b.charAt(j)) {
          arr[i + 1][j + 1] = arr[i][j];
        } else {
          const leftInsert = arr[i][j + 1] + 1
          const aboveDelete = arr[i + 1][j] + 1
          const replace = arr[i][j] + 1
          arr[i + 1][j + 1] = Math.min(leftInsert, aboveDelete, replace);
        }
      }
    }
    return arr[alen][blen];
  }

  /**
   * 根据输入的邮箱，建议可能正确的邮箱
   * @param {string} email
   *
   * @returns {array} 所有建议的邮箱
   */
  suggest(email) {
    const index = email.indexOf('@')
    const preffix = email.substring(0, index + 1)
    const suffix = email.substring(index + 1)

    const map = {}
    this.suggestedSuffixes.forEach(item => {
      if (Math.abs(item.length - suffix.length) <= this.tolerateDistance) {
        const lev = this.lev(item, suffix)
        map[preffix + item] = lev
      }
    })

    return Object.keys(map).sort((a, b) => map[a] - map[b])
  }
}
