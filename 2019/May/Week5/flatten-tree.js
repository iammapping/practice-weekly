/**
 * 平面结构转树结构
 * @param   {array}     flattenArr 平面数组
 * @param   {string}    id 数组元素索引名称
 * @param   {string}    pid 数组父元素索引名称
 * @param   {string}    level 数组元素层级名称
 * @param   {string}    children 树结构子节点名称
 *
 * @example
 * 平面结构:
 * [
 *   {id: 1, pid: 0, name: 'a', level: 1},
 *   {id: 2, pid: 0, name: 'b', level: 1},
 *   {id: 3, pid: 1, name: 'aa', level: 2},
 *   {id: 4, pid: 1, name: 'ab', level: 2}
 * ]
 * 树结构:
 * [
 *   {
 *     id: 1,
 *     pid: 0,
 *     name: 'a',
 *     level: 1,
 *     children: [
 *       {id: 3, pid: 1, name: 'aa', level: 2},
 *       {id: 4, pid: 1, name: 'ab', level: 2}
 *     ]
 *   },
 *   {
 *     id: 2,
 *     pid: 0,
 *     name: 'b',
 *     level: 1
 *   }
 * ]
 */
module.exports = function flatten2tree(
  flattenArr,
  id = 'id',
  pid = 'pid',
  level = 'level',
  children = 'children'
) {
  if (!Array.isArray(flattenArr) || !flattenArr.length) {
    return flattenArr;
  }

  const result = {};
  let maxLevel = 0;
  let minLevel = 0;
  flattenArr.forEach(item => {
    const currentLevel = item[level];

    if (maxLevel === 0 || maxLevel < currentLevel) {
      maxLevel = currentLevel;
    }
    if (minLevel === 0 || minLevel > currentLevel) {
      minLevel = currentLevel;
    }

    result[currentLevel] = result[currentLevel] || {};
    result[currentLevel][item[id]] = item;
  });

  while (maxLevel > minLevel) {
    maxLevel -= 1;

    const parentLevelObj = result[maxLevel];
    const childLevelObj = result[maxLevel + 1];

    Object.keys(childLevelObj).forEach(key => {
      const pidValue = childLevelObj[key][pid];
      parentLevelObj[pidValue] = parentLevelObj[pidValue] || {};
      parentLevelObj[pidValue][children] = parentLevelObj[pidValue][children] || [];
      parentLevelObj[pidValue][children].push(childLevelObj[key]);
    });

    result[maxLevel] = parentLevelObj;
  }

  return Object.values(result[minLevel]);
};
