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
    let props = [];
    let hasCall = false;

    function proxy(exctor) {
        return new Proxy(exctor || {}, {
            get: (target, prop) => {
                if (hasCall) {
                    props = [];
                    hasCall = false;
                }

                props.push(prop);
                return proxy(target);
            },
            apply: async (target, ctx, args) => {
                hasCall = true;
                await target(props.join('.'), args);
            }
        });
    }
    
    return proxy(executor);
}

module.exports = CallChain;
