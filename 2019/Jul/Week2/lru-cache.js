/**
 * 实现一个 LRU Cache
 */
class LruNode {
  constructor(key, value, pre, next) {
    this.key = key;
    this.value = value;
    this.pre = pre;
    this.next = next;
  }
};

module.exports = class LruCache {
  /**
   *
   * @param {number} max 最大容量
   */
  constructor(max) {
    this.max = max;
    this.currentLength = 0;
    this.head = new LruNode(null, null, null, null);
    this.last = new LruNode(null, null, this.head, null);
    this.head.next = this.last;
  }

  nodeToHead(node) {
    node.pre.next = node.next;
    node.next.pre = node.pre;

    node.next = this.head.next;
    node.pre = this.head;

    this.head.next.pre = node;
    this.head.next = node;
  }

  delLast() {
    this.last.pre.pre.next = this.last;
    this.last.pre = this.last.pre.pre;
    this.currentLength--;
  }

  addHead(node) {
    node.next = this.head.next;
    node.pre = this.head;
    this.head.next.pre = node;
    this.head.next = node;
    this.currentLength++;
  }

  delNode(node) {
    node.pre.next = node.next;
    node.next.pre = node.pre;
    this.currentLength--;
  }

  /**
   * 已存储的数量
   *
   * @readonly
   */
  get length() {
    return this.currentLength;
  }

  /**
   * 获取某个 key 对应的值
   *
   * @param {*} key
   */
  get(key) {
    let current = this.head.next;
    while (current !== this.last) {
      if(current.key === key) {
        this.nodeToHead(current);
        return current.value;
      }
      current = current.next;
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
    let current = this.head.next;
    while (current !== this.last) {
      if(current.key === key) {
        current.value = val;
        this.nodeToHead(current);
        return true;
      }
      current = current.next;
    }
    if(this.currentLength >= this.max) {
      this.delLast();
    }
    const newNode = new LruNode(key, val, null, null);
    this.addHead(newNode);
    return true;
  }

  /**
   * 删除某个 key
   *
   * @param {any} key
   */
  del(key) {
    let current = this.head.next;
    while (current !== this.last) {
      if(current.key === key) {
        this.delNode(current);
        return true;
      }
      current = current.next;
    }

    return false;
  }

  /**
   * 判断某个 key 是否存在
   *
   * @param {any} key
   */
  has(key) {
    let current = this.head.next;
    while (current !== this.last) {
      if(current.key === key) {
        this.nodeToHead(current);
        return true;
      }
      current = current.next;
    }
    return false;
  }

  /**
   * 清空所有的内容
   */
  reset() {
    this.head.next = this.last;
    this.last.pre = this.head;
    this.currentLength = 0;
  }
}
