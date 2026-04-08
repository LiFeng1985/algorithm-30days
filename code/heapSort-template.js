/**
 * 堆排序 - 框架结构
 * 
 * 目标：实现一个完整的堆排序算法
 * 提示：基于最大堆（大顶堆）实现升序排序
 */

// ==================== 第一部分：辅助函数 ====================

/**
 * 交换数组中两个元素的位置
 * @param {number[]} arr - 数组
 * @param {number} i - 索引 1
 * @param {number} j - 索引 2
 */
function swap(arr, i, j) {
    // TODO: 实现交换逻辑
    // 提示：使用解构赋值 [arr[i], arr[j]] = [arr[j], arr[i]]
    [arr[i], arr[j]] = [arr[j], arr[i]];
}


// ==================== 第二部分：堆调整 ====================

/**
 * 下沉操作（Heapify）- 维护最大堆性质
 * 
 * 任务：将指定节点向下调整，使其满足最大堆的性质
 * 
 * @param {number[]} arr - 待调整数组
 * @param {number} n - 堆的大小（最后一个元素的索引 +1）
 * @param {number} i - 当前节点的索引
 * 
 * 步骤提示：
 * 1. 假设当前节点是最大的
 * 2. 计算左孩子索引：left = 2*i + 1
 * 3. 计算右孩子索引：right = 2*i + 2
 * 4. 如果左孩子存在且比当前节点大，更新最大值索引
 * 5. 如果右孩子存在且比当前最大值还大，更新最大值索引
 * 6. 如果最大值不是当前节点，交换并递归调整
 */
function heapify(arr, n, i) {
    let largest = i;  // 假设当前节点最大
    
    // TODO: 计算左孩子索引
    let left = 2 * i + 1;
    
    // TODO: 计算右孩子索引
    let right = 2 * i + 2;
    
    // TODO: 如果左孩子存在且比当前最大值大
    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }
    
    // TODO: 如果右孩子存在且比当前最大值大
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }
    
    // TODO: 如果最大值不是当前节点，交换并递归
    if (largest !== i) {
        swap(arr, i, largest);  // 交换
        heapify(arr, n, largest);  // 递归调整被交换的子树
    }
}


// ==================== 第三部分：主函数 ====================

/**
 * 堆排序主函数
 * 
 * 任务：使用堆排序对数组进行升序排序
 * 
 * @param {number[]} arr - 待排序数组
 * @returns {number[]} - 排序后的数组
 * 
 * 算法步骤：
 * 1. 构建最大堆（从最后一个非叶子节点开始，自底向上调整）
 * 2. 依次将堆顶元素（最大值）与末尾元素交换
 * 3. 重新调整剩余元素为最大堆
 * 4. 重复步骤 2-3，直到堆的大小为 1
 */
function heapSort(arr) {
    const n = arr.length;
    
    // ========== 步骤 1：构建最大堆 ==========
    // 提示：从最后一个非叶子节点开始向前遍历
    // 最后一个非叶子节点索引：Math.floor(n/2) - 1
    
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);  // 调用 heapify 调整
    }
    
    // ========== 步骤 2：依次取出堆顶元素 ==========
    // 提示：从最后一个元素开始向前遍历
    
    for (let i = n - 1; i > 0; i--) {
        // TODO: 将堆顶（索引 0）与当前末尾元素交换
        swap(arr, 0, i);
        
        // TODO: 对剩余元素重新调整（堆大小变为 i）
        heapify(arr, i, 0);
    }
    
    return arr;
}


// ==================== 第四部分：测试用例 ====================

/**
 * 打印数组
 */
function printArray(arr) {
    console.log(arr.join(' '));
}

// 测试 1：普通数组
console.log('测试 1：普通数组');
const arr1 = [12, 11, 13, 5, 6, 7];
console.log('排序前:', printArray(arr1));
heapSort(arr1);
console.log('排序后:', printArray(arr1));
console.log('期望结果：5 6 7 11 12 13\n');

// 测试 2：逆序数组
console.log('测试 2：逆序数组');
const arr2 = [9, 7, 5, 3, 1];
console.log('排序前:', printArray(arr2));
heapSort([...arr2]);
console.log('排序后:', printArray(heapSort([...arr2])));
console.log('期望结果：1 3 5 7 9\n');

// 测试 3：已排序数组
console.log('测试 3：已排序数组');
const arr3 = [1, 2, 3, 4, 5];
console.log('排序前:', printArray(arr3));
heapSort([...arr3]);
console.log('排序后:', printArray(heapSort([...arr3])));
console.log('期望结果：1 2 3 4 5\n');

// 测试 4：有重复元素
console.log('测试 4：有重复元素');
const arr4 = [3, 1, 4, 1, 5, 9, 2, 6, 5];
console.log('排序前:', printArray(arr4));
heapSort([...arr4]);
console.log('排序后:', printArray(heapSort([...arr4])));
console.log('期望结果：1 1 2 3 4 5 5 6 9\n');

// 测试 5：单个元素
console.log('测试 5：单个元素');
const arr5 = [1];
console.log('排序前:', printArray(arr5));
heapSort(arr5);
console.log('排序后:', printArray(arr5));
console.log('期望结果：1\n');

// 测试 6：空数组
console.log('测试 6：空数组');
const arr6 = [];
console.log('排序前:', printArray(arr6));
heapSort(arr6);
console.log('排序后:', printArray(arr6));
console.log('期望结果：[]\n');


// ==================== 第五部分：学习提示 ====================

/**
 * 堆排序知识点总结：
 * 
 * 1. 时间复杂度：
 *    - 最好情况：O(n log n)
 *    - 平均情况：O(n log n)
 *    - 最坏情况：O(n log n)
 * 
 * 2. 空间复杂度：O(1) - 原地排序
 * 
 * 3. 稳定性：不稳定排序
 * 
 * 4. 核心思想：
 *    - 利用完全二叉树的性质
 *    - 父节点索引 i，左孩子 2i+1，右孩子 2i+2
 *    - 最大堆：父节点 >= 子节点
 * 
 * 5. 关键步骤：
 *    - 构建最大堆
 *    - 交换堆顶和末尾元素
 *    - 重新调整堆
 * 
 * 6. 与选择排序的关系：
 *    - 可以看作是选择排序的优化版本
 *    - 都是每次选最大（小）的元素
 *    - 堆排序用堆结构加速了查找过程
 */

// ==================== 第六部分：调试工具 ====================

/**
 * 可视化堆结构（可选功能）
 * 帮助理解堆的形状
 */
function printHeapTree(arr) {
    // TODO: 实现树的可视化输出
    // 提示：按层打印，使用空格对齐
    console.log('TODO: 实现堆的可视化');
}

/**
 * 验证是否为最大堆
 */
function isValidMaxHeap(arr) {
    const n = arr.length;
    
    // 检查所有非叶子节点
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        
        // TODO: 检查是否满足最大堆性质
        // 如果左孩子或右孩子存在且大于父节点，返回 false
        if ((left < n && arr[left] > arr[i]) ||
            (right < n && arr[right] > arr[i])) {
            return false;
        }
    }
    
    return true;
}

// 验证示例
console.log('\n验证工具测试：');
const testHeap = [9, 5, 8, 3, 4];
console.log('数组:', testHeap);
console.log('是否为最大堆？', isValidMaxHeap(testHeap));  // 应该是 true

const notHeap = [5, 9, 8, 3, 4];
console.log('数组:', notHeap);
console.log('是否为最大堆？', isValidMaxHeap(notHeap));  // 应该是 false


// ==================== 第七部分：挑战任务 ====================

/**
 * 挑战 1：实现最小堆版本的堆排序（降序排序）
 */
function heapSortDescending(arr) {
    // TODO: 实现基于最小堆的降序排序
    // 提示：修改比较方向，父节点 <= 子节点
}

/**
 * 挑战 2：不使用递归实现 heapify（迭代版本）
 */
function heapifyIterative(arr, n, i) {
    // TODO: 使用 while 循环代替递归
}

/**
 * 挑战 3：统计比较次数和交换次数
 */
function heapSortWithStats(arr) {
    let comparisons = 0;
    let swaps = 0;
    
    // TODO: 在排序过程中统计
    // 最后返回 { sortedArray, comparisons, swaps }
    
    return {
        sortedArray: arr,
        comparisons: comparisons,
        swaps: swaps
    };
}


// ==================== 完成标志 ====================

console.log('\n========================================');
console.log('堆排序练习框架已加载完成！');
console.log('请完成 TODO 部分的代码实现');
console.log('========================================\n');
