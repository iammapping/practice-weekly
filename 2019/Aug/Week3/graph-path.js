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
    this.nodeObj = graph.nodeObj;
    this.searchNode = source;
  }

  /**
   * 是否有到 target 节点的路径
   * @param {any} target
   * @returns {boolean}
   */
  hasPathTo(target) {
    return !!(this.nodeObj[target] && this.nodeObj[target].path === this.nodeObj[this.searchNode].path);
  }

  pathTo(target) {
    if (!this.hasPathTo(target)) {
      return null;
    }

    return this.getTargetFromChildren([this.searchNode], target);
  }

  getTargetFromChildren(currentPathArr, targetNode) {
    const currentNode = currentPathArr[currentPathArr.length - 1];

    if (!this.nodeObj[currentNode] || !this.nodeObj[currentNode].children) {
      return false;
    }

    let result = false;

    if (!Array.isArray(this.nodeObj[currentNode].children)) {
      if (this.nodeObj[currentNode].children === targetNode) {
        currentPathArr.push(targetNode);
        return currentPathArr;
      }

      return this.getTargetFromChildren(currentPathArr.concat([this.nodeObj[currentNode].children]), targetNode);
    }

    if (this.nodeObj[currentNode].children.indexOf(targetNode) > -1) {
      currentPathArr.push(targetNode);
      return currentPathArr;
    }

    for(let i = 0; i < this.nodeObj[currentNode].children.length; i += 1) {
      const node = this.nodeObj[currentNode].children[i];
      const tmp = this.getTargetFromChildren(currentPathArr.concat([node]), targetNode);
      if (tmp) {
        result = tmp;
        break;
      }
    }

    return result;
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
    this.nodeObj = {};

    nodePairs.forEach(nodePair => {
      this.addNodePair(nodePair);
    })
  }

  /**
   * @param {[node1, node2]} nodePair 连通的节点对
   */
  addNodePair(nodePair) {
    const [node1, node2] = nodePair;

    const path = this.nodeObj[node1] ? this.nodeObj[node1].path : node1;

    if (this.nodeObj[node1]) {
      if (this.nodeObj[node1].children) {
        this.nodeObj[node1].children = Array.isArray(this.nodeObj[node1].children) ? this.nodeObj[node1].children : [this.nodeObj[node1].children];
        this.nodeObj[node1].children.push(node2);
      } else {
        this.nodeObj[node1].children = node2;
      }
    } else {
      this.nodeObj[node1] = {path, children: node2};
    }

    this.nodeObj[node2] = Object.assign({}, this.nodeObj[node2], {path})
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
