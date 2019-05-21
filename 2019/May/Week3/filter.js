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
  if (!collection || typeof collection !== 'object' && !Array.isArray(collection) || !predicate) {
    return [];
  }

  let col = collection;
  if (typeof(collection) === 'object') {
    col = Object.values(collection);
  }

  if (typeof(predicate) === 'string') {
    return col.filter(obj => obj[predicate]);
  }

  if (typeof(predicate) === 'function') {
    return col.filter(obj => predicate(obj))
  }

  if (typeof(predicate) === 'object') {
    return col.filter(obj => Object.keys(predicate).every(key => obj[key] === predicate[key]));
  }

  return [];
};

/**
 * @param {Array|Object} col
 * @param {Function} callback
 * @return {Array}
 */
function colFilter(col, callback) {
  if (Array.isArray(col)) {
    return col.filter(callback);
  }

  if (typeof(col) === 'object') {
    const result = [];

    /* eslint no-restricted-syntax: "error" */
    for (const key in col) {
      if (Object.prototype.hasOwnProperty.call(col, key) && callback(col[key])) {
        result.push(col[key]);
      }
    }
    return result;
  }

  return [];
}

// filter版本2，性能优化, 当collection为object时使用for...in，不使用Object.values将其转为数组
module.exports.filter = function filter(collection, predicate) {
  if (!collection || typeof collection !== 'object' && !Array.isArray(collection) || !predicate) {
    return [];
  }

  if (typeof(predicate) === 'string') {
    return colFilter(collection, obj => obj[predicate]);
  }

  if (typeof(predicate) === 'function') {
    return colFilter(collection, obj => predicate(obj));
  }

  if (typeof(predicate) === 'object') {
    return colFilter(collection, obj => Object.keys(predicate).every(key => obj[key] === predicate[key]));
  }

  return [];
}
