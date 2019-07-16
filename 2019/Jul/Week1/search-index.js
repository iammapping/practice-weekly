function Node() {
  this.children = {};
  this.ids = [];

  return this;
}

/**
 * Array deduplication filter
 * @param value {string}
 * @param index {number}
 * @param array {Array<string>}
 * @return {boolean}
 */
function uniqueFilter(value, index, array) {
  return array.indexOf(value) === index;
}

/**
 * Get the intersection of two arrays
 * @param array1 {Array<string>}
 * @param array2 {Array<string>}
 * @return {Array<string>}
 */
function getIntersection(array1, array2) {
  if (array1.length === array2.length || array1.length < array2.length) {
    return array2.filter((value, index, self) => (
      uniqueFilter(value, index, self) && array1.indexOf(value) !== -1
    ));
  }

  return array1.filter((value, index, self) => (
    uniqueFilter(value, index, self) && array2.indexOf(value) !== -1
  ));
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

    this.trie = new Node();
    this.indexedData = {};
  }

  add(data) {
    for (let i = 0; i < data.length; i++) {
      const id = this.options.identify(data[i]);
      this.indexedData[id] = data[i];

      const tokens = this.options.datumTokenizer(data[i]);

      for (let j = 0; j < tokens.length; j++) {
        const token = tokens[j];
        let node = this.trie;

        for (let n = 0; n < token.length; n++) {

          if (!node.children[token[n]]) {
            node.children[token[n]] = new Node();
          }

          node = node.children[token[n]];
          node.ids.push(id);
        }
      }
    }
  }

  search(query) {
    const queryset = this.options.queryTokenizer(query);
    let matchedArray = [];

    for (let i = 0; i < queryset.length; i++) {
      const word = queryset[i];
      let node = this.trie;

      for (let j = 0; j < word.length; j++) {
        if (node) {
          node = node.children[word[j]];
        }
      }

      if (node) {
        matchedArray = matchedArray.length ?
          getIntersection(matchedArray, node.ids) :
          node.ids.filter(uniqueFilter)
        ;
      }
    }

    return matchedArray.map(id => this.indexedData[id]);
  }
};
