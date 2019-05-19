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
  const result = [];

  if(collection && typeof collection === 'object') {
    collection = Object.values(collection);
  }

  if(Array.isArray(collection)) {
    if(typeof predicate === 'function') {
      collection.map(predicate).forEach((funcResult, index) => {
        if(funcResult) {
          result.push(collection[index]);
        }
      })
    } else if(typeof predicate === 'object') {
      collection.forEach(item => {
        let isMatched = true;

        for(let i in predicate) {
          if(i && item[i] !== predicate[i]) {
            isMatched = false;
            break;
          }
        }

        if(isMatched) {
          result.push(item);
        }
      })
    } else {
      collection.forEach(item => {
        if(item[predicate]) {
          result.push(item);
        }
      })
    }
  }

  return result;
};
