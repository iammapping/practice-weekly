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
      this.treesObj = {};
  }

    add(data) {
        this.addData = data;
        const treeObj = {};
        data.forEach((item, index) => {
            const needSearchData = this.options.datumTokenizer(item);

            needSearchData.forEach( needSearchItem => {
                let currentTreeObj = treeObj;
                for(let i = 0; i < needSearchItem.length; i += 1) {
                    const currentWord = needSearchItem[i];
                    if(currentTreeObj[currentWord]) {
                        if(currentTreeObj[currentWord].indexes.indexOf(index) < 0) {
                            currentTreeObj[currentWord].indexes.push(index);
                        }
                    } else {
                        currentTreeObj[currentWord] = {indexes: [index], children: {}}
                    }

                    currentTreeObj = currentTreeObj[currentWord].children;
                }
            })
        });

        this.treesObj = treeObj;
    }

    search(query) {
        const result = [];
        const addedDataArr = this.addData;
        const queryData = this.options.queryTokenizer(query);
        const matchedIndexes = [];

        queryData.forEach(queryItem => {
            const matchedIndexesItem = [];
            let currentTreeObj = this.treesObj;

            for(let i = 0; i < queryItem.length; i += 1) {
                const currentWord = queryItem[i];
                if(currentTreeObj[currentWord]) {
                    matchedIndexesItem.push(currentTreeObj[currentWord].indexes);
                    currentTreeObj = currentTreeObj[currentWord].children;
                } else {
                    matchedIndexesItem.push([]);
                    break;
                }
            }
            matchedIndexes.push(matchedIndexesItem);
        });

        let matchedIndexArr = null;
        matchedIndexes.forEach(matchedIndexesItem => {
            const lastMatchIndexes = matchedIndexesItem[matchedIndexesItem.length - 1];
            if(!matchedIndexArr) {
                matchedIndexArr = lastMatchIndexes;
            } else {
                matchedIndexArr.forEach((item, index) => {
                    if(lastMatchIndexes.indexOf(item) < 0) {
                    matchedIndexArr.splice(index, 1);
                }
            });
            }
        });

        matchedIndexArr.forEach(index => {
            result.push(addedDataArr[index]);
        });
        return result;
    }
};
