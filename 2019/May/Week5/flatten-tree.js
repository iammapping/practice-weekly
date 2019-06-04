function toTree(arr, pid, idKey, pidKey, levelKey, childrenKey) {
    const children = [];
    arr.forEach(item => {
        if(item[pidKey] === pid) {
            const newItem = item;
            const arr1 = [...arr];
            const childrens = toTree(arr1, item[idKey], idKey, pidKey, levelKey, childrenKey);
            if(childrens.length !== 0) {
                newItem[childrenKey] = childrens;
            }
            children.push(newItem);
        }
    });
    return children;
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

    const result = [];
    // const maxLeve = flattenArr[flattenArr.length - 1][level];

    flattenArr.forEach(item => {
        if(item[level] === 1) {
            const newItem = item;
            const flattenArr1 = [...flattenArr];
            const childrens = toTree(flattenArr1, item[id], id, pid, level, children);
            if(childrens.length !== 0) {
                newItem[children] = childrens;
            }
            result.push(newItem);
        }
    });

    return result;
}


