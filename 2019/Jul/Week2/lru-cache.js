/**
 * 实现一个 LRU Cache
 */
module.exports = class LruCache {
    /**
     *
     * @param {number} max 最大容量
     */
    constructor(max) {
        this.obj = {};
        this.max = max;
    }

    /**
     * 已存储的数量
     *
     * @readonly
     */
    get length() {
        return Object.keys(this.obj).length;
    }

    /**
     * 获取某个 key 对应的值
     *
     * @param {*} key
     */
    get(key) {
        const result = this.obj[key];

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
        this.obj[key] = val;
        if(this.length > this.max) {
            delete this.obj[Object.keys(this.obj)[0]];
        }
    }

    /**
     * 删除某个 key
     *
     * @param {any} key
     */
    del(key) {
        delete this.obj[key];
    }

    /**
     * 判断某个 key 是否存在
     *
     * @param {any} key
     */
    has(key) {
        return this.obj[key] !== undefined;
    }

    /**
     * 清空所有的内容
     */
    reset() {
        this.obj = {};
    }
}
