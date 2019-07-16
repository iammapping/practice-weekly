/* eslint-disable prefer-destructuring */
/* eslint-disable no-cond-assign */
/* eslint-disable no-bitwise */

function hashCode(str) {
  if (str == null) return 0
  let h = 0;
  let off = 0;
  const len = str.length;
  for(let i = 0; i < len; i++){
    h = 31 * h + str.charCodeAt(off++);
  }
  return h;
}

class Node {
  constructor(hash, key, value, next) {
    this.hashCode = hash;
    this.key = key;
    this.value = value;
    this.next = next;
  }

  getKey() {
    return this.key;
  }

  getValue() {
    return this.value;
  }

  setValue(value) {
    this.value = value;
  }

  hash() {
    return this.hashCode;
  }

}

/**
 * 实现一个 LRU Cache
 */
module.exports = class LruCache {
// class LruCache {
  /**
   *
   * @param {number} max 最大容量
   */
  constructor(max) {
    this.capacity = max
    this.table = []
  }

  getNode(hash, key) {
    let len; 
    let first;
    let e;
    let k;
    if ((len = this.table.length) > 0 
        && (first = this.table[0]) != null
        && hash != null) {
        if (first.hash() === hash && // always check first node
            ((k = first.getKey()) === key))
            return first;
        if ((e = first.next) != null) {
            do {
                if (e.hash() === hash &&
                    ((k = e.getKey()) === key))
                    return e;
            } while ((e = e.next) != null);
        }
    }
    return null;
  }

  removeNode(hash, key) {
    let len; 
    let first;
    let p;
    let e;
    let k;
    let index = 0;
    if ((len = this.table.length) > 0 
      && (first = this.table[0]) != null
      && hash != null) {
      if (first.hash() === hash && // always check first node
          ((k = first.getKey()) === key)) {
        this.table.shift(); 
        return;
      }
      
      if ((e = first.next) != null) {
        p = first;
        do {
          index++
          if (e.hash() === hash &&
              ((k = e.getKey()) === key)) {
            p.next = e.next;
            this.table.splice(index, 1);
            return;
          }
          p = p.next;
        } while ((e = e.next) != null);
      }
    }
  }

  push(hash, key) {
    let len; 
    let first;
    let p;
    let e;
    let k;
    if ((len = this.table.length) > 0 
        && (first = this.table[0]) != null
        && hash != null) {
        
        if (first.hash() === hash && // always check first node
            ((k = first.getKey()) === key)) {
          if (len > 1) {
            first.next = null
            this.table[len-1].next = first
            this.table.shift()
            this.table.push(first)
          }
          return first;
        }
        if ((e = first.next) != null) {
          p = first;
          let index = 0;
            do {
              index++;
              if (e.hash() === hash &&
                ((k = e.getKey()) === key)) {
                
                if (index < len -1) {
                  p.next = e.next;
                  e.next = null
                  this.table.splice(index, 1)
                  this.table.push(e)
                }
                return e;
              }

              p = p.next;
            } while ((e = e.next) != null);
        }
    }
    return null;
  }

  /**
   * 已存储的数量
   *
   * @readonly
   */
  get length() {
    return this.table.length
  }

  /**
   * 获取某个 key 对应的值
   *
   * @param {*} key
   */
  get(key) {
    const node = this.push(hashCode(key), key)
    if (node) {
      return node.getValue()
    }

    return undefined
  }

  /**
   * 设置键值对
   *
   * @param {any} key
   * @param {any} val
   */
  set(key, val) {
    const hash = hashCode(key)
    let node = this.push(hash, key)
    if (node) {
      node.setValue(val)
    } else {
      node = new Node(hash, key, val, null)

      const len = this.table.length
      if (len > 0) {
        this.table[len - 1].next = node
      }
      this.table.push(node)
  
      if (this.length > this.capacity) {
        this.table.shift()
      }
    }
  }

  /**
   * 删除某个 key
   *
   * @param {any} key
   */
  del(key) {
    this.removeNode(hashCode(key), key)
  }

  /**
   * 判断某个 key 是否存在
   *
   * @param {any} key
   */
  has(key) {
    return this.getNode(hashCode(key), key) !== null
  }

  /**
   * 清空所有的内容
   */
  reset() {
    this.table = []
  }
}
