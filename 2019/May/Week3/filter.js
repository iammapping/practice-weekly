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
   const retArr = []
   if (Array.isArray(collection)) {
      collection.forEach(val => {
        filterObj(retArr, val, predicate)
      })
   } else if (Object.prototype.toString.call(collection) === '[object Object]') {
      for (let key in collection) {
        filterObj(retArr, collection[key], predicate)
      }
   }
 
   return retArr
 };
 
 function filterObj(retArr, obj, predicate) {
   if (Object.prototype.toString.call(predicate) === '[object Object]') {
     let isFit = true
     for (let key in predicate) {
       if (obj[key] !== predicate[key]) {
         isFit = false
         break
       }
     }
 
     if (isFit) {
       retArr.push(obj)
     }
 
   } else if (typeof predicate === 'string') {
     if (obj[predicate]) {
       retArr.push(obj)
     }
   } else if (typeof predicate === 'function') {
     if (predicate(obj) === true) {
       retArr.push(obj)
     }
   }
 };
 