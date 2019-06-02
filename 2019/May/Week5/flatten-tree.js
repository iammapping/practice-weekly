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
module.exports = function flatten2tree(flattenArr, id = 'id', pid = 'pid', level = 'level', children = 'children') {
  if(!Array.isArray(flattenArr) || !flattenArr.length) {
    return flattenArr;
  }

  const result = {};
  let maxLevel = 0;
  let minLevel = 0;
  flattenArr.forEach(flattenObj => {
    const currentLevel = flattenObj[level];

    if(maxLevel === 0 || maxLevel < currentLevel) {
      maxLevel = currentLevel;
    }
    if(minLevel === 0 || minLevel > currentLevel) {
      minLevel = currentLevel;
    }

    if(!Array.isArray(result[currentLevel])) {
      result[currentLevel] = [];
    }
    result[currentLevel].push(flattenObj);
  });

  while (maxLevel > minLevel) {
    maxLevel -= 1;

    const parentLevelArr = result[maxLevel];
    const childLevelArr = result[maxLevel + 1];

    if(parentLevelArr && childLevelArr) {
      parentLevelArr.forEach((item, index) => {
        const parentLevelObj = item;
        childLevelArr.forEach(childLevelObj => {
          if(parentLevelObj[id] === childLevelObj[pid]) {
            parentLevelObj[children] = parentLevelObj[children] || [];
            parentLevelObj[children].push(childLevelObj);
          }
        });
        parentLevelArr[index] = parentLevelObj;
      });

      result[maxLevel] = parentLevelArr;
    }
  }

  return result[minLevel];
}
