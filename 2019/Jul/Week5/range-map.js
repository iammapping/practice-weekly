/* eslint-disable compat/compat */
const ShouldBeType = {
  start: Symbol('start'),
  end: Symbol('end'),
  none: Symbol('none')
}

class Range {
  constructor(start, end, value) {
    this.start = start
    this.end = end
    this.value = value
  }

  contains(val) {
    return this.start <= val && val <= this.end
  }
}

/**
 * 实现一个区间 Map
 */
module.exports = class RangeMap {

  constructor() {
    this.rangeArr = []
  }

  findIndex(search, shouldBe = ShouldBeType.none) {
    if (this.rangeArr.length === 0){
      return -1
    }

    let left = 0;
    let right = this.rangeArr.length;
    let mid = 0

    while (left < right) {
      // eslint-disable-next-line no-bitwise
      mid = (left + right) >>> 1
      const r = this.rangeArr[mid]

      if (r.start > search)
        right = mid;
      else if (r.end < search)
        left = mid + 1;
      else 
        return mid
    }

    let ret = -1
    
    if (shouldBe === ShouldBeType.start)
      ret = this.rangeArr[mid].end < search ? mid : mid - 1
    
    if (shouldBe === ShouldBeType.end)
      ret = this.rangeArr[mid].start > search ? mid : mid + 1
    
    if (ret >= 0 && ret < this.rangeArr.length)
      return ret

    return -1
  }

  /**
   * 添加区间与值的映射
   * @param {array<number>} range 整型范围区间 [start, end]
   * @param {any} value
   */
  add(range, value) {
    const len = this.rangeArr.length
    const start = range[0]
    const end = range[1]
    const r = new Range(start, end, value)


    if (len === 0 || this.rangeArr[len - 1].end < start) {
      this.rangeArr.push(r)
      return
    }

    if (this.rangeArr[0].start > end) {
      this.rangeArr.unshift(r)
      return
    }

    let startIndex = this.findIndex(start, ShouldBeType.start)
    const endIndex = this.findIndex(end, ShouldBeType.end)

    const insertArr = []

    if (startIndex !== -1) {
      const startRange = this.rangeArr[startIndex]
      if (startRange.contains(start) && startRange.start < start) {
        insertArr.push(new Range(startRange.start, start-1, startRange.value))
      }
    } else {
      startIndex = 0
    }

    insertArr.push(r)

    if (endIndex !== -1 ) {
      const endRange = this.rangeArr[endIndex]
      if (endRange.contains(end) && endRange.end > end) {
        insertArr.push(new Range(end+1, endRange.end, endRange.value))
      }
    }

    // 删除原有的
    this.rangeArr.splice(startIndex, endIndex > 0 
      ? endIndex - startIndex + 1 
      : this.rangeArr.length - startIndex)

    // 添加新的range
    let insertIndex = startIndex
    insertArr.forEach(item => {
      this.rangeArr.splice(insertIndex++, 0, item)
    })
  }

  /**
   * 查找命中的区间
   * @param {number} search
   * @returns {array<number>}
   */
  findRange(search) {
    const index = this.findIndex(search)
    if (index !== -1) {
      const r = this.rangeArr[index]
      return [r.start, r.end]
    }

    return undefined
  }

  /**
   * 查找命中区间对应的值
   * @param {number} search
   * @returns {any}
   */
  findValue(search) {
    const index = this.findIndex(search)
    if (index !== -1) {
      const r = this.rangeArr[index]
      return r.value
    }

    return undefined
  }

  /**
   * 清空 Map
   */
  clear() {
    this.rangeArr = []
  }
};
