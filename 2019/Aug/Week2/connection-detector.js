/**
 * 联通性检测
 */

module.exports = class ConnectionDetector {
  constructor(options) {
    this.options = Object.assign({
      // 节点用于索引的属性，默认为节点本身
      identify: o => o
    }, options);
    this.edge = new Map();
  }


  addEdge(v, w) {
    if (this.edge.get(v) !== undefined) {
      this.edge.get(v).push(w);

      const it = this.edge.keys();
      const {size} = this.edge;
      for (let i = 0; i < size; i++) {
        const key = it.next().value;
        if (this.edge.get(key).indexOf(v) > -1) {
          this.edge.get(key).push(w);
        }
      }
      if (this.edge.get(w) !== undefined) {
        this.edge.get(w).push(v);
        return;
      }
      this.edge.set(w, [v]);
      return;
    }

    this.edge.set(v, [w]);
    this.edge.set(w, [v]);
  }

  /**
   * 每次添加的一批节点即表示这一批节点任意两个都联通
   * @param  {...any} nodes
   */
  addConnectedNodes(...nodes) {

    if (nodes.length < 2) {
      throw new Error('You should provide at least two nodes each time.');
    }

    for (let i = 0; i < nodes.length - 1; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeA = this.options.identify(nodes[i]);
        const nodeB = this.options.identify(nodes[j]);
        this.addEdge(nodeA, nodeB);
      }
    }
  }

  /**
   * 判断两个节点是否联通
   * @param {any} nodeA
   * @param {any} nodeB
   */
  isConntectedTo(nodeA, nodeB) {
    nodeA = this.options.identify(nodeA);
    nodeB = this.options.identify(nodeB);
    const it = this.edge.keys();
    const {size} = this.edge;

    for (let i = 0; i < size; i++) {
      const key = it.next().value;
      if (key === nodeA) {
        const values = this.edge.get(key);
        for (let j = 0; j < values.length; j++) {
          // eslint-disable-next-line radix
          if (parseInt(values[j]) === nodeB) {
            return true;
          }
        }
      }
    }
    return false;
  }
};
