/**
 * 优先队列 - Priority Queue
 * 
 * 什么是优先队列？
 * 优先队列是一种特殊的队列，每个元素都有优先级
 * 出队时，优先级最高的元素先出队（而不是先进先出）
 * 
 * 与普通队列的区别：
 * - 普通队列：FIFO（先进先出）
 * - 优先队列：按优先级出队
 * 
 * 实现方式：
 * 1. 无序数组：插入O(1)，删除O(n)
 * 2. 有序数组：插入O(n)，删除O(1)
 * 3. 二叉堆：插入O(log n)，删除O(log n) ← 最常用
 * 
 * 时间复杂度（使用堆实现）：
 * - 插入：O(log n)
 * - 删除最高优先级：O(log n)
 * - 查看最高优先级：O(1)
 * 
 * 空间复杂度：O(n)
 * 
 * 应用场景：
 * - 任务调度（高优先级任务先执行）
 * - Dijkstra算法
 * - Huffman编码
 * - 合并K个有序链表
 * - Top K问题
 */

/**
 * 最小堆实现（用于优先队列）
 */
class MinHeap {
    constructor() {
        this.heap = [];
    }
    
    /**
     * 获取父节点索引
     * @param {number} index - 当前节点索引
     * @returns {number}
     */
    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }
    
    /**
     * 获取左子节点索引
     * @param {number} index
     * @returns {number}
     */
    getLeftChildIndex(index) {
        return 2 * index + 1;
    }
    
    /**
     * 获取右子节点索引
     * @param {number} index
     * @returns {number}
     */
    getRightChildIndex(index) {
        return 2 * index + 2;
    }
    
    /**
     * 交换两个元素
     * @param {number} i
     * @param {number} j
     */
    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
    
    /**
     * 上浮操作
     * 当插入新元素后，可能需要向上调整
     * @param {number} index - 要上浮的节点索引
     */
    heapifyUp(index) {
        while (index > 0) {
            const parentIndex = this.getParentIndex(index);
            
            // 如果当前节点比父节点小，就交换
            if (this.heap[index].priority < this.heap[parentIndex].priority) {
                this.swap(index, parentIndex);
                index = parentIndex;
            } else {
                break;
            }
        }
    }
    
    /**
     * 下沉操作
     * 当删除根节点后，可能需要向下调整
     * @param {number} index - 要下沉的节点索引
     */
    heapifyDown(index) {
        const size = this.heap.length;
        
        while (true) {
            let smallest = index;
            const left = this.getLeftChildIndex(index);
            const right = this.getRightChildIndex(index);
            
            // 找到最小的节点
            if (left < size && this.heap[left].priority < this.heap[smallest].priority) {
                smallest = left;
            }
            if (right < size && this.heap[right].priority < this.heap[smallest].priority) {
                smallest = right;
            }
            
            // 如果最小的是当前节点，说明已经满足堆性质
            if (smallest === index) {
                break;
            }
            
            // 交换并继续下沉
            this.swap(index, smallest);
            index = smallest;
        }
    }
    
    /**
     * 插入元素
     * 时间复杂度：O(log n)
     * @param {*} value - 值
     * @param {number} priority - 优先级（数字越小优先级越高）
     */
    insert(value, priority) {
        this.heap.push({ value, priority });
        this.heapifyUp(this.heap.length - 1);
    }
    
    /**
     * 提取最小优先级的元素
     * 时间复杂度：O(log n)
     * @returns {Object|null} - {value, priority}，如果堆为空返回null
     */
    extractMin() {
        if (this.heap.length === 0) {
            return null;
        }
        
        if (this.heap.length === 1) {
            return this.heap.pop();
        }
        
        // 保存根节点
        const min = this.heap[0];
        
        // 把最后一个元素移到根
        this.heap[0] = this.heap.pop();
        
        // 下沉调整
        this.heapifyDown(0);
        
        return min;
    }
    
    /**
     * 查看最小优先级的元素（不删除）
     * 时间复杂度：O(1)
     * @returns {Object|null}
     */
    peek() {
        return this.heap.length > 0 ? this.heap[0] : null;
    }
    
    /**
     * 获取堆的大小
     * @returns {number}
     */
    size() {
        return this.heap.length;
    }
    
    /**
     * 判断堆是否为空
     * @returns {boolean}
     */
    isEmpty() {
        return this.heap.length === 0;
    }
}

/**
 * 最大堆实现
 */
class MaxHeap {
    constructor() {
        this.heap = [];
    }
    
    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }
    
    getLeftChildIndex(index) {
        return 2 * index + 1;
    }
    
    getRightChildIndex(index) {
        return 2 * index + 2;
    }
    
    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
    
    heapifyUp(index) {
        while (index > 0) {
            const parentIndex = this.getParentIndex(index);
            
            // 如果当前节点比父节点大，就交换
            if (this.heap[index].priority > this.heap[parentIndex].priority) {
                this.swap(index, parentIndex);
                index = parentIndex;
            } else {
                break;
            }
        }
    }
    
    heapifyDown(index) {
        const size = this.heap.length;
        
        while (true) {
            let largest = index;
            const left = this.getLeftChildIndex(index);
            const right = this.getRightChildIndex(index);
            
            if (left < size && this.heap[left].priority > this.heap[largest].priority) {
                largest = left;
            }
            if (right < size && this.heap[right].priority > this.heap[largest].priority) {
                largest = right;
            }
            
            if (largest === index) {
                break;
            }
            
            this.swap(index, largest);
            index = largest;
        }
    }
    
    insert(value, priority) {
        this.heap.push({ value, priority });
        this.heapifyUp(this.heap.length - 1);
    }
    
    extractMax() {
        if (this.heap.length === 0) {
            return null;
        }
        
        if (this.heap.length === 1) {
            return this.heap.pop();
        }
        
        const max = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        
        return max;
    }
    
    peek() {
        return this.heap.length > 0 ? this.heap[0] : null;
    }
    
    size() {
        return this.heap.length;
    }
    
    isEmpty() {
        return this.heap.length === 0;
    }
}

/**
 * 优先队列类 - 基于最小堆
 */
class PriorityQueue {
    constructor() {
        this.heap = new MinHeap();
    }
    
    /**
     * 入队
     * 时间复杂度：O(log n)
     * @param {*} value - 值
     * @param {number} priority - 优先级（数字越小优先级越高）
     */
    enqueue(value, priority) {
        this.heap.insert(value, priority);
    }
    
    /**
     * 出队（取出优先级最高的元素）
     * 时间复杂度：O(log n)
     * @returns {*} - 值，如果队列为空返回undefined
     */
    dequeue() {
        const item = this.heap.extractMin();
        return item ? item.value : undefined;
    }
    
    /**
     * 查看优先级最高的元素（不出队）
     * 时间复杂度：O(1)
     * @returns {*}
     */
    front() {
        const item = this.heap.peek();
        return item ? item.value : undefined;
    }
    
    /**
     * 判断队列是否为空
     * @returns {boolean}
     */
    isEmpty() {
        return this.heap.isEmpty();
    }
    
    /**
     * 获取队列大小
     * @returns {number}
     */
    size() {
        return this.heap.size();
    }
}

/**
 * 应用1：Top K 问题
 * 
 * 问题：从n个数中找到最大的k个数
 * 
 * 思路：
 * 使用大小为k的最小堆
 * 1. 先把前k个数放入堆
 * 2. 对于后面的数，如果比堆顶大，就替换堆顶
 * 3. 最后堆里的就是最大的k个数
 * 
 * 时间复杂度：O(n log k)
 * 
 * @param {number[]} nums - 数组
 * @param {number} k - 要找的top k
 * @returns {number[]} - 最大的k个数
 */
function topKFrequent(nums, k) {
    // 统计频率
    const freqMap = new Map();
    for (let num of nums) {
        freqMap.set(num, (freqMap.get(num) || 0) + 1);
    }
    
    // 使用最小堆维护top k
    const minHeap = new MinHeap();
    
    for (let [num, freq] of freqMap) {
        if (minHeap.size() < k) {
            minHeap.insert(num, freq);
        } else if (freq > minHeap.peek().priority) {
            minHeap.extractMin();
            minHeap.insert(num, freq);
        }
    }
    
    // 提取结果
    const result = [];
    while (!minHeap.isEmpty()) {
        result.push(minHeap.extractMin().value);
    }
    
    return result;
}

/**
 * 应用2：合并K个有序链表
 * 
 * 思路：
 * 1. 把每个链表的头节点放入最小堆
 * 2. 每次取出最小的节点
 * 3. 如果该节点有下一个节点，就把下一个节点放入堆
 * 4. 重复直到堆为空
 * 
 * 时间复杂度：O(N log k)，N是所有节点总数，k是链表数量
 * 
 * @param {Array} lists - K个有序链表
 * @returns {Array} - 合并后的有序数组
 */
function mergeKSortedLists(lists) {
    const minHeap = new MinHeap();
    
    // 把每个链表的第一个元素放入堆
    lists.forEach((list, listIndex) => {
        if (list.length > 0) {
            minHeap.insert(
                { value: list[0], listIndex, elementIndex: 0 },
                list[0]
            );
        }
    });
    
    const result = [];
    
    while (!minHeap.isEmpty()) {
        const { value, listIndex, elementIndex } = minHeap.extractMin().value;
        result.push(value);
        
        // 如果该链表还有下一个元素，就加入堆
        if (elementIndex + 1 < lists[listIndex].length) {
            const nextValue = lists[listIndex][elementIndex + 1];
            minHeap.insert(
                { value: nextValue, listIndex, elementIndex: elementIndex + 1 },
                nextValue
            );
        }
    }
    
    return result;
}

/**
 * 应用3：任务调度器
 * 
 * 模拟一个任务调度系统，优先级高的任务先执行
 */
class TaskScheduler {
    constructor() {
        this.queue = new PriorityQueue();
        this.taskId = 0;
    }
    
    /**
     * 添加任务
     * @param {string} name - 任务名称
     * @param {number} priority - 优先级（1-10，1最高）
     */
    addTask(name, priority) {
        this.taskId++;
        this.queue.enqueue(
            { id: this.taskId, name, priority },
            priority
        );
        console.log(`添加任务: ${name} (优先级: ${priority})`);
    }
    
    /**
     * 执行下一个任务
     */
    executeNext() {
        if (this.queue.isEmpty()) {
            console.log('没有待执行的任务');
            return null;
        }
        
        const task = this.queue.dequeue();
        console.log(`执行任务: ${task.name} (ID: ${task.id}, 优先级: ${task.priority})`);
        return task;
    }
    
    /**
     * 查看所有待执行任务
     */
    viewTasks() {
        console.log(`待执行任务数: ${this.queue.size()}`);
    }
}

// ==================== 测试代码 ====================

console.log('===== 优先队列基本操作测试 =====\n');

const pq = new PriorityQueue();

console.log('入队（数字越小优先级越高）:');
pq.enqueue('任务C', 3);
pq.enqueue('任务A', 1);
pq.enqueue('任务B', 2);
pq.enqueue('任务D', 1);
console.log('队列大小:', pq.size());
console.log();

console.log('出队顺序（应该按优先级）:');
while (!pq.isEmpty()) {
    console.log('出队:', pq.dequeue());
}
console.log();

console.log('===== Top K 问题测试 =====\n');

const nums = [1, 1, 1, 2, 2, 3];
const k = 2;
console.log(`数组: [${nums}]`);
console.log(`Top ${k} 高频元素:`, topKFrequent(nums, k));
console.log();

const nums2 = [4, 1, -1, 2, -1, 2, 3];
console.log(`数组: [${nums2}]`);
console.log(`Top 3 高频元素:`, topKFrequent(nums2, 3));
console.log();

console.log('===== 合并K个有序链表测试 =====\n');

const lists = [
    [1, 4, 5],
    [1, 3, 4],
    [2, 6]
];

console.log('K个有序链表:');
lists.forEach((list, i) => {
    console.log(`  链表${i + 1}: [${list.join(', ')}]`);
});

const merged = mergeKSortedLists(lists);
console.log('合并后:', `[${merged.join(', ')}]`);
console.log();

console.log('===== 任务调度器测试 =====\n');

const scheduler = new TaskScheduler();

scheduler.addTask('修复紧急bug', 1);
scheduler.addTask('编写文档', 5);
scheduler.addTask('代码审查', 2);
scheduler.addTask('开会', 3);
scheduler.addTask('修复严重bug', 1);
console.log();

scheduler.viewTasks();
console.log();

console.log('执行任务:');
scheduler.executeNext();
scheduler.executeNext();
scheduler.executeNext();
scheduler.executeNext();
scheduler.executeNext();
scheduler.executeNext(); // 队列为空
console.log();

// 性能测试
console.log('===== 性能测试 =====\n');

function measureTime(operation, name) {
    const start = Date.now();
    operation();
    const end = Date.now();
    console.log(`${name}: ${end - start}ms`);
}

// 测试大量插入和删除
console.log('插入和删除10000个元素:');
measureTime(() => {
    const perfPQ = new PriorityQueue();
    for (let i = 0; i < 10000; i++) {
        perfPQ.enqueue(i, Math.random() * 100);
    }
    while (!perfPQ.isEmpty()) {
        perfPQ.dequeue();
    }
}, '优先队列操作');

// 导出类和函数（如果在Node.js环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MinHeap,
        MaxHeap,
        PriorityQueue,
        topKFrequent,
        mergeKSortedLists,
        TaskScheduler
    };
}
