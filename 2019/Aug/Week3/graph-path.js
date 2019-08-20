/**
 * 节点的路径类
 */
class Paths {
  /**
   * 根据图和起始节点创建路径对象
   * @param {Graph} graph
   * @param {any} source
   */
  constructor(graph, source) {
    this.pathMap = {};
    this.nodeMap = graph.nodeMap;

    this.buildPath([], source);
  }

  buildPath(path, current) {
    if(path.indexOf(current) > -1) return;
    path.push(current);
    if((this.pathMap[current] || []) < path.length) {
      this.pathMap[current] = path.map(e => e);
      (this.nodeMap[current] || []).forEach(value => this.buildPath(path, value));
    }
    path.pop();
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
  /**
   * 根据节点信息构建图
   * @param {Array<[node1, node2]>} nodePairs 初始化的连通节点对
   */
  constructor(nodePairs) {
    this.nodeMap = {};
    nodePairs.forEach(nodePair => this.linkNode(nodePair));
  }

  linkNode(nodePairs){
    const [value1, value2] = nodePairs;
    this.nodeMap[value1] = (this.nodeMap[value1] || new Set()).add(value2);
    this.nodeMap[value2] = (this.nodeMap[value2] || new Set()).add(value1);
  }

  /**
   * @param {[node1, node2]} nodePair 连通的节点对
   */
  addNodePair(nodePair) {
    this.linkNode(nodePair);
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
