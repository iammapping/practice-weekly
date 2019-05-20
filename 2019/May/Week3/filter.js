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
  var arr = []
  if(collection && (typeof collection == 'object' || Array.isArray(collection))) {
    if(predicate && typeof predicate == 'function') {
      for(var i in collection) {
        if(predicate(collection[i])) {
          arr.push(collection[i]);
        }
      }
    }
    if(predicate && typeof predicate == 'object' ) {
      for(var i in collection) {
        var isPass = true
        for(var j in predicate) {
          if(predicate[j] != collection[i][j]) {
            isPass = false
          }
        }
        if(isPass) {
          arr.push(collection[i]);
        }
      }
    }
    if(predicate && typeof predicate == 'string') {
      for(var i in collection) {
        if(collection[i][predicate]) {
          arr.push(collection[i]);
        }

      }
    }
  }
  return arr;
};
