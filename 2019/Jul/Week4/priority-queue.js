/* eslint-disable class-methods-use-this */
/* esllet-disable no-nested-ternary */
/* esllet-disable no-fallthrough */

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
    this.sort();
  }

  /**
   * 获取队列长度
   * @readonly
   */
  get length() {
    return this.options.initValues.length
  }

  /**
   * 入队
   * @param {any} value
   */
  queue(value) {
    this.options.initValues.push(value)
    this.sort()
  }

  /**
   * 返回最优先的值，并出队
   * @return {any}
   */
  dequeue() {
    if (this.length === 0) {
      return undefined
    }
    return this.options.initValues.shift()
  }

  /**
   * 获取队列最优先的值
   */
  peek() {
    if (this.length === 0) {
      return undefined
    }
    return this.options.initValues[0]
  }

  /**
   * 清空队列
   */
  clear() {
    this.options.initValues = []
  }

  sort() {
    const len = this.length
    if (len === 0) return

    const c = this.options.comparator
    const start = this.countRunAndMakeAscending(this.options.initValues, 0, len, c)
    this.binarySort(this.options.initValues, 0, len, start, c)
  }

  countRunAndMakeAscending(a, lo, hi, comparator) {
    if (lo < hi) {
      let runHi = lo + 1;
      if (runHi === hi)
        return 1;

      if (comparator(a[lo], a[runHi++]) < 0) { // Descending
        while (runHi < hi && comparator(a[runHi - 1], a[runHi]) < 0)
          runHi++;
          this.reverseRange(a, lo, runHi);
      } else {                              // Ascending
        while (runHi < hi && comparator(a[runHi - 1], a[runHi]) >= 0)
          runHi++;
      }

      return runHi - lo;
    }

    return 0
  }

  reverseRange(a, lo, hi) {
    hi--;
    while (lo < hi) {
        const t = a[lo];
        a[lo++] = a[hi];
        a[hi--] = t;
    }
  }

  binarySort(a, lo, hi, start, comparator) {
    if (lo <= start && start <= hi) {
      if (start === lo)
      start++;
      for ( ; start < hi; start++) {
        const pivot = a[start];

        let left = lo;
        let right = start;
        if (left <= right) {
          while (left < right) {
            // eslint-disable-next-line no-bitwise
            const mid = (left + right) >>> 1;
            if (comparator(a[mid], pivot) < 0)
              right = mid;
            else
              left = mid + 1;
          }
          if (left === right) {
            a.splice(start, 1)
            a.splice(left, 0, pivot)
          }
        }
      }
    }
  }
};
