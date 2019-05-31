const objectAssign = require('object-assign');

function arrayRowsKeyby(keys, arr) {
    const len = keys.length - 1;
    const rs = {};

    arr.forEach(a => {
        let r = rs;
        keys.forEach((key, i) => {
            if(i === len) {
                r[a[key]] = objectAssign({}, a);
            }else {
                if(!r[a[key]]) r[a[key]] = {};
                r = r[a[key]];
            }
        });
    });

    return rs    
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
    if(!Array.isArray(flattenArr) || flattenArr.length === 0) return [];

    const treeArr = [];

    const arrKeyby = arrayRowsKeyby([level, id], flattenArr);
    const descLevels = Object.keys(arrKeyby).sort((a, b) => b - a);

    descLevels.forEach(lev => {
        const pLev = lev - 1;
        Object.keys(arrKeyby[lev]).forEach(idVal => {
            const item = arrKeyby[lev][idVal];
            const pidVal = item[pid];

            if(pidVal === 0 && pLev === 0) { // 此处约定id必须是数字型
                treeArr.push(item);
                return;
            }
            if(!arrKeyby[pLev] || !arrKeyby[pLev][pidVal]) return;
            
            if(!arrKeyby[pLev][pidVal][children]) { arrKeyby[pLev][pidVal][children] = []; }
            arrKeyby[pLev][pidVal][children].push(item);
        });
    });

    return treeArr;
}
