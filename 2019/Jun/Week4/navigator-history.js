/**
 * 导航历史，实现类似浏览器的前进后退
 */
class NavigatorHistory {
  constructor() {
    this.urls = [];
    this.currentIndex = -1;
  }

  /**
   * 导航到某地址
   *
   * @param {any} url
   * @memberof NavigatorHistory
   */
  navigate(url) {
    this.currentIndex += 1;
    this.urls[this.currentIndex] = url;
  }

  /**
   * 后退
   *
   * @returns {any} url
   * @memberof NavigatorHistory
   */
  back() {
    if(this.isBackAvailable()){
        this.currentIndex -= 1;
        return this.urls[this.currentIndex];
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
    return this.currentIndex>0;
  }

  /**
   * 前进
   *
   * @returns {any} url
   * @memberof NavigatorHistory
   */
  forward() {
      if(this.isForwardAvailable()){
        this.currentIndex += 1;
        return this.urls[this.currentIndex];
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
    return this.currentIndex<this.urls.length-1;
  }

  /**
   * 当前
   *
   * @returns {any} url
   * @memberof NavigatorHistory
   */
  current() {
    return this.urls[this.currentIndex];
  }
}

module.exports = NavigatorHistory;
