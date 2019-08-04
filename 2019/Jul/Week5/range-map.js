/**
 * 实现一个区间 Map
 */
module.exports = class RangeMap {
  /**
   * 添加区间与值的映射
   * @param {array<number>} range 整型范围区间 [start, end]
   * @param {any} value
   */

  constructor () {
    this.rangeData = [null];
  }

  resetRange(start, end, value) {
    for (let i = start; i <= end; i++) {
      this.rangeData[i] = value;
    }
  }

  add(range, value) {
    const rangeMin = range[0];
    const rangeMax = range[1];

    if (this.rangeData[rangeMin]) {
      const rangeItem = this.rangeData[rangeMin];

      if (rangeItem.ran[0] < rangeMin) {
        this.resetRange(rangeItem.ran[0], rangeMin - 1, {ran: [rangeItem.ran[0], rangeMin - 1], val: rangeItem.val});
      }
    }

    if (this.rangeData[rangeMax]) {
      const rangeItem = this.rangeData[rangeMax];
      if (rangeItem.ran[1] > rangeMax) {
        this.resetRange(rangeMax + 1, rangeItem.ran[1], {ran: [rangeMax + 1, rangeItem.ran[1]], val: rangeItem.val});
      }
    }

    for (let i = rangeMin; i <= rangeMax; i++) {
      this.rangeData[i] = {
        ran: range,
        val: value
      };
    } 
  }

  /**
   * 查找命中的区间
   * @param {number} search
   * @returns {array<number>}
   */
  findRange(search) {
    if (this.rangeData[search]) {
        return this.rangeData[search].ran;
    }

    return undefined;
  }

  /**
   * 查找命中区间对应的值
   * @param {number} search
   * @returns {any}
   */
  findValue(search) {
    if (this.rangeData[search]) {
        return this.rangeData[search].val;
    }

    return undefined;
  }

  /**
   * 清空 Map
   */
  clear() {
    this.rangeData = [null];
  }
};
