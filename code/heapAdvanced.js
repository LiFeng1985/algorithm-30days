/**
 * =====================================================
 * 最小堆和最大堆（完整实现）
 * =====================================================
 * 
 * 【堆是什么？】
 * 堆是一种特殊的完全二叉树，满足：
 * - 最小堆：父节点 <= 子节点
 * - 最大堆：父节点 >= 子节点
 * 
 * 【vs 优先队列】
 * 优先队列通常用堆来实现，堆是底层数据结构。
 * 
 * 【核心操作】
 * 1. insert：插入元素，上浮调整
 * 2. extractMin/Max：删除堆顶，下沉调整
 * 3. heapify：构建堆
 * 
 * 【时间复杂度】
 * - 插入：O(log n)
 * - 删除堆顶：O(log n)
 * - 建堆：O(n)
 * - 查找最值：O(1)
 * 
 * 【应用场景】
 * - Top K问题（找出最大/最小的K个数）
 * - 中位数维护
 * - 任务调度
 * - Dijkstra算法
 * - Huffman编码
 */

class MinHeap {
    constructor() {
        this.heap = [];
    }

    /**
     * 获取父节点索引
     */
    getParentIndex(i) {
        return Math.floor((i - 1) / 2);
    }

    /**
     * 获取左子节点索引
     */
    getLeftIndex(i) {
        return 2 * i + 1;
    }

    /**
     * 获取右子节点索引
     */
    getRightIndex(i) {
        return 2 * i + 2;
    }

    /**
     * 上浮操作（插入后调整）
     */
    siftUp(index) {
        let current = index;
        while (current > 0) {
            const parent = this.getParentIndex(current);
            if (this.heap[current] < this.heap[parent]) {
                [this.heap[current], this.heap[parent]] = 
                [this.heap[parent], this.heap[current]];
                current = parent;
            } else {
                break;
            }
        }
    }

    /**
     * 下沉操作（删除后调整）
     */
    siftDown(index) {
        let current = index;
        const size = this.heap.length;

        while (true) {
            const left = this.getLeftIndex(current);
            const right = this.getRightIndex(current);
            let smallest = current;

            if (left < size && this.heap[left] < this.heap[smallest]) {
                smallest = left;
            }
            if (right < size && this.heap[right] < this.heap[smallest]) {
                smallest = right;
            }

            if (smallest === current) break;

            [this.heap[current], this.heap[smallest]] = 
            [this.heap[smallest], this.heap[current]];
            current = smallest;
        }
    }

    /**
     * 插入元素
     */
    insert(value) {
        this.heap.push(value);
        this.siftUp(this.heap.length - 1);
    }

    /**
     * 删除堆顶元素
     */
    extractMin() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.siftDown(0);
        return min;
    }

    /**
     * 获取堆顶元素（不删除）
     */
    peek() {
        return this.heap.length > 0 ? this.heap[0] : null;
    }

    /**
     * 获取堆大小
     */
    size() {
        return this.heap.length;
    }

    /**
     * 判断是否为空
     */
    isEmpty() {
        return this.heap.length === 0;
    }

    /**
     * 打印堆（数组形式）
     */
    print() {
        console.log('堆:', this.heap);
    }
}

// ========== Top K 问题 ==========

console.log('=== Top K 问题：找出最大的K个数 ===\n');

function findTopK(nums, k) {
    const minHeap = new MinHeap();

    // 维护一个大小为K的最小堆
    for (let num of nums) {
        if (minHeap.size() < k) {
            minHeap.insert(num);
        } else if (num > minHeap.peek()) {
            minHeap.extractMin();
            minHeap.insert(num);
        }
    }

    return minHeap.heap.sort((a, b) => b - a);
}

const nums = [3, 2, 1, 5, 6, 4];
const k = 2;
console.log('数组:', nums);
console.log(`Top ${k}:`, findTopK(nums, k)); // [6, 5]

// ========== 数据流中位数 ==========

console.log('\n=== 数据流中位数 ===\n');

class MedianFinder {
    constructor() {
        this.maxHeap = []; // 存储较小的一半（用负数模拟最大堆）
        this.minHeap = []; // 存储较大的一半
    }

    // 最大堆上浮
    maxHeapSiftUp(arr, index) {
        let current = index;
        while (current > 0) {
            const parent = Math.floor((current - 1) / 2);
            if (arr[current] > arr[parent]) {
                [arr[current], arr[parent]] = [arr[parent], arr[current]];
                current = parent;
            } else break;
        }
    }

    // 最大堆下沉
    maxHeapSiftDown(arr, index) {
        let current = index;
        const size = arr.length;
        while (true) {
            const left = 2 * current + 1;
            const right = 2 * current + 2;
            let largest = current;
            if (left < size && arr[left] > arr[largest]) largest = left;
            if (right < size && arr[right] > arr[largest]) largest = right;
            if (largest === current) break;
            [arr[current], arr[largest]] = [arr[largest], arr[current]];
            current = largest;
        }
    }

    // 最小堆上浮
    minHeapSiftUp(arr, index) {
        let current = index;
        while (current > 0) {
            const parent = Math.floor((current - 1) / 2);
            if (arr[current] < arr[parent]) {
                [arr[current], arr[parent]] = [arr[parent], arr[current]];
                current = parent;
            } else break;
        }
    }

    // 最小堆下沉
    minHeapSiftDown(arr, index) {
        let current = index;
        const size = arr.length;
        while (true) {
            const left = 2 * current + 1;
            const right = 2 * current + 2;
            let smallest = current;
            if (left < size && arr[left] < arr[smallest]) smallest = left;
            if (right < size && arr[right] < arr[smallest]) smallest = right;
            if (smallest === current) break;
            [arr[current], arr[smallest]] = [arr[smallest], arr[current]];
            current = smallest;
        }
    }

    addNum(num) {
        // 先加入最大堆
        this.maxHeap.push(-num);
        this.maxHeapSiftUp(this.maxHeap, this.maxHeap.length - 1);

        // 平衡两个堆
        if (this.maxHeap.length > this.minHeap.length + 1) {
            const val = -this.maxHeap.shift();
            this.maxHeapSiftDown(this.maxHeap, 0);
            this.minHeap.push(val);
            this.minHeapSiftUp(this.minHeap, this.minHeap.length - 1);
        }

        // 确保最大堆的堆顶 <= 最小堆的堆顶
        if (this.maxHeap.length > 0 && this.minHeap.length > 0) {
            if (-this.maxHeap[0] > this.minHeap[0]) {
                const maxVal = -this.maxHeap.shift();
                const minVal = this.minHeap.shift();
                this.maxHeapSiftDown(this.maxHeap, 0);
                this.minHeapSiftDown(this.minHeap, 0);

                this.maxHeap.push(-minVal);
                this.maxHeapSiftUp(this.maxHeap, this.maxHeap.length - 1);
                this.minHeap.push(maxVal);
                this.minHeapSiftUp(this.minHeap, this.minHeap.length - 1);
            }
        }
    }

    findMedian() {
        if (this.maxHeap.length === this.minHeap.length) {
            return (-this.maxHeap[0] + this.minHeap[0]) / 2;
        }
        return -this.maxHeap[0];
    }
}

const finder = new MedianFinder();
const stream = [1, 2, 3, 4, 5];

console.log('数据流:', stream);
stream.forEach(num => {
    finder.addNum(num);
    console.log(`  加入 ${num}, 中位数: ${finder.findMedian()}`);
});
