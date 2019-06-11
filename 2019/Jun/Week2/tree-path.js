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
  const result = [];

  if (!Array.isArray(tree) || !tree.length || ['function', 'object'].indexOf(typeof predicate) < 0) {
    return result;
  }

  function checkItem(itemObj) {
    let isMatched = true;

    if (typeof predicate === 'object') {
      Object.keys(predicate).forEach(key => {
        if (typeof predicate[key] === 'function') {
          if (!predicate[key](itemObj[key])) {
            isMatched = false;
          }
        } else if (predicate[key] !== itemObj[key]) {
          isMatched = false;
        }
      })
    }

    if (typeof predicate === 'function') {
     if (!predicate(itemObj)) {
       isMatched = false;
     }
    }

    return isMatched;
  }

  function addMatchedItem(treeArr, currentIndex, resultItem, needCheck = true) {
    const tmpResultItem = resultItem.concat();

    treeArr.forEach(item => {
      const tmpItem = Object.assign({}, item);
      const childrenArr = tmpItem.children;

      delete tmpItem.children;
      tmpResultItem[currentIndex] = tmpItem;

      const isMatched = checkItem(tmpItem);
      const isHasChildren = childrenArr && Array.isArray(childrenArr);

      if (lookupType === LOOKUPTYPE.ONLY_LEAF) {
        if (isHasChildren) {
          addMatchedItem(childrenArr, currentIndex + 1, tmpResultItem);
        } else if (isMatched) {
          result.push(tmpResultItem.concat());
        }
      }

      if (lookupType === LOOKUPTYPE.WITHOUT_CHILDREN) {
        if (isMatched) {
          result.push(tmpResultItem.concat());
        } else if (isHasChildren){
          addMatchedItem(childrenArr, currentIndex + 1, tmpResultItem);
        }
      }

      if (lookupType === LOOKUPTYPE.ALWAYS_CHILDREN) {
        if (needCheck) {
          if (isMatched) {
            if (isHasChildren) {
              addMatchedItem(childrenArr, currentIndex + 1, tmpResultItem, false);
            } else {
              result.push(tmpResultItem.concat());
            }
          } else if (isHasChildren){
            addMatchedItem(childrenArr, currentIndex + 1, tmpResultItem);
          }
        }

        if (!needCheck) {
          if (isHasChildren) {
            addMatchedItem(childrenArr, currentIndex + 1, tmpResultItem, false);
          } else {
            result.push(tmpResultItem.concat());
          }
        }
      }
    })
  }

  addMatchedItem(tree, 0, []);

  return result;
}

module.exports.LOOKUPTYPE = LOOKUPTYPE;
