/**
 * 实现一个 LRU Cache
 */
module.exports = class LruCache {
  /**
   *
   * @param {number} max 最大容量
   */
  constructor(max) {
    this.storeObj = {};
    this.max = max;
  }

  /**
   * 已存储的数量
   *
   * @readonly
   */
  get length() {
    return Object.keys(this.storeObj).length;
  }

  /**
   * 获取某个 key 对应的值
   *
   * @param {*} key
   */
  get(key) {
    const result = this.storeObj[key];

    if(this.has(key)) {
      this.del(key);
      this.set(key, result);
    }

    return result;
  }

  /**
   * 设置键值对
   *
   * @param {any} key
   * @param {any} val
   */
  set(key, val) {
    this.storeObj[key] = val;
    if(this.length > this.max) {
      delete this.storeObj[Object.keys(this.storeObj)[0]];
    }
  }

  /**
   * 删除某个 key
   *
   * @param {any} key
   */
  del(key) {
    delete this.storeObj[key];
  }

  /**
   * 判断某个 key 是否存在
   *
   * @param {any} key
   */
  has(key) {
    return this.storeObj[key] !== undefined;
  }

  /**
   * 清空所有的内容
   */
  reset() {
    this.storeObj = {};
  }
}
