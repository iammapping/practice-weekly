class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

/**
 * 双向链表
 */
class DoubleLinkedList {
  constructor() {
    this.init();
  }

  /**
   * @protected
   */
  init() {
    // 头结点
    this.head = new Node("#head", "head");
    // 尾节点
    this.rear = new Node("#rear", "rear");
    // 节点数量
    this.size = 0;

    this.head.next = this.rear;
    this.rear.prev = this.head;
  }

  /**
   * @param node {Node}
   */
  moveToFirst(node) {
    this.remove(node);
    this.insert(node);
  }

  /**
   * @param node {Node}
   * @return {Node}
   */
  remove(node) {
    const { next, prev } = node;

    prev.next = next;
    next.prev = prev;

    this.size--;
    return node;
  }

  /**
   * @return {Node}
   */
  pop() {
    return this.remove(this.rear.prev);
  }

  /**
   * 头插
   * @param node {Node}
   */
  insert(node) {
    const prev = this.head.next;

    this.head.next = node;
    node.prev = this.head;

    if (prev !== null) {
      node.next = prev;
      prev.prev = node;
    }

    this.size++;
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
    this.capacity = max;
    this.cache = {};
    this.list = new DoubleLinkedList();
  }

  /**
   * 已存储的数量
   *
   * @readonly
   */
  get length() {
    return this.list.size;
  }

  /**
   * 获取某个 key 对应的值
   *
   * @param {*} key
   */
  get(key) {
    if (!this.has(key)) {
      return undefined;
    }

    this.list.moveToFirst(this.cache[key]);
    return this.cache[key].value;
  }

  /**
   * 设置键值对
   *
   * @param {any} key
   * @param {any} val
   */
  set(key, val) {
    if (this.has(key)) {
      this.cache[key].value = val;
      this.list.moveToFirst(this.cache[key]);
      return;
    }

    this.cache[key] = new Node(key, val);
    this.list.insert(this.cache[key]);

    if (this.length > this.capacity) {
      delete this.cache[this.list.pop().key];
    }
  }

  /**
   * 删除某个 key
   *
   * @param {any} key
   */
  del(key) {
    this.list.remove(this.cache[key]);

    delete this.cache[key];
  }

  /**
   * 判断某个 key 是否存在
   *
   * @param {any} key
   */
  has(key) {
    return key in this.cache;
  }

  /**
   * 清空所有的内容
   */
  reset() {
    this.cache = {};
    this.list = new DoubleLinkedList();
  }
};
