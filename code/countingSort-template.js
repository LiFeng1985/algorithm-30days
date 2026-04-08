/**
 * 计数排序 - 框架结构
 * 
 * 目标：实现一个非比较排序算法
 * 特点：时间复杂度 O(n+k)，空间复杂度 O(k)
 * 适用场景：整数范围已知的情况
 */

// ==================== 第一部分：主函数 ====================

/**
 * 计数排序主函数
 * 
 * 任务：使用计数排序对数组进行升序排序
 * 
 * @param {number[]} arr - 待排序数组（非负整数）
 * @returns {number[]} - 排序后的数组
 * 
 * 算法步骤：
 * 1. 找出数组中的最大值 max
 * 2. 创建计数数组 count，长度为 max+1
 * 3. 统计每个元素出现的次数
 * 4. 根据计数数组重建有序数组
 */
function countingSort(arr) {
    if (arr.length <= 1) return arr;
    
    // ========== 步骤 1：找出最大值 ==========
    let max = arr[0];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    
    // ========== 步骤 2：创建计数数组 ==========
    // 提示：长度为 max+1，初始化为 0
    const count = new Array(max + 1).fill(0);
    
    // ========== 步骤 3：统计每个元素出现的次数 ==========
    for (let i = 0; i < arr.length; i++) {
        count[arr[i]]++;
    }
    
    // ========== 步骤 4：根据计数数组重建有序数组 ==========
    const sorted = [];
    for (let i = 0; i < count.length; i++) {
        // TODO: 如果 count[i] > 0，将 i 添加 count[i] 次到 sorted 数组
        while (count[i] > 0) {
            sorted.push(i);
            count[i]--;
        }
    }
    
    // ========== 步骤 5：将排序结果复制回原数组 ==========
    for (let i = 0; i < sorted.length; i++) {
        arr[i] = sorted[i];
    }
    
    return arr;
}


// ==================== 第二部分：优化版本 ====================

/**
 * 计数排序优化版本 - 保持稳定性
 * 
 * 稳定排序：相等元素的相对位置不变
 * 
 * @param {number[]} arr - 待排序数组
 * @returns {number[]} - 排序后的数组
 */
function countingSortStable(arr) {
    if (arr.length <= 1) return arr;
    
    // 找出最大值和最小值
    let max = arr[0];
    let min = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) max = arr[i];
        if (arr[i] < min) min = arr[i];
    }
    
    // 创建计数数组
    const range = max - min + 1;
    const count = new Array(range).fill(0);
    
    // 统计频次
    for (let num of arr) {
        count[num - min]++;
    }
    
    // 计算累积频次（关键：保证稳定性）
    for (let i = 1; i < range; i++) {
        count[i] += count[i - 1];
    }
    
    // 从后向前遍历，构建结果数组
    const result = new Array(arr.length);
    for (let i = arr.length - 1; i >= 0; i--) {
        const idx = count[arr[i] - min] - 1;
        result[idx] = arr[i];
        count[arr[i] - min]--;
    }
    
    // 复制回原数组
    for (let i = 0; i < result.length; i++) {
        arr[i] = result[i];
    }
    
    return arr;
}


// ==================== 第三部分：测试用例 ====================

console.log('=== 计数排序测试 ===\n');

// 测试 1：普通数组
console.log('测试 1：普通数组');
const arr1 = [4, 2, 2, 8, 3, 3, 1];
console.log('排序前:', arr1.join(' '));
countingSort([...arr1]);
console.log('排序后:', countingSort([...arr1]).join(' '));
console.log('期望：1 2 2 3 3 4 8\n');

// 测试 2：包含 0
console.log('测试 2：包含 0');
const arr2 = [0, 5, 0, 3, 0, 1];
console.log('排序前:', arr2.join(' '));
console.log('排序后:', countingSort([...arr2]).join(' '));
console.log('期望：0 0 0 1 3 5\n');

// 测试 3：所有元素相同
console.log('测试 3：所有元素相同');
const arr3 = [5, 5, 5, 5, 5];
console.log('排序前:', arr3.join(' '));
console.log('排序后:', countingSort([...arr3]).join(' '));
console.log('期望：5 5 5 5 5\n');

// 测试 4：单个元素
console.log('测试 4：单个元素');
const arr4 = [1];
console.log('排序前:', arr4.join(' '));
console.log('排序后:', countingSort([...arr4]).join(' '));
console.log('期望：1\n');

// 测试 5：空数组
console.log('测试 5：空数组');
const arr5 = [];
console.log('排序前:', arr5.join(' '));
console.log('排序后:', countingSort([...arr5]).join(' '));
console.log('期望：[]\n');

// 测试 6：大范围数据
console.log('测试 6：大范围数据');
const arr6 = [100, 50, 25, 75, 10, 90, 5];
console.log('排序前:', arr6.join(' '));
console.log('排序后:', countingSort([...arr6]).join(' '));
console.log('期望：5 10 25 50 75 90 100\n');


// ==================== 第四部分：学习提示 ====================

/**
 * 计数排序知识点总结：
 * 
 * 1. 时间复杂度：O(n + k)
 *    - n: 数组长度
 *    - k: 数据范围 (max - min + 1)
 * 
 * 2. 空间复杂度：O(k)
 *    - 需要额外的计数数组
 * 
 * 3. 稳定性：
 *    - 基础版本：不稳定
 *    - 优化版本：稳定
 * 
 * 4. 适用场景：
 *    - 整数排序
 *    - 数据范围已知且不大
 *    - 有重复元素
 * 
 * 5. 不适用场景：
 *    - 浮点数
 *    - 数据范围很大（如 1 到 10 亿）
 *    - 负数（需要特殊处理）
 * 
 * 6. 与比较排序的对比：
 *    - 计数排序不是基于比较的排序
 *    - 可以突破 O(n log n) 的下界
 */


// ==================== 第五部分：挑战任务 ====================

/**
 * 挑战 1：支持负数的计数排序
 */
function countingSortWithNegative(arr) {
    // TODO: 实现支持负数的计数排序
    // 提示：找到 min 和 max，所有数减去 min 变成非负数
}

/**
 * 挑战 2：原地计数排序（不使用额外数组）
 */
function countingSortInPlace(arr) {
    // TODO: 尝试在不使用 sorted 数组的情况下排序
    // 提示：直接在原数组上修改
}

/**
 * 挑战 3：统计性能
 */
function countingSortWithStats(arr) {
    const startTime = performance.now();
    const result = countingSort([...arr]);
    const endTime = performance.now();
    
    console.log(`耗时：${(endTime - startTime).toFixed(2)}ms`);
    console.log(`数据范围：${Math.max(...arr) - Math.min(...arr) + 1}`);
    console.log(`数组长度：${arr.length}`);
    
    return result;
}

/**
 * 挑战 4：与快速排序对比性能
 */
function compareSortingAlgorithms(arr) {
    const arr1 = [...arr];
    const arr2 = [...arr];
    
    const start1 = performance.now();
    countingSort(arr1);
    const end1 = performance.now();
    
    const start2 = performance.now();
    quickSort(arr2);
    const end2 = performance.now();
    
    console.log('计数排序耗时:', (end1 - start1).toFixed(2), 'ms');
    console.log('快速排序耗时:', (end2 - start2).toFixed(2), 'ms');
}

// 性能对比测试
console.log('\n=== 性能对比 ===');
const largeArr = Array.from({length: 1000}, () => Math.floor(Math.random() * 100));
compareSortingAlgorithms(largeArr);


// ==================== 第六部分：可视化辅助 ====================

/**
 * 可视化计数过程
 */
function visualizeCounting(arr) {
    console.log('\n计数过程可视化：');
    console.log('原始数组:', arr);
    
    const max = Math.max(...arr);
    const count = new Array(max + 1).fill(0);
    
    for (let num of arr) {
        count[num]++;
    }
    
    console.log('计数数组:', count);
    console.log('索引：    ', count.map((_, i) => i).join(' '));
    
    console.log('\n重建过程：');
    for (let i = 0; i < count.length; i++) {
        if (count[i] > 0) {
            console.log(`${i}: ${'*'.repeat(count[i])} (${count[i]}个)`);
        }
    }
}

// 可视化示例
console.log('\n=== 可视化示例 ===');
visualizeCounting([4, 2, 2, 8, 3, 3, 1]);


// ==================== 完成标志 ====================

console.log('\n========================================');
console.log('计数排序练习框架已加载完成！');
console.log('请完成 TODO 部分的代码实现');
console.log('========================================\n');
