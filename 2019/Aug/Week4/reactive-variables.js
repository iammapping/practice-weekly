/**
 * 响应式变量
 */
class Dep {
  constructor () {
    this.deps = [];
  }

  depend () {
    if (Dep.target && this.deps.indexOf(Dep.target) === -1) {
      this.deps.push(Dep.target);
    }
  }

  notify () {
    this.deps.forEach((dep) => {
      dep();
    })
  }
}

class Observable {
  constructor (obj) {
    Object.keys(obj).forEach((key) => {
        Observable.defineReactive(obj, key, obj[key])
    });
    return obj;
  }

  static defineReactive (obj, key, val) {
    const dep = new Dep();
    Object.defineProperty(obj, key, {
      get () {
        dep.depend();
        return val;
      },
      set (newVal) {
        val = newVal;
        dep.notify();
      }
    })
  }
}

class Watcher {
  constructor (obj, key, cb) {
    this.cb = () => {
      obj[key] = cb.bind(obj).call();
    };
    Dep.target = this.cb;
    this.cb();
    Dep.target = null;
  }
}

module.exports = class ReactiveVariables {
  constructor(variables) {
    const attrs = {};
    const funcs = {};
    Object.keys(variables).forEach((key) => {
      const variable = variables[key];
      if(typeof variables[key] === 'function' ){
        funcs[key] = variable;
      }else{
        attrs[key] = variable;
      }
    });
    this.obj = new Observable(attrs);
    Object.keys(funcs).forEach((key) => {
      // eslint-disable-next-line
      new Watcher(this.obj, key, funcs[key]);
    });
    return this.obj;
  }
};