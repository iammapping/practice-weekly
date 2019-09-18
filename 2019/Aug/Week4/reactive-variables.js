/**
 * 响应式变量
 */
module.exports = class ReactiveVariables {
  constructor(variables) {
    const valueCacheMap = {};
    const dependMap = {};
    let currDependKey = '';

    const proxy = new Proxy(variables, {
      get(target, key, receiver) {
        if (currDependKey !== '') {
          (dependMap[key] || (dependMap[key] = new Set())).add(currDependKey);
        }

        if (typeof target[key] === 'function') {
          if (Reflect.has(valueCacheMap, key)) {
            return valueCacheMap[key];
          }

          currDependKey = key;
          const v = Reflect.apply(target[key], proxy, []);
          valueCacheMap[key] = v;
          currDependKey = '';

          return v;
        }

        return Reflect.get(target, key, receiver);
      },
      
      set(target, key, value, receiver) {
        if (dependMap[key]) {
          dependMap[key].forEach(dependKey => {
            Reflect.deleteProperty(valueCacheMap, dependKey);
          });
        }

        Reflect.set(target, key, value, receiver);
      }
    });

    return proxy;
  }
}
