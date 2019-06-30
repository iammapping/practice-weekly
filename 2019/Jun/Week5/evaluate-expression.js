/**
 * 计算四则运算表达式的结果
 *
 * @example
 * expression:
 * 1 + 2 * 3
 * returns:
 * 7
 */
module.exports = function evaluate(expression) {
  expression = expression.replace(/ /g, '');

  function compute(express){
    let result = 0;
    const parenthesizedExpress = express.match(/\(.*?\)/g);

    if (Array.isArray(parenthesizedExpress) && parenthesizedExpress.length) {
      parenthesizedExpress.forEach(item => {
        express = express.replace(item, compute(item.substring(1, item.length - 1)))
      })
    }

    express = express.replace('-', '+-');
    const addArr = express.split('+');

    for(let i = 0; i < addArr.length; i += 1) {
      if (addArr[i].indexOf('*') < 0 && addArr[i].indexOf('-') < 0) {
        result += Number(addArr[i]);
      } else {
        let multiplyResult = 1;
        const multiplyArr= addArr[i].split('*');

        for(let j = 0; j < multiplyArr.length; j += 1) {
          if (multiplyArr[j].indexOf('/') < 0) {
            multiplyResult *= multiplyArr[j];
          } else {
            let divideResult = 0;
            const divideArr = multiplyArr[j].split('/');

            divideArr.forEach(divideItem => {
              if (divideResult === 0) {
                divideResult = divideItem;
              } else {
                divideResult /= Number(divideItem);
              }
            });

            multiplyResult *= divideResult;
          }
        }

        result += multiplyResult;
      }
    }

    return result;
  }

  return compute(expression);
};
