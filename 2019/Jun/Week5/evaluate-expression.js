function expression2nodes(expression) {
    const nodes = [];

    for (let i = 0, len = expression.length; i < len; i++) {
        const c = expression[i];

        if (c !== ' ') {
            if (nodes.length === 0 || (c !== '.' && Number.isNaN(Number(c))) || (nodes[nodes.length - 1] !== '.' && Number.isNaN(Number(nodes[nodes.length - 1])))) {
                nodes.push(c);
            } else {
                nodes[nodes.length - 1] += c;
            }
        }
    }

    return nodes;
}

class NumberNode {
    constructor(data) {
        this.data = data;
        this.preNode = null;
        this.nextNode = null;
    }
}

class OperatorNode {
    constructor(operator) {
        this.operator = operator;
        this.preNode = null;
    }
}

/**
 * 左括号当做数字入栈
 */
class NumberStack {
    constructor() {
        this.curNode = null;
    }

    push(node) {
        if (this.curNode === null) {
            this.curNode = node;
        } else {
            node.preNode = this.curNode;
            this.curNode.nextNode = node;
            this.curNode = node;
        }
    }

    pop() {
        const popNode = this.curNode;
        this.curNode = this.curNode.preNode;
        this.curNode.nextNode = null;
        popNode.preNode = null;
        return popNode;
    }

    static operate(leftNumber, operator, rightNumber) {
        switch (operator) {
            case '+':
                return leftNumber + rightNumber;
            case '-':
                return leftNumber - rightNumber;
            case '*':
                return leftNumber * rightNumber;
            case '/':
                return leftNumber / rightNumber;
            default:
                return leftNumber;
        }
    }

    isLeftBracketPreNode() {
        return this.curNode && this.curNode.preNode && this.curNode.preNode.data === '(';
    }

    calculate(operator) {
        this.curNode.preNode.data = NumberStack.operate(Number(this.curNode.preNode.data), operator, Number(this.curNode.data));
        this.pop();
    }

    removeLeftBracket() {
        this.curNode.preNode.nextNode = null;
        this.curNode.preNode = this.curNode.preNode.preNode;
        if (this.curNode.preNode !== null) {
             this.curNode.preNode.nextNode.preNode = null;
             this.curNode.preNode.nextNode = this.curNode;
        }
    }

    getResult(operator) {
        if (this.curNode === null) {
            return 0;
        }

        if(this.curNode.preNode === null) {
            return Number(this.curNode.data);
        }

        const r = NumberStack.operate(Number(this.curNode.preNode.data), operator, Number(this.curNode.data));
        this.curNode = null;

        return r;
    }
}

class OperatorStack {
    constructor() {
        this.curNode = null;
    }

    push(node) {
        node.preNode = this.curNode;
        this.curNode = node;
    }

    pop() {
        if (this.curNode === null) return null;

        const popNode = this.curNode;
        this.curNode = this.curNode.preNode;
        popNode.preNode = null;
        return popNode;
    }

    isHigher(operator) {
        return this.curNode === null || (['+', '-'].includes(this.curNode.operator) && ['*', '/'].includes(operator));
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
    const dataNodes = expression2nodes(expression);

    const numberStack = new NumberStack();
    const operatorStack = new OperatorStack();

    dataNodes.forEach(data => {
        if(!Number.isNaN(Number(data)) || data === '(') { // is number or is '('
            numberStack.push(new NumberNode(data));
        } else if (data === ')') {
            const operatorNode = operatorStack.pop();
            numberStack.calculate(operatorNode.operator);
            numberStack.removeLeftBracket();
        } else { // + 、- 、* 、/
            if (!operatorStack.isHigher(data) && !numberStack.isLeftBracketPreNode()) {
                const operatorNode = operatorStack.pop();
                numberStack.calculate(operatorNode.operator);
            }

            operatorStack.push(new OperatorNode(data));
        }
    });

    // Must be calculated again at the end
    let operatorNode = operatorStack.pop();
    if (operatorNode !== null) {
        numberStack.calculate(operatorNode.operator);
    }

    operatorNode = operatorStack.pop();
    return numberStack.getResult(operatorNode === null ? '' : operatorNode.operator);
};
