/**
 * 导航历史，实现类似浏览器的前进后退
 */
class NavigatorHistory {
  constructor() {
    this.currIndex = -1;
    this.histories = [];
  }

  /**
   * 导航到某地址
   *
   * @param {any} url
   * @memberof NavigatorHistory
   */
  navigate(url) {
    this.histories.splice(this.currIndex + 1);
    this.histories.push(url);
    this.currIndex++;
  }

  /**
   * 后退
   *
   * @returns {any} url
   * @memberof NavigatorHistory
   */
  back() {
    if (this.isBackAvailable()) {
      this.currIndex--;
      return this.current();
    }
    
    return undefined;
  }

  /**
   * 判断是否可以后退
   *
   * @returns {boolean}
   * @memberof NavigatorHistory
   */
  isBackAvailable() {
    return this.currIndex > 0;
  }

  /**
   * 前进
   *
   * @returns {any} url
   * @memberof NavigatorHistory
   */
  forward() {

    if (this.isForwardAvailable()) {
      this.currIndex++;
      return this.current();
    }

    return undefined;
  }

  /**
   * 判断是否可以前进
   *
   * @returns {boolean}
   * @memberof NavigatorHistory
   */
  isForwardAvailable() {
    return this.currIndex < this.histories.length - 1;
  }

  /**
   * 当前
   *
   * @returns {any} url
   * @memberof NavigatorHistory
   */
  current() {
    return this.histories[this.currIndex];
  }
}

module.exports = NavigatorHistory;
