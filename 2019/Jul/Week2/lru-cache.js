/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-cond-assign */
/* eslint-disable no-bitwise */

function hashCode(str) {
  if (str == null) return 0
  str += ''
  let h = 0;
  let off = 0;
  const len = str.length;
  for(let i = 0; i < len; i++){
    h = 31 * h + str.charCodeAt(off++);
  }
  return h;
}

class Entry {
  constructor(hash, key, value, next) {
    this.hash = hash;
    this.key = key;
    this.value = value;
    this.before = null;
    this.after = next;
  }

  remove() {
    this.before.after = this.after;
    this.after.before = this.before;
  }

  addBefore(existingEntry) {
    this.after  = existingEntry;
    this.before = existingEntry.before;
    if (this.before) {
      this.before.after = this;
    }
    if (this.after) {
      this.after.before = this;
    }
  }

  recordAccess(m) {
    if (m.accessOrder) {
      m.modCount++;
      this.remove();
      this.addBefore(m.header);
    }
  }

  recordRemoval(m) {
    this.remove();
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
    this.capacity = max
    this.header = null
    this.table = []
    this.size = 0
    this.accessOrder = true
    this.modCount = 0
    this.hashMap = {}
    this.init()
  }

  init() {
    this.header = new Entry(-1, null, null, null);
    this.header.before = this.header;
    this.header.after = this.header;
  }

  indexFor(h, length) {
    // assert Integer.bitCount(length) == 1 : "length must be a non-zero power of 2";
    // return h & (length-1);
    const i = this.hashMap[h]
    if (i != null) 
      return i
    this.hashMap[h] = this.size
    return this.size
  }

  getEntry(key) {
    if (this.size === 0) {
        return null;
    }

    const hash = (key == null) ? 0 : hashCode(key);
    for (let e = this.table[this.indexFor(hash, this.table.length)];
         e != null;
         e = e.next) {
        let k;
        if (e.hash === hash &&
            ((k = e.key) === key))
            return e;
    }
    return null;
  }

  addEntry(hash, key, value, bucketIndex) {

    const old = this.table[bucketIndex];
    const e = new Entry(hash, key, value, old);
    this.table[bucketIndex] = e;
    e.addBefore(this.header);
    this.size++;

    if (this.size > this.capacity) {
      this.removeEntryForKey(this.header.after.key)
    }
  }

  removeEntryForKey(key) {
    if (this.size === 0) {
        return null;
    }
    const hash = (key == null) ? 0 : hashCode(key);
    const i = this.indexFor(hash, this.table.length);
    let prev = this.table[i];
    let e = prev;

    while (e != null) {
        const next = e.next;
        let k;
        if (e.hash === hash &&
            ((k = e.key) === key)) {
            this.modCount++;
            this.size--;
            if (prev === e)
                this.table[i] = next;
            else
                prev.next = next;
            e.recordRemoval(this);
            return e;
        }
        prev = e;
        e = next;
    }

    return e;
  }

  /**
   * 已存储的数量
   *
   * @readonly
   */
  get length() {
    return this.size
  }

  /**
   * 获取某个 key 对应的值
   *
   * @param {*} key
   */
  get(key) {
    const e = this.getEntry(key);
    if (e == null)
        return undefined;
    e.recordAccess(this);
    return e.value;
  }

  /**
   * 设置键值对
   *
   * @param {any} key
   * @param {any} val
   */
  set(key, val) {
    const hash = hashCode(key);
    const i = this.indexFor(hash, this.table.length);
    for (let e = this.table[i]; e != null; e = e.next) {
        let k;
        if (e.hash === hash && ((k = e.key) === key)) {
            const oldValue = e.value;
            e.value = val;
            e.recordAccess(this);
            return oldValue;
        }
    }

    this.modCount++;
    this.addEntry(hash, key, val, i);
    return null;
  }

  /**
   * 删除某个 key
   *
   * @param {any} key
   */
  del(key) {
    const e = this.removeEntryForKey(key);
    return (e == null ? null : e.value);
  }

  /**
   * 判断某个 key 是否存在
   *
   * @param {any} key
   */
  has(key) {
    return this.getEntry(key) != null;
  }

  /**
   * 清空所有的内容
   */
  reset() {
    this.modCount++
    this.table = []
    this.size = 0
    this.init()
  }
}
