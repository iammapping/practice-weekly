function intersection(a, b) { // 交集
  const result = [];

  for (let i = 0; i < b.length; i++) {
    const temp = b[i];
    for (let j = 0; j < a.length; j++) {
      if (temp === a[j]) {
        result.push(temp);
        break;
      }
    }
  }

  return result;
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

    this.dicts = {};
    this.identifyMaps = {};
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
    let result = [];

    const queies = this.options.queryTokenizer(query);
    if (queies.indexOf(query) === -1) queies.push(query);

    queies.forEach(que => {
      const r = [];

      const noReatIdf = [];
      Object.keys(this.dicts).forEach(key => {
        if (key === que || key.search(query) === 0) {
          (this.dicts[key] || []).forEach(identify => {
            if (noReatIdf.indexOf(identify) === -1) {
              r.push(this.identifyMaps[identify]);
              noReatIdf.push(identify);
            }
          });
        }
      })

      if (result.length === 0) {
        result = r;
      } else if(r.length) {
          result = intersection(result, r);
      }
    });

    return result;
  }
};
