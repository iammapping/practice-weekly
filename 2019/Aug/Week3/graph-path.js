/**
 * 图类
 */
class Graph {
  /**
   * 根据节点信息构建图
   * @param {Array<[node1, node2]>} nodePairs 初始化的连通节点对
   */
  constructor(nodePairs) {

  }

  /**
   * @param {[node1, node2]} nodePair 连通的节点对
   */
  addNodePair(nodePair) {

  }

  /**
   * 返回节点的路径对象
   * @param {any} source
   * @return {Paths}
   */
  search(source) {

  }
}


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

  }

  /**
   * 是否有到 target 节点的路径
   * @param {any} target
   * @returns {boolean}
   */
  hasPathTo(target) {

  }

  pathTo(target) {

  }
}

module.exports = {
  Graph,
  Paths,
};
