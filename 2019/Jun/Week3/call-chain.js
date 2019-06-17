/**
 * 链式调用
 *
 * @param {Function} executor 执行器
 *
 * @example
 * const cc = new CallChain((method, args) => {
 *   console.log(method, args);
 * });
 * cc.a.b.c(1, 2, 3);
 *
 * method: a.b.c
 * args: [1, 2, 3]
 */
function CallChain(executor) {
  if(!executor || typeof executor !== 'function') {
    return () => {
      throw new TypeError();
    }
  }

  let methodArr = [];

  return new Proxy(executor, {
    get(target, property, receiver) {
      methodArr.push(property);
      return receiver;
    },
    apply(target, ctx, args) {
      const tmp = methodArr;
      methodArr = [];
      return target(tmp.join('.'), args);
    }
  });
}

module.exports = CallChain;
