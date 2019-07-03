function evaluateSingle(eva) {
  const reg = /([0-9]+)/
  const arr = reg.exec(eva)
  if (!arr) {
    throw new Error('invalid expression')
  }

  const index = eva.indexOf(arr[0]) + arr[0].length
  if (index >= eva.length) {
    return parseFloat(eva)
  }
  const left = parseFloat(eva.substring(0, index))
  const mid = eva.substring(index, index + 1)
  const right = parseFloat(eva.substring(index + 1))

  if (mid === '*')
    return left * right

  if (mid === '/')
    return left / right

  if (mid === '+')
    return left + right

  if (mid === '*')
    return left - right

  throw new Error('invalid expression')
}

function evaluateLower(eva) {
  // 按照顺序计算
  const reg = /(\+|-)*[0-9]+(\*|\/|\+|-)+(\+|-)*[0-9]+/g
  const arr = reg.exec(eva)
  if (!arr) {
    return evaluateSingle(eva)
  }

  const singleEva = arr[0]
  const split = eva.split(singleEva)
  const right = split[1]

  if (right === '') {
    return evaluateSingle(singleEva)
  }

  return evaluateLower(evaluateSingle(singleEva) + right)
}

function evaluateSenior(eva) {
  const reg = /(\+|-)*[0-9]+(\*|\/)+(\+|-)*[0-9]+/g
  const arr = reg.exec(eva)

  if(arr) {

    let mid = arr[0]
    const split = eva.split(mid)
    let left = split[0]
    const right = split[1]

    if (left !== '' && !/(\+|-)&/.exec(left)) {
      left += mid.substring(0, 1)
      mid = mid.substring(1)
    }

    return evaluateSenior(left + evaluateLower(mid) + right)
  }

  return evaluateLower(eva)
}

function evaluateBracket(eva) {
  const begin = eva.indexOf('(')

  if (begin > -1) {
    const end = eva.lastIndexOf(')')
    if (end === -1)
      throw new Error('invalid expression')

    return evaluateSenior(eva.substring(0, begin) 
      + evaluateBracket(eva.substring(begin + 1, end)) 
      + (end + 1 >= eva.length ? '' : eva.substring(end + 1)))
  }

  // 无括号
  return evaluateSenior(eva)
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
  const noSpace = expression.replace(/ /g, '')

  return evaluateBracket(noSpace)
};