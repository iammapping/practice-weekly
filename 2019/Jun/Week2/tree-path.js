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

    function check(itemObj) {
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

    function searchPath (treeArr, index, resultItem, needCheck = true) {
        const childrenItems = resultItem.concat();

        if (lookupType === LOOKUPTYPE.ONLY_LEAF) {
            treeArr.forEach(item => {
                const copyItem = Object.assign({}, item);
                const childrenArr = copyItem.children;

                delete copyItem.children;
                childrenItems[index] = copyItem;

                if (childrenArr && Array.isArray(childrenArr)) {
                    searchPath(childrenArr, index + 1, childrenItems);
                } else if (check(copyItem)) {
                    result.push(childrenItems.concat());
                }
            })
        }

        if (lookupType === LOOKUPTYPE.ALWAYS_CHILDREN) {
            treeArr.forEach(item => {
                const copyItem = Object.assign({}, item);
                const childrenArr = copyItem.children;

                delete copyItem.children;
                childrenItems[index] = copyItem;

                if (!needCheck) {
                    if (childrenArr && Array.isArray(childrenArr)) {
                        searchPath(childrenArr, index + 1, childrenItems, false);
                    } else {
                        result.push(childrenItems.concat());
                    }
                }

                if (needCheck) {
                    if (check(copyItem)) {
                        if (childrenArr && Array.isArray(childrenArr)) {
                            searchPath(childrenArr, index + 1, childrenItems, false);
                        } else {
                            result.push(childrenItems.concat());
                        }
                    } else if (childrenArr && Array.isArray(childrenArr)){
                        searchPath(childrenArr, index + 1, childrenItems);
                    }
                }
            })
        }

        if (lookupType === LOOKUPTYPE.WITHOUT_CHILDREN) {
            treeArr.forEach(item => {
                const copyItem = Object.assign({}, item);
                const childrenArr = copyItem.children;

                delete copyItem.children;
                childrenItems[index] = copyItem;

                if (check(copyItem)) {
                    result.push(childrenItems.concat());
                } else if (childrenArr && Array.isArray(childrenArr)){
                    searchPath(childrenArr, index + 1, childrenItems);
                }
            })
        }
    }

    searchPath(tree, 0, []);

    return result;
}

module.exports.LOOKUPTYPE = LOOKUPTYPE;
