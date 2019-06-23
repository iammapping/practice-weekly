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
  const inputMethods = [];

  // eslint-disable-next-line compat/compat
  return new Proxy(executor || {}, {
    get(target, prop, receiver) {
      inputMethods.push(prop);
      return receiver;
    },
    async apply(target, thisArg, argArray) {
      // eslint-disable-next-line no-return-await
      return await target(inputMethods.splice(0, inputMethods.length).join('.'), argArray);
    }
  });


}

module.exports = CallChain;
