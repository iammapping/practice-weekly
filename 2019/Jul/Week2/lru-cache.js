class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.nextNode = null;
  }

  isEqual(key) {
    return this.key === key;
  }

  getVal() {
    return this.value;
  }
}

/**
 * 实现一个 LRU Cache
 */
module.exports = class LruCache {
  /**
   *
   * @param {number} max 最大容量
   */
  constructor(max) {
    this.max = max;
    this.size = 0;
    this.firstNode = null;
  }

  /**
   * 已存储的数量
   *
   * @readonly
   */
  get length() {
    return this.size;
  }

  isFull() {
    return this.size === this.max;
  }

  /**
   * 获取某个 key 对应的值
   *
   * @param {*} key
   */
  get(key) {
    const [preNode, curNode, nextNode] = this.find(key);
    this.moveToFirst(preNode, curNode, nextNode);
    if (curNode !== null) {
      return curNode.getVal();
    }

    return undefined;
  }

  /**
   * 设置键值对
   *
   * @param {any} key
   * @param {any} val
   */
  set(key, val) {
    const [preNode, curNode, nextNode] = this.find(key);
    if (curNode === null) {
      this.push(new Node(key, val));
    } else {
      this.moveToFirst(preNode, curNode, nextNode);
    }
  }

  /**
   * 删除某个 key
   *
   * @param {any} key
   */
  del(key) {
    const [preNode, curNode, nextNode] = this.find(key);
    if(curNode !== null) {
      preNode.nextNode = nextNode;
    }
    return curNode;
  }

  /**
   * 判断某个 key 是否存在
   *
   * @param {any} key
   */
  has(key) {
    const [preNode, curNode, nextNode] = this.find(key);
    return curNode !== null;
  }

  find(key) {
    let preNode = this.firstNode;
    
    let compareNode = this.firstNode;
    while (compareNode !== null) {
      if (compareNode.isEqual(key)) {
        return [preNode, compareNode, compareNode.nextNode];
      }

      preNode = compareNode;
      compareNode = compareNode.nextNode;
    }

    return [null, null, null];
  }

  push(node) {
    if (this.isFull()) {
      this.pop();
    }

    node.nextNode = this.firstNode;
    this.firstNode = node;
    this.size++;
  }

  pop() {
    let nextNode = this.firstNode;
    let newLastNode = null;
    while (nextNode) {
      if (nextNode.nextNode === null) {
        if (newLastNode === null) {
          this.firstNode = null;
        } else {
          newLastNode.nextNode = null;
        }

        this.size--;
        return;
      }

      newLastNode = nextNode;
      const nn = nextNode.nextNode;
      nextNode = nn;
    }
  }

  moveToFirst(preNode, curNode, nextNode) {
    if (curNode === null || curNode.isEqual(this.firstNode.key)) {
      return;
    }

    preNode.nextNode = nextNode;
    curNode.nextNode = this.firstNode;
    this.firstNode = curNode;
  }

  /**
   * 清空所有的内容
   */
  reset() {
    this.firstNode = null;
    this.size = 0;
  }
}
