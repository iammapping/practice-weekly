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
    const self = this;
    let queueIndex = 0;

    for(let i = 0; i < this.queueArr.length; i += 1) {
      const queueValue = this.queueArr[i];
      if(self.options.comparator(queueValue, value) <= 0) {
        queueIndex = i + 1;
      } else {
        break;
      }
    }

    self.queueArr.splice(queueIndex, 0, value);
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
