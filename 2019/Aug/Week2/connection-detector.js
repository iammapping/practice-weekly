/**
 * 联通性检测
 */
module.exports = class ConnectionDetector {
  constructor(options) {
    this.options = Object.assign({
      // 节点用于索引的属性，默认为节点本身
      identify: o => o
    }, options);

    this.treeObj = {};
  }

  /**
   * 每次添加的一批节点即表示这一批节点任意两个都联通
   * @param  {...any} nodes
   */
  addConnectedNodes(...nodes) {
    if (nodes.length < 2) {
      throw new Error('You should provide at least two nodes each time.');
    }

    const firstNodeKey = this.options.identify(nodes[0]);
    const pathKey = this.treeObj[firstNodeKey] && this.treeObj[firstNodeKey].path || firstNodeKey;

    let previousKey = null;
    nodes.forEach(node => {
      const key = this.options.identify(node);

      if (previousKey) {
        this.treeObj[previousKey].next = key;
      }
      previousKey = key;

      if (!this.treeObj[key]) {
        this.treeObj[key] = {path: pathKey};
      } else if (this.treeObj[key].path !== pathKey) {
        this.changeNodePath(key, pathKey);
      }
    })
  }

  /**
   * 判断两个节点是否联通
   * @param {any} nodeA
   * @param {any} nodeB
   */
  isConntectedTo(nodeA, nodeB) {
    const result = this.treeObj[this.options.identify(nodeA)]
      && this.treeObj[this.options.identify(nodeB)]
      && (this.treeObj[this.options.identify(nodeA)].path === this.treeObj[this.options.identify(nodeB)].path);

    return !!result;
  }

  changeNodePath(currentKey, path) {
    this.treeObj[currentKey].path = path;

    const nextKey = this.treeObj[currentKey] && this.treeObj[currentKey].next;
    if (nextKey) {
      this.changeNodePath(nextKey, path);
    }
  }

}
