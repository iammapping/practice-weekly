function getMergedObject(keys, baseObj, distObject) {

  if (Array.isArray(keys)) {
    let isFit = true;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (distObject[key] !== baseObj[key]) {
        isFit = false;
        break;
      }
    }
    if (isFit) {
      return { ...baseObj, ...distObject }
    }
  } else if (typeof keys === 'string') {
    if (distObject[keys] === baseObj[keys]) {
      return { ...baseObj, ...distObject }
    }
  } else if (typeof keys === 'function') {
    const val = keys(baseObj)
    if (val && keys(distObject) === val) {
      return { ...baseObj, ...distObject }
    }
  }

  return baseObj
};

function mergeObject(retArr, keys, baseObj, restCollection) {
  let cloneBaseObj = { ...baseObj }

  restCollection.forEach(distCollection => {
    if (Array.isArray(distCollection)) {
      distCollection.forEach(distObject => {
        cloneBaseObj = getMergedObject(keys, cloneBaseObj, distObject)
      })

    } else if (Object.prototype.toString.call(distCollection) === '[object Object]') {
      Object.values(distCollection).forEach(distObject => {
        cloneBaseObj = getMergedObject(keys, cloneBaseObj, distObject)
      })
    }
  })

  retArr.push(cloneBaseObj)
};

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
 *
 *
 *
 *
 *
 */

module.exports = function mergeCollection(keys, baseCollection, ...restCollection) {
  const arr = [];

  Object.values(baseCollection).forEach((baseCollectionItem) => {
    const arrItem = baseCollectionItem;
      restCollection.forEach(restCollectionItem => {
          Object.values(restCollectionItem).forEach((restItem) => {
              let matched = true;
              if (typeof keys === 'function') {
                  if(keys(baseCollectionItem) !== keys(restItem)) {
                    matched = false;
                  }
              } else if (typeof keys === 'string') {
                if(baseCollectionItem[keys] !== restItem[keys]) {
                  matched = false;
                }
              } else {
                keys.forEach((key) => {
                  if(baseCollectionItem[key] !== restItem[key]) {
                    matched = false;
                  }
                });
              }

              if(matched) {
                Object.keys(restItem).forEach((restKey) => {
                  arrItem[restKey] = restItem[restKey];
                });
              }
          })
      });
      arr.push(arrItem);
  });

  return arr;
};
