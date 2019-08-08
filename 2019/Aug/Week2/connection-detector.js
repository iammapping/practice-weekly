/**
 * 联通性检测
 */
module.exports = class ConnectionDetector {
  constructor(options) {
    this.options = Object.assign({
      // 节点用于索引的属性，默认为节点本身
      identify: o => o
    }, options);

    this.nodeMap = {};
  }

  /**
   * 每次添加的一批节点即表示这一批节点任意两个都联通
   * @param  {...any} nodes
   */
  addConnectedNodes(...nodes) {
    if (nodes.length < 2) {
      throw new Error('You should provide at least two nodes each time.');
    }
    nodes = nodes.map(node => this.options.identify(node));
    let foundSet = null;
    for(let i = 0; i < nodes.length; i++) {
      if(this.nodeMap[nodes[i]] !== undefined) {
        foundSet = this.nodeMap[nodes[i]].set;
        break;
      }
    }

    foundSet = new Set([...(foundSet || []), ...nodes]);
    foundSet.forEach(node => {this.nodeMap[node] = { value: node, set: foundSet }});
  }

  /**
   * 判断两个节点是否联通
   * @param {any} nodeA
   * @param {any} nodeB
   */
  isConntectedTo(nodeA, nodeB) {
    return this.nodeMap[this.options.identify(nodeA)] !== undefined
      && this.nodeMap[this.options.identify(nodeB)] !== undefined
      && this.nodeMap[this.options.identify(nodeA)].set === this.nodeMap[this.options.identify(nodeB)].set;
  }
}
