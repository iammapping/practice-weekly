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

    this.priorityQueue = [null];
    
    this.options.initValues.forEach(value => {
      this.queue(value);
    });
  }

  /**
   * 获取队列长度
   * @readonly
   */
  get length() {
    return this.priorityQueue.length - 1;
  }

  /**
   * 入队
   * @param {any} value
   */
  queue(value) {
    this.priorityQueue.push(value);
    
    let i = this.priorityQueue.length - 1;
    while(i > 1) {
      const parentIndex = parseInt(i / 2, 10);
      if (this.options.comparator(this.priorityQueue[i], this.priorityQueue[parentIndex]) > 0) {
        this.exchange(parentIndex, i);
        i = parentIndex;
      } else {
        break;
      }
    }
  }

  /**
   * 返回最优先的值，并出队
   * @return {any}
   */
  dequeue() {
    this.exchange(1, this.priorityQueue.length - 1);
    const r = this.priorityQueue.pop();
    
    let i = 1;
    while(2 * i + 1 < this.priorityQueue.length) {
      const largerIndex = this.options.comparator(this.priorityQueue[2 * i], this.priorityQueue[2 * i + 1]) > 0 ? (2 * i) : (2 * i + 1);
      if (this.options.comparator(this.priorityQueue[largerIndex], this.priorityQueue[i]) > 0) {
        this.exchange(i, largerIndex);
        i = largerIndex;
      } else {
        break;
      }
    }

    return r;
  }

  /**
   * 获取队列最优先的值
   */
  peek() {
    return this.priorityQueue[1];
  }

  /**
   * 清空队列
   */
  clear() {
    this.priorityQueue = [null];
  }

  exchange(i, j) {
    const item = this.priorityQueue[i];
    this.priorityQueue[i] = this.priorityQueue[j];
    this.priorityQueue[j] = item;
  }
};
