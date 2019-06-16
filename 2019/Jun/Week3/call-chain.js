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
  let inputMethods = [];
  const defaultExecutor = () => {
    throw new TypeError();
  };

  // eslint-disable-next-line compat/compat
  return new Proxy(typeof executor === "function" ? executor : defaultExecutor, {
    get(target, prop, receiver) {
      inputMethods.push(prop);
      return receiver;
    },
    apply(target, thisArg, argArray) {
      const methods = inputMethods;
      inputMethods = [];

      return target(methods.join('.'), argArray);
    }
  });


}

module.exports = CallChain;
