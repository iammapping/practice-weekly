/**
 * 按条件过滤传入的集合
 *
 * @param {Array|Object} collection 用于查找的集合
 * @param {Function|Object|String} predicate 用于过滤的断言
 * @returns {Array} 返回集合中满足条件的对象组成的数组
 *
 * @example
 *
 * const users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * // 过滤出 active 为 true 的元素
 * filter(users, function(o) { return !o.active; });
 *
 * // 过滤 age 为 36 且 active 为 true 的元素
 * filter(users, { 'age': 36, 'active': true });
 *
 * // 过滤出 active 为 true 的元素
 * filter(users, 'active');
 */
module.exports = function filter(collection, predicate) {
    if(!collection || !(typeof collection === 'object' || Array.isArray(collection))) { 
        return []; 
    }

    // convert to array
    let coll = [];
    if(typeof collection === 'object') {
        // for(const key of collection) {
        //     coll.push(collection[key]);
        // }
        // not for .. in 
        Object.keys(collection).forEach((c) => coll.push(c));
    }else {
        coll = collection;
    }

    if(coll.length === 0) { return []; }

    // filter
    const ct = typeof predicate;
    if(ct === 'function') {
        return coll.filter((o) => predicate(o));
    }

    if(ct === 'object') { // && Object.keys(predicate).length > 0
        if(Object.keys(predicate).length === 0) { // 空对象即不过滤，直接返回
            return coll;
        }

        return coll.filter((o) => {
            return Object.keys(predicate).every((k) => o[k] === predicate[k]);
        });
    }
    
    if(ct === 'string' && predicate !== '') {
        return coll.filter((o) => o[predicate]);
    }
    
    return [];
};
