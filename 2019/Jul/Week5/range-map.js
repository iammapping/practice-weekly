
/**
 * 实现一个区间 Map
 */

const index = 0;

module.exports = class RangeMap {
  /**
   * 添加区间与值的映射
   * @param {array<number>} range 整型范围区间 [start, end]
   * @param {any} value
   */

  constructor() {
    this.map = new Map();
    this.start = 0;
    this.end = 0;
  }

  add(range, value) {
    if (this.map.size > 0) {
      if (range[index] > this.end || range[range.length-1] < this.start) {
        this.map.set(range, value);
        this.start = range[index];
        this.end = range[range.length-1];
      } else {

        const it = this.map.keys();
        const {size} = this.map;

        for (let i = 0; i < size; i++) {
          const key = it.next().value;

          if (range[index] >= key[index] && range[range.length - 1] <= key[key.length - 1]) {

            this.map.set(range, value);
            if (range[index] === key[index]) {
              this.map.set([key[index], key[index]], this.map.get(key));
            } else {
              this.map.set([key[index], range[index] - 1], this.map.get(key));
            }
            if (range[range.length - 1] === key[key.length - 1]) {
              this.map.set([key[key.length - 1], key[key.length - 1]], this.map.get(key));
            } else {
              this.map.set([range[range.length - 1] + 1, key[key.length - 1]], this.map.get(key));
            }

            this.map.delete(key);

          } else {

            if (range[range.length - 1] >= key[index] && range[index] <= key[index] ) {
              this.map.set(range, value);
              this.map.set([range[range.length - 1] + 1, key[key.length - 1]], this.map.get(key));
              this.map.delete(key);
              this.start = range[index];

            }

            if (range[index] <= key[key.length - 1] && range[range.length-1] >= key[index]) {
              this.map.set(range, value);
              this.map.set([key[index], range[index] - 1], this.map.get(key));
              this.map.delete(key);
              this.end = range[range.length-1];
            }
          }

        }
      }
    } else {
      this.map.set(range, value);
      this.start = range[index];
      this.end = range[range.length - 1];
    }

  }



  /**
   * 查找命中的区间
   * @param {number} search
   * @returns {array<number>}
   */
  findRange(search) {
    const it = this.map.keys();

    for (let i = 0; i < this.map.size; i++) {
      const key = it.next().value;
      if (search >= key[index] && search <= key[key.length - 1]) {
        return key;
      }
    }
    return undefined;
  }

  /**
   * 查找命中区间对应的值
   * @param {number} search
   * @returns {any}
   */
  findValue(search) {
    const it = this.map.keys();

    for (let i = 0; i < this.map.size; i++) {
      const key = it.next().value;
      if (search >= key[index] && search <= key[key.length - 1]) {
        return this.map.get(key);
      }
    }

    return undefined;
  }

  /**
   * 清空 Map
   */
  clear() {
    this.map.clear();
  }
};

