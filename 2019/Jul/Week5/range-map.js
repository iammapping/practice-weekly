class Node {
  constructor(range, value) {
    this.range = range;
    this.value = value;
    this.preNode = null;
    this.nextNode = null;
  }

  isMapping(num) {
    return num >= this.range[0] && num <= this.range[1];
  }
}

class SortedRangeLink {
  constructor() {
    this.firstNode = null;
  }

  add(range, value) {
    let hasAddRangeNode = false;
    const rangeNode = new Node(range, value);

    if (this.firstNode === null) {
      this.firstNode = rangeNode;
      return;
    } 

    let node = this.firstNode;
    while (node) {
      if (range[0] > node.range[1]) { // 向后继续
        if (!node.nextNode) { // 结尾接入
          node.nextNode = rangeNode;
          rangeNode.preNode = node;
          break;
        }

        node = node.nextNode;
      } else if (range[1] < node.range[0]) { // 前插入
        rangeNode.preNode = node.preNode;
        node.preNode.nextNode = rangeNode;
        rangeNode.nextNode = node;
        node.preNode = rangeNode;
        break;
      } else if (range[0] <= node.range[0] && range[1] >= node.range[1]) { // 移除 && add range
        if (!hasAddRangeNode) {
          rangeNode.preNode = node.preNode;
          rangeNode.nextNode = node.nextNode;
          node.preNode.nextNode = rangeNode;
          node.nextNode.preNode = rangeNode;
          hasAddRangeNode = true;
        } else {
          node.preNode.nextNode = node.nextNode;
          node.nextNode.preNode = node.preNode;
        }
        
        node = node.nextNode;
      } else if (node.range[0] < range[0]) { // 头拆分
        const beforeNode = new Node([node.range[0], range[0] - 1], node.value);

        if(node.preNode) {
          node.preNode.nextNode = beforeNode;
          beforeNode.preNode = node.preNode;
        } else {
          this.firstNode = beforeNode;
        }

        beforeNode.nextNode = rangeNode;
        rangeNode.preNode = beforeNode;
        
        node.preNode = rangeNode;
        if(range[0] + 1 > node.range[1]) {
          node = node.nextNode;
          rangeNode.nextNode = node;
        } else {
          node.range[0] = range[0] + 1;
          rangeNode.nextNode = node;
        }
        
        hasAddRangeNode = true;
      } else if (node.range[1] > range[1]) { // 尾拆分
        const afterNode = new Node([range[1] + 1, node.range[1]], node.value);
        node.range[0] = range[1] + 1;
        if(!hasAddRangeNode) {
          rangeNode.nextNode = afterNode;
          rangeNode.preNode = node.preNode;
          node.preNode.nextNode = rangeNode;
          node.nextNode.preNode = rangeNode;
        } else {
          afterNode.preNode = node.preNode;
          node.preNode.nextNode = afterNode;
          if(node.nextNode) {
            afterNode.nextNode = node.nextNode;
            node.nextNode.preNode = afterNode;
          }
        }
        break;
      }
    }
  }

  find(num) {
    let node = this.firstNode;
    while (node) {
      if (node.isMapping(num)) {
        return node;
      }

      node = node.nextNode;
    }
    return undefined;
  }

  clear() {
    this.firstNode = null;
  }
}

/**
 * 实现一个区间 Map
 */
module.exports = class RangeMap {
  constructor() {
    this.sortedRangeLink = new SortedRangeLink();
  }

  /**
   * 添加区间与值的映射
   * @param {array<number>} range 整型范围区间 [start, end]
   * @param {any} value
   */
  add(range, value) {
    this.sortedRangeLink.add(range, value);
  }

  /**
   * 查找命中的区间
   * @param {number} search
   * @returns {array<number>}
   */
  findRange(search) {
    const node = this.sortedRangeLink.find(search);
    return node ? node.range : undefined;
  }

  /**
   * 查找命中区间对应的值
   * @param {number} search
   * @returns {any}
   */
  findValue(search) {
    const node = this.sortedRangeLink.find(search);
    return node ? node.value : undefined;
  }

  /**
   * 清空 Map
   */
  clear() {
    this.sortedRangeLink.clear();
  }
};
