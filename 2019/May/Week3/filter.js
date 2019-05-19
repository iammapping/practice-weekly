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
  let result = [];

  if (!collection || !predicate) return result;
  if (typeof collection !== 'object') return result;

  const coll = typeof collection === 'object' ? Object.values(collection) : collection;

  if (typeof predicate === 'function') {
    result = coll.filter(item => predicate(item));
  }

  if (typeof predicate === 'object') {
    coll.forEach(item => {
      let has = true;

      Object.keys(predicate).forEach(key => {
        if ((item[key] === 'undefined') || (item[key] !== predicate[key])) has = false;
      });

      if (has) result.push(item);
    });
  }

  if (typeof predicate === 'string') {
    result = coll.filter(item => item[predicate]);
  }

  return result;
};
