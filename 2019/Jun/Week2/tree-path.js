const LOOKUPTYPE = {
  // 只搜索叶子节点，即没有 children 的节点
  ONLY_LEAF: 1,
  // 父节点满足，则所有子节点视为满足条件
  ALWAYS_CHILDREN: 2,
  // 父节点满足，则忽略所有子节点
  WITHOUT_CHILDREN: 3,
}

function isMatch(node, predicate) {
  if (typeof predicate === 'object') {
    let m = true;
    Object.keys(predicate).forEach(key => {
      if (typeof predicate[key] === 'function') {
        if (!predicate[key](node[key])) {
           m = false;
        }
      } else if (predicate[key] !== node[key]) {
         m = false;
      }
    });
    return m;
  } 
  
  if (typeof predicate === 'function') {
    return predicate(node);
  } 
  
  return false;
}

function isBreak(node, predicate, lookupType, childAlwaysMatch = false) {
  if (!node.children || node.children.length === 0) return true;
  if (childAlwaysMatch) return false;
  if (lookupType === LOOKUPTYPE.ONLY_LEAF) return false;
  if (lookupType === LOOKUPTYPE.ALWAYS_CHILDREN && isMatch(node, predicate)) return false;
  if (lookupType === LOOKUPTYPE.WITHOUT_CHILDREN && isMatch(node, predicate)) return true;
  return false;
}

function matchNodes(tree, predicate, lookupType, childAlwaysMatch = false) {
  let rs = [];
  const brotherAlwaysMatch = childAlwaysMatch;

  tree.forEach(node => {
    const nd = Object.assign({}, node);
    delete nd.children;
    
    if (!childAlwaysMatch && lookupType === LOOKUPTYPE.ALWAYS_CHILDREN && isMatch(node, predicate)) {
      childAlwaysMatch = true;
    }

    if (!isBreak(node, predicate, lookupType, childAlwaysMatch)) {
      const deepRs = matchNodes(node.children, predicate, lookupType, childAlwaysMatch);
      deepRs.forEach((deepR, i) => {
        deepR.unshift(nd);
      });
      rs = rs.concat(deepRs);
    } else if (brotherAlwaysMatch || isMatch(node, predicate)) {
      rs.push([nd]);
    }
    
  });

  return rs;
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
  return matchNodes(tree, predicate, lookupType);
}

module.exports.LOOKUPTYPE = LOOKUPTYPE;
