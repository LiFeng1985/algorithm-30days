/**
 * 归并排序 - Merge Sort
 * 
 * 核心思想（分治法）：
 * 1. 分解（Divide）：把数组从中间分成两半
 * 2. 解决（Conquer）：递归地对两半分别排序
 * 3. 合并（Merge）：把两个有序数组合并成一个有序数组
 * 
 * 形象比喻：
 * 就像整理扑克牌，先把牌分成小堆，每堆排好序，然后逐步合并
 * 
 * 时间复杂度：
 * - 最好情况：O(n log n) - 无论什么情况都是这个复杂度
 * - 平均情况：O(n log n) - 稳定的性能
 * - 最坏情况：O(n log n) - 不会退化
 * 
 * 空间复杂度：O(n) - 需要额外的临时数组来合并
 * 
 * 稳定性：稳定 - 合并时相等元素保持原有顺序
 * 
 * 优点：
 * - 性能稳定，不会退化
 * - 适合链表排序（不需要额外空间）
 * - 适合外部排序（数据太大无法全部加载到内存）
 * 
 * 缺点：
 * - 需要额外的 O(n) 空间
 * - 对于小数组，递归开销较大
 * 
 * 适用场景：
 * - 需要稳定排序
 * - 数据量较大
 * - 链表排序
 * - 外部排序
 * 
 * @param {number[]} arr - 待排序的数组
 * @returns {number[]} - 排序后的新数组（不修改原数组）
 */
function mergeSort(arr) {
    // 基本情况：数组长度为 0 或 1，已经有序
    if (arr.length <= 1) {
        return arr;
    }
    
    // 分解：找到中间位置
    const mid = Math.floor(arr.length / 2);
    
    // 分解：把数组分成左右两半
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
    
    console.log(`分解: [${arr}] -> [${left}] 和 [${right}]`);
    
    // 解决：递归地对两半排序
    const sortedLeft = mergeSort(left);
    const sortedRight = mergeSort(right);
    
    // 合并：把两个有序数组合并
    return merge(sortedLeft, sortedRight);
}

/**
 * 合并两个有序数组
 * 
 * 工作原理：
 * 1. 使用两个指针分别指向两个数组的开头
 * 2. 比较两个指针指向的元素，把较小的放入结果数组
 * 3. 移动对应指针
 * 4. 重复直到一个数组遍历完
 * 5. 把另一个数组剩余的元素追加到结果数组
 * 
 * @param {number[]} left - 左边的有序数组
 * @param {number[]} right - 右边的有序数组
 * @returns {number[]} - 合并后的有序数组
 */
function merge(left, right) {
    const result = [];
    let leftIndex = 0;
    let rightIndex = 0;
    
    console.log(`合并: [${left}] 和 [${right}]`);
    
    // 比较两个数组的元素，把较小的放入结果
    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] <= right[rightIndex]) {
            // 左边的小（或相等），放入结果
            // 使用 <= 保证稳定性
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            // 右边的小，放入结果
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }
    
    // 把左边数组剩余的元素追加到结果
    // 如果 leftIndex < left.length，说明左边还有剩余
    while (leftIndex < left.length) {
        result.push(left[leftIndex]);
        leftIndex++;
    }
    
    // 把右边数组剩余的元素追加到结果
    // 如果 rightIndex < right.length，说明右边还有剩余
    while (rightIndex < right.length) {
        result.push(right[rightIndex]);
        rightIndex++;
    }
    
    console.log(`结果: [${result}]`);
    
    return result;
}

/**
 * 归并排序 - 原地排序版（优化空间复杂度）
 * 
 * 优化思路：
 * 使用索引而不是创建新数组，减少空间开销
 * 但实现更复杂，实际中很少使用
 * 
 * @param {number[]} arr - 待排序的数组
 * @param {number} start - 起始索引
 * @param {number} end - 结束索引
 * @returns {number[]} - 排序后的数组（原地修改）
 */
function mergeSortInPlace(arr, start = 0, end = arr.length - 1) {
    // 基本情况：只有一个元素或没有元素
    if (start >= end) {
        return arr;
    }
    
    // 找到中间位置
    const mid = Math.floor((start + end) / 2);
    
    // 递归排序左半部分
    mergeSortInPlace(arr, start, mid);
    
    // 递归排序右半部分
    mergeSortInPlace(arr, mid + 1, end);
    
    // 合并两个有序部分
    mergeInPlace(arr, start, mid, end);
    
    return arr;
}

/**
 * 原地合并两个有序子数组
 * 
 * @param {number[]} arr - 数组
 * @param {number} start - 左半部分起始索引
 * @param {number} mid - 左半部分结束索引
 * @param {number} end - 右半部分结束索引
 */
function mergeInPlace(arr, start, mid, end) {
    // 创建临时数组存储左半部分
    const leftArray = arr.slice(start, mid + 1);
    const rightArray = arr.slice(mid + 1, end + 1);
    
    let leftIndex = 0;
    let rightIndex = 0;
    let currentIndex = start;
    
    // 合并两个子数组
    while (leftIndex < leftArray.length && rightIndex < rightArray.length) {
        if (leftArray[leftIndex] <= rightArray[rightIndex]) {
            arr[currentIndex] = leftArray[leftIndex];
            leftIndex++;
        } else {
            arr[currentIndex] = rightArray[rightIndex];
            rightIndex++;
        }
        currentIndex++;
    }
    
    // 处理剩余元素
    while (leftIndex < leftArray.length) {
        arr[currentIndex] = leftArray[leftIndex];
        leftIndex++;
        currentIndex++;
    }
    
    while (rightIndex < rightArray.length) {
        arr[currentIndex] = rightArray[rightIndex];
        rightIndex++;
        currentIndex++;
    }
}

/**
 * 归并排序 - 自底向上（迭代版）
 * 
 * 优化思路：
 * 不使用递归，而是从小到大逐步合并
 * 先合并长度为1的子数组，再合并长度为2的，以此类推
 * 
 * 优点：避免递归调用栈的开销
 * 
 * @param {number[]} arr - 待排序的数组
 * @returns {number[]} - 排序后的数组
 */
function mergeSortBottomUp(arr) {
    const n = arr.length;
    
    // 当前子数组的大小，从1开始，每次翻倍
    for (let size = 1; size < n; size *= 2) {
        console.log(`\n当前子数组大小: ${size}`);
        
        // 遍历数组，合并相邻的子数组
        for (let leftStart = 0; leftStart < n - 1; leftStart += 2 * size) {
            // 计算边界
            const mid = Math.min(leftStart + size - 1, n - 1);
            const rightEnd = Math.min(leftStart + 2 * size - 1, n - 1);
            
            // 只有当右半部分存在时才需要合并
            if (mid < rightEnd) {
                mergeInPlace(arr, leftStart, mid, rightEnd);
            }
        }
        
        console.log(`当前状态: [${arr.join(', ')}]`);
    }
    
    return arr;
}

// ==================== 测试代码 ====================

console.log('===== 归并排序测试 =====\n');

// 测试用例1：普通数组
console.log('测试1：普通数组');
const test1 = [38, 27, 43, 3, 9, 82, 10];
console.log('排序前:', test1);
const sorted1 = mergeSort([...test1]);
console.log('排序后:', sorted1);
console.log();

// 测试用例2：已经有序的数组
console.log('测试2：已排序数组');
const test2 = [1, 2, 3, 4, 5];
console.log('排序前:', test2);
const sorted2 = mergeSort([...test2]);
console.log('排序后:', sorted2);
console.log();

// 测试用例3：完全逆序的数组
console.log('测试3：逆序数组');
const test3 = [5, 4, 3, 2, 1];
console.log('排序前:', test3);
const sorted3 = mergeSort([...test3]);
console.log('排序后:', sorted3);
console.log();

// 测试用例4：包含重复元素
console.log('测试4：包含重复元素');
const test4 = [3, 1, 4, 1, 5, 9, 2, 6, 5];
console.log('排序前:', test4);
const sorted4 = mergeSort([...test4]);
console.log('排序后:', sorted4);
console.log();

// 测试用例5：空数组
console.log('测试5：空数组');
const test5 = [];
console.log('排序前:', test5);
const sorted5 = mergeSort(test5);
console.log('排序后:', sorted5);
console.log();

// 测试用例6：单元素数组
console.log('测试6：单元素数组');
const test6 = [42];
console.log('排序前:', test6);
const sorted6 = mergeSort(test6);
console.log('排序后:', sorted6);
console.log();

// 测试用例7：两个元素
console.log('测试7：两个元素');
const test7 = [2, 1];
console.log('排序前:', test7);
const sorted7 = mergeSort([...test7]);
console.log('排序后:', sorted7);
console.log();

// 测试原地排序版
console.log('===== 原地排序版测试 =====\n');
const test8 = [38, 27, 43, 3, 9, 82, 10];
console.log('排序前:', test8);
mergeSortInPlace(test8);
console.log('排序后:', test8);
console.log();

// 测试自底向上版
console.log('===== 自底向上版测试 =====\n');
const test9 = [38, 27, 43, 3, 9, 82, 10];
console.log('排序前:', test9);
mergeSortBottomUp(test9);
console.log('排序后:', test9);
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
    measureTime(mergeSort, randomArr, '归并排序（递归）');
    measureTime(mergeSortInPlace, randomArr, '归并排序（原地）');
    measureTime(mergeSortBottomUp, randomArr, '归并排序（迭代）');
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
    const sorted = mergeSort([...testCase]);
    const correct = isSorted(sorted);
    console.log(`测试用例 ${index + 1}: ${correct ? '✓ 通过' : '✗ 失败'}`);
});

// 导出函数（如果在Node.js环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        mergeSort,
        mergeSortInPlace,
        mergeSortBottomUp,
        isSorted
    };
}
