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
  const nodeByPid = {};
  const tree = [];

  let minLevel = 1;

  function assignChildren(source) {
    const node = source;
    if (node[level] === minLevel) {
      tree.push(node);
    }

    if (node[id] in nodeByPid) {
      node[children] = nodeByPid[node[id]];
    }
  }

  flattenArr.forEach(node => {
    const nodeLevel = node[level];
    const nodePid = node[pid];

    if (nodeLevel < minLevel) {
      minLevel = nodeLevel;
    }

    if (!Array.isArray(nodeByPid[nodePid])) {
      nodeByPid[nodePid] = [];
    }

    nodeByPid[nodePid].push({...node});
  });

  /* eslint no-restricted-syntax: "error" */
  for (const nodePid in nodeByPid) {
    if (Object.prototype.hasOwnProperty.call(nodeByPid, nodePid)) {
      nodeByPid[nodePid].forEach(assignChildren);
    }
  }

  return tree;
};
