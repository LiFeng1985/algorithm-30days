/**
 * 栈 - Stack
 * 
 * 什么是栈？
 * 栈是一种后进先出（LIFO - Last In First Out）的线性数据结构
 * 就像一摞盘子，只能从顶部放或取
 * 
 * 核心操作：
 * 1. push(element) - 入栈：把元素放到栈顶
 * 2. pop() - 出栈：移除并返回栈顶元素
 * 3. peek() - 查看栈顶：返回栈顶元素但不移除
 * 4. isEmpty() - 判断是否为空
 * 5. size() - 获取栈的大小
 * 
 * 时间复杂度：
 * - push: O(1)
 * - pop: O(1)
 * - peek: O(1)
 * - isEmpty: O(1)
 * - size: O(1)
 * 
 * 空间复杂度：O(n)
 * 
 * 应用场景：
 * 1. 函数调用栈
 * 2. 表达式求值（中缀转后缀）
 * 3. 括号匹配
 * 4. 浏览器的前进后退
 * 5. 撤销操作（Undo）
 * 6. 深度优先搜索（DFS）
 * 7. 回文检测
 */

/**
 * 栈类 - 使用数组实现
 */
class Stack {
    constructor() {
        this.items = []; // 用数组存储元素
    }
    
    /**
     * 入栈：把元素添加到栈顶
     * 时间复杂度：O(1)
     * @param {*} element - 要入栈的元素
     */
    push(element) {
        this.items.push(element);
    }
    
    /**
     * 出栈：移除并返回栈顶元素
     * 时间复杂度：O(1)
     * @returns {*} - 栈顶元素，如果栈为空返回 undefined
     */
    pop() {
        if (this.isEmpty()) {
            console.warn('栈为空，无法出栈');
            return undefined;
        }
        return this.items.pop();
    }
    
    /**
     * 查看栈顶元素（不移除）
     * 时间复杂度：O(1)
     * @returns {*} - 栈顶元素，如果栈为空返回 undefined
     */
    peek() {
        if (this.isEmpty()) {
            console.warn('栈为空');
            return undefined;
        }
        return this.items[this.items.length - 1];
    }
    
    /**
     * 判断栈是否为空
     * 时间复杂度：O(1)
     * @returns {boolean}
     */
    isEmpty() {
        return this.items.length === 0;
    }
    
    /**
     * 获取栈的大小
     * 时间复杂度：O(1)
     * @returns {number}
     */
    size() {
        return this.items.length;
    }
    
    /**
     * 清空栈
     */
    clear() {
        this.items = [];
    }
    
    /**
     * 将栈转换为字符串
     * @returns {string}
     */
    toString() {
        return this.items.toString();
    }
    
    /**
     * 打印栈的内容
     */
    print() {
        console.log(`栈底 [${this.items.join(', ')}] 栈顶`);
    }
}

/**
 * 应用1：括号匹配
 * 
 * 问题：判断一个字符串中的括号是否匹配
 * 例如："()"、"([])"、"{[()]}" 是匹配的
 *       "("、"([)]"、"(((" 是不匹配的
 * 
 * 思路：
 * 1. 遇到左括号就入栈
 * 2. 遇到右括号就检查栈顶是否是对应的左括号
 * 3. 最后检查栈是否为空
 * 
 * @param {string} str - 包含括号的字符串
 * @returns {boolean} - 括号是否匹配
 */
function isValidParentheses(str) {
    const stack = new Stack();
    const mapping = {
        ')': '(',
        ']': '[',
        '}': '{'
    };
    const leftBrackets = '([{';
    const rightBrackets = ')]}';
    
    for (let char of str) {
        if (leftBrackets.includes(char)) {
            // 左括号，入栈
            stack.push(char);
        } else if (rightBrackets.includes(char)) {
            // 右括号，检查栈顶
            if (stack.isEmpty() || stack.peek() !== mapping[char]) {
                return false;
            }
            stack.pop();
        }
    }
    
    // 最后栈应该为空
    return stack.isEmpty();
}

/**
 * 应用2：十进制转二进制
 * 
 * 思路：
 * 1. 不断除以2，余数入栈
 * 2. 直到商为0
 * 3. 依次出栈，得到二进制表示
 * 
 * @param {number} decimal - 十进制数
 * @returns {string} - 二进制字符串
 */
function decimalToBinary(decimal) {
    if (decimal === 0) {
        return '0';
    }
    
    const stack = new Stack();
    let num = Math.abs(decimal);
    
    while (num > 0) {
        stack.push(num % 2);
        num = Math.floor(num / 2);
    }
    
    let binary = '';
    while (!stack.isEmpty()) {
        binary += stack.pop();
    }
    
    return decimal < 0 ? '-' + binary : binary;
}

/**
 * 应用3：逆波兰表达式求值
 * 
 * 什么是逆波兰表达式（后缀表达式）？
 * - 普通表达式（中缀）：3 + 4 * 2
 * - 后缀表达式：3 4 2 * +
 * 
 * 优点：不需要括号，不需要考虑运算符优先级
 * 
 * 求值思路：
 * 1. 遇到数字就入栈
 * 2. 遇到运算符就弹出两个数字，计算后结果入栈
 * 3. 最后栈里剩下的就是结果
 * 
 * @param {string[]} tokens - 后缀表达式的token数组
 * @returns {number} - 计算结果
 */
function evalRPN(tokens) {
    const stack = new Stack();
    const operators = '+-*/';
    
    for (let token of tokens) {
        if (operators.includes(token)) {
            // 运算符，弹出两个数计算
            const b = stack.pop();
            const a = stack.pop();
            
            let result;
            switch (token) {
                case '+':
                    result = a + b;
                    break;
                case '-':
                    result = a - b;
                    break;
                case '*':
                    result = a * b;
                    break;
                case '/':
                    // JavaScript除法会保留小数，需要向零取整
                    result = Math.trunc(a / b);
                    break;
            }
            
            stack.push(result);
        } else {
            // 数字，入栈
            stack.push(parseInt(token));
        }
    }
    
    return stack.pop();
}

/**
 * 应用4：最小栈
 * 
 * 设计一个栈，支持在 O(1) 时间内获取最小元素
 * 
 * 思路：
 * 使用两个栈：
 * - 主栈：存储所有元素
 * - 最小栈：存储每个状态下的最小值
 */
class MinStack {
    constructor() {
        this.stack = new Stack();
        this.minStack = new Stack();
    }
    
    /**
     * 入栈
     * @param {number} value
     */
    push(value) {
        this.stack.push(value);
        
        // 如果最小栈为空，或者新值 <= 当前最小值，就入最小栈
        if (this.minStack.isEmpty() || value <= this.minStack.peek()) {
            this.minStack.push(value);
        }
    }
    
    /**
     * 出栈
     * @returns {number}
     */
    pop() {
        if (this.stack.isEmpty()) {
            return undefined;
        }
        
        const value = this.stack.pop();
        
        // 如果弹出的值等于最小栈的栈顶，也要弹出最小栈
        if (value === this.minStack.peek()) {
            this.minStack.pop();
        }
        
        return value;
    }
    
    /**
     * 获取栈顶元素
     * @returns {number}
     */
    top() {
        return this.stack.peek();
    }
    
    /**
     * 获取最小值
     * @returns {number}
     */
    getMin() {
        return this.minStack.peek();
    }
}

// ==================== 测试代码 ====================

console.log('===== 栈基本操作测试 =====\n');

const stack = new Stack();
console.log('创建空栈');
console.log('是否为空:', stack.isEmpty());
console.log('大小:', stack.size());
console.log();

console.log('入栈: 10, 20, 30');
stack.push(10);
stack.push(20);
stack.push(30);
stack.print();
console.log('栈顶元素:', stack.peek());
console.log('大小:', stack.size());
console.log();

console.log('出栈:', stack.pop());
stack.print();
console.log('出栈:', stack.pop());
stack.print();
console.log();

console.log('===== 括号匹配测试 =====\n');

const testCases = [
    '()',
    '()[]{}',
    '(]',
    '([)]',
    '{[]}',
    '((()))',
    '(()',
    ''
];

testCases.forEach(test => {
    const result = isValidParentheses(test);
    console.log(`"${test}" -> ${result ? '✓ 匹配' : '✗ 不匹配'}`);
});
console.log();

console.log('===== 十进制转二进制测试 =====\n');

const numbers = [0, 1, 2, 10, 255, 1024];
numbers.forEach(num => {
    const binary = decimalToBinary(num);
    console.log(`${num} -> ${binary} (验证: ${parseInt(binary, 2)})`);
});
console.log();

console.log('===== 逆波兰表达式求值测试 =====\n');

const expressions = [
    ['2', '1', '+', '3', '*'],           // (2 + 1) * 3 = 9
    ['4', '13', '5', '/', '+'],          // 4 + (13 / 5) = 6
    ['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']  // 22
];

expressions.forEach((expr, index) => {
    const result = evalRPN(expr);
    console.log(`表达式 ${index + 1}: ${expr.join(' ')} = ${result}`);
});
console.log();

console.log('===== 最小栈测试 =====\n');

const minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
console.log('当前最小值:', minStack.getMin()); // -3
console.log('出栈:', minStack.pop());
console.log('栈顶元素:', minStack.top());      // 0
console.log('当前最小值:', minStack.getMin());  // -2
console.log();

// 导出类和函数（如果在Node.js环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Stack,
        MinStack,
        isValidParentheses,
        decimalToBinary,
        evalRPN
    };
}
