/**
 * 响应式变量
 */
module.exports = class ReactiveVariables {
  constructor(variables) {
    const globVar = {};

    Object.keys(variables).forEach(key => {
      let temp = null;

      Object.defineProperty(globVar, key, {
        get: () => {
          if (typeof temp === 'function') {
            return temp.call(globVar);
          }

          if (typeof temp === 'object') {
            return Object.assign({}, temp);
          }
          
          return temp;
        },
        set: val => {
          temp = val;
        },
      });

      globVar[key] = variables[key];
    });

    return globVar;
  }
}
