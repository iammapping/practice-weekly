/**
 * 联通性检测
 */
module.exports = class ConnectionDetector {
  constructor(options) {
    this.options = Object.assign({
      // 节点用于索引的属性，默认为节点本身
      identify: o => o
    }, options);
    this.connectionRelationMap = new Map();
  }


  /**
   * 每次添加的一批节点即表示这一批节点任意两个都联通
   * @param  {...any} nodes
   */
  addConnectedNodes(...nodes) {
    if (nodes.length < 2) {
      throw new Error('You should provide at least two nodes each time.');
    }
    // 使用第一个节点所在到组名作为其他节点所在到组名
    const rootIdentify = this.search(nodes[0]);
    for(let i = 1; i < nodes.length; i++){
      const nodeIRootIdentify = this.search(nodes[i]);
      if( rootIdentify !==  nodeIRootIdentify){
        this.connectionRelationMap.set(nodeIRootIdentify, rootIdentify);
      }
    }
    console.log(this.connectionRelationMap);
  }

  search(root) {
    let sonIdentify = this.options.identify(root);
    let rootIdentify = this.options.identify(root);
    // 如果节点没有值，说明它还没有组，将自己到组名设为自己
    if(!this.connectionRelationMap.has(rootIdentify)) {
      this.connectionRelationMap.set(rootIdentify, rootIdentify);
    }
    // 找到该节点的所在到组
    while(rootIdentify !== this.connectionRelationMap.get(rootIdentify)) {
      rootIdentify = this.connectionRelationMap.get(rootIdentify);
    }
    // 重新调整
    while(sonIdentify !== rootIdentify) {
      const tmpIdentify = this.connectionRelationMap.get(sonIdentify);
      this.connectionRelationMap.set(sonIdentify, rootIdentify);
      sonIdentify = tmpIdentify;
    }
    return rootIdentify;
  }

  /**
   * 判断两个节点是否联通
   * @param {any} nodeA
   * @param {any} nodeB
   */
  isConntectedTo(nodeA, nodeB) {
    return this.search(nodeA) === this.search(nodeB);
  }
}
