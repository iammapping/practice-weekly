class Node {
  constructor(data) {
    this.setData(data);
    this.adjacents = [];
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
  }

  addAdjacent(node) {
    this.adjacents.push(node);
  }

  getAdjacents() {
    return this.adjacents;
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
    this.nodes = new Map();

    nodePairs.forEach(nodePair => {
      this.addNodePair(nodePair);
    })
  }

  /**
   * @param {[node1, node2]} nodePair 连通的节点对
   */
  addNodePair(nodePair) {
    const sourceNode = this.addVertex(nodePair[0]);
    const destNode = this.addVertex(nodePair[1]);

    sourceNode.addAdjacent(destNode);
    destNode.addAdjacent(sourceNode);
  }

  addVertex(value) {
    if (this.nodes.has(value)) {
      return this.nodes.get(value);
    }

    const vertex = new Node(value);
    this.nodes.set(value, vertex);

    return vertex;
  }

  /**
   * 返回节点的路径对象
   * @param {any} source
   * @return {Paths}
   */
  search(source) {
    // eslint-disable-next-line no-use-before-define
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
    this.graph = graph;
    this.souce = source;
  }

  visitor(target) {
    const visited = new Map();
    const visitList = [this.souce];

    // this.dijkstraMap.get(this.souce).distance = 0;
    while (visitList.length) {
      const visit = visitList.pop();

      if (!visited.has(visit)) {

        visited.set(visit, null);
        if (visit === target) {
          return visited;
        }

        const adjacent = this.graph.nodes.get(visit).getAdjacents();
        for (let i = 0; i < adjacent.length; i++) {
          const currentVertex = adjacent[i].getData();
          visitList.push(currentVertex);

          if (target === currentVertex) {
            break
          }
        }
      }
    }

    return visited;
  }

  /**
   * 是否有到 target 节点的路径
   * @param {any} target
   * @returns {boolean}
   */
  hasPathTo(target) {
    const search = this.visitor(target);
    return search ? search.has(target) : false;
  }

  pathTo(target) {
    const search = this.visitor(target);
    // eslint-disable-next-line compat/compat
    return !search.has(target) ? null : Array.from(search.keys());
  }
}

module.exports = {
  Graph,
  Paths,
};
