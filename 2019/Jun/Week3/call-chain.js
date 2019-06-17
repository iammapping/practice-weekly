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
  let methods = [];

// eslint-disable-next-line compat/compat
  return new Proxy({}, {
    get: (targetTop, name) => {
      methods.push(name);

      return (() => {
        // eslint-disable-next-line compat/compat
        const oproxy = new Proxy(executor, {
          get: (target, fnName) => {
            methods.push(fnName);
            return oproxy;
          },
          apply: (target, ctx, args) => {
            const methodsPrams = [].concat(methods);
            methods = [];

            return target(methodsPrams.join('.'), args);
          }
        });

        return oproxy;
      })();
    }
  });
}

module.exports = CallChain;
