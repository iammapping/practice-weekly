const LOOKUPTYPE = {
  // 只搜索叶子节点，即没有 children 的节点
  ONLY_LEAF: 1,
  // 父节点满足，则所有子节点视为满足条件
  ALWAYS_CHILDREN: 2,
  // 父节点满足，则忽略所有子节点
  WITHOUT_CHILDREN: 3,
}

/**
 * 查找符合条件的树节点路径
 * @param   {array}     tree 树
 * @param   {object|function}    predicate 节点过滤条件
 * @returns {array} 路径数组
 *
 * @example
 * 树结构:
 * [
 *   {
 *     id: 1,
 *     pid: 0,
 *     name: 'a',
 *     level: 1,
 *     children: [
 *       { id: 3, pid: 1, name: 'aa', level: 2 },
 *       { id: 4, pid: 1, name: 'ab', level: 2 }
 *     ]
 *   },
 *   {
 *     id: 2,
 *     pid: 0,
 *     name: 'b',
 *     level: 1
 *   }
 * ]
 * 按对象 { id: 3 } 查找:
 * [
 *   [ { id: 1, pid: 0, name: 'a', level: 1 }, { id: 3, pid: 1, name: 'aa', level: 2 } ]
 * ]
 * 按对象方法 { name: n => n.indexOf('a') > -1 } 查找:
 * [
 *   [ { id: 1, pid: 0, name: 'a', level: 1 }, { id: 3, pid: 1, name: 'aa', level: 2 } ],
 *   [ { id: 1, pid: 0, name: 'a', level: 1 }, { id: 4, pid: 1, name: 'ab', level: 2 } ]
 * ]
 * 按方法 node => node.level === 2 查找:
 * [
 *   [ { id: 1, pid: 0, name: 'a', level: 1 }, { id: 3, pid: 1, name: 'aa', level: 2 } ],
 *   [ { id: 1, pid: 0, name: 'a', level: 1 }, { id: 4, pid: 1, name: 'ab', level: 2 } ]
 * ]
 */
module.exports = function lookupTreePath(tree, predicate, lookupType = LOOKUPTYPE.ONLY_LEAF) {
  if (!tree) return [];

  const lutp = lookupType;
  let predicateFn = predicate;
  const paths = [];

  if (typeof predicate === 'object') {
    predicateFn = node => Object.keys(predicate).every(key => (typeof predicate[key] === 'function' ? predicate[key](node[key]) : node[key] === predicate[key]));
  }

  function passTree(node, path) {
    const currentNode = JSON.parse(JSON.stringify(node));
    if (currentNode.children) delete currentNode.children;
    path.push(currentNode);

    if (lutp === LOOKUPTYPE.ONLY_LEAF && !node.children && predicateFn(node)) {
      paths.push(path);
      return;
    }

    if (lutp === LOOKUPTYPE.ALWAYS_CHILDREN && node.children && predicateFn(node)) {
      node.children.forEach(cNode => {
        paths.push([].concat(path, [cNode]));
      });

      return;
    }

    if (lutp === LOOKUPTYPE.WITHOUT_CHILDREN && node.children && predicateFn(node)) {
      paths.push([currentNode]);
      return;
    }

    if (node.children) {
      node.children.forEach(cNode => {
        const newPatch = [].concat(path);
        passTree(cNode, newPatch);
      });
    }
  }

  tree.forEach(node => {
    const path = [];
    passTree(node, path);
  });

  return paths;
}

module.exports.LOOKUPTYPE = LOOKUPTYPE;
