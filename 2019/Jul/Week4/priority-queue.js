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
  }

  /**
   * 获取队列长度
   * @readonly
   */
  get length() {

  }

  /**
   * 入队
   * @param {any} value
   */
  queue(value) {

  }

  /**
   * 返回最优先的值，并出队
   * @return {any}
   */
  dequeue() {
;
  }

  /**
   * 获取队列最优先的值
   */
  peek() {

  }

  /**
   * 清空队列
   */
  clear() {

  }
};
