/**
 * 图类
 */
class Graph {
  /**
   * 根据节点信息构建图
   * @param {Array<[node1, node2]>} nodePairs 初始化的连通节点对
   */
  constructor(nodePairs) {
    this.Adjacency = [];
    this.graphMap = new Map();
    // eslint-disable-next-line prefer-spread
    this.nodes = [...new Set([].concat.apply([],nodePairs))];
    this.init(this.nodes);
    this.edge = [];
    this.adjEdge = [];

    for (let i = 0; i < nodePairs.length; i++) {
      this.edge.push(nodePairs[i]);
      this.addEdge(nodePairs[i][0], nodePairs[i][1])
    }
    this.createAdjacency(this.Adjacency);
  }
  
  init(nodes) {
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for(const item in nodes) {
      this.Adjacency[nodes[item]] = [];
    }
  }

  addEdge(v1, v2) {
    this.Adjacency[v1].push(v2);
    this.Adjacency[v2].push(v1);
  };

  createAdjacency(Adjacency) {
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for(const item in Adjacency) {
      this.graphMap.set(parseInt(item, 10),this.Adjacency[item] )
    }
  };


  /**
   * @param {[node1, node2]} nodePair 连通的节点对
   */
  addNodePair(nodePair) {
    this.nodes = [...new Set(nodePair.concat([...this.nodes]))];
    this.init(this.nodes);
    this.edge.push(nodePair);
    for (let i = 0; i < this.edge.length; i++) {
      this.addEdge(this.edge[i][0], this.edge[i][1])
      // eslint-disable-next-line prefer-destructuring
      this.adjEdge[this.edge[i][1]] = this.edge[i][0];
    }
    this.createAdjacency(this.Adjacency);
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
    this.map = graph.graphMap;
    this.nodes = graph.nodes;
    this.searchNode = source;
    this.vertices = [];
    this.marked = [];
    this.edge = graph.adjEdge;

    for(let i=0; i<this.nodes.length; i++){
      this.marked[this.nodes[i]] = false;
    }

    this.dfs(source);
  }

  /**
   * 是否有到 target 节点的路径
   * @param {any} target
   * @returns {boolean}
   */
  hasPathTo(target) {
    for (let i = 0; i < this.vertices.length; i++) {
      if (this.vertices[i] === target) {
        return true;
      }
    }
    return false
  }


  dfs(v) {
    this.marked[v] = true;
    if(this.map.get(v)!==undefined){
      this.vertices.push(v)
    }
    for(let i=0; i < this.map.get(v).length; i++) {
      const values = this.map.get(v);
      for(let j=0; j < values.length; j++ ){
        if(!this.marked[values[j]]) {
          this.dfs(values[j])
        }
      }
    }
  }



  pathTo(target) {
    const path = [];
    for (let i = target; i !== this.searchNode; i = this.edge[i]) {
      path.push(i);
      if (this.edge[i] === undefined) {
        return null;

      }
    }
    path.push(this.searchNode);
    return path.reverse()
  }
}

module.exports = {
  Graph,
  Paths,
};
