const Heap = require('./heap');
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
    this.heap = new Heap(this.options.initValues, this.options.comparator);
  }

  /**
   * 获取队列长度
   * @readonly
   */
  get length() {
    return this.heap.length;
  }

  /**
   * 入队
   * @param {any} value
   */
  queue(value) {
    this.heap.insert(value);
  }

  /**
   * 返回最优先的值，并出队
   * @return {any}
   */
  dequeue() {
    return this.heap.removeRoot();
  }

  /**
   * 获取队列最优先的值
   */
  peek() {
    return this.heap.max;
  }

  /**
   * 清空队列
   */
  clear() {
    this.heap = new Heap([], this.options.comparator);
  }
};
