/**
 * 按指定键合并多个集合
 *
 * @param {String|Array<String>|Function} keys 指定的键
 * @param {Array|Object} collection 用于合并的基础集合
 * @param {Array|Object} restCollection 用于合并的其他集合
 * @returns {Array} 返回合并后的集合
 *
 * @example
 *
 * const col1 = [
 *   { 'dim1': 'barney', 'met1': 123 },
 *   { 'dim1': 'fred', 'met1': 456 }
 * ];
 *
 * const col2 = [
 *   { 'dim1': 'barney', 'met2': 111 },
 *   { 'dim1': 'fred', 'met2': 222 }
 * ];
 *
 * const col3 = [
 *  { 'dim1': 'barney', 'met3': 113 },
 *  { 'dim1': 'fred', 'met3': 223 }
 * ];
 *
 * // 按 dim1 合并
 * mergeCollection('dim1', col1, col2, col3);
 *
 * // 按 [dim1] 合并
 * mergeCollection(['dim1'], col1, col2, col3);
 *
 * // 按 (o) => o.dim1 合并
 * mergeCollection((o) => o.dim1, col1, col2, col3);
 */
module.exports = function mergeCollection(keys, baseCollection, ...restCollection) {
  if (!keys || !baseCollection || typeof baseCollection !== "object" && !Array.isArray(baseCollection)) {
    return [];
  }

  function objectEach(object, callback) {
    if (!object || !callback) {
      return;
    }

    if (Array.isArray(object)) {
      object.forEach(callback);
      return;
    }

    if (typeof object === "object") {

      /* eslint no-restricted-syntax: "error" */
      for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          callback(object[key]);
        }
      }
    }
  }

  function isKeysMatch(baseObj, extraObj) {
    if (typeof keys === "function" && keys(baseObj) === keys(extraObj)) {
      return true;
    }

    if (typeof keys === "string" && baseObj[keys] === extraObj[keys]) {
      return true;
    }

    if (Array.isArray(keys) && keys.every(key => baseObj[key] === extraObj[key])) {
      return true;
    }

    return false;
  }

  function colAssign(baseCol, extraCol) {
    const obj = { ...baseCol };
    if (isKeysMatch(baseCol, extraCol)) {

      /* eslint no-restricted-syntax: "error" */
      for (const key in extraCol) {
        if (Object.prototype.hasOwnProperty.call(extraCol, key)) {
          obj[key] = extraCol[key];
        }
      }
    }

    return obj;
  };


  const result = [];
  objectEach(baseCollection, baseCol => {
    let baseObj = { ...baseCol };

    restCollection.forEach(restCol => {
      objectEach(restCol, restObj => {
        baseObj = colAssign(baseObj, restObj);
      });
    });

    result.push(baseObj);
  });

  return result;
};
