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

    this.sortData = [];

    this.options.initValues.forEach(v => {
      this.queue(v);
    });
  }

  /**
   * 获取队列长度
   * @readonly
   */
  get length() {
    return this.sortData.length;
  }

  /**
   * 入队
   * @param {any} value
   */
  queue(value) {
    let fromIndex = 0;

    for (let i = 0; i < this.sortData.length; i++) {
      if (this.options.comparator(value, this.sortData[i]) > 0) {
        fromIndex = i + 1;
      }
    }

    this.sortData.splice(fromIndex, 0, value);
  }

  /**
   * 返回最优先的值，并出队
   * @return {any}
   */
  dequeue() {
    return this.sortData.pop();
  }

  /**
   * 获取队列最优先的值
   */
  peek() {
    if (this.sortData.length === 0) return null;

    return this.sortData[this.length - 1];
  }

  /**
   * 清空队列
   */
  clear() {
    this.sortData = [];
  }
};
