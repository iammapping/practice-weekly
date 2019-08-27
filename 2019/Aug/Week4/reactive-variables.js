/**
 * 响应式变量
 */
module.exports = class ReactiveVariables {
  constructor(variables) {
    const obj = {};
    const variablesObj = {};
    Object.keys(variables).forEach(key => {
      if(typeof variables[key] === 'function') {
        Object.defineProperty(obj, key, {
          get: () => {
            const value = variables[key].call(obj);
            if(typeof variablesObj[key] === 'object') {
              let shouldNew = false;
              Object.keys(value).forEach(k => {
                if(variablesObj[key][k] !== value[k]) {
                  shouldNew = true;
                }
              });
              if(shouldNew) {
                variablesObj[key] = value;
              }
            }else {
              variablesObj[key] = value;
            }
            return variablesObj[key];
          }
        });
      }else {
        obj[key] = variables[key];
      }
    });
    return obj;
  }
}
