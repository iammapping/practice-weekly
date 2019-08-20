/**
 * 联通性检测
 */
module.exports = class ConnectionDetector {
  constructor(options) {
    this.options = Object.assign({
      // 节点用于索引的属性，默认为节点本身
      identify: o => o
    }, options);

    this.connMap = {};
    this.unionMap = {};
  }

  /**
   * 每次添加的一批节点即表示这一批节点任意两个都联通
   * @param  {...any} nodes
   */
  addConnectedNodes(...nodes) {
    if (nodes.length < 2) {
      throw new Error('You should provide at least two nodes each time.');
    }

    let firstId = null;

    nodes.forEach(node => {
      const id = this.options.identify(node);

      if (this.connMap[id] === undefined) {
        this.connMap[id] = (firstId === null ? id : firstId);

        if (this.unionMap[this.connMap[id]] === undefined) {
          this.unionMap[this.connMap[id]] = [id];
        } else {
          this.unionMap[this.connMap[id]].push(id);
        }
      }

      if (firstId === null) {
        firstId = this.connMap[id];
      }

      if (this.connMap[id] !== firstId) {
        const combineId = this.unionMap[firstId].length <= this.unionMap[this.connMap[id]].length ? firstId : this.connMap[id];
        const combineToId = this.unionMap[firstId].length <= this.unionMap[this.connMap[id]].length ? this.connMap[id] : firstId;

        this.unionMap[combineId].forEach(uid => {
          this.connMap[uid] = combineToId;
          this.unionMap[combineToId].push(uid);
        });

        delete this.unionMap[combineId];
        firstId = combineToId;
      }
    });
  }

  /**
   * 判断两个节点是否联通
   * @param {any} nodeA
   * @param {any} nodeB
   */
  isConntectedTo(nodeA, nodeB) {
    const idA = this.options.identify(nodeA);
    const idB = this.options.identify(nodeB);
    return this.connMap[idA] !== undefined && this.connMap[idB] !== undefined && this.connMap[idA] === this.connMap[idB];
  }
}