/**
 * 选择排序 - Selection Sort
 * 
 * 核心思想：
 * 1. 从未排序的部分找到最小（或最大）的元素
 * 2. 把它放到已排序部分的末尾
 * 3. 重复这个过程，直到所有元素都排好序
 * 
 * 形象比喻：
 * 就像从一堆牌中每次选出最小的牌，依次放到左边
 * 
 * 时间复杂度：
 * - 最好情况：O(n²) - 即使数组已经有序，也要遍历找最小值
 * - 平均情况：O(n²) - 需要进行 n*(n-1)/2 次比较
 * - 最坏情况：O(n²) - 和最好情况一样
 * 
 * 空间复杂度：O(1) - 原地排序，只需要常数额外空间
 * 
 * 稳定性：不稳定 - 交换可能改变相等元素的相对顺序
 * 
 * 与冒泡排序的区别：
 * - 冒泡：每轮多次交换，相邻元素比较
 * - 选择：每轮只交换一次，找到最小值再交换
 * - 选择排序的交换次数更少，但比较次数相同
 * 
 * 适用场景：
 * - 数据量较小
 * - 交换操作代价较高时（因为交换次数少）
 * - 教学演示
 * 
 * @param {number[]} arr - 待排序的数组
 * @returns {number[]} - 排序后的数组（原地修改）
 */
function selectionSort(arr) {
    // 获取数组长度
    const n = arr.length;
    
    // 外层循环：控制已排序部分的边界
    // i 表示当前要确定第 i 个位置的元素
    for (let i = 0; i < n - 1; i++) {
        // 假设当前位置就是最小值的位置
        let minIndex = i;
        
        // 内层循环：在未排序部分寻找最小值
        // 从 i+1 开始，因为前 i 个元素已经排好序了
        for (let j = i + 1; j < n; j++) {
            // 如果找到更小的元素，更新最小值的索引
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        
        // 如果最小值不在位置 i，就交换
        // 注意：即使 minIndex === i，交换也没关系（自己和自己交换）
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            console.log(`第 ${i + 1} 轮：将 ${arr[i]} 放到位置 ${i}`);
        } else {
            console.log(`第 ${i + 1} 轮：位置 ${i} 已经是最小值 ${arr[i]}`);
        }
        
        // 打印每轮的排序过程
        console.log(`第 ${i + 1} 轮结果: [${arr.join(', ')}]`);
    }
    
    // 返回排序后的数组
    return arr;
}

/**
 * 选择排序 - 同时找最大值和最小值（优化版）
 * 
 * 优化思路：
 * 每轮同时找到未排序部分的最小值和最大值
 * 把最小值放左边，最大值放右边
 * 这样可以减少一半的轮数
 * 
 * @param {number[]} arr - 待排序的数组
 * @returns {number[]} - 排序后的数组
 */
function selectionSortOptimized(arr) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left < right) {
        let minIndex = left;
        let maxIndex = left;
        
        // 在未排序部分同时找最小值和最大值
        for (let i = left; i <= right; i++) {
            if (arr[i] < arr[minIndex]) {
                minIndex = i;
            }
            if (arr[i] > arr[maxIndex]) {
                maxIndex = i;
            }
        }
        
        // 把最小值交换到左边
        if (minIndex !== left) {
            [arr[left], arr[minIndex]] = [arr[minIndex], arr[left]];
        }
        
        // 特殊情况处理：
        // 如果最大值原本在 left 位置，现在被交换到了 minIndex
        // 需要更新 maxIndex
        if (maxIndex === left) {
            maxIndex = minIndex;
        }
        
        // 把最大值交换到右边
        if (maxIndex !== right) {
            [arr[right], arr[maxIndex]] = [arr[maxIndex], arr[right]];
        }
        
        // 缩小边界
        left++;
        right--;
    }
    
    return arr;
}

// ==================== 测试代码 ====================

console.log('===== 选择排序测试 =====\n');

// 测试用例1：普通数组
console.log('测试1：普通数组');
const test1 = [64, 25, 12, 22, 11];
console.log('排序前:', test1);
selectionSort([...test1]);
console.log();

// 测试用例2：已经有序的数组
console.log('测试2：已排序数组');
const test2 = [1, 2, 3, 4, 5];
console.log('排序前:', test2);
selectionSort([...test2]);
console.log();

// 测试用例3：完全逆序的数组
console.log('测试3：逆序数组');
const test3 = [5, 4, 3, 2, 1];
console.log('排序前:', test3);
selectionSort([...test3]);
console.log();

// 测试用例4：包含重复元素
console.log('测试4：包含重复元素');
const test4 = [3, 1, 4, 1, 5, 9, 2, 6, 5];
console.log('排序前:', test4);
selectionSort([...test4]);
console.log();

// 测试用例5：空数组
console.log('测试5：空数组');
const test5 = [];
console.log('排序前:', test5);
selectionSort(test5);
console.log('排序后:', test5);
console.log();

// 测试用例6：单元素数组
console.log('测试6：单元素数组');
const test6 = [42];
console.log('排序前:', test6);
selectionSort(test6);
console.log('排序后:', test6);
console.log();

// 测试用例7：两个元素
console.log('测试7：两个元素');
const test7 = [2, 1];
console.log('排序前:', test7);
selectionSort([...test7]);
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
const sizes = [1000, 5000, 10000];

sizes.forEach(size => {
    const randomArr = generateRandomArray(size);
    console.log(`\n数组大小: ${size}`);
    measureTime(selectionSort, randomArr, '选择排序');
    measureTime(selectionSortOptimized, randomArr, '优化版选择排序');
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
    Array.from({ length: 100 }, () => Math.floor(Math.random() * 1000))
];

testCases.forEach((testCase, index) => {
    const sorted = selectionSort([...testCase]);
    const correct = isSorted(sorted);
    console.log(`测试用例 ${index + 1}: ${correct ? '✓ 通过' : '✗ 失败'}`);
});

// 导出函数（如果在Node.js环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        selectionSort,
        selectionSortOptimized,
        isSorted
    };
}
