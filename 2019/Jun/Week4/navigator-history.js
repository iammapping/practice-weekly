/**
 * 导航历史，实现类似浏览器的前进后退
 */
class NavigatorHistory {
  constructor() {
    this.history = [];
    this.position = -1;
  }

  /**
   * 导航到某地址
   *
   * @param {any} url
   * @memberOf NavigatorHistory
   */
  navigate(url) {
    this.position += 1;
    this.history[this.position] = url;

    if (this.isForwardAvailable()) {
      this.history.splice(this.position);
    }
  }

  /**
   * 后退
   *
   * @returns {any} url
   * @memberof NavigatorHistory
   */
  back() {
    if (!this.isBackAvailable()) {
      return undefined;
    }

    return this.history[--this.position];
  }

  /**
   * 判断是否可以后退
   *
   * @returns {boolean}
   * @memberof NavigatorHistory
   */
  isBackAvailable() {
    return this.position > 0;
  }

  /**
   * 前进
   *
   * @returns {any} url
   * @memberOf NavigatorHistory
   */
  forward() {
    if (!this.isForwardAvailable()) {
      return undefined;
    }

    return this.history[++this.position];
  }

  /**
   * 判断是否可以前进
   *
   * @returns {boolean}
   * @memberof NavigatorHistory
   */
  isForwardAvailable() {
    return this.position < this.history.length - 1;
  }

  /**
   * 当前
   *
   * @returns {any} url
   * @memberof NavigatorHistory
   */
  current() {
    return this.history[this.position];
  }
}

module.exports = NavigatorHistory;
