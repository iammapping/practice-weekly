// const objectAssign = require('object-assign');

function objectMerge(obj1, obj2) {
    const r = obj1;
    Object.keys(obj2).forEach(key => {
        r[key] = obj2[key];
    });
    return r;
}

function getCollFromKeybyGroup(keys, keybyGroup) {
    const l = keys.length - 1;
    let group = keybyGroup;
    let r = [];
    keys.forEach((key, i) => {
        if(l === i){
            r = group[key] || [];
        }else {
            group = group[key] || {};
        }
    });
    return r;
}

function getValueKeys(obj, keys) {
    const valueKeys = [];
    if(Array.isArray(keys)) {
        keys.forEach(key => {
            valueKeys.push(obj[key]);
        });
    }else if(typeof keys === 'function') {
        valueKeys.push(keys(obj))
    }
    return valueKeys;
}

function arrayRowsKeybyGroup(keys, arr) {
    const l = keys.length - 1;
    const rs = {};

    if(Array.isArray(keys)) {
        arr.forEach(a => {
            let r = rs;
            keys.forEach((key, i) => {
                if(r[a[key]]) {
                    if(i === l) {
                        r[a[key]].push(a);
                    }else {
                        r = r[a[key]];
                    }
                }else if(i === l) {
                    r[a[key]] = [a];
                }else {
                    r[a[key]] = {};
                    r = r[a[key]];
                }
                
            });
        });
    }else if(typeof keys === 'function') {
        arr.forEach(a => {
            const key = keys(a);
            if(rs[key]) {
                rs[key].push(a);
            }else {
                rs[key] = [a];
            }
        });
        
    }

    return rs    
}

/**
 * 按指定键合并多个集合
 *
 * @param {String|Array<String>|Function} keys 指定的键
 * @param {Array|Object} collection 用于合并的基础集合
 * @param {Array|Object} restCollection 用于合并的其他集合
 * @returns {Array} 返回合并后的集合
 *
 * @example
 *
 * const col1 = [
 *   { 'dim1': 'barney', 'met1': 123 },
 *   { 'dim1': 'fred', 'met1': 456 }
 * ];
 *
 * const col2 = [
 *   { 'dim1': 'barney', 'met2': 111 },
 *   { 'dim1': 'fred', 'met2': 222 }
 * ];
 *
 * const col3 = [
 *  { 'dim1': 'barney', 'met3': 113 },
 *  { 'dim1': 'fred', 'met3': 223 }
 * ];
 *
 * // 按 dim1 合并
 * mergeCollection('dim1', col1, col2, col3);
 *
 * // 按 [dim1] 合并
 * mergeCollection(['dim1'], col1, col2, col3);
 *
 * // 按 (o) => o.dim1 合并
 * mergeCollection((o) => o.dim1, col1, col2, col3);
 */
module.exports = function mergeCollection(keys, baseCollection, ...restCollection) {
    if(!baseCollection || (!Array.isArray(baseCollection) && typeof baseCollection !== 'object' )) {
        return [];
    }

    let baseColl = baseCollection;
    if(!Array.isArray(baseCollection)) {
        baseColl = Object.values(baseCollection);
    }

    if(!keys) return baseCollection;
    if(!restCollection || (!Array.isArray(restCollection) && typeof restCollection !== 'object' )) return baseCollection;

    let rkeys = keys;
    if(typeof rkeys === 'string') {
        rkeys = [rkeys];
    }

    let restColl = [];
    restCollection.forEach(o => {
        if(Array.isArray(o)) {
            restColl = restColl.concat(o);
        }else {
            restColl = restColl.concat(Object.values(o));
        }
    });

    const allColl = baseColl.concat(restColl);
    const allCollKeybyGroup = arrayRowsKeybyGroup(rkeys, allColl);

    const rs = [];
    baseColl.forEach(o => {
        const groupKeys = getValueKeys(o, rkeys);
        const coll = getCollFromKeybyGroup(groupKeys, allCollKeybyGroup);
        if(coll.length > 1) {
            let r = {};
            coll.forEach(c => {
                // r = Object.assign(r, c);
                // r = objectAssign(r, c);
                r = objectMerge(r, c);
            });
            rs.push(r);
        }else {
            rs.push(o);
        }
    });

    return rs;
};