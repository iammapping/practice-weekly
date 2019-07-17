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

  }
}
