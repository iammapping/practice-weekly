/**
 * 响应式变量
 */
module.exports = class ReactiveVariables {
  constructor(variables) {
    const result = {};
    const variablesObj = Object.assign({}, variables);

    Object.keys(variables).forEach(key => {
      if(typeof variables[key] === 'function') {
        result[key] = variables[key].call(variablesObj);
        variablesObj[key] = result[key];
      } else {
        Object.defineProperty(result, key, {
          get: () => variablesObj[key],
          set: (val) => {
            variablesObj[key] = val;

            Object.keys(result).forEach(k => {
              if(typeof result[k] === 'object') {
                if(Object.keys(result[k]).indexOf(key) > -1) {
                  result[k] = variables[k].call(variablesObj);
                  variablesObj[k] = result[k];
                }
              } else if(typeof variables[k] === 'function') {
                if(variables[k].call(variablesObj) !== result[k]) {
                  result[k] = variables[k].call(variablesObj);
                  variablesObj[k] = result[k];
                }
              }
            })
          },
        })
        result[key] = variables[key];
      }
    })

    return result;
  }
}
