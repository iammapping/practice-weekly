function MaxHeap(data) {

    this.heap = data || [];

    function init() {
        let length = this.heap.length;
        let currPos = Math.floor((length - 2) / 2);
        while (currPos >= 0){
            shif_down(currPos, length - 1);
            currPos--;
        }
    }

    function shif_down(start, length) {
        let parentIndex = start;
        let maxChildIndex = parentIndex * 2 + 1;;
        while (maxChildIndex <= length){
            if(maxChildIndex < length && this.heap[maxChildIndex] < this.heap[maxChildIndex + 1]){
                maxChildIndex += 1;
            }
            if(this.heap[parentIndex] >= this.heap[maxChildIndex]){
                break;
            }else {
                swap(parentIndex, maxChildIndex);
                parentIndex = maxChildIndex;
                maxChildIndex = maxChildIndex * 2 + 1
            }
        }
    }

    function swap(parentIndex, maxChildIndex){
        const temp = this.heap[parentIndex];
        this.heap[parentIndex] = this.heap[maxChildIndex];
        this.heap[maxChildIndex] = temp;
    }

    this.insert = function (element) {
        this.heap.push(element);
        shif_up(this.heap.length);
    };

    function shif_up(start) {
        let childIndex=start;   //当前叶节点
        let parentIndex=Math.floor((childIndex-1)/2); //父节点

        while (childIndex>0){
            //如果大就不交换
            if(heap[parentIndex]>=heap[childIndex]){
                break;
            }else {
                let temp=heap[parentIndex];
                heap[parentIndex]=heap[childIndex];
                heap[childIndex]=temp;
                childIndex=parentIndex;
                parentIndex=Math.floor((parentIndex-1)/2);
            }
        }
    }

    /**
     * 移除根元素，并返回根元素数据
     *
     * @returns {*} data 根元素的数据值
     */
    this.removeRoot = function () {
        if(currSize<=0){
            return null;
        }
        let maxValue=heap[0];
        heap[0]=heap[currSize];
        currSize--;
        shif_down(0, currSize-1);
        return maxValue;
    };

    init();

}

/**
 * 二叉树节点构造函数
 * @class
 * @param {*} data
 */
function BinaryTreeNode(data) {

    this.data = data;

    this.parent = null;

    this.leftChild = null;
    this.rightChild = null;

}

const maxHeap = new MaxHeap();

const initDataArray = [];
for (let index = 0; index < 5; index++) {

    const value = 5 + 95 * Math.random();

    if (-1 === initDataArray.indexOf(value)) {
        // 没有重复值
        initDataArray.push(value);
        if (!maxHeap.insert(value)) {
            // 插入失败，重新生成一个
            index--;
        }
    } else {
        // 重复了，重新生成一个
        index--;
    }

}
console.log('init array = ', initDataArray);


const max1 = maxHeap.removeRoot();
console.log('max1', max1);

const max2 = maxHeap.removeRoot();
console.log('max2', max2);

const max3 = maxHeap.removeRoot();
console.log('max3', max3);