function toTree(classifyArr, lv, pid, idName, pidName, childrenName) {
  const tree = [];

  const currentLvArr = classifyArr[lv]
  if (!currentLvArr || currentLvArr.length === 0) return tree;

  currentLvArr.forEach(item => {
    if (lv === 1 || item[pidName] === pid) {
      const temp = toTree(classifyArr, lv + 1, item[idName], idName, pidName, childrenName);
      if (temp.length > 0) {
        // eslint-disable-next-line no-param-reassign
        item[childrenName] = temp;
      }
      tree.push(item);
    }
  })
  return tree;
}

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
  const classifyArr = []
  flattenArr.forEach(item => {
    const lv = item[level]
    if (classifyArr[lv]) {
      classifyArr[lv].push(item)
    } else {
      classifyArr[lv] = [item]
    }
  })

  return toTree(classifyArr, 1, 0, id, pid, children);
}
