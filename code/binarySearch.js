/**
 * 二分查找 - Binary Search
 * 
 * 核心思想：
 * 1. 在有序数组中，每次取中间元素与目标值比较
 * 2. 如果中间元素等于目标值，找到结果
 * 3. 如果中间元素大于目标值，在左半部分继续查找
 * 4. 如果中间元素小于目标值，在右半部分继续查找
 * 5. 重复上述过程，直到找到目标或搜索范围为空
 * 
 * 形象比喻：
 * 就像查字典，先翻到中间，判断目标在前半本还是后半本，然后继续折半
 * 
 * 前提条件：
 * - 数组必须是有序的（升序或降序）
 * - 支持随机访问（数组可以，链表不行）
 * 
 * 时间复杂度：
 * - 最好情况：O(1) - 第一次就找到
 * - 平均情况：O(log n) - 每次排除一半
 * - 最坏情况：O(log n) - 查找到最后一个元素
 * 
 * 空间复杂度：
 * - 迭代版：O(1) - 只需要几个变量
 * - 递归版：O(log n) - 递归调用栈的深度
 * 
 * 优点：
 * - 速度极快，log₂(100万) ≈ 20 次比较
 * - 实现简单
 * 
 * 缺点：
 * - 要求数组有序
 * - 只适用于支持随机访问的数据结构
 * 
 * 适用场景：
 * - 在有序数组中查找元素
 * - 查找边界（第一个/最后一个满足条件的元素）
 * - 求平方根、对数等数学问题
 * - 二分答案（最大化最小值、最小化最大值等问题）
 * 
 * @param {number[]} arr - 有序数组（升序）
 * @param {number} target - 要查找的目标值
 * @returns {number} - 目标值的索引，如果不存在返回 -1
 */
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    console.log(`在 [${arr}] 中查找 ${target}`);
    
    // 当搜索范围不为空时继续
    while (left <= right) {
        // 计算中间位置
        // 使用 Math.floor((left + right) / 2) 可能导致溢出
        // 更好的写法：left + Math.floor((right - left) / 2)
        const mid = left + Math.floor((right - left) / 2);
        
        console.log(`  搜索范围: [${left}, ${right}], 中间位置: ${mid}, 中间值: ${arr[mid]}`);
        
        if (arr[mid] === target) {
            // 找到了！
            console.log(`  ✓ 找到目标 ${target}，索引为 ${mid}`);
            return mid;
        } else if (arr[mid] < target) {
            // 中间值小于目标，目标在右半部分
            console.log(`  → 中间值 ${arr[mid]} < 目标 ${target}，搜索右半部分`);
            left = mid + 1;
        } else {
            // 中间值大于目标，目标在左半部分
            console.log(`  → 中间值 ${arr[mid]} > 目标 ${target}，搜索左半部分`);
            right = mid - 1;
        }
    }
    
    // 搜索范围为空，说明目标不存在
    console.log(`  ✗ 未找到目标 ${target}`);
    return -1;
}

/**
 * 二分查找 - 递归版
 * 
 * 递归思路：
 * 1. 基本情况：搜索范围为空，返回 -1
 * 2. 计算中间位置
 * 3. 如果找到，返回索引
 * 4. 否则递归搜索左半部分或右半部分
 * 
 * @param {number[]} arr - 有序数组
 * @param {number} target - 目标值
 * @param {number} left - 左边界
 * @param {number} right - 右边界
 * @returns {number} - 目标值的索引，如果不存在返回 -1
 */
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
    // 基本情况：搜索范围为空
    if (left > right) {
        return -1;
    }
    
    // 计算中间位置
    const mid = left + Math.floor((right - left) / 2);
    
    console.log(`  搜索范围: [${left}, ${right}], 中间位置: ${mid}, 中间值: ${arr[mid]}`);
    
    if (arr[mid] === target) {
        // 找到了
        console.log(`  ✓ 找到目标 ${target}，索引为 ${mid}`);
        return mid;
    } else if (arr[mid] < target) {
        // 搜索右半部分
        console.log(`  → 搜索右半部分 [${mid + 1}, ${right}]`);
        return binarySearchRecursive(arr, target, mid + 1, right);
    } else {
        // 搜索左半部分
        console.log(`  → 搜索左半部分 [${left}, ${mid - 1}]`);
        return binarySearchRecursive(arr, target, left, mid - 1);
    }
}

/**
 * 二分查找 - 查找第一个等于目标值的元素
 * 
 * 应用场景：
 * 当数组中有重复元素时，找到第一个出现的位置
 * 
 * @param {number[]} arr - 有序数组（可能有重复元素）
 * @param {number} target - 目标值
 * @returns {number} - 第一个等于目标值的索引，如果不存在返回 -1
 */
function binarySearchFirst(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    let result = -1;
    
    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        
        if (arr[mid] === target) {
            // 找到了，但不一定是第一个
            // 记录结果，继续在左半部分查找
            result = mid;
            right = mid - 1;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}

/**
 * 二分查找 - 查找最后一个等于目标值的元素
 * 
 * 应用场景：
 * 当数组中有重复元素时，找到最后一个出现的位置
 * 
 * @param {number[]} arr - 有序数组（可能有重复元素）
 * @param {number} target - 目标值
 * @returns {number} - 最后一个等于目标值的索引，如果不存在返回 -1
 */
function binarySearchLast(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    let result = -1;
    
    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        
        if (arr[mid] === target) {
            // 找到了，但不一定是最后一个
            // 记录结果，继续在右半部分查找
            result = mid;
            left = mid + 1;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}

/**
 * 二分查找 - 查找第一个大于等于目标值的元素
 * 
 * 应用场景：
 * - 插入位置（保持数组有序）
 * - 下界查询
 * 
 * @param {number[]} arr - 有序数组
 * @param {number} target - 目标值
 * @returns {number} - 第一个 >= target 的元素索引
 */
function binarySearchLowerBound(arr, target) {
    let left = 0;
    let right = arr.length; // 注意：这里是 length，不是 length - 1
    
    while (left < right) {
        const mid = left + Math.floor((right - left) / 2);
        
        if (arr[mid] < target) {
            // 中间值小于目标，搜索右半部分
            left = mid + 1;
        } else {
            // 中间值 >= 目标，可能是答案，但继续在左半部分找更小的
            right = mid;
        }
    }
    
    // left 就是第一个 >= target 的位置
    return left;
}

/**
 * 二分查找 - 查找第一个大于目标值的元素
 * 
 * 应用场景：
 * - 上界查询
 * 
 * @param {number[]} arr - 有序数组
 * @param {number} target - 目标值
 * @returns {number} - 第一个 > target 的元素索引
 */
function binarySearchUpperBound(arr, target) {
    let left = 0;
    let right = arr.length;
    
    while (left < right) {
        const mid = left + Math.floor((right - left) / 2);
        
        if (arr[mid] <= target) {
            // 中间值 <= 目标，搜索右半部分
            left = mid + 1;
        } else {
            // 中间值 > 目标，可能是答案，但继续在左半部分找更小的
            right = mid;
        }
    }
    
    return left;
}

/**
 * 二分查找应用：求平方根（整数部分）
 * 
 * 问题：求 x 的平方根的整数部分
 * 思路：在 [0, x] 范围内二分查找，找到最大的 i 使得 i*i <= x
 * 
 * @param {number} x - 非负整数
 * @returns {number} - x 的平方根的整数部分
 */
function sqrt(x) {
    if (x < 2) {
        return x;
    }
    
    let left = 0;
    let right = x;
    let result = 0;
    
    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        const square = mid * mid;
        
        if (square === x) {
            return mid;
        } else if (square < x) {
            result = mid; // 记录当前答案
            left = mid + 1; // 继续找更大的
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}

// ==================== 测试代码 ====================

console.log('===== 二分查找测试 =====\n');

// 测试用例1：基本查找
console.log('测试1：基本查找');
const test1 = [1, 3, 5, 7, 9, 11, 13, 15];
console.log('数组:', test1);
binarySearch(test1, 7);
console.log();

// 测试用例2：查找不存在的元素
console.log('测试2：查找不存在的元素');
binarySearch(test1, 6);
console.log();

// 测试用例3：查找第一个元素
console.log('测试3：查找第一个元素');
binarySearch(test1, 1);
console.log();

// 测试用例4：查找最后一个元素
console.log('测试4：查找最后一个元素');
binarySearch(test1, 15);
console.log();

// 测试用例5：空数组
console.log('测试5：空数组');
binarySearch([], 5);
console.log();

// 测试用例6：单元素数组
console.log('测试6：单元素数组');
binarySearch([42], 42);
console.log();

// 测试递归版
console.log('===== 递归版测试 =====\n');
console.log('测试7：递归版查找');
binarySearchRecursive(test1, 9);
console.log();

// 测试查找第一个/最后一个
console.log('===== 查找第一个/最后一个测试 =====\n');
const test2 = [1, 2, 2, 2, 3, 4, 5];
console.log('数组（有重复）:', test2);
console.log('查找第一个 2:', binarySearchFirst(test2, 2));
console.log('查找最后一个 2:', binarySearchLast(test2, 2));
console.log();

// 测试下界和上界
console.log('===== 下界和上界测试 =====\n');
const test3 = [1, 3, 5, 7, 9];
console.log('数组:', test3);
console.log('lower_bound(4):', binarySearchLowerBound(test3, 4)); // 应该返回 2（第一个 >= 4 的是 5）
console.log('upper_bound(4):', binarySearchUpperBound(test3, 4)); // 应该返回 2（第一个 > 4 的是 5）
console.log('lower_bound(5):', binarySearchLowerBound(test3, 5)); // 应该返回 2（第一个 >= 5 的是 5）
console.log('upper_bound(5):', binarySearchUpperBound(test3, 5)); // 应该返回 3（第一个 > 5 的是 7）
console.log();

// 测试平方根
console.log('===== 平方根测试 =====\n');
console.log('sqrt(0):', sqrt(0));
console.log('sqrt(1):', sqrt(1));
console.log('sqrt(4):', sqrt(4));
console.log('sqrt(8):', sqrt(8)); // 应该是 2
console.log('sqrt(9):', sqrt(9));
console.log('sqrt(16):', sqrt(16));
console.log('sqrt(100):', sqrt(100));
console.log();

// 性能测试
console.log('===== 性能测试 =====\n');

function generateSortedArray(size) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(i * 2); // 生成有序数组
    }
    return arr;
}

function measureTime(searchFunc, arr, target, name) {
    const iterations = 100000;
    const start = Date.now();
    for (let i = 0; i < iterations; i++) {
        searchFunc(arr, target);
    }
    const end = Date.now();
    console.log(`${name}: ${end - start}ms (${iterations} 次)`);
}

// 在不同大小的数组上测试
const sizes = [1000, 10000, 100000, 1000000];

sizes.forEach(size => {
    const sortedArr = generateSortedArray(size);
    const target = size - 1; // 查找最后一个元素（最坏情况）
    console.log(`\n数组大小: ${size.toLocaleString()}`);
    measureTime(binarySearch, sortedArr, target, '二分查找（迭代）');
    measureTime(binarySearchRecursive, sortedArr, target, '二分查找（递归）');
});

// 验证正确性
console.log('\n===== 正确性验证 =====\n');

const testCases = [
    { arr: [], target: 5, expected: -1 },
    { arr: [1], target: 1, expected: 0 },
    { arr: [1], target: 2, expected: -1 },
    { arr: [1, 3, 5, 7, 9], target: 5, expected: 2 },
    { arr: [1, 3, 5, 7, 9], target: 6, expected: -1 },
    { arr: [1, 2, 2, 2, 3], target: 2, expected: 1 }, // 第一个2的位置
];

testCases.forEach((testCase, index) => {
    const result = binarySearchFirst(testCase.arr, testCase.target);
    const correct = result === testCase.expected;
    console.log(`测试用例 ${index + 1}: ${correct ? '✓ 通过' : '✗ 失败'} (期望: ${testCase.expected}, 实际: ${result})`);
});

// 导出函数（如果在Node.js环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        binarySearch,
        binarySearchRecursive,
        binarySearchFirst,
        binarySearchLast,
        binarySearchLowerBound,
        binarySearchUpperBound,
        sqrt
    };
}
