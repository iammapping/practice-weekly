module.exports = class Heap{

    constructor(data, comparator){
        this.heap = ['']; // 第一个元素留空 元素i的左孩子为2i，右孩子为2i+1
        this.heap = this.heap.concat(data);

        this.comparator = comparator || ((a, b) => a - b);
        this.init();
    }

    get length(){
        return this.heap.length - 1;
    }

    init(){
        let { length } = this;
        let current = Math.ceil((length - 1) / 2);
        while(current > 0){
            this.shiftDown(current, length--);
            current--;
        }
    }

    insert(element){
        this.heap.push(element);
        this.shiftUp(this.length);
    }

    get max(){
        return this.length > 0 ? this.heap[1] : NaN;
    }

    removeRoot(){
        if(this.length === 0){
            return null;
        }
        const maxValue = this.heap[1];
        this.heap[1] = this.heap.pop();
        this.shiftDown(1, this.length);
        return maxValue;
    }

    shiftDown(start, length){
        let parent = start;
        let maxChild = parent * 2;
        while (maxChild <= length){
            if(maxChild < length && this.comparator(this.heap[maxChild], this.heap[maxChild + 1]) < 0){
                maxChild += 1;
            }
            if(this.comparator(this.heap[parent], this.heap[maxChild]) >= 0){
                break;
            }else {
                this.swap(parent, maxChild);
                parent = maxChild;
                maxChild *= 2;
            }
        }
    }

    shiftUp(start){
        let child = start;
        let parent = Math.ceil((child - 1) /2);
        while (parent > 0){
            if(this.comparator(this.heap[parent], this.heap[child]) >= 0){
                break;
            }else {
                this.swap(parent, child);
                child = parent;
                parent = Math.floor((parent - 1) / 2);
            }
        }
    }

    swap(key1, key2){
        const temp = this.heap[key1];
        this.heap[key1] = this.heap[key2];
        this.heap[key2] = temp;
    }

};
