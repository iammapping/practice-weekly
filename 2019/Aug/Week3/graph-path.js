class EdgeNode {
  constructor(adjvex, next) {
    this.adjvex = adjvex;
    this.next = next;
  }
}
class VextexNode {
  constructor(node) {
    this.node = node;
    this.firstEdge = new EdgeNode(-1, null);
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
    this.AdjList = [];
    this.init(nodePairs);
  }

  /**
   * 返回node在下标，如果找不到，插入到this.AdjList
   * @param node
   * @returns {number}
   */
  findVextexNodeIndex(node){
    let index = this.AdjList.findIndex(vextexNode => vextexNode.node === node);
    if(index === -1) {
      index = this.AdjList.push(new VextexNode(node)) - 1;
    }
    return index;
  }

  init(nodePairs) {
    nodePairs.forEach(nodePair => this.addNodePair(nodePair))
  }

  /**
   * @param {[node1, node2]} nodePair 连通的节点对
   */
  addNodePair(nodePair) {
    const [node1Index, node2Index] = nodePair.map(node => this.findVextexNodeIndex(node));
    this.AdjList[node1Index].firstEdge.next = new EdgeNode(
        node2Index,
        this.AdjList[node1Index].firstEdge.next,
    );
    this.AdjList[node2Index].firstEdge.next = new EdgeNode(
        node1Index,
        this.AdjList[node2Index].firstEdge.next,
    );
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
    this.paths = {};
    this.BFSTree(graph, source);
  }

  BFSTree(graph, source) {
    const queue = [graph.findVextexNodeIndex(source)];
    const visited = [];
    this.paths[source] = -1;
    while (queue.length !== 0) {
      const edgeNodeIndex = queue.shift();
      const { firstEdge } = graph.AdjList[edgeNodeIndex];
      let nextNode = firstEdge.next;
      visited[edgeNodeIndex] = true;
      while (nextNode) {
        const index = nextNode.adjvex;
        if (!visited[index]) {
          queue.push(index);
          visited[index] = true;
          this.paths[graph.AdjList[index].node] = graph.AdjList[edgeNodeIndex].node;
        }
        nextNode = nextNode.next;
      }
    }
  }

  /**
   * 是否有到 target 节点的路径
   * @param {any} target
   * @returns {boolean}
   */
  hasPathTo(target) {
    return this.paths[target] !== undefined;
  }

  pathTo(target) {
    if(!this.hasPathTo(target)){
      return null;
    }
    const path = [target];
    let parent = target;
    // eslint-disable-next-line
    while((parent = this.paths[parent]) !== -1) {
      path.push(parent);
    }
    return path.reverse();
  }
}

module.exports = {
  Graph,
  Paths,
};
