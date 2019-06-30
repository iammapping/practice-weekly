function Node() {
  this.data = null;
  this.next = null;
}

function Stack() {
  this.top = new Node;
  this.count = 0;
};

function initStack(s) {
  s.top = null;
  s.count = 0;

  return true;
}

function isEmptyStack(s) {
  return s.count === 0;
}

function push(s, e) {
  const n = new Node();
  n.data = e;
  n.next = s.top;
  s.top = n;
  s.count++;
}

function getTop(s) {
  return s.top.data;
}

function priority(o) {
  switch (o) {
    case '(':
      return 3;
    case '*':
    case '/':
      return 2;
    case '+':
    case '-':
      return 1;
    default:
      return 0;
  }
}

function pop(s) {
  if (!s.top) return undefined;

  const node = s.top;
  const e = node.data;
  s.top = node.next;
  s.count--;

  return e;
}

/**
 * 计算四则运算表达式的结果
 *
 * @example
 * expression:
 * 1 + 2 * 3
 * returns:
 * 7
 */
module.exports = function evaluate(expression) {
  const numStack = new Stack();
  const optStack = new Stack();
  const str = String(expression.replace(/\s*/g, ''));
  let i = 0;
  let tmp = 0;
  let j;

  initStack(numStack);
  initStack(optStack);

  /* eslint no-continue:0 */
  while (str[i] !== undefined || !isEmptyStack(optStack)) {
    if (str[i] >= '0' && str[i] <= '9') {
      tmp = tmp * 10 + parseInt(str[i], 10);
      i++;

      if (str[i] < '0' || str[i] > '9' || str[i] === undefined) {
        push(numStack, tmp);
        tmp = 0;
      }
    }
    else {
      if (isEmptyStack(optStack) || (getTop(optStack) === '(' && str[i] !== ')') || priority(str[i]) > priority(getTop(optStack))) {
        push(optStack, str[i]);
        i++;
        continue;
      }

      if (getTop(optStack) === '(' && str[i] === ')') {
        pop(optStack);
        i++;
        continue;
      }

      if ((str[i] === undefined && !isEmptyStack(optStack)) || (str[i] === ')' && getTop(optStack) !== '(') || priority(str[i]) <= priority(getTop(optStack))) {
        switch (pop(optStack)) {
          case '+':
            push(numStack, pop(numStack) + pop(numStack));
            break;
          case '-':
            j = pop(numStack);
            push(numStack, pop(numStack) - j);
            break;
          case '*':
            push(numStack, pop(numStack) * pop(numStack));
            break;
          case '/':
            j = pop(numStack);
            push(numStack, pop(numStack) / j);
            break
          default:
            return undefined;
        }
      }
    }
  }

  return pop(numStack);
};
