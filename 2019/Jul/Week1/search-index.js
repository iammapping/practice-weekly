function intersection(a, b) {// 交集
  return [...new Set([...new Set(a)].filter(x => new Set(b).has(x)))];
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

    this.dicts = {};// 词典
    this.identifyMaps = {};// 源数据索引
  }

  add(data) {
    (data || []).forEach(word => {
      const identify = this.options.identify(word);
      this.identifyMaps[identify] = word;

      (this.options.datumTokenizer(word) || []).forEach(key => {
        if (this.dicts[key]) {
          this.dicts[key].push(identify);
        } else {
          this.dicts[key] = [identify];
        }
      });
    });
  }

  search(query) {
    const queies = this.options.queryTokenizer(query);
    if (queies.indexOf(query) === -1) queies.push(query);

    const result = [];
    let identifies = [];

    queies.forEach(que => {
      const identifiesTmp = [];

      Object.keys(this.dicts).forEach(key => {
        if (key === que || key.search(query) === 0) {// 匹配规则: 全等 或 前部分相等
          (this.dicts[key] || []).forEach(identify => {
            if (identifiesTmp.indexOf(identify) === -1) identifiesTmp.push(identify);
          });
        }
      });

      if (!identifies.length) {// identifies做交集
        identifies = identifiesTmp;
      } else if (identifiesTmp.length) {
        identifies = intersection(identifies, identifiesTmp);
      }
    });

    identifies.sort((a, b) => a - b).forEach(identify => result.push(this.identifyMaps[identify]));// 数字排序，字符不变

    return result;
  }
};
