/**
 * 实现一个 LRU Cache
 */

// function Node() {
//   this.key = null;
//   this.value = null;
//   //this.obj = [];
//   this.previous = null;
//   this.next = null;
// }
function Node() {
  this.key = null;
  this.value = null;
}
module.exports = class LruCache {
  /**
   *
   * @param {number} max 最大容量
   */
  constructor(max) {
    this.maxLength = max;
    this.lru = [];
  }

  /**
   * 已存储的数量
   *
   * @readonly
   */
  get length() {
    return this.lru.length
  }

  /**
   * 获取某个 key 对应的值
   *
   * @param {*} key
   */
  get(key) {
    for (let i=0; i<this.lru.length; i++) {
      if (key === this.lru[i].key) {
        const node = this.lru.splice(i,1);
        this.lru.unshift({key:node[0].key,value:node[0].value});
        return node[0].value;
      }
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
    // let element = this.node;
    // if(this.has(key)) {
    //   element.key = key;
    //   element.value = val;
    //
    // }
    // this.lru.push(element);

    if(!this.has(key)) {
      const element = {
        key,
        value: val
      }
      if(this.lru.length === this.maxLength ) {
        this.del(key);
      }
      this.lru.unshift(element);
    }
  }

  /**
   * 删除某个 key
   *
   * @param {any} key
   */
  del(key) {
    for (let i=0; i<this.lru.length; i++) {
      if (key === this.lru[i].key) {
       return this.lru.splice(i, 1);
      }
    }
    return  this.lru.pop();
  }

  /**
   * 判断某个 key 是否存在
   *
   * @param {any} key
   */
  has(key) {
    for (let i=0; i<this.lru.length; i++) {
      if (key === this.lru[i].key) {
        return true;
      }
    }
    return false;
  }

  /**
   * 清空所有的内容
   */
  reset() {
    this.lru.splice(0, this.lru.length)
  }
}
