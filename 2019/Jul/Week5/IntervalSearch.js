/**
 * 条件：由于范围是不相交的，所有可以将范围区间进行排序
 * 由条件创建的数据结构：
 * 1、intervalKeyMap：保存所有的范围区间的最小值和最大值，满足intervalKeyMap是一个有序的数列，intervalKeyMap[2i]和intervalKeyMap[2i+1]分别代表范围区间的最小值和最大值
 * 2、intervalValueMap：所有的范围区间对应的value，范围区间与value的下标对应关系为：设value的下标为i， 则intervalKeyMap[2i]和intervalKeyMap[2i+1]分别代表范围区间的最小值和最大值
 * 
 * 证明二分查找可以判断某个数在某个区间中的正确性：
 * 情况一：要查找的数通过二分查找被找到
 *      显而易见，这个数一定是某个区间范围的边界，根据intervalKeyMap的性质，就可以找到这个数所在的范围
 * 情况二：要查找的数没有通过二分查找找到
 *      通过二分查找的过程，我们可以得到被查找这个数在intervalKeyMap中哪两个数之间，根据intervalKeyMap的性质，判断这个数是否在给定的某个范围之间
 */

const Searcher = require('./Searcher.js');

class IntervalSearch extends Searcher{

    constructor(){
        super();
        this.intervalValueMap = [];
        this.intervalKeyMap = [];
    }

    static inInterval(low, high){
        return low % 2 === 0 && high % 2 !== 0;
    }

    binarySearch(target){
        let low = 0;
        let high = this.intervalKeyMap.length - 1;
        while (low <= high){
            let mid = Math.floor( low + (high - low) / 2);
            if(target === this.intervalKeyMap[mid]){
                mid = mid % 2 === 0 ? mid + 1 : mid; // 保证查找的数一定在range中
                return [mid -1 , mid];
            }
            if(target > this.intervalKeyMap[mid]){
                low = mid + 1;
            }else{
                high = mid - 1;
            }
        }
        return [high, low];
    }

    search(target){
        let [low, high] = this.binarySearch(target);
        if(!IntervalSearch.inInterval(low, high)){
            return {};
        }
        if(low === high){
            if(low % 2 === 0){
                high += 1;
            }else{
                low -= 1;
            }
        }
        return {
            interval: [this.intervalKeyMap[low], this.intervalKeyMap[high]],
            value: this.intervalValueMap[low/2]
        }
    }

    add(range, value){
        const [min, max] = range;
        const [minLow, minHigh] = this.binarySearch(min);
        const [maxLow, maxHigh] = this.binarySearch(max);
        const tmpKey  = []; // 重新调整intervalKeyMap，现将数据暂时存到tmpKey 最后将tmpKey赋值到intervalKeyMap
        const tmpValue = [];
        // 设intervalKeyMap为 [3, 5] [8, 11]
        for(let i = 0; i < this.intervalKeyMap.length; i++){
            // 设min = 7 min存在到位置在区间范围之中
            // 当下标i移动到3时，将min插入到tmpKey， 变成[3, 5] [7, 8] [11
            if(i === minHigh && !IntervalSearch.inInterval(minLow, minHigh)){
                tmpKey.push(min);
            }
            // 设min = 4 min存在到位置在区间范围之中
            // 当下标i移动到1时，将min-1和min插入到tmpKey， 变成[3, 3] [4, 5]
            if(i === minHigh && IntervalSearch.inInterval(minLow, minHigh)){
                tmpKey.push(min - 1);
                tmpKey.push(min);
                tmpValue.push(this.intervalValueMap[(i-1)/2]);
            }
            // max和min插入到原理相同
            if(i === maxHigh && !IntervalSearch.inInterval(maxLow, maxHigh)){
                tmpKey.push(max);
                tmpValue.push(value);
            }
            if(i === maxHigh && IntervalSearch.inInterval(maxLow, maxHigh)){
                tmpKey.push(max);
                tmpKey.push(max + 1);
                tmpValue.push(value);
            }
            // 如果min <= intervalKeyMap[i] <= max就不加入tmpKey
            if(minLow >= i || i >= maxHigh){
                tmpKey.push(this.intervalKeyMap[i]);
                if(i % 2 !== 0){
                    tmpValue.push(this.intervalValueMap[(i-1)/2]);
                }
            }
        }
        // 处理特殊值，例如min = 12
        if(minHigh === this.intervalKeyMap.length){
            tmpKey.push(min);
        }

        if(maxHigh === this.intervalKeyMap.length){
            tmpKey.push(max);
            tmpValue.push(value);
        }
        this.intervalKeyMap = tmpKey;
        this.intervalValueMap = tmpValue;
    }

    clear(){
        this.intervalValueMap = [];
        this.intervalKeyMap = [];
    }

    display(){
        let str = '';
        this.intervalKeyMap.forEach((value, key) => {
            if(key % 2 === 0){
                str += '[';
            }
            str += value;
            if(key % 2 !== 0){
                str += '] ';
            }else{
                str += ',';
            }
        });
        // eslint-disable-next-line no-console
        console.log(str);

        // eslint-disable-next-line no-console
        console.log(this.intervalValueMap);
    }
}

module.exports = IntervalSearch;