/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-syntax */
class Node {
  constructor(value) {
    this.value = value
    this.children = []
    this.dataIndexs = []
  }

  getValue() {
    return this.value
  }

  setValue(value) {
    this.value = value
  }

  getDataIndexs() {
    return this.dataIndexs
  }

  addDataIndex(index) {
    this.dataIndexs.push(index)
  }

  add(index, str) {
    if (this.dataIndexs.indexOf(index) === -1) {
      this.dataIndexs.push(index)
    }

    let left = null
    if (this.getValue() === 'root') {
      left = str
    } else if(str.length > 1) {
      left = str.substring(1)
    }

    if (left) {
      const leftFirstChar = left.substring(0, 1)

      let child = null
      for(const childNode of this.children) {
        if (childNode.getValue() === leftFirstChar) {
          child = childNode
          break
        }
      }

      if (child) {
        child.add(index, left)
      } else {
        child = new Node(leftFirstChar)
        child.add(index, left)
        this.children.push(child)
      }
    }
  }

  search(str) {
    const isLast = str.length === 1
    const char = str.substring(0, 1)
    const left = isLast ? null : str.substring(1)

    // eslint-disable-next-line no-restricted-syntax
    for(const child of this.children) {
      if (child.getValue() === char) {
        if (isLast) {
          return child.getDataIndexs()
        } 

        return child.search(left)
      }
    }

    return []
  }

  toJson() {
    const json = {
      value: this.value,
      dataIndexs: this.dataIndexs,
      children: []
    }

    if (this.children) {
      this.children.forEach(child => {
        json.children.push(child.toJson())
      })
    }

    return json
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
      // 是否为交集
      intersection: true
    }, options);

    this.data = []
    this.rootNode = new Node('root')
  }

  add(data) {
    if (!Array.isArray(data)) {
      data = [data]
    }

    data.forEach(item => {
      const index = this.data.length
      this.data.push(item)

      this.options.datumTokenizer(item).forEach(token => {
        if(token && token.length > 0) {
          this.rootNode.add(index, token)
        }
      })
    })
    
  }

  search(query) {
    const retArr = []
    let indexArr = []


    for(const token of this.options.queryTokenizer(query)) {
      const nextIndexArr = this.rootNode.search(token)
      // 第一次循环
      if (indexArr.length === 0) {
        indexArr = nextIndexArr
      } else if(this.options.intersection){
        // 取交集
        const intersection = []
        indexArr.forEach(index => {
          if (nextIndexArr.indexOf(index) > -1) {
            intersection.push(index)
          }
        })
        indexArr = intersection
      } else {
        // 取并集
        nextIndexArr.forEach(index => {
          if (indexArr.indexOf(index) === -1) {
            indexArr.push(index)
          }
        })
      }

      if (indexArr.length === 0) {
        break;
      }
    }

    indexArr.forEach(index => {
      retArr.push(this.data[index])
      
    })
    return retArr
  }
};
