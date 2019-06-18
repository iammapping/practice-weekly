function proxy(executor, prop = null) {
  // eslint-disable-next-line compat/compat
  return new Proxy(executor || {}, {
    get: (target, property) => proxy(target, prop === null ? property : `${prop}.${property}`),

    apply: async (target, ctx, args) => { 
      await target(prop, args) 
    }
  });
}

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
  return proxy(executor)
}

module.exports = CallChain;
