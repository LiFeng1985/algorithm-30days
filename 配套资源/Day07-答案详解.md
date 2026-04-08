# 💡 Day 07 - 练习题答案详解

> **第一周复习与实战**  
> **参考答案与解析**

---

## 一、基础概念题答案

### 题目 1：数据结构对比（20 分）

**参考答案：**

```
数据结构 | 访问   | 插入删除 | 特点       | 典型应用
---------|--------|----------|------------|----------
数组     | O(1)   | O(n)     | 连续存储   | 随机访问
链表     | O(n)   | O(1)     | 指针连接   | 频繁插删
栈       | O(n)   | O(1)     | LIFO      | 撤销功能
队列     | O(n)   | O(1)     | FIFO      | 任务调度
```

**评分要点：**
- 每项正确得 5 分
- 特点和应用合理即可得分

---

### 题目 2：选择合适的数据结构（15 分）

**参考答案：**

**场景 A：实现浏览器的后退功能**
```
选择：栈
理由：最后访问的页面最先回去，符合 LIFO
```

**场景 B：打印任务调度**
```
选择：队列
理由：先提交的任务先打印，符合 FIFO
```

**场景 C：频繁在中间插入删除元素**
```
选择：链表
理由：链表插入删除只需修改指针，O(1) 时间
```

**评分要点：**
- 每个选择 2 分，理由 3 分
- 意思对即可

---

### 题目 3：时间复杂度分析（15 分）

**参考答案：**

```
1. 访问数组的第 i 个元素：O(1)
2. 在链表头部插入节点：O(1)
3. 栈的 push 操作：O(1)
4. 队列的 dequeue 操作：O(1)
5. 递归计算斐波那契数列 F(n)：O(2^n)
```

**评分要点：**
- 每个 3 分
- 第 5 题答 O(n²) 也给 2 分（虽然不是最优但比指数好）

---

## 二、代码实践题答案

### 题目 4：用数组实现栈（20 分）

**参考答案：**

```javascript
class Stack {
    constructor() {
        this.items = [];
    }
    
    push(element) {
        this.items.push(element);
    }
    
    pop() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.pop();
    }
    
    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[this.items.length - 1];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
}
```

**评分要点：**
- 构造函数正确（2 分）
- push 正确（4 分）
- pop 正确（5 分，含边界检查 1 分）
- peek 正确（5 分，含边界检查 1 分）
- isEmpty 正确（2 分）
- size 正确（2 分）

---

### 题目 5：反转链表（20 分）

**参考答案：**

```javascript
function reverseList(head) {
    let prev = null;
    let current = head;
    
    while (current !== null) {
        const nextTemp = current.next;  // 保存下一个节点
        current.next = prev;            // 反转指针
        prev = current;                 // prev 前进一步
        current = nextTemp;             // current 前进一步
    }
    
    return prev;  // prev 是新的头节点
}
```

**评分要点：**
- 三个指针使用正确（6 分）
- 循环逻辑正确（8 分）
- 返回结果正确（4 分）
- 能通过测试（2 分）

---

### 题目 6：括号匹配检测（10 分）

**参考答案：**

```javascript
function isValid(s) {
    const stack = new Stack();
    const map = {
        ')': '(',
        ']': '[',
        '}': '{'
    };
    
    for (let char of s) {
        if (char === '(' || char === '[' || char === '{') {
            stack.push(char);
        } else {
            const top = stack.pop();
            if (top !== map[char]) {
                return false;
            }
        }
    }
    
    return stack.isEmpty();
}
```

**评分要点：**
- 使用栈（3 分）
- 左括号处理正确（2 分）
- 右括号匹配逻辑正确（3 分）
- 最后检查栈空（2 分）

---

## 三、综合应用题答案

### 题目 7：用两个栈实现队列（10 分）

**参考答案：**

```javascript
class QueueWithTwoStacks {
    constructor() {
        this.stack1 = new Stack();  // 入队栈
        this.stack2 = new Stack();  // 出队栈
    }
    
    enqueue(element) {
        this.stack1.push(element);
    }
    
    dequeue() {
        // 如果出队栈为空，把入队栈的元素倒过来
        if (this.stack2.isEmpty()) {
            while (!this.stack1.isEmpty()) {
                this.stack2.push(this.stack1.pop());
            }
        }
        
        if (this.stack2.isEmpty()) {
            return null;  // 队列为空
        }
        
        return this.stack2.pop();
    }
}
```

**思路说明：**
```
stack1 负责接收新元素（入队）
stack2 负责提供旧元素（出队）
当 stack2 为空时，把 stack1 的元素全部倒入 stack2
这样就实现了先进先出
```

**评分要点：**
- 两个栈的分工明确（3 分）
- enqueue 正确（2 分）
- dequeue 的转移逻辑正确（3 分）
- 边界条件处理正确（2 分）

---

### 题目 8：递归求最大公约数（10 分）

**参考答案：**

```javascript
function gcd(a, b) {
    // 基准情况
    if (b === 0) {
        return a;
    }
    
    // 递归调用
    return gcd(b, a % b);
}

// 测试
console.log(gcd(48, 18));  // 6
console.log(gcd(100, 25)); // 25
```

**执行过程：**
```
gcd(48, 18)
= gcd(18, 48 % 18)
= gcd(18, 12)
= gcd(12, 18 % 12)
= gcd(12, 6)
= gcd(6, 12 % 6)
= gcd(6, 0)
= 6
```

**评分要点：**
- 基准情况正确（4 分）
- 递归关系正确（4 分）
- 能通过测试（2 分）

---

## 四、费曼输出答案

### 题目 9：第一周总结（10 分）

**参考模板：**

```
第一周我学了：
1. 算法的基础概念
2. 数组、链表、栈、队列
3. 递归的思想

最重要的是：
理解了不同数据结构的特点和适用场景

最难的是：
递归的理解和应用，需要多练习

我还需要加强：
代码实现的熟练度，特别是链表操作

下周的学习计划：
1. 认真预习树结构
2. 多做编程练习
3. 及时复习不遗忘
```

**评分要点：**
- 内容真实具体（3 分）
- 有自我反思（3 分）
- 有计划性（2 分）
- 态度认真（2 分）

---

## 📊 总分统计

| 题号 | 满分 | 你的得分 | 评语 |
|-----|------|---------|------|
| 题目 1 | 20 | ___ | _____ |
| 题目 2 | 15 | ___ | _____ |
| 题目 3 | 15 | ___ | _____ |
| 题目 4 | 20 | ___ | _____ |
| 题目 5 | 20 | ___ | _____ |
| 题目 6 | 10 | ___ | _____ |
| 题目 7 | 10 | ___ | _____ |
| 题目 8 | 10 | ___ | _____ |
| 题目 9 | 10 | ___ | _____ |
| **总分** | **130** | **___** | _____ |

**评级标准：**
- 🌟🌟🌟 110-130 分：优秀！第一周掌握得很好
- 🌟🌟 90-109 分：良好！基础扎实
- 🌟 70-89 分：合格！继续努力
- 💪 70 分以下：需要重新学习部分内容

---

**🎉 恭喜你完成了第一周的所有练习！**

**你已经掌握了所有基础的线性数据结构！**

**准备好迎接第二周的挑战了吗？** ✨
