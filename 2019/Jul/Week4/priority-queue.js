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

    this.queueArray = this.options.initValues.sort(this.options.comparator);
  }

  /**
   * 获取队列长度
   * @readonly
   */
  get length() {
    return this.queueArray.length;
  }

  /**
   * 入队
   * @param {any} value
   */
  queue(value) {
    if (this.queueArray.length !== 0) {
      let index = 0;
      for (let i = 0; i < this.queueArray.length; i++) {
        const comparator = this.options.comparator(this.queueArray[i],value);
        if (comparator < 0) {
          index = i+1;
        }
      }
      this.queueArray.splice(index, 0, value);
    } else {
      this.queueArray.push(value);
    }
  }

  /**
   * 返回最优先的值，并出队
   * @return {any}
   */
  dequeue() {
    return this.queueArray.pop();
  }

  /**
   * 获取队列最优先的值
   */
  peek() {
    const queue = this.queueArray;
    return queue[queue.length-1];
  }

  /**
   * 清空队列
   */
  clear() {
    this.queueArray.length = 0;
  }
};
