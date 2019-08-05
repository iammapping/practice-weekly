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
    this.rangeData = [];
  }

  add(range, value) {
    const rangeMin = range[0];
    const rangeMax = range[1];

    for (let i = 0; i < this.rangeData.length; i++) {
      const rangeItem = this.rangeData[i];

      if (rangeItem.ran[1] < rangeMin) continue;

      if (rangeMin <= rangeItem.ran[0] && rangeMax >= rangeItem.ran[1]) {
        rangeItem.deleted = true;
        continue;
      }

      if (rangeMin <= rangeItem.ran[0] && rangeMax < rangeItem.ran[1]) {
        this.rangeData[i] = {ran: [rangeMax + 1, rangeItem.ran[1]], val: rangeItem.val};
        continue;
      }

      if (rangeMin > rangeItem.ran[0] && rangeMax > rangeItem.ran[1]) {
        this.rangeData[i] = {ran: [rangeItem.ran[0], rangeMin - 1], val: rangeItem.val};
        continue;
      }

      if (rangeMin > rangeItem.ran[0] && rangeMax < rangeItem.ran[1]) {
        this.rangeData[i] = {ran: [rangeItem.ran[0], rangeMin - 1], val: rangeItem.val};
        this.rangeData.push({ran: [rangeMax + 1, rangeItem.ran[1]], val: rangeItem.val});
        break;
      }
    }

    this.rangeData.push({ran: range, val: value});
    this.rangeData = this.rangeData.filter(rangeItem => !rangeItem.deleted);
}

  /**
   * 查找命中的区间
   * @param {number} search
   * @returns {array<number>}
   */
  findRange(search) {
    const ri = this.rangeData.find(rangeItem => search >= rangeItem.ran[0] && search <= rangeItem.ran[1]);

    if (ri) return ri.ran;

    return undefined;
  }

  /**
   * 查找命中区间对应的值
   * @param {number} search
   * @returns {any}
   */
  findValue(search) {
    const ri = this.rangeData.find(rangeItem => search >= rangeItem.ran[0] && search <= rangeItem.ran[1]);
    
    if (ri) return ri.val;

    return undefined;
  }

  /**
   * 清空 Map
   */
  clear() {
    this.rangeData = [];
  }
};
