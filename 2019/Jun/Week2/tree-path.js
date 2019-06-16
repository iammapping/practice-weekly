/* eslint-disable no-restricted-syntax */
const LOOKUPTYPE = {
  // 只搜索叶子节点，即没有 children 的节点
  ONLY_LEAF: 1,
  // 父节点满足，则所有子节点视为满足条件
  ALWAYS_CHILDREN: 2,
  // 父节点满足，则忽略所有子节点
  WITHOUT_CHILDREN: 3,
};

function correspond(object, predicate) {
  if (typeof predicate === 'function') {
    return predicate(object);
  }

  let isConrrespond = true;
  // eslint-disable-next-line no-restricted-syntax
  for (const key in predicate) {
    if (Object.prototype.hasOwnProperty.call(predicate, key)) {
      const val = predicate[key];
      if (typeof val === 'function') {
        if (!val(object[key])) {
          isConrrespond = false;
          break;
        }
      } else if (object[key] !== val) {
        isConrrespond = false;
        break;
      }
    }
  }

  return isConrrespond;
}

function toPath(retArr, tree, prePath, predicate, lookupType) {
  tree.forEach(item => {
    const cloneItem = { ...item };
    delete cloneItem.children;

    const currentPath = [...prePath];
    currentPath.push(cloneItem);
    if (lookupType === LOOKUPTYPE.WITHOUT_CHILDREN) {
      if (correspond(item, predicate)) {
        retArr.push(currentPath);
      }
    } else if (lookupType === LOOKUPTYPE.ALWAYS_CHILDREN) {
      // 此节点满足，则此节点下的叶子节点全部满足
      if (correspond(item, predicate)) {
        toPath(retArr, item.children, currentPath, () => true, LOOKUPTYPE.ONLY_LEAF);
      }
    } else if (lookupType === LOOKUPTYPE.ONLY_LEAF) {
      if (item.children) {
        toPath(retArr, item.children, currentPath, predicate, lookupType);
      } else if (correspond(item, predicate)) {
        retArr.push(currentPath);
      }
    }
  });
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
  const retArr = [];
  toPath(retArr, tree, [], predicate, lookupType);
  return retArr;
};

module.exports.LOOKUPTYPE = LOOKUPTYPE;
