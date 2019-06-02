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
  if (!Array.isArray(flattenArr)) {
    return [];
  }

  let maxLevel = 0;
  let minLevel = 0;

  flattenArr.forEach(item => {
    if (maxLevel === 0 || item[level] > maxLevel) {
      maxLevel = item[level];
    }

    if (minLevel === 0 || item[level] < minLevel) {
      minLevel = item[level];
    }
  });

  let nowLevel = maxLevel;
  let currentLevelNodes = [];
  let lastLevelNodes = [];

  function buildData() {
    lastLevelNodes = currentLevelNodes;
    currentLevelNodes = [];

    flattenArr.forEach(it => {
      const item = it;

      if (item[level] !== nowLevel) return;

      const node = item[id];
      const pNode = item[pid];

      if (lastLevelNodes[node]) {
        item[children] = lastLevelNodes[node];
      }

      if (!currentLevelNodes[pNode]) {
        currentLevelNodes[pNode] = [];
      }

      currentLevelNodes[pNode].push(item);
    });

    nowLevel -= 1;
  }

  while (nowLevel > (minLevel - 1)) { // 2 > 0
    buildData();
  }

  let tree = [];
  currentLevelNodes.forEach(nodes => {
    tree = tree.concat(nodes);
  });

  return tree;
}
