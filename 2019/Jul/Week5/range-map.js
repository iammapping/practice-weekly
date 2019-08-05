const createSearcher = require('./SearchFactory.js');
/**
 * 实现一个区间 Map
 */
module.exports = class RangeMap {

  constructor(){
    this.searcher = createSearcher();
  }

  /**
   * 添加区间与值的映射
   * @param {array<number>} range 整型范围区间 [start, end]
   * @param {any} value
   */
  add(range, value) {
    this.searcher.add(range, value);
    // this.searcher.display();
  }

  /**
   * 查找命中的区间
   * @param {number} search
   * @returns {array<number>}
   */
  findRange(search) {
    return this.searcher.search(search).interval;
  }

  /**
   * 查找命中区间对应的值
   * @param {number} search
   * @returns {any}
   */
  findValue(search) {
    return this.searcher.search(search).value;
  }

  /**
   * 清空 Map
   */
  clear() {
    this.searcher.clear();
  }
};
