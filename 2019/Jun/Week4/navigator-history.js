/**
 * 导航历史，实现类似浏览器的前进后退
 */
class NavigatorHistory {

  constructor() {
    this.urlData = []
    this.currentIndex = -1
  }

  /**
   * 导航到某地址
   *
   * @param {any} url
   * @memberof NavigatorHistory
   */
  navigate(url) {
    const currentIndex = this.currentIndex + 1
    const howmany = this.urlData.length - this.currentIndex // 需删除的数量

    try {
      this.urlData.splice(currentIndex, howmany, url)
    } catch (error) {
      console.error('navigate error', error)
      throw error
    }

    this.currentIndex = currentIndex
  }

  /**
   * 后退
   *
   * @returns {any} url
   * @memberof NavigatorHistory
   */
  back() {
    if (this.isBackAvailable()) {
      return this.urlData[--this.currentIndex]
    }

    return undefined
  }

  /**
   * 判断是否可以后退
   *
   * @returns {boolean}
   * @memberof NavigatorHistory
   */
  isBackAvailable() {
    return this.currentIndex > 0
  }

  /**
   * 前进
   *
   * @returns {any} url
   * @memberof NavigatorHistory
   */
  forward() {
    if (this.isForwardAvailable()) {
      return this.urlData[++this.currentIndex]
    }

    return undefined
  }

  /**
   * 判断是否可以前进
   *
   * @returns {boolean}
   * @memberof NavigatorHistory
   */
  isForwardAvailable() {
    return this.urlData.length > this.currentIndex + 1
  }

  /**
   * 当前
   *
   * @returns {any} url
   * @memberof NavigatorHistory
   */
  current() {
    if (this.urlData.length > 0) {
      return this.urlData[this.currentIndex]
    }

    return undefined
  }
}

module.exports = NavigatorHistory;
