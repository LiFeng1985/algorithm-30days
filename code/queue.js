/**
 * 队列 - Queue
 * 
 * 什么是队列？
 * 队列是一种先进先出（FIFO - First In First Out）的线性数据结构
 * 就像排队买票，先来的人先买到
 * 
 * 核心操作：
 * 1. enqueue(element) - 入队：把元素添加到队尾
 * 2. dequeue() - 出队：移除并返回队头元素
 * 3. front() - 查看队头：返回队头元素但不移除
 * 4. isEmpty() - 判断是否为空
 * 5. size() - 获取队列的大小
 * 
 * 时间复杂度：
 * - enqueue: O(1)
 * - dequeue: O(1)
 * - front: O(1)
 * - isEmpty: O(1)
 * - size: O(1)
 * 
 * 空间复杂度：O(n)
 * 
 * 队列的变体：
 * 1. 普通队列：基本的FIFO
 * 2. 双端队列（Deque）：两端都可以插入和删除
 * 3. 优先队列：按优先级出队
 * 4. 循环队列：固定大小，空间循环利用
 * 
 * 应用场景：
 * 1. BFS（广度优先搜索）
 * 2. 任务调度
 * 3. 缓冲区（打印队列、消息队列）
 * 4. 层序遍历二叉树
 * 5. 滑动窗口问题
 */

/**
 * 队列类 - 使用数组实现
 */
class Queue {
    constructor() {
        this.items = [];
    }
    
    /**
     * 入队：把元素添加到队尾
     * 时间复杂度：O(1)
     * @param {*} element - 要入队的元素
     */
    enqueue(element) {
        this.items.push(element);
    }
    
    /**
     * 出队：移除并返回队头元素
     * 时间复杂度：O(n) - 数组shift操作需要移动所有元素
     * @returns {*} - 队头元素，如果队列为空返回 undefined
     */
    dequeue() {
        if (this.isEmpty()) {
            console.warn('队列为空，无法出队');
            return undefined;
        }
        return this.items.shift();
    }
    
    /**
     * 查看队头元素（不移除）
     * 时间复杂度：O(1)
     * @returns {*} - 队头元素
     */
    front() {
        if (this.isEmpty()) {
            console.warn('队列为空');
            return undefined;
        }
        return this.items[0];
    }
    
    /**
     * 查看队尾元素（不移除）
     * 时间复杂度：O(1)
     * @returns {*} - 队尾元素
     */
    back() {
        if (this.isEmpty()) {
            console.warn('队列为空');
            return undefined;
        }
        return this.items[this.items.length - 1];
    }
    
    /**
     * 判断队列是否为空
     * 时间复杂度：O(1)
     * @returns {boolean}
     */
    isEmpty() {
        return this.items.length === 0;
    }
    
    /**
     * 获取队列的大小
     * 时间复杂度：O(1)
     * @returns {number}
     */
    size() {
        return this.items.length;
    }
    
    /**
     * 清空队列
     */
    clear() {
        this.items = [];
    }
    
    /**
     * 打印队列
     */
    print() {
        console.log(`队头 [${this.items.join(', ')}] 队尾`);
    }
}

/**
 * 队列优化版 - 使用两个指针避免shift的性能问题
 * 
 * 问题：数组的shift()操作是O(n)的，因为要移动所有元素
 * 解决：使用head和tail指针，不真正删除元素
 */
class OptimizedQueue {
    constructor() {
        this.items = {};  // 用对象存储
        this.head = 0;    // 队头指针
        this.tail = 0;    // 队尾指针
    }
    
    /**
     * 入队
     * 时间复杂度：O(1)
     * @param {*} element
     */
    enqueue(element) {
        this.items[this.tail] = element;
        this.tail++;
    }
    
    /**
     * 出队
     * 时间复杂度：O(1) 均摊
     * @returns {*}
     */
    dequeue() {
        if (this.isEmpty()) {
            return undefined;
        }
        
        const element = this.items[this.head];
        delete this.items[this.head]; // 删除引用，帮助垃圾回收
        this.head++;
        
        return element;
    }
    
    /**
     * 查看队头
     * @returns {*}
     */
    front() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[this.head];
    }
    
    /**
     * 判断是否为空
     * @returns {boolean}
     */
    isEmpty() {
        return this.tail - this.head === 0;
    }
    
    /**
     * 获取大小
     * @returns {number}
     */
    size() {
        return this.tail - this.head;
    }
}

/**
 * 双端队列 - Deque (Double Ended Queue)
 * 
 * 特点：两端都可以插入和删除
 * 
 * 应用场景：
 * - 滑动窗口最大值
 * - 回文检测
 */
class Deque {
    constructor() {
        this.items = {};
        this.front = 0;
        this.rear = 0;
    }
    
    /**
     * 在队头添加元素
     * @param {*} element
     */
    addFront(element) {
        if (this.isEmpty()) {
            this.items[0] = element;
        } else if (this.front > 0) {
            this.front--;
            this.items[this.front] = element;
        } else {
            // front已经是0，需要重新索引
            for (let i = this.rear - 1; i >= this.front; i--) {
                this.items[i + 1] = this.items[i];
            }
            this.items[this.front] = element;
            this.rear++;
        }
    }
    
    /**
     * 在队尾添加元素
     * @param {*} element
     */
    addRear(element) {
        this.items[this.rear] = element;
        this.rear++;
    }
    
    /**
     * 从队头移除元素
     * @returns {*}
     */
    removeFront() {
        if (this.isEmpty()) {
            return undefined;
        }
        const element = this.items[this.front];
        delete this.items[this.front];
        this.front++;
        return element;
    }
    
    /**
     * 从队尾移除元素
     * @returns {*}
     */
    removeRear() {
        if (this.isEmpty()) {
            return undefined;
        }
        this.rear--;
        const element = this.items[this.rear];
        delete this.items[this.rear];
        return element;
    }
    
    /**
     * 查看队头
     * @returns {*}
     */
    peekFront() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[this.front];
    }
    
    /**
     * 查看队尾
     * @returns {*}
     */
    peekRear() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[this.rear - 1];
    }
    
    /**
     * 判断是否为空
     * @returns {boolean}
     */
    isEmpty() {
        return this.rear - this.front === 0;
    }
    
    /**
     * 获取大小
     * @returns {number}
     */
    size() {
        return this.rear - this.front;
    }
}

/**
 * 应用1：击鼓传花游戏
 * 
 * 规则：
 * 1. n个人围成一圈
 * 2. 从第一个人开始传花，传m次
 * 3. 拿到花的人出局
 * 4. 重复直到只剩一人
 * 
 * @param {string[]} names - 参与者名字列表
 * @param {number} num - 传递次数
 * @returns {string} - 获胜者
 */
function hotPotato(names, num) {
    const queue = new Queue();
    
    // 所有人入队
    names.forEach(name => queue.enqueue(name));
    
    console.log(`参与者: ${names.join(', ')}`);
    console.log(`传递次数: ${num}\n`);
    
    while (queue.size() > 1) {
        // 传递num次
        for (let i = 0; i < num; i++) {
            queue.enqueue(queue.dequeue());
        }
        
        // 拿到花的人出局
        const eliminated = queue.dequeue();
        console.log(`${eliminated} 出局`);
    }
    
    const winner = queue.dequeue();
    console.log(`\n获胜者: ${winner}`);
    return winner;
}

/**
 * 应用2：回文检测
 * 
 * 回文：正读和反读都一样的字符串
 * 例如："madam"、"racecar"、"12321"
 * 
 * 思路：使用双端队列，从两端同时比较
 * 
 * @param {string} str - 要检测的字符串
 * @returns {boolean} - 是否是回文
 */
function isPalindrome(str) {
    const deque = new Deque();
    
    // 去掉空格和标点，转小写
    const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // 所有字符入队
    for (let char of cleanStr) {
        deque.addRear(char);
    }
    
    // 从两端同时比较
    while (deque.size() > 1) {
        const first = deque.removeFront();
        const last = deque.removeRear();
        
        if (first !== last) {
            return false;
        }
    }
    
    return true;
}

/**
 * 应用3：最近请求次数
 * 
 * 模拟一个系统，统计最近3000毫秒内的请求数
 * 
 * 思路：
 * 1. 每次请求的时间戳入队
 * 2. 移除超过3000ms的旧请求
 * 3. 返回队列大小
 */
class RecentCounter {
    constructor() {
        this.queue = new Queue();
    }
    
    /**
     * 添加一个新请求
     * @param {number} t - 请求的时间戳（毫秒）
     * @returns {number} - 最近3000ms内的请求数
     */
    ping(t) {
        this.queue.enqueue(t);
        
        // 移除超过3000ms的旧请求
        while (!this.queue.isEmpty() && this.queue.front() < t - 3000) {
            this.queue.dequeue();
        }
        
        return this.queue.size();
    }
}

// ==================== 测试代码 ====================

console.log('===== 队列基本操作测试 =====\n');

const queue = new Queue();
console.log('创建空队列');
console.log('是否为空:', queue.isEmpty());
console.log('大小:', queue.size());
console.log();

console.log('入队: 10, 20, 30');
queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);
queue.print();
console.log('队头:', queue.front());
console.log('队尾:', queue.back());
console.log('大小:', queue.size());
console.log();

console.log('出队:', queue.dequeue());
queue.print();
console.log('出队:', queue.dequeue());
queue.print();
console.log();

console.log('===== 优化队列测试 =====\n');

const optQueue = new OptimizedQueue();
console.log('入队: 1, 2, 3, 4, 5');
optQueue.enqueue(1);
optQueue.enqueue(2);
optQueue.enqueue(3);
optQueue.enqueue(4);
optQueue.enqueue(5);
console.log('队头:', optQueue.front());
console.log('大小:', optQueue.size());
console.log('出队:', optQueue.dequeue());
console.log('出队:', optQueue.dequeue());
console.log('剩余大小:', optQueue.size());
console.log();

console.log('===== 双端队列测试 =====\n');

const deque = new Deque();
console.log('从队尾添加: 10, 20, 30');
deque.addRear(10);
deque.addRear(20);
deque.addRear(30);
console.log('队头:', deque.peekFront());
console.log('队尾:', deque.peekRear());
console.log();

console.log('从队头添加: 5');
deque.addFront(5);
console.log('队头:', deque.peekFront());
console.log('队尾:', deque.peekRear());
console.log();

console.log('从队头移除:', deque.removeFront());
console.log('从队尾移除:', deque.removeRear());
console.log('剩余大小:', deque.size());
console.log();

console.log('===== 击鼓传花游戏 =====\n');

const players = ['Alice', 'Bob', 'Charlie', 'David', 'Eve'];
hotPotato(players, 7);
console.log();

console.log('===== 回文检测 =====\n');

const testStrings = [
    'madam',
    'racecar',
    'hello',
    '12321',
    'A man a plan a canal Panama',
    'Was it a car or a cat I saw'
];

testStrings.forEach(str => {
    const result = isPalindrome(str);
    console.log(`"${str}" -> ${result ? '✓ 是回文' : '✗ 不是回文'}`);
});
console.log();

console.log('===== 最近请求次数 =====\n');

const counter = new RecentCounter();
console.log('ping(1):', counter.ping(1));      // 1
console.log('ping(100):', counter.ping(100));   // 2
console.log('ping(3001):', counter.ping(3001)); // 3
console.log('ping(3002):', counter.ping(3002)); // 3 (ping(1)已过期)
console.log();

// 导出类和函数（如果在Node.js环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Queue,
        OptimizedQueue,
        Deque,
        hotPotato,
        isPalindrome,
        RecentCounter
    };
}
