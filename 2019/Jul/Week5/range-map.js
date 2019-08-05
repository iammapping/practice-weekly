/**
 * 实现一个区间 Map
 */
function getPosition(arr, value) {
  let position = 0;
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    position = Math.floor((low + high) / 2);

    if (value === arr[position]){
      break;
    } else if (value > arr[position]) {
      low = position + 1;
      if (low > high) {
        position = low;
      }
    } else {
      high = position - 1;
      if (low > high) {
        position = high + 1;
      }
    }
  }

  return position;
}

module.exports = class RangeMap {
  /**
   * 添加区间与值的映射
   * @param {array<number>} range 整型范围区间 [start, end]
   * @param {any} value
   */
  //   this.rangeValArr [ 1, 3 ]
  //   this.valueArr [ 'xxx', 'xxx' ]
  //   this.rangeValArr [ 1, 3, 4, 7 ]
  //   this.valueArr [ 'xxx', 'xxx', 'yyy', 'yyy' ]
  //   this.rangeValArr [ 1, 3 ]
  //   this.valueArr [ 'xxx', 'xxx' ]
  //   this.rangeValArr [ 1, 2, 3, 7 ]
  //   this.valueArr [ 'xxx', 'xxx', 'yyy', 'yyy' ]
  //   this.rangeValArr [ 1, 2, 3, 3, 4, 5, 6, 7 ]
  //   this.valueArr [ 'xxx', 'xxx', 'yyy', 'yyy', 'zzz', 'zzz', 'yyy', 'yyy' ]
  add(range, value) {
    this.rangeValArr = this.rangeValArr || [];
    this.valueArr = this.valueArr || [];

    const [from, to] = range;
    const fromPosition = getPosition(this.rangeValArr, from);

    if (fromPosition > 0 && fromPosition < this.rangeValArr.length) {
      if (from === this.rangeValArr[fromPosition]) {
        this.rangeValArr.splice(fromPosition, 1, from - 1);
        this.valueArr.splice(fromPosition, 1, this.valueArr[fromPosition]);
      } else {
        this.rangeValArr.splice(fromPosition, 0, from - 1);
        this.valueArr.splice(fromPosition, 0, this.valueArr[fromPosition]);
      }

      this.rangeValArr.splice(fromPosition + 1, 0, from);
      this.valueArr.splice(fromPosition + 1, 0, value);
    } else {
      this.rangeValArr.splice(fromPosition, 0, from);
      this.valueArr.splice(fromPosition, 0, value);
    }

    const toPosition = getPosition(this.rangeValArr, to);
    if (toPosition < this.rangeValArr.length) {
      this.rangeValArr.splice(toPosition, 0, to + 1);
      this.valueArr.splice(toPosition, 0, this.valueArr[toPosition]);
    }

    this.rangeValArr.splice(toPosition, 0, to);
    this.valueArr.splice(toPosition, 0, value);
  }

  /**
   * 查找命中的区间
   * @param {number} search
   * @returns {array<number>}
   */
  findRange(search) {
    const position = getPosition(this.rangeValArr, search);

    if (this.rangeValArr[position] === undefined) {
      return undefined;
    }

    if (search === this.rangeValArr[position] && this.valueArr[position + 1] === this.valueArr[position]) {
      return [this.rangeValArr[position], this.rangeValArr[position + 1]];
    }

    return [this.rangeValArr[position - 1], this.rangeValArr[position]];
  }

  /**
   * 查找命中区间对应的值
   * @param {number} search
   * @returns {any}
   */
  findValue(search) {
    const position = getPosition(this.rangeValArr, search);
    return this.valueArr[position];
  }

  /**
   * 清空 Map
   */
  clear() {
    this.rangeValArr = [];
    this.valueArr = [];
  }
};