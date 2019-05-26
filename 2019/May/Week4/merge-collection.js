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

function assign(targetPar, ...parameters) {
  const target = Object(targetPar);

  parameters.forEach(source => {
    Object.keys(source).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    });
  });

  return target;
};

module.exports = function mergeCollection(keys, baseCollection, ...restCollection) {
  if (!keys || !baseCollection || !restCollection) return baseCollection;

  const result = [];
  let baseColl = baseCollection;
  let restColl = restCollection;
  let keysArr = keys;

  if (typeof keys === 'string') keysArr = [keys];

  if (typeof baseCollection === 'object' && !Array.isArray(baseCollection)) {
    baseColl = Object.values(baseCollection);
  }

  const arrayRestColl = [];
  restColl.forEach(item => {
    if (typeof item === 'object' && !Array.isArray(item)) {
      arrayRestColl.push(Object.values(item));
    }
  });
  if (arrayRestColl.length) restColl = arrayRestColl;

  baseColl.forEach(bi => {
    let biTmp = bi;
    restColl.forEach(rc => {
      rc.forEach(ri => {
        let match = false;

        if (typeof keysArr === 'object' && Array.isArray(keysArr) && keysArr.every(key => (biTmp[key] === ri[key]))) match = true;

        if (typeof keysArr === 'function' && (keysArr(ri) === keysArr(biTmp))) match = true;

        if (match) biTmp = assign(biTmp, ri);
      });
    });
    result.push(biTmp);
  });

  return result;
};
