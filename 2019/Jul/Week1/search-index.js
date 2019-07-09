class LinkNode {
  constructor(key) {
    this.key = key;
    this.nextChildNode = null;
    this.nextBrotherNode = null;
    this.lastBrotherNode = null;

    this.dataIndexs = [];
  }

  searchNextNode(key) {
    let node = this.nextChildNode;
    while (node !== null) {
      if (node.key === key) {
        return node;
      }

      node = node.nextBrotherNode;
    }

    return null;
  }

  pushNextNode(nextNode) {
    if (this.nextChildNode === null) {
      this.nextChildNode = nextNode;
    } else {
      this.lastBrotherNode.nextBrotherNode = nextNode;
    }

    this.lastBrotherNode = nextNode;
  }

  pushDataIndex(dataIndex) {
    this.dataIndexs.push(dataIndex);
  }

  add(keys, dataIndex) {
    if (keys.length > 0) {
      const key = keys.substring(0, 1);
      let nextNode = this.searchNextNode(key);
      if (nextNode === null) {
        nextNode = new LinkNode(key);
        this.pushNextNode(nextNode);
      }

      nextNode.pushDataIndex(dataIndex);

      nextNode.add(keys.substring(1), dataIndex);
    }
  }

  search(keys) {
    if (keys.length === 0) {
      return this.dataIndexs;
    } 

    const key = keys.substring(0, 1);
    const nextNode = this.searchNextNode(key);
    if(nextNode === null) {
      return [];
    } 

    return nextNode.search(keys.substring(1));
  }
}

/**
 * 构建一个字符串查找时间复杂度为 O(1) 索引
 */
module.exports = class SearchIndex {
  constructor(options) {
    this.options = Object.assign({
      // 提取对象的索引
      identify: o => String(o),
      // 将数据分词
      datumTokenizer: o => String(o).split(/\s+/),
      // 将查询字符串分词
      queryTokenizer: q => String(q).split(/\s+/),
    }, options);

    this.data = [];
    this.rootNode = new LinkNode();
  }

  add(data) {
    data.forEach(d => {
      const dataIndex = this.data.length;
      this.data.push(d);

      this.options.datumTokenizer(d).forEach(keys => {
        this.rootNode.add(keys, dataIndex);
      });
    });
  }

  search(query) {
    let retIndexs = null;

    for (const keys of this.options.queryTokenizer(query)) {
      const indexs = new Set(this.rootNode.search(keys));

      if (retIndexs === null) {
        retIndexs = indexs;
      } else {
        retIndexs = new Set([...retIndexs].filter(index => indexs.has(index))); // 交集
      }
      
      if (retIndexs.size === 0) {
        break;
      }
    };

    const rs = [];
    retIndexs.forEach(dataIndex => {
      rs.push(this.data[dataIndex]);
    });

    return rs;
  }
};
