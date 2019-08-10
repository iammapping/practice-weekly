/**
 * 联通性检测
 */
module.exports = class ConnectionDetector {
  constructor(options) {
    this.options = Object.assign({
      // 节点用于索引的属性，默认为节点本身
      identify: o => o
    }, options);

    this.treeBoj = {};
  }

  /**
   * 每次添加的一批节点即表示这一批节点任意两个都联通
   * @param  {...any} nodes
   */
  addConnectedNodes(...nodes) {
    if (nodes.length < 2) {
      throw new Error('You should provide at least two nodes each time.');
    }

    [...nodes].forEach((node, index) => {
      const key = this.options.identify(node);
      const nextKey = [...nodes][index + 1] && this.options.identify([...nodes][index + 1]);

      this.treeBoj[key] = this.treeBoj[key] || {};

      if(nextKey) {
        this.addNextKey(key, nextKey);
      }
    })
  }

  /**
   * 判断两个节点是否联通
   * @param {any} nodeA
   * @param {any} nodeB
   */
  isConntectedTo(nodeA, nodeB) {
    return this.searchNodeKey(this.options.identify(nodeA), this.options.identify(nodeB));
  }

  searchNodeKey(currentKey, searchKey) {
    if (!this.treeBoj[currentKey]) {
      return false;
    }

    if (this.treeBoj[currentKey].next) {
      if (this.treeBoj[currentKey].next === searchKey) {
        return true;
      }

      return this.searchNodeKey(this.treeBoj[currentKey].next, searchKey);
    }

    return false;
  }

  addNextKey(currentKey, addKey) {
    if (this.treeBoj[currentKey].next) {
      this.addNextKey(this.treeBoj[currentKey].next, addKey);
    } else {
      this.treeBoj[currentKey].next = addKey;
    }
  }
}
