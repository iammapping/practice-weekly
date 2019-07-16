/**
 * 实现一个 LRU Cache
 */
module.exports = class LruCache {
  /**
   *
   * @param {number} max 最大容量
   */
  constructor(max) {
    this.storage = {};
    this.maxSize = max;
  }

  /**
   * 已存储的数量
   *
   * @readonly
   */
  get length() {
    return Object.keys(this.storage).length;
  }

  /**
   * 获取某个 key 对应的值
   *
   * @param {*} key
   */
  get(key) {
    const val = this.storage[key];

    if (this.has(key)) {
      this.del(key);
      this.set(key, val);
    }

    return val;
  }

  /**
   * 设置键值对
   *
   * @param {any} key
   * @param {any} val
   */
  set(key, val) {
    this.storage[key] = val;

    if (this.length > this.maxSize) {
      delete this.storage[Object.keys(this.storage)[0]];
    }
  }

  /**
   * 删除某个 key
   *
   * @param {any} key
   */
  del(key) {
    delete this.storage[key];
  }

  /**
   * 判断某个 key 是否存在
   *
   * @param {any} key
   */
  has(key) {
    return key in this.storage;
  }

  /**
   * 清空所有的内容
   */
  reset() {
    this.storage = {};
  }
}
