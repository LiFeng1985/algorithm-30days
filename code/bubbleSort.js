/**
 * 冒泡排序 - Bubble Sort
 * 
 * 核心思想：
 * 1. 从数组第一个元素开始，依次比较相邻的两个元素
 * 2. 如果前面的比后面的大，就交换它们
 * 3. 每一轮遍历后，最大的元素会"冒泡"到末尾
 * 4. 重复这个过程，直到没有元素需要交换
 * 
 * 时间复杂度：
 * - 最好情况：O(n) - 数组已经有序，只需要一轮遍历
 * - 平均情况：O(n²) - 需要进行 n*(n-1)/2 次比较
 * - 最坏情况：O(n²) - 数组完全逆序
 * 
 * 空间复杂度：O(1) - 原地排序，只需要常数额外空间
 * 
 * 稳定性：稳定 - 相等元素的相对顺序不会改变
 * 
 * 适用场景：
 * - 数据量很小（n < 50）
 * - 数组基本有序
 * - 教学演示（最容易理解的排序算法）
 * 
 * @param {number[]} arr - 待排序的数组
 * @returns {number[]} - 排序后的数组（原地修改）
 */
function bubbleSort(arr) {
    // 获取数组长度
    const n = arr.length;
    
    // 外层循环：控制排序轮数
    // 最多需要 n-1 轮，因为每轮确定一个最大值的位置
    for (let i = 0; i < n - 1; i++) {
        // 优化标志：如果某一轮没有发生交换，说明数组已经有序
        let swapped = false;
        
        // 内层循环：进行相邻元素的比较和交换
        // 每轮结束后，最后 i 个元素已经是排好序的，所以不需要再比较
        for (let j = 0; j < n - 1 - i; j++) {
            // 如果当前元素比下一个元素大，就交换它们
            if (arr[j] > arr[j + 1]) {
                // 使用解构赋值交换两个元素
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                // 标记发生了交换
                swapped = true;
            }
        }
        
        // 如果这一轮没有发生任何交换，说明数组已经有序
        // 可以提前结束，避免不必要的比较
        if (!swapped) {
            console.log(`第 ${i + 1} 轮没有交换，提前结束`);
            break;
        }
        
        // 打印每轮的排序过程（用于教学演示）
        console.log(`第 ${i + 1} 轮结果: [${arr.join(', ')}]`);
    }
    
    // 返回排序后的数组
    return arr;
}

/**
 * 冒泡排序 - 优化版（记录最后交换位置）
 * 
 * 优化思路：
 * 每一轮最后一次交换的位置之后的元素都是有序的
 * 下一轮只需要遍历到这个位置即可
 * 
 * @param {number[]} arr - 待排序的数组
 * @returns {number[]} - 排序后的数组
 */
function bubbleSortOptimized(arr) {
    let n = arr.length;
    
    // 记录最后一次交换的位置
    let lastSwapIndex = n - 1;
    
    while (lastSwapIndex > 0) {
        // 记录当前轮的交换位置
        let currentSwapIndex = 0;
        
        // 只需要遍历到最后一次交换的位置
        for (let j = 0; j < lastSwapIndex; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                // 更新当前轮的交换位置
                currentSwapIndex = j;
            }
        }
        
        // 更新最后交换位置
        lastSwapIndex = currentSwapIndex;
    }
    
    return arr;
}

/**
 * 双向冒泡排序（鸡尾酒排序）
 * 
 * 优化思路：
 * 传统冒泡只能把最大值移到右边
 * 双向冒泡可以同时把最小值移到左边，最大值移到右边
 * 适合大部分元素已经有序的情况
 * 
 * @param {number[]} arr - 待排序的数组
 * @returns {number[]} - 排序后的数组
 */
function cocktailShakerSort(arr) {
    let start = 0;
    let end = arr.length - 1;
    let swapped = true;
    
    while (swapped) {
        swapped = false;
        
        // 从左到右：把最大值移到右边
        for (let i = start; i < end; i++) {
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                swapped = true;
            }
        }
        
        // 如果没有交换，说明已经有序
        if (!swapped) break;
        
        // 缩小右边界
        end--;
        swapped = false;
        
        // 从右到左：把最小值移到左边
        for (let i = end; i > start; i--) {
            if (arr[i] < arr[i - 1]) {
                [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
                swapped = true;
            }
        }
        
        // 缩小左边界
        start++;
    }
    
    return arr;
}

// ==================== 测试代码 ====================

console.log('===== 冒泡排序测试 =====\n');

// 测试用例1：普通数组
console.log('测试1：普通数组');
const test1 = [64, 34, 25, 12, 22, 11, 90];
console.log('排序前:', test1);
bubbleSort([...test1]); // 使用展开运算符，避免修改原数组
console.log();

// 测试用例2：已经有序的数组（最好情况）
console.log('测试2：已排序数组（最好情况）');
const test2 = [1, 2, 3, 4, 5];
console.log('排序前:', test2);
bubbleSort([...test2]);
console.log();

// 测试用例3：完全逆序的数组（最坏情况）
console.log('测试3：逆序数组（最坏情况）');
const test3 = [5, 4, 3, 2, 1];
console.log('排序前:', test3);
bubbleSort([...test3]);
console.log();

// 测试用例4：包含重复元素
console.log('测试4：包含重复元素');
const test4 = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
console.log('排序前:', test4);
bubbleSort([...test4]);
console.log();

// 测试用例5：空数组
console.log('测试5：空数组');
const test5 = [];
console.log('排序前:', test5);
bubbleSort(test5);
console.log('排序后:', test5);
console.log();

// 测试用例6：单元素数组
console.log('测试6：单元素数组');
const test6 = [42];
console.log('排序前:', test6);
bubbleSort(test6);
console.log('排序后:', test6);
console.log();

// 性能测试
console.log('===== 性能测试 =====\n');

function generateRandomArray(size) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 10000));
}

function measureTime(sortFunc, arr, name) {
    const start = Date.now();
    sortFunc([...arr]);
    const end = Date.now();
    console.log(`${name}: ${end - start}ms`);
}

// 生成不同大小的随机数组进行测试
const sizes = [1000, 5000, 10000];

sizes.forEach(size => {
    const randomArr = generateRandomArray(size);
    console.log(`\n数组大小: ${size}`);
    measureTime(bubbleSort, randomArr, '冒泡排序');
    measureTime(bubbleSortOptimized, randomArr, '优化版冒泡');
    measureTime(cocktailShakerSort, randomArr, '双向冒泡');
});

// 导出函数（如果在Node.js环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        bubbleSort,
        bubbleSortOptimized,
        cocktailShakerSort
    };
}
