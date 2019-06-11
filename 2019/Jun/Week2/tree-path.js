/* eslint-disable no-restricted-syntax */
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
  function isMatch(node, pred) {
    if (typeof pred === "function") {
      return pred(node);
    }

    if (typeof pred === "object") {
       let match = false;

       /** eslint no-restricted-syntax: "error" */
       for (const k in pred) {
         if (Object.prototype.hasOwnProperty.call(pred, k)) {
           if (typeof pred[k] === "function") {
             match = pred[k](node[k]);
           } else {
             match = node[k] === pred[k];
           }
         }
       }

       return match;
    }

    return false;
  }

  function getParent(node, path) {
    let parentIndex = -1;
    const parent = path.find((sp, si) => {
      const last = sp[sp.length - 1] || [];
      if (last && last.id === node.pid) {
        parentIndex = si;
        return true;
      }
      return false;
    });

    return [parent, parentIndex];
  }

  function getPath(nodes, pred) {
    const stack = [...nodes];
    const path = [];
    const pathIndex = [];

    while (stack.length) {
      const node = stack.pop();
      const { pid, id, level, name } = node;
      const newNode = { pid, id, level, name };
      const [parent, parentIndex] = getParent(newNode, path);

      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          stack.push(node.children[i]);

          let index = -1;
          const match = isMatch(newNode, pred);
          if (parentIndex !== -1) {
            if (i === 0) {
              path[parentIndex] = [...parent, newNode];
            } else {
              path.push([...parent, newNode]);
            }

            index = parentIndex;
          } else {
            path.push([newNode]);
            index = path.length -1;
          }

          if (lookupType === LOOKUPTYPE.ALWAYS_CHILDREN && match) {
            pathIndex.push(index);
          }

          if (lookupType === LOOKUPTYPE.WITHOUT_CHILDREN && match) {
            pathIndex.push(index);
            break;
          }
        }

        // eslint-disable-next-line no-continue
        continue;
      }


      let index = -1;
      if (parent && lookupType !== LOOKUPTYPE.WITHOUT_CHILDREN) {
        parent.push(newNode);
        index = parentIndex;
      } else {
        path.push([newNode]);
        index = path.length -1;
      }

      if (lookupType === LOOKUPTYPE.ONLY_LEAF && isMatch(newNode, pred)) {
        pathIndex.push(index);
      }
    }

    const result = [];
    while (pathIndex.length) {
      result.push(path[pathIndex.pop()]);
    }

    return result;
  }

  return getPath(tree, predicate)
};

module.exports.LOOKUPTYPE = LOOKUPTYPE;
