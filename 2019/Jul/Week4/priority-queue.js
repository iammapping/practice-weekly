class Heap {
  constructor(comparator, initList=[]) {
    this.comparator = comparator;
    this.size = 0;
    this.elements = [NaN];

    initList.forEach(element => {
      this.insert(element);
    });
  }

  getSize() {
    return this.size;
  }

  getMin() {
    return this.elements[1];
  }

  getLast() {
    return this.elements[this.getSize()];
  }

  getParent(i) {
    return this.elements[Math.floor(i - 1 / 2)];
  }

  insert(element) {
    this.size++;
    let i = this.getSize();

    while (this.comparator(this.getParent(i), element) <= 0) {
      this.elements[i] = this.getParent(i);

      i = Math.floor(i - 1 / 2);
    }

    this.elements[i] = element;
  }

  deleteMin() {
    const minElement = this.getMin();
    const lastElement = this.getLast();

    let childIndex = 0;
    let i = 1;

    this.size--;
    while (this.getSize() > childIndex) {
      childIndex = i * 2;

      if (childIndex !== this.getSize() &&
        this.comparator(this.elements[childIndex + 1], this.elements[childIndex]) <= 0
      ) {
        childIndex++;
      }

      if (this.comparator(lastElement, this.elements[childIndex]) <= 0) {
        this.elements[i] = this.elements[childIndex];
      } else {
        break;
      }

      i = childIndex;
    }

    this.elements[i] = lastElement;

    return minElement;
  }

}

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

    this.heap = new Heap(this.options.comparator, this.options.initValues);
  }

  /**
   * 获取队列长度
   * @readonly
   */
  get length() {
    return this.heap.getSize();
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
    return this.heap.deleteMin();
  }

  /**
   * 获取队列最优先的值
   */
  peek() {
    return this.heap.getMin();
  }

  /**
   * 清空队列
   */
  clear() {
    this.heap = new Heap(this.options.comparator, this.options.initValues);
  }
};
