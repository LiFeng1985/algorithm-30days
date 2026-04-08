/**
 * 堆排序 - Heap Sort
 * 
 * 核心思想：
 * 1. 把数组构建成一个最大堆（或最小堆）
 * 2. 每次取出堆顶元素（最大值），放到数组末尾
 * 3. 调整剩余元素，重新形成堆
 * 4. 重复步骤2-3，直到所有元素都排好序
 * 
 * 什么是堆？
 * - 堆是一种完全二叉树
 * - 最大堆：父节点的值 >= 子节点的值
 * - 最小堆：父节点的值 <= 子节点的值
 * 
 * 数组表示堆：
 * - 对于索引为 i 的节点：
 *   - 父节点索引: Math.floor((i - 1) / 2)
 *   - 左子节点索引: 2 * i + 1
 *   - 右子节点索引: 2 * i + 2
 * 
 * 时间复杂度：
 * - 最好情况：O(n log n)
 * - 平均情况：O(n log n)
 * - 最坏情况：O(n log n)
 * 
 * 空间复杂度：O(1) - 原地排序
 * 
 * 稳定性：不稳定 - 堆调整可能改变相等元素的相对顺序
 * 
 * 优点：
 * - 性能稳定，不会退化
 * - 原地排序，不需要额外空间
 * - 适合找Top K问题
 * 
 * 缺点：
 * - 不稳定
 * - 常数因子较大，实际性能不如快速排序
 * 
 * 适用场景：
 * - 需要稳定的 O(n log n) 性能
 * - 内存受限
 * - Top K 问题
 * - 优先队列实现
 * 
 * @param {number[]} arr - 待排序的数组
 * @returns {number[]} - 排序后的数组（原地修改）
 */
function heapSort(arr) {
    const n = arr.length;
    
    console.log('原始数组:', arr);
    
    // 第1步：构建最大堆
    // 从最后一个非叶子节点开始，向前调整
    // 最后一个非叶子节点的索引是 Math.floor(n/2) - 1
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
        console.log(`构建堆 - 调整节点 ${i}: [${arr.join(', ')}]`);
    }
    
    console.log('构建完成的最大堆:', arr);
    
    // 第2步：逐个提取元素
    // 从最后一个元素开始，把堆顶（最大值）交换到末尾
    for (let i = n - 1; i > 0; i--) {
        // 把堆顶（最大值）交换到位置 i
        [arr[0], arr[i]] = [arr[i], arr[0]];
        console.log(`提取最大值 ${arr[i]}，放到位置 ${i}`);
        
        // 对剩余的元素重新调整堆
        // 现在堆的大小是 i（因为位置 i 已经是排好序的）
        heapify(arr, i, 0);
        console.log(`调整后: [${arr.slice(0, i).join(', ')}] | 已排序: [${arr.slice(i).join(', ')}]`);
    }
    
    return arr;
}

/**
 * 堆调整（下沉操作）
 * 
 * 工作原理：
 * 1. 假设当前节点可能违反了堆的性质
 * 2. 比较当前节点和它的子节点
 * 3. 如果子节点更大，就交换
 * 4. 继续向下调整，直到满足堆的性质
 * 
 * @param {number[]} arr - 数组
 * @param {number} heapSize - 堆的大小
 * @param {number} root - 要调整的根节点索引
 */
function heapify(arr, heapSize, root) {
    let largest = root; // 假设根节点是最大的
    const left = 2 * root + 1; // 左子节点
    const right = 2 * root + 2; // 右子节点
    
    // 如果左子节点存在且比根节点大
    if (left < heapSize && arr[left] > arr[largest]) {
        largest = left;
    }
    
    // 如果右子节点存在且比当前最大值大
    if (right < heapSize && arr[right] > arr[largest]) {
        largest = right;
    }
    
    // 如果最大值不是根节点，就交换并继续调整
    if (largest !== root) {
        [arr[root], arr[largest]] = [arr[largest], arr[root]];
        // 递归调整被交换的子树
        heapify(arr, heapSize, largest);
    }
}

/**
 * 堆排序 - 使用类实现（更面向对象）
 * 
 * 这个实现展示了如何用类来封装堆的操作
 * 更适合在实际项目中使用
 */
class MaxHeap {
    constructor(arr = []) {
        this.heap = [];
        // 如果传入了数组，就构建堆
        if (arr.length > 0) {
            this.buildHeap(arr);
        }
    }
    
    /**
     * 构建最大堆
     * @param {number[]} arr - 输入数组
     */
    buildHeap(arr) {
        this.heap = [...arr];
        // 从最后一个非叶子节点开始调整
        for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
            this.heapifyDown(i);
        }
    }
    
    /**
     * 获取父节点索引
     * @param {number} index - 当前节点索引
     * @returns {number} - 父节点索引
     */
    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }
    
    /**
     * 获取左子节点索引
     * @param {number} index - 当前节点索引
     * @returns {number} - 左子节点索引
     */
    getLeftChildIndex(index) {
        return 2 * index + 1;
    }
    
    /**
     * 获取右子节点索引
     * @param {number} index - 当前节点索引
     * @returns {number} - 右子节点索引
     */
    getRightChildIndex(index) {
        return 2 * index + 2;
    }
    
    /**
     * 上浮操作（用于插入）
     * @param {number} index - 要上浮的节点索引
     */
    heapifyUp(index) {
        while (index > 0) {
            const parentIndex = this.getParentIndex(index);
            if (this.heap[index] > this.heap[parentIndex]) {
                [this.heap[index], this.heap[parentIndex]] = 
                    [this.heap[parentIndex], this.heap[index]];
                index = parentIndex;
            } else {
                break;
            }
        }
    }
    
    /**
     * 下沉操作（用于删除和调整）
     * @param {number} index - 要下沉的节点索引
     */
    heapifyDown(index) {
        const size = this.heap.length;
        let largest = index;
        
        while (true) {
            const left = this.getLeftChildIndex(index);
            const right = this.getRightChildIndex(index);
            
            // 找到最大的节点
            if (left < size && this.heap[left] > this.heap[largest]) {
                largest = left;
            }
            if (right < size && this.heap[right] > this.heap[largest]) {
                largest = right;
            }
            
            // 如果最大的是当前节点，说明已经满足堆性质
            if (largest === index) {
                break;
            }
            
            // 交换并继续下沉
            [this.heap[index], this.heap[largest]] = 
                [this.heap[largest], this.heap[index]];
            index = largest;
        }
    }
    
    /**
     * 插入元素
     * @param {number} value - 要插入的值
     */
    insert(value) {
        this.heap.push(value);
        // 新元素添加到末尾，需要上浮
        this.heapifyUp(this.heap.length - 1);
    }
    
    /**
     * 提取最大值（堆顶）
     * @returns {number|null} - 最大值，如果堆为空返回 null
     */
    extractMax() {
        if (this.heap.length === 0) {
            return null;
        }
        
        if (this.heap.length === 1) {
            return this.heap.pop();
        }
        
        // 保存最大值
        const max = this.heap[0];
        // 把最后一个元素移到堆顶
        this.heap[0] = this.heap.pop();
        // 下沉调整
        this.heapifyDown(0);
        
        return max;
    }
    
    /**
     * 获取堆顶元素（不删除）
     * @returns {number|null} - 堆顶元素
     */
    peek() {
        return this.heap.length > 0 ? this.heap[0] : null;
    }
    
    /**
     * 获取堆的大小
     * @returns {number} - 堆的大小
     */
    size() {
        return this.heap.length;
    }
    
    /**
     * 判断堆是否为空
     * @returns {boolean} - 是否为空
     */
    isEmpty() {
        return this.heap.length === 0;
    }
    
    /**
     * 获取堆的数组表示
     * @returns {number[]} - 堆数组
     */
    toArray() {
        return [...this.heap];
    }
}

/**
 * 使用堆类进行排序
 * @param {number[]} arr - 待排序的数组
 * @returns {number[]} - 排序后的数组（降序）
 */
function heapSortWithClass(arr) {
    // 创建最大堆
    const heap = new MaxHeap(arr);
    const sorted = [];
    
    // 逐个提取最大值
    while (!heap.isEmpty()) {
        sorted.push(heap.extractMax());
    }
    
    // 因为是最大堆，所以结果是降序的
    // 如果需要升序，就反转数组
    return sorted.reverse();
}

// ==================== 测试代码 ====================

console.log('===== 堆排序测试 =====\n');

// 测试用例1：普通数组
console.log('测试1：普通数组');
const test1 = [12, 11, 13, 5, 6, 7];
console.log('排序前:', test1);
heapSort([...test1]);
console.log();

// 测试用例2：已经有序的数组
console.log('测试2：已排序数组');
const test2 = [1, 2, 3, 4, 5];
console.log('排序前:', test2);
heapSort([...test2]);
console.log();

// 测试用例3：完全逆序的数组
console.log('测试3：逆序数组');
const test3 = [5, 4, 3, 2, 1];
console.log('排序前:', test3);
heapSort([...test3]);
console.log();

// 测试用例4：包含重复元素
console.log('测试4：包含重复元素');
const test4 = [3, 1, 4, 1, 5, 9, 2, 6, 5];
console.log('排序前:', test4);
heapSort([...test4]);
console.log();

// 测试用例5：空数组
console.log('测试5：空数组');
const test5 = [];
console.log('排序前:', test5);
heapSort(test5);
console.log('排序后:', test5);
console.log();

// 测试用例6：单元素数组
console.log('测试6：单元素数组');
const test6 = [42];
console.log('排序前:', test6);
heapSort(test6);
console.log('排序后:', test6);
console.log();

// 测试堆类
console.log('===== 堆类测试 =====\n');

const heap = new MaxHeap();
console.log('插入元素: 10, 20, 15, 30, 25');
heap.insert(10);
heap.insert(20);
heap.insert(15);
heap.insert(30);
heap.insert(25);
console.log('堆数组:', heap.toArray());
console.log('堆顶元素:', heap.peek());
console.log('提取最大值:', heap.extractMax());
console.log('提取后堆数组:', heap.toArray());
console.log('堆大小:', heap.size());
console.log();

// 测试用堆类排序
console.log('===== 使用堆类排序 =====\n');
const test7 = [12, 11, 13, 5, 6, 7];
console.log('排序前:', test7);
const sorted7 = heapSortWithClass([...test7]);
console.log('排序后:', sorted7);
console.log();

// 性能对比测试
console.log('===== 性能对比测试 =====\n');

function generateRandomArray(size) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 10000));
}

function measureTime(sortFunc, arr, name) {
    const start = Date.now();
    sortFunc([...arr]);
    const end = Date.now();
    console.log(`${name}: ${end - start}ms`);
}

// 生成不同大小的随机数组
const sizes = [1000, 10000, 100000];

sizes.forEach(size => {
    const randomArr = generateRandomArray(size);
    console.log(`\n数组大小: ${size}`);
    measureTime(heapSort, randomArr, '堆排序（函数式）');
    measureTime(heapSortWithClass, randomArr, '堆排序（类实现）');
});

// 验证正确性
console.log('\n===== 正确性验证 =====\n');

function isSorted(arr) {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) {
            return false;
        }
    }
    return true;
}

const testCases = [
    [],
    [1],
    [2, 1],
    [1, 2, 3],
    [3, 2, 1],
    [5, 3, 8, 1, 9, 2],
    [1, 1, 1, 1],
    Array.from({ length: 1000 }, () => Math.floor(Math.random() * 10000))
];

testCases.forEach((testCase, index) => {
    const sorted = heapSort([...testCase]);
    const correct = isSorted(sorted);
    console.log(`测试用例 ${index + 1}: ${correct ? '✓ 通过' : '✗ 失败'}`);
});

// 导出函数和类（如果在Node.js环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        heapSort,
        heapSortWithClass,
        MaxHeap,
        isSorted
    };
}
