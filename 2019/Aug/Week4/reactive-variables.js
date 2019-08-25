function observer(obj, target) {
  const indeps = {};
  const valueCache = {};
  const waitUpdate = {};
  let currentGetter = '';

  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) {
      break;
    }

    let value = obj[key];

    Object.defineProperty(target, key, {
      // eslint-disable-next-line no-loop-func
      get() {
        if (currentGetter !== '') {
          // 获取依赖
          if (!indeps[key]) {
            indeps[key] = {};
          }

          indeps[key][currentGetter] = true;
        }

        if (typeof value === 'function') {
          currentGetter = key;

          if (valueCache[key] && !waitUpdate[key]) {
            return valueCache[key];
          }

          const getterValue = value.call(target);
          currentGetter = '';
          valueCache[key] = getterValue;


          delete waitUpdate[key];
          return getterValue
        }
        return value;
      },
      set(v) {
        value = v;

        // 如果该key被依赖了
        if (indeps[key]) {
          // 将依赖key的方法名放入待更新对象
          Object.assign(waitUpdate, indeps[key]);
        }
      },
      enumerable: true,
    })
  }
}
/**
 * 响应式变量
 */
module.exports = class ReactiveVariables {
  constructor(variables) {
    observer(variables, this)
  }
}
