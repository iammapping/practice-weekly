class RangeNode {
  constructor(low, high, value) {
    this.low = low;
    this.high = high;
    this.value = value;
    this.max = 0;

    this.left = null;
    this.right = null;
  }

  setLeft(node) {
    this.left = node;
  }

  setRight(node) {
    this.right = node;
  }

  setMax(max) {
    this.max = max;
  }
}

/**
 * range2 is subset of range1
 * @param range1 {RangeNode}
 * @param range2 {RangeNode}
 */
function isSubsetOfRange(range1, range2) {
  return range1.low < range2.low && range2.high < range1.high;
}

/**
 * range1 intersects with range2
 * @param range1 {RangeNode}
 * @param range2 {RangeNode}
 */
function isIntersectionOfRange(range1, range2) {
  return range1.high >= range2.low && range2.high >= range1.high
}

/**
 * @param node {RangeNode}
 * @param newNode {RangeNode}
 * @return {RangeNode}
 */
function doInsert(node, newNode) {
  if (node === null) {
    return newNode;
  }

  if (isIntersectionOfRange(node, newNode)) {
    const { low, high, value: oldValue } = node;
    const { high: newHigh, value } = newNode;

    if (node.high === newNode.low) {
      node.high = newNode.low - 1;
    }

    node.setRight(newNode);

    if (node.high > newNode.low) {
      node.high = low;
      newNode.high = newNode.low;

      newNode.setRight(new RangeNode(newNode.high + 1, high, oldValue));
      newNode.right.setRight(new RangeNode(high + 1, newHigh, value));
    }

    return node;
  }

  if (isSubsetOfRange(node, newNode)) {
    const { high } = node;

    node.high -= newNode.low;

    node.setRight(newNode);
    newNode.setRight(new RangeNode(newNode.high + 1, high, node.value));

    return node;
  }

  if (node.low > newNode.low) {
    node.setLeft(doInsert(node.left, newNode));
  } else {
    node.setRight(doInsert(node.right, newNode));
  }

  if (node.max < newNode.high) {
    node.setMax(newNode.high);
  }

  return node;
}

function doSearch(node, search, rangeSearch=false) {
  if (node === null) {
    return undefined;
  }

  if (search >= node.low && search <= node.high) {
    if (!rangeSearch) {
      return node.value;
    }

    return [node.low, node.high];
  }

  if (node.left && node.left.max > search) {
    return doSearch(node.left, search, rangeSearch);
  }

  return doSearch(node.right, search, rangeSearch);
}

/**
 * 实现一个区间 Map
 */
module.exports = class RangeMap {
  constructor() {
    this.root = null;
  }

  /**
   * 添加区间与值的映射
   * @param {array<number>} range 整型范围区间 [start, end]
   * @param {any} value
   */
  add(range, value) {
    const node = doInsert(this.root, new RangeNode(...range, value));

    if (this.root === null) {
      this.root = node;
    }

    return node;
  }

  /**
   * 查找命中的区间
   * @param {number} search
   * @returns {array<number>}
   */
  findRange(search) {
    return doSearch(this.root, search, true);
  }

  /**
   * 查找命中区间对应的值
   * @param {number} search
   * @returns {any}
   */
  findValue(search) {
    return doSearch(this.root, search);
  }

  /**
   * 清空 Map
   */
  clear() {
    this.root = null;
  }
};
