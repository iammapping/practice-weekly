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
<<<<<<< HEAD
  const arr = [];

  let convertedArr = collection;
  if(collection && typeof collection === 'object') {
    convertedArr = Object.values(collection);
  }

  if(collection && Array.isArray(convertedArr)) {
    convertedArr.forEach(item => {
      if(predicate && typeof predicate === 'function') {
        if(predicate(item)) {
          arr.push(item);
        }
      } else if(predicate && typeof predicate === 'object') {
        const predicateKeys = Object.keys(predicate);
        let isPass = true;
        predicateKeys.forEach(i => {
          if(predicate[i] !== item[i]) {
            isPass = false;
          }
        });
        if(isPass) {
          arr.push(item);
        }
      } else if(predicate && typeof predicate === 'string') {
        if(item[predicate]) {
          arr.push(item);
        }
      }
    });
  }
  return arr;
};
=======
  if (!collection || typeof collection !== 'object' && !Array.isArray(collection) || !predicate) {
    return [];
  }

  function colFilter(col, callback) {
    if (Array.isArray(col)) {
      return col.filter(callback);
    }

    if (typeof (col) === 'object') {
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
>>>>>>> upstream/master
