function isValueInRange(range, value) {
  return value >= range[0] && value <= range[1];
}

/**
 * 实现一个区间 Map
 */
module.exports = class RangeMap {
  constructor() {
    this.rangeList = [];
  }

  loopFind(low, high, search) {
    if(low > high) {
      return {
        index: high,
        ele: undefined,
      };
    }
    const index = Math.floor((low + high) / 2);
    const [start, end] = this.rangeList[index].range;
    if(search < start) {
      return this.loopFind(low, index - 1, search);
    }
    if(search > end) {
      return this.loopFind(index + 1, high, search);
    }
    return {
      index,
      ele: this.rangeList[index],
    }
  }

  /**
   * 添加区间与值的映射
   * @param {array<number>} range 整型范围区间 [start, end]
   * @param {any} value
   */
  add(range, value) {
    const [start, end] = range;
    const startIndex = this.loopFind(0, this.rangeList.length - 1, start).index;
    let endIndex = this.loopFind(0, this.rangeList.length - 1, end).index;

    // 新插入的范围是某个范围的子集
    if(startIndex === endIndex
      && startIndex >= 0
      && isValueInRange(this.rangeList[startIndex].range, start)
      && isValueInRange(this.rangeList[startIndex].range, end)
    ) {
      const oldEle = this.rangeList[startIndex];
      this.rangeList.splice(startIndex, 1);
      if(oldEle.range[1] > end) {
        this.rangeList.splice(startIndex, 0, {
          range: [end + 1, oldEle.range[1]],
          value: oldEle.value,
        });
      }
      this.rangeList.splice(startIndex, 0, {
        range: [start, end],
        value,
      });
      if(oldEle.range[0] < start) {
        this.rangeList.splice(startIndex, 0, {
          range: [oldEle.range[0], start - 1],
          value: oldEle.value,
        });
      }
      return true;
    }

    // 其他交叉或不交叉的情况
    this.rangeList.splice(startIndex + 1, endIndex - startIndex - 1);
    endIndex = startIndex + 1;
    if(this.rangeList[startIndex] !== undefined && isValueInRange(this.rangeList[startIndex].range, range[0])) {
      if(this.rangeList[startIndex].range[0] < range[0]) {
        this.rangeList[startIndex].range[1] = range[0] - 1;
      }else {
        this.rangeList.splice(startIndex, 1);
      }
    }

    if(this.rangeList[endIndex] !== undefined
      && (isValueInRange(this.rangeList[endIndex].range, range[1]) || this.rangeList[endIndex].range[1] < range[1])) {
      if(this.rangeList[endIndex].range[1] > range[1]) {
        this.rangeList[endIndex].range[0] = range[1] + 1;
      }else {
        this.rangeList.splice(endIndex, 1);
      }
    }

    this.rangeList.splice(startIndex + 1, 0, {range, value});
    return true;
  }

  /**
   * 查找命中的区间
   * @param {number} search
   * @returns {array<number>}
   */
  findRange(search) {
    const result = this.loopFind(0, this.rangeList.length - 1, search).ele;
    return result === undefined ? undefined : result.range;
  }

  /**
   * 查找命中区间对应的值
   * @param {number} search
   * @returns {any}
   */
  findValue(search) {
    const result = this.loopFind(0, this.rangeList.length - 1, search).ele;
    return result === undefined ? undefined : result.value;
  }

  /**
   * 清空 Map
   */
  clear() {
    this.rangeList = [];
  }
};
