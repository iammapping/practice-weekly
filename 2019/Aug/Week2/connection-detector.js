function mergeNodes(arrA, arrB) {
  arrB.forEach(id => {
    if (!arrA.includes(id)) {
      arrA.push(id);
    }
  });

  return arrA;
}

/**
 * 联通性检测
 */
module.exports = class ConnectionDetector {
  constructor(options) {
    this.options = Object.assign({
      // 节点用于索引的属性，默认为节点本身
      identify: o => o
    }, options);

    this.nodeData = [];
  }

  /**
   * 每次添加的一批节点即表示这一批节点任意两个都联通
   * @param  {...any} nodes
   */
  addConnectedNodes(...nodes) {
    if (nodes.length < 2) {
      throw new Error('You should provide at least two nodes each time.');
    }

    const identifyIDs = [];
    nodes.forEach(node => {
      identifyIDs.push(this.options.identify(node));
    });

    let newIDs = [].concat(identifyIDs);
    const identifySet = new Set(identifyIDs);
    for (let i = 0; i < this.nodeData.length; i++) {
      const nodeDataSet = new Set(this.nodeData[i].identifyIDs);

      if ((new Set([...nodeDataSet].filter(id => identifySet.has(id)))).size) {
        this.nodeData[i].isDelete = true;
        newIDs = mergeNodes(newIDs, this.nodeData[i].identifyIDs);
      }
    }

    this.nodeData.push({
      'identifyIDs': newIDs
    });

    this.nodeData = this.nodeData.filter(node => !node.isDelete);
  }

  /**
   * 判断两个节点是否联通
   * @param {any} nodeA
   * @param {any} nodeB
   */
  isConntectedTo(nodeA, nodeB) {
    for (let i = 0; i < this.nodeData.length; i++) {
      const {identifyIDs} = this.nodeData[i];
      
      if (identifyIDs.includes(this.options.identify(nodeA)) && identifyIDs.includes(this.options.identify(nodeB))) {
        return true;
      }
    }
    return false;
  }
}
