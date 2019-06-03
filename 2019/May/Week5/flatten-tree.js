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
  const tree = [];

  function getNodeByID(node, idVal, idAlias) {
    if (node[idAlias] === idVal) {
      return node;
    }

    if (node[children]) {
      let result = null;
      node[children].forEach(item => {
        if (!result) {
          result = getNodeByID(item, idVal, idAlias);
        }
      });

      return result;
    }

    return null;
  }

  function findNode(idVal, idAlias) {
    let node = null;
    tree.forEach(t => {
      if (!node) {
        node = getNodeByID(t, idVal, idAlias);
      }
    });

    return node;
  }

  flattenArr.forEach(node => {
    const treeNode = {
      name: node.name,
      [id]: node[id],
      [pid]: node[pid],
      [level]: node[level],
    };

    if (node[level] === 1 && node[pid] === 0) {
      tree.push(treeNode);
    } else {
      const parent = findNode(node[pid], id);

      if (parent) {
        if (!parent[children]) {
          parent[children] = [treeNode];
        } else {
          parent[children].push(treeNode);
        }
      }
    }
  });

  return tree;
};
