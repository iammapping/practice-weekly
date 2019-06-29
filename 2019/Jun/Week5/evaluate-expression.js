function precedence(opt) {
  switch (opt) {
    case "+":
    case "-":
      return 1;
    case "*":
    case "/":
      return 2;
    case "(":
      return 3;
    default:
      return 0;
  }
}

function peek(stack) {
  return stack.slice(-1)[0];
}

function basicOperation(n1, n2, opt) {
  switch (opt) {
    case "+":
      return n1 + n2;
    case "-":
      return n1 - n2;
    case "*":
      return n2 * n1;
    case "/":
      return n2 / n1;
    default:
      return 0;
  }
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
  const values = [];
  const opts = [];

  for (let i = 0; i < expression.length; i++) {
    if (expression.charCodeAt(i) >= 48 && expression.charCodeAt(i) <= 57) {

      let numberString = "";
      while (i < expression.length) {
        numberString += expression[i];

        if (!(expression.charCodeAt(i + 1) >= 48 && expression.charCodeAt(i + 1) <= 57)) {
          break;
        }

        i++;
      }
      values.push(parseInt(numberString, 10));

    } else if (expression[i] === '(') {
      opts.push(expression[i]);

    } else if (expression[i] === ')') {
      while (opts.length && peek(opts) !== '(') {
        values.push(basicOperation(values.pop(), values.pop(), opts.pop()));
      }
      opts.pop();

    } else if (expression[i] === '*' || expression[i] === '/' || expression[i] === '+' || expression[i] === '-') {
      while (opts.length && peek(opts) !== '(' && precedence(peek(opts)) > precedence(expression[i])) {
        values.push(basicOperation(values.pop(), values.pop(), opts.pop()));
      }
      opts.push(expression[i]);
    }
  }

  while (opts.length) {
    values.push(basicOperation(values.pop(), values.pop(), opts.pop()));
  }

  return values.pop();
};
