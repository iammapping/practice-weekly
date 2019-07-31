/**
 * 实现一个优先级队列
 */
module.exports = class PriorityQueue {
  constructor(options) {
    this.options = Object.assign({
      // 队列的初始值
      initValues: [],
      // 队列元素的优先级比对方法
      comparator: (a, b) => b - a,
    }, options);

    this.queueArr = this.options.initValues.sort(this.options.comparator);
  }

  /**
   * 获取队列长度
   * @readonly
   */
  get length() {
    return this.queueArr.length;
  }

  /**
   * 入队
   * @param {any} value
   */
  queue(value) {
    let queueIndex = 0;
    let low = 0;
    let high = this.queueArr.length - 1;

    while (low <= high) {
      queueIndex = Math.floor((low + high) / 2);

      if (this.options.comparator(this.queueArr[queueIndex], value) <= 0) {
        low = queueIndex + 1;
      } else {
        high = queueIndex - 1;
      }

      if(high - low <= 1) {
        queueIndex = low + 1;
        break;
      }
    }

    this.queueArr.splice(queueIndex, 0, value);
  }

  /**
   * 返回最优先的值，并出队
   * @return {any}
   */
  dequeue() {
    return this.queueArr.pop();
  }

  /**
   * 获取队列最优先的值
   */
  peek() {
    return this.queueArr[this.queueArr.length - 1];
  }

  /**
   * 清空队列
   */
  clear() {
    this.queueArr = [];
  }
};
