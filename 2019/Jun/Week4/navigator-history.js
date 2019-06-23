/**
 * 导航历史，实现类似浏览器的前进后退
 */
class NavigatorHistory {
  constructor() {
    this.steps = [];
    this.currentStepIndex = -1;
  }

  /**
   * 导航到某地址
   *
   * @param {any} url
   * @memberof NavigatorHistory
   */
  navigate(url) {
    this.currentStepIndex += 1;
    this.steps[this.currentStepIndex] = url;
  }

  /**
   * 后退
   *
   * @returns {any} url
   * @memberof NavigatorHistory
   */
  back() {
    const result = this.steps[this.currentStepIndex - 1];

    if(this.currentStepIndex > 0) {
      this.currentStepIndex -= 1;
    }

    return result;
  }

  /**
   * 判断是否可以后退
   *
   * @returns {boolean}
   * @memberof NavigatorHistory
   */
  isBackAvailable() {
    return this.currentStepIndex > 0;
  }

  /**
   * 前进
   *
   * @returns {any} url
   * @memberof NavigatorHistory
   */
  forward() {
    const result = this.steps[this.currentStepIndex + 1];

    if(this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex += 1;
    }

    return result;
  }

  /**
   * 判断是否可以前进
   *
   * @returns {boolean}
   * @memberof NavigatorHistory
   */
  isForwardAvailable() {
    return this.currentStepIndex < this.steps.length - 1;
  }

  /**
   * 当前
   *
   * @returns {any} url
   * @memberof NavigatorHistory
   */
  current() {
    return this.steps[this.currentStepIndex];
  }
}

module.exports = NavigatorHistory;
