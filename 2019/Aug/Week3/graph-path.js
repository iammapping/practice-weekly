function createNode(key) {
  return {
    nodeData: key,
    relateNodeDatas: []
  };
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
    this.nodes = {};
    nodePairs.forEach(nodePair => {
      this.addNodePair(nodePair);
    });
  }

  /**
   * @param {[node1, node2]} nodePair 连通的节点对
   */
  addNodePair(nodePair) {
    const nodeA = nodePair[0];
    const nodeB = nodePair[1];

    if (!this.nodes[nodeA]) this.nodes[nodeA] = createNode(nodeA);
    if (!this.nodes[nodeB]) this.nodes[nodeB] = createNode(nodeB);

    if (!this.nodes[nodeA].relateNodeDatas.includes(nodeB)) this.nodes[nodeA].relateNodeDatas.push(nodeB);
    if (!this.nodes[nodeB].relateNodeDatas.includes(nodeA)) this.nodes[nodeB].relateNodeDatas.push(nodeA);
  }

  /**
   * 返回节点的路径对象
   * @param {any} source
   * @return {Paths}
   */
  search(source) {
    // eslint-disable-next-line
    return new Paths(this, source);
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
    this.nodes = graph.nodes;
    this.sourceNode = graph.nodes[source];
    this.initedNode = [];
  }

  findPath(node, target, path) {
    if (this.initedNode.includes(node.nodeData)) return [];
    
    this.initedNode.push(node.nodeData);

    if (node.relateNodeDatas.includes(target)) {
      path.push(node.nodeData);
      path.push(target);
      return path;
    }

    if (node.relateNodeDatas) {
      for (let i = 0; i < node.relateNodeDatas.length; i++) {
        let newPath = [];
        newPath = this.findPath(this.nodes[node.relateNodeDatas[i]], target, newPath);
        if (newPath.includes(target)) {
          path.push(node.nodeData);
          path = path.concat(newPath);
          return path;
        }
      }
    }

    return [];
  }

  /**
   * 是否有到 target 节点的路径
   * @param {any} target
   * @returns {boolean}
   */
  hasPathTo(target) {
    if (this.pathTo(target)) return true;

    return false;
  }

  pathTo(target) {
    if (!this.nodes[target]) return null;

    if (this.sourceNode.nodeData === target) return [target, target];

    this.initedNode = [];

    let path = [];
    path = this.findPath(this.sourceNode, target, path);

    return (path.length ? path : null);
  }
}

module.exports = {
  Graph,
  Paths,
};
