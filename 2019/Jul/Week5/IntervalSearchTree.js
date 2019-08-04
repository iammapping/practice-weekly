const Searcher = require('./Searcher.js');

function Node(min , max, value){
    this.leftLimit = min;
    this.rightLimit = max;
    this.value = value;
    this.left = null;
    this.right = null;
}

class IntervalSearchTree extends Searcher{

    constructor(){
        super();
        this.root = null;
    }

    add(range, value){
        const [min, max] = range;
        if(this.root === null){
            this.root = new Node(min, max, value);
        }else{
            IntervalSearchTree.insert(min, max, value, this.root);
        }
    }

    search(target){
        return IntervalSearchTree.find(target, this.root);
    }

    display(){
        // eslint-disable-next-line no-console
        console.log(this.root);
    }

    clear(){
        this.root = null;
    }

    static insert(min, max, value, root){
        // 设root = [20, 30]
        // 设max = 10 满足该条件
        // root的区间                    min=20|--------|max=30
        // 插入节点的区间   ++++++|max=10
        if(root.leftLimit > max){
            if(root.left === null){
                root.left = new Node(min, max, value);
            }else{
                IntervalSearchTree.insert(min, max, value, root.left);
            }
        }
        // 设min = 40 满足该条件
        // root的区间                    min=20|--------|max=30
        // 插入节点的区间                                        min=40|++++++
        else if(root.rightLimit < min){
            if(root.right === null){
                root.right = new Node(min, max, value);
            }else{
                IntervalSearchTree.insert(min, max, value, root.right);
            }
        }
        //  设min = 22 max = 25 满足该条件
        // root的区间                    min=20|--------|max=30
        // 插入节点的区间                  min=22|+++++|max=25
        else if(root.leftLimit < min && max < root.rightLimit){
            const {leftLimit, rightLimit, left, right} = root;
            root.left = new Node(leftLimit, min - 1, root.value);
            root.left.left = left;
            root.right = new Node(max + 1, rightLimit, root.value);
            root.right.right = right;
            root.leftLimit = min;
            root.rightLimit = max;
            root.value = value;
        }
        // 设min = 10 max = 25 满足该条件
        // root的区间                    min=20|--------|max=30
        // 插入节点的区间        min=10|++++++++++++|max=25
        else if((root.leftLimit <= max && max < root.rightLimit) && min < root.leftLimit ){
            root.leftLimit = max + 1;
            if(root.left === null){
                root.left = new Node(min, max, value);
            }else{
                IntervalSearchTree.insert(min, max, value, root.left);
            }
        }
        // 设min = 25 max = 40 满足该条件
        // root的区间                    min=20|--------|max=30
        // 插入节点的区间                      min=25|++++++++++++|max=40
        else if((root.leftLimit < min && min <= root.rightLimit) && root.rightLimit < max){
            root.rightLimit = min - 1;
            if(root.right === null){
                root.right = new Node(min, max, value);
            }else{
                IntervalSearchTree.insert(min, max, value, root.right);
            }
        }
        // 设min = 10 max = 40 满足该条件
        // root的区间                    min=20|--------|max=30
        // 插入节点的区间           min=10|+++++++++++++++++++|max=40
        else if(root.leftLimit >= min && root.rightLimit <= max){
            const interval = IntervalSearchTree.findLeftInterval(min, root.left).concat(IntervalSearchTree.findRightInterval(max, root.right));
            root = new Node(min, max, value);
            interval.forEach(node => {
                IntervalSearchTree.insert(node.min, node.max, node.value, root);
            })
        }
    }

    static find(target, root){
        if(root === null){
            return {};
        }
        if(target < root.leftLimit){
            return IntervalSearchTree.find(target, root.left)
        }
        if(target > root.rightLimit){
            return IntervalSearchTree.find(target, root.right)
        }
        return {
            interval: [root.leftLimit, root.rightLimit],
            value: root.value
        }
    }

    static travelTree(root, cbFn){
        let head = 0;
        let tail = 0;
        let tmp = null;
        const queue = [];
        if(root !== null){
            queue[head] = root;
            tail++;
        }else{
            return;
        }
        while(head < tail){
            tmp = queue[head++];
            cbFn(tmp);
            if(tmp.left !== null){
                queue[tail++] = tmp.left;
            }
            if(tmp.right !== null){
                queue[tail++] = tmp.right;
            }
        }
    }

    static findLeftInterval(target, root){
        const interval = [];
        IntervalSearchTree.travelTree(root, (node) => {
            if(node.rightLimit < target){
                interval.push({
                    min: node.leftLimit,
                    max: node.rightLimit,
                    value: node.value
                })
            }else if(node.leftLimit < target){
                interval.push({
                    min: node.leftLimit,
                    max: target -1,
                    value: node.value
                })
            }
        });
        return interval;
    }

    static findRightInterval(target, root){
        const interval = [];
        IntervalSearchTree.travelTree(root, (node) => {
            if(node.leftLimit > target){
                interval.push({
                    min: node.leftLimit,
                    max: node.rightLimit,
                    value: node.value
                })
            }else if(node.rightLimit > target){
                interval.push({
                    min: target + 1,
                    max: node.rightLimit,
                    value: node.value
                })
            }
        });
        return interval;
    }
}

module.exports = IntervalSearchTree;