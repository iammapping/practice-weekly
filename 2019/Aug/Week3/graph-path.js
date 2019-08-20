/**
 * 图类
 */
class Graph {
  /**
   * 根据节点信息构建图
   * @param {Array<[node1, node2]>} nodePairs 初始化的连通节点对
   */
  constructor(nodePairs) {
    this.pairMap = {};

    nodePairs.forEach(nodePair => {
      this.addNodePair(nodePair);
    });
  }

  /**
   * @param {[node1, node2]} nodePair 连通的节点对
   */
  addNodePair(nodePair) {
    this.pairMap[nodePair[0]] || (this.pairMap[nodePair[0]] = []);
    this.pairMap[nodePair[1]] || (this.pairMap[nodePair[1]] = []);
    
    this.pairMap[nodePair[0]].push(nodePair[1]);
    this.pairMap[nodePair[1]].push(nodePair[0]);
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
    this.pairMap = graph.pairMap;
    this.source = source;
    this.pathMap = {};
  }

  /**
   * 是否有到 target 节点的路径
   * @param {any} target
   * @returns {boolean}
   */
  hasPathTo(target) {
    return this.pathMap[target] || !!this.pathTo(target);
  }

  pathTo(target) {
    const path = [];
    const hasSearchNodes = [];
    const sr = this.searchPath(target, path, hasSearchNodes);
    if (sr) {
      this.pathMap[target] = path.reverse();
    }
    return sr ? this.pathMap[target] : null;
  }

  searchPath(node, path, hasSearchNodes) {
    path.push(node);
    
    if (node === this.source) {
      return true;
    }

    let sr = false;
    for (const nextNode of (this.pairMap[node] || [])) {
      if (hasSearchNodes.includes(nextNode)) {
        continue;
      }
      
      hasSearchNodes.push(nextNode);
      sr = this.searchPath(nextNode, path, hasSearchNodes);
      if (sr) {
        break; 
      }
    }

    if(!sr) {
      path.pop();
    }

    return sr;
  }
}

module.exports = {
  Graph,
  Paths,
};
