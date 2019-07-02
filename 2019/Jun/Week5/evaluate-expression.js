/**
 * 计算四则运算表达式的结果
 *
 * @example
 * expression:
 * 1 + 2 * 3
 * returns:
 * 7
 */

function priority(c){
  switch (c) {
    case '+' : return 1;
    case '-' : return 1;
    case '*' : return 2;
    case '/' : return 2;
    default : break;
  }
  return 0;
}

function operate(num1, operator, num2){
  let result;
  switch (operator) {
    case '+' : result =  num1 + num2; break;
    case '-' : result =  num1 - num2; break;
    case '*' : result =  num1 * num2; break;
    case '/' : result =  num2 / num1; break;
    default : break;
  }
  return result;
}

module.exports = function evaluate(expression) {
  expression = expression.replace(/\s+/g,'')
  const optr = [];
  const opnd = [];
  let n = 0;

  for(let i=0; i<expression.length; i++) {
    const c = expression.charAt(i);
    if (/^[0-9]+$/.test(c)) {
      n = 10 * n + parseFloat(c);
    } else {
      if (n !== 0) {
        opnd.push(n);
        n = 0;
      }
      if (c === '(') {
        optr.push(c)
      } else if (c === ')') {
        while (optr[optr.length-1] !== '(') {
          const res = operate(opnd.pop(), optr.pop(), opnd.pop());
          opnd.push(res);
        }
        optr.pop();
      }else if(priority(c)> 0){
        if(optr.length <= 0){
          optr.push(c);
        }else{
          if(priority(optr[optr.length-1])>= priority(c)){
            const res = operate(opnd.pop(), optr.pop(), opnd.pop());
            opnd.push(res);
          }
          optr.push(c);
        }
      }
    }
  }

  if(n !== 0){
    opnd.push(n)
  }
  while (optr.length > 0){
    const res = operate(opnd.pop(), optr.pop(), opnd.pop());
    opnd.push(res);
  }
  return opnd.pop()


};

