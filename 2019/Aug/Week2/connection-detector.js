/**
 * 联通性检测
 */
module.exports = class ConnectionDetector {
  constructor(options) {
    this.nodes = {};
    this.options = Object.assign({
      // 节点用于索引的属性，默认为节点本身
      identify: o => o
    }, options);
  }

  /**
   * 每次添加的一批节点即表示这一批节点任意两个都联通
   * @param  {...any} nodes
   */
  addConnectedNodes(...nodes) {
    if (nodes.length < 2) {
      throw new Error('You should provide at least two nodes each time.');
    }

    let isChangeNewNodeGateway = false;
    const route = {};

    nodes.forEach((node, i) => {
      const id = this.options.identify(node);
      if (i === 0) {
        route.gateway = id;
      }

      if (!(id in this.nodes)) {
        this.nodes[id] = { route, node };
      } else if (!isChangeNewNodeGateway) {
        // 新插入nodes的gateway设置为this.nodes[id]中的gateway
        route.gateway = this.nodes[id].route.gateway;
        isChangeNewNodeGateway = true;
      } else {
        // 更新与id一起添加的node gateway
        this.nodes[id].route.gateway = route.gateway;
      }
    });
  }

  /**
   * 判断两个节点是否联通
   * @param {any} nodeA
   * @param {any} nodeB
   */
  isConntectedTo(nodeA, nodeB) {
    const ida = this.options.identify(nodeA);
    const idb = this.options.identify(nodeB);

    if (!(this.nodes[ida] && this.nodes[idb])) {
      return false;
    }

    return this.nodes[ida].route.gateway === this.nodes[idb].route.gateway;
  }
};
