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

  let convertedCollection = collection;
  if(collection && typeof collection === 'object') {
    convertedCollection = Object.values(collection);
  }

  if(Array.isArray(convertedCollection)) {
    if(typeof predicate === 'function') {
      convertedCollection.map(predicate).forEach((funcResult, index) => {
        if(funcResult) {
          result.push(convertedCollection[index]);
        }
      })
    } else if(typeof predicate === 'object') {
      convertedCollection.forEach(item => {
        let isMatched = true;

        Object.keys(predicate).forEach(i => {
          if(i && item[i] !== predicate[i]) {
            isMatched = false;
          }
        });

        if(isMatched) {
          result.push(item);
        }
      })
    } else {
      convertedCollection.forEach(item => {
        if(item[predicate]) {
          result.push(item);
        }
      })
    }
  }

  return result;
};
