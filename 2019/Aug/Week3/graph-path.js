/**
 * 节点的路径类
 */
class Paths {

  buildPath(current) {
    this.currentList.push(current);
    if(this.askedMap[current] === undefined) {
      this.askedMap[current] = true;
      this.pathMap[current] = this.currentList.map(e => e);
      (this.nodeMap[current] || []).forEach(value => this.buildPath(value));
    }
    this.currentList.pop();
  }

  /**
   * 根据图和起始节点创建路径对象
   * @param {Graph} graph
   * @param {any} source
   */
  constructor(graph, source) {
    this.pathMap = {};
    this.askedMap = {};
    this.currentList = [];
    this.nodeMap = graph.nodeMap;

    this.buildPath(source);
  }

  /**
   * 是否有到 target 节点的路径
   * @param {any} target
   * @returns {boolean}
   */
  hasPathTo(target) {
    return this.pathMap[target] !== undefined;
  }

  pathTo(target) {
    return this.pathMap[target] || null;
  }
}

/**
 * 图类
 */
class Graph {
  linkPoint(nodePairs){
    const [value1, value2] = nodePairs;
    this.nodeMap[value1] = (this.nodeMap[value1] || new Set()).add(value2);
    this.nodeMap[value2] = (this.nodeMap[value2] || new Set()).add(value1);
  }

  /**
   * 根据节点信息构建图
   * @param {Array<[node1, node2]>} nodePairs 初始化的连通节点对
   */
  constructor(nodePairs) {
    this.nodeMap = {};
    nodePairs.forEach(nodePair => this.linkPoint(nodePair));
  }

  /**
   * @param {[node1, node2]} nodePair 连通的节点对
   */
  addNodePair(nodePair) {
    this.linkPoint(nodePair);
  }

  /**
   * 返回节点的路径对象
   * @param {any} source
   * @return {Paths}
   */
  search(source) {
    return new Paths(this, source);
  }
}

module.exports = {
  Graph,
  Paths,
};
