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

    // 字符串数组生成的查找树的头节点
    this.header = {
      index:[], // 记录对象的索引identify()，根据索引查找最后符合条件的对象
      children:{}
    }
  }

  // 求两个数组的交集
  static getIntersection(array1, array2){
    return array1.filter(v => array2.includes(v));
  }

  /**
   * 处理数组
   * @param data
   * @param split
   * @returns 对象数组 [{index:'', value:''}]
   */
  dealData(data){
    const res = [];
    for(let i = 0; i < data.length; i++){
      // 将全部索引保存到header.index中，方便接下来索引取交集
      this.header.index.push(this.options.identify(data[i]));

      const item = this.options.datumTokenizer(data[i]);
      for(let k = 0; k < item.length; k++){
        res.push({
          index: this.options.identify(data[i]), // 索引
          value: item[k]                        // 生成索引树的值
        });
      }
    }
    return res;
  }

  /**
   * 递归添加节点
   * @param children
   * @param index 索引
   * @param item 建树的字符串
   * @param key 字符串的key
   */

  addTreeNode(children, index, item, key){
    const char = item[key];
    // 遍历到字符串结尾
    if(char === undefined){
      return;
    }
    if(children[char] === undefined){
      const childrenTreeNode = {
        index:[index],
        children:[]
      }
      children[char] = childrenTreeNode;
    }else{
      children[char].index.push(index);
    }
    key += 1;
    // 递归调用添加节点
    this.addTreeNode(children[char].children, index, item, key);
  }

  add(data) {
    // 保留原始数据，最后根据索引查找匹配的数据
    this.data = data;
    // 预处理数据
    data = this.dealData(data);
    // 生成树
    for(let i = 0; i < data.length; i++){
      this.addTreeNode(this.header.children, data[i].index, data[i].value, 0);
    }
  }

  /**
   * 递归查找索引
   * @param children 树节点的孩子数组
   * @param query 查询的字符串
   * @param key 字符串的key
   * @param index 索引
   * @returns Array 索引
   */
  findIndex(children, query, key, index){
    const treeNode = children[query[key]];
    // 查找失败，跳出递归
    if(treeNode === undefined){
      return [];
    }
    // 取index和children[childrenKey].index的交集
    const res = SearchIndex.getIntersection(index, treeNode.index);
    key += 1;
    // 所有的字符都查找完，跳出递归
    if(query[key] === undefined){
      return res;
    }
    return this.findIndex(treeNode.children, query, key, res);
  }

  /**
   * 根据索引查找符合条件的值
   * @param index 索引
   * @returns {Array} 符合条件的值
   */
  findDataByIndex(index){
    const res = [];
    for(let i = 0; i < this.data.length; i++){
      if(index.indexOf(this.options.identify(this.data[i])) !== -1){
        res.push(this.data[i]);
      }
    }
    return res;
  }

  search(query) {
    // 处理查询字符串
    query = this.options.queryTokenizer(query);
    // 包含存储所有的索引
    let {index} = this.header;
    // 查找树
    for(let i = 0; i < query.length; i++){
      // 取交集
      index = SearchIndex.getIntersection(index, this.findIndex(this.header.children, query[i], 0, this.header.index));
    }
    // 根据索引查找结果
    return this.findDataByIndex(index);
  }
};