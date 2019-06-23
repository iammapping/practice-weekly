/**
 * 导航历史，实现类似浏览器的前进后退
 */
class NavigatorHistory {
  constructor() {
    this.index = -1;
    this.histories = [];
  }

  /**
   * 导航到某地址
   *
   * @param {any} url
   * @memberof NavigatorHistory
   */
  navigate(url) {
    this.index += 1;
    this.histories[this.index] = url;
  }

  /**
   * 后退
   *
   * @returns {any} url
   * @memberof NavigatorHistory
   */
  back() {
    if (!this.isBackAvailable()) return undefined;

    this.index -= 1;
    return this.histories[this.index];
  }

  /**
   * 判断是否可以后退
   *
   * @returns {boolean}
   * @memberof NavigatorHistory
   */
  isBackAvailable() {
    return this.histories[this.index - 1] !== undefined;
  }

  /**
   * 前进
   *
   * @returns {any} url
   * @memberof NavigatorHistory
   */
  forward() {
    if (!this.isForwardAvailable()) return undefined;

    this.index += 1;
    return this.histories[this.index];
  }

  /**
   * 判断是否可以前进
   *
   * @returns {boolean}
   * @memberof NavigatorHistory
   */
  isForwardAvailable() {
    return this.histories[this.index + 1] !== undefined;
  }

  /**
   * 当前
   *
   * @returns {any} url
   * @memberof NavigatorHistory
   */
  current() {
    return this.histories[this.index];
  }
}

module.exports = NavigatorHistory;
