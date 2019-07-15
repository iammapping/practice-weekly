
// double linked list node
function Node(key, value) {
  this.value = value;
  this.key = key;
  this.prev= null;
  this.next = null;
}

// have head pointer and tail pointer
class LinkedList{
  constructor(){
    this.head = new Node('', '');   // head pointer
    // this.tail = this.head;   // tail pointer
    this.length = 0;      // length
  }

  /**
   * find a node
   * @param key key of node
   * @returns {Node|null}
   */
  find(key){
    let currNode = this.head;
    while (currNode !== null){
      if(currNode.key === key){
        return currNode;
      }
      currNode = currNode.next;
    }
    return null;
  }

  /**
   * find last node
   * @returns {Node}
   */
  findLastNode(){
    let currNode = this.head;
    while (currNode.next !== null){
      currNode = currNode.next;
    }
    return currNode;
  }

  insertToHead(newNode){
    newNode.next = this.head.next;
    newNode.prev = this.head;
    if(this.head.next !== null){
      this.head.next.prev = newNode;
    }
    this.head.next = newNode;
  }

  /**
   * insert a node to head pointer
   * @param key key of node
   * @param value value of node
   */
  insert(key, value){
    this.insertToHead(new Node(key, value));
    this.length += 1;
  }

  static deleteNode(currNode){
    currNode.prev.next = currNode.next;
    if(currNode.next !== null){
      currNode.next.prev = currNode.prev;
    }
  }

  /**
   * delete a node by key
   * @param key
   */
  delete(key){
    const currNode = this.find(key);
    // find node
    if(currNode !== null){
      LinkedList.deleteNode(currNode);
      this.length -= 1;
    }
  }

  /**
   * delete last node
   */
  deleteLastNode(){
    const lastNode = this.findLastNode();
    lastNode.prev.next = null;
    this.length -= 1;
  }

  /**
   * move a node to head pointer
   * @param key
   */
  moveNodeToHead(key){
    const currNode = this.find(key);
    // find node
    if(currNode !== null){
      // delete this node
      LinkedList.deleteNode(currNode);

      // insert to head
      this.insertToHead(currNode);
    }
  }

  /**
   * show linked list all node
   */
  // display(){
  //   let currNode = this.head;
  //   let str = "";
  //   while (currNode !== null) {
  //     str += `${currNode.key}:${currNode.value}->`;
  //     currNode = currNode.next;
  //   }
  //   console.log(str);
  // }
  //
  // displayReverse() {
  //   let currNode = this.findLastNode();
  //   let str = "";
  //   while (currNode !== null) {
  //     str += `${currNode.key}:${currNode.value}->`;
  //     currNode = currNode.prev;
  //   }
  //   console.log(str);
  // }
}

/**
 * 实现一个 LRU Cache
 */
module.exports = class LruCache {
  /**
   *
   * @param {number} max 最大容量
   */
  constructor(max) {
    this.max = max;
    this.linkedList = new LinkedList();
  }

  /**
   * 已存储的数量
   *
   * @readonly
   */
  get length() {
    return this.linkedList.length;
  }

  /**
   * 获取某个 key 对应的值
   *
   * @param {*} key
   */
  get(key) {
    const node = this.linkedList.find(key);
    if(node !== null){
      this.linkedList.moveNodeToHead(key);
      return node.value;
    }
    return undefined;
  }

  /**
   * 设置键值对
   *
   * @param {any} key
   * @param {any} val
   */
  set(key, val) {
    if(this.length >= this.max){
      this.linkedList.deleteLastNode();
    }
    this.linkedList.insert(key, val);
  }

  /**
   * 删除某个 key
   *
   * @param {any} key
   */
  del(key) {
    this.linkedList.delete(key);
  }

  /**
   * 判断某个 key 是否存在
   *
   * @param {any} key
   */
  has(key) {
    const node = this.linkedList.find(key);
    if(node === null){
      return false;
    }
    return true;
  }

  /**
   * 清空所有的内容
   */
  reset() {
    this.linkedList = new LinkedList();
  }
}
