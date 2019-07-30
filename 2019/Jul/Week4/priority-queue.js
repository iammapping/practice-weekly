class Node {
  constructor(value, left, right) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

function treeAddNode(root, node, comparator){
  if(comparator(root.value, node.value) > 0){
    if(root.right === null) {
      root.right = node;
    }else {
      treeAddNode(root.right, node, comparator);
    }
  }else if(root.left === null) {
    root.left = node;
  }else {
    treeAddNode(root.left, node, comparator);
  }
}

function getPriorityNode(root) {
  return root.left === null ? root : getPriorityNode(root.left);
}

function outPriorityNode(preNode, currentNode) {
  if(currentNode.left !== null) {
    return outPriorityNode(currentNode, currentNode.left);
  }
  if(currentNode.right !== null) {
    preNode.left = currentNode.right;
    return currentNode;
  }
  preNode.left = null;
  return currentNode;
}

/**
 * 实现一个优先级队列, 二叉树
 */
module.exports = class PriorityQueue {
  constructor(options) {
    this.options = Object.assign({
      // 队列的初始值
      initValues: [],
      // 队列元素的优先级比对方法
      comparator: (a, b) => b - a,
    }, options);

    this.treeBaseNode = null;
    this.options.initValues.map(e => {
      const node = new Node(e, null, null);
      this.addNode(node);
      return true;
    });
    this.currentLength = this.options.initValues.length;
  }

  addNode(node){
    if(this.treeBaseNode === null) {
      this.treeBaseNode = node;
    }else {
      treeAddNode(this.treeBaseNode, node, this.options.comparator);
    }
  }

  outNode(){
    if(this.treeBaseNode.left == null) {
      this.treeBaseNode = this.treeBaseNode.right;
      return this.treeBaseNode;
    }
    return outPriorityNode(this.treeBaseNode, this.treeBaseNode.left);
  }

  /**
   * 获取队列长度
   * @readonly
   */
  get length() {
    return this.currentLength;
  }

  /**
   * 入队
   * @param {any} value
   */
  queue(value) {
    this.addNode(new Node(value, null, null));
    this.currentLength++;
  }

  /**
   * 返回最优先的值，并出队
   * @return {any}
   */
  dequeue() {
    if(this.currentLength <= 0) {
      return undefined;
    }
    this.currentLength--;
    return this.outNode().value;
  }

  /**
   * 获取队列最优先的值
   */
  peek() {
    return this.currentLength <= 0 ? undefined : getPriorityNode(this.treeBaseNode).value;
  }

  /**
   * 清空队列
   */
  clear() {
    this.treeBaseNode = null;
    this.currentLength = 0;
  }
};
