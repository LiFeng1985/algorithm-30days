/**
 * 动态规划经典问题集合
 * 
 * 什么是动态规划？
 * 动态规划是一种通过将复杂问题分解为子问题来求解的方法
 * 核心思想：记住已经计算过的结果，避免重复计算
 * 
 * 动态规划的三个要素：
 * 1. 状态定义：dp[i] 表示什么
 * 2. 状态转移方程：dp[i] 如何从之前的状态推导
 * 3. 初始条件：dp[0], dp[1] 等基础情况
 * 
 * 解题步骤：
 * 1. 确定状态（dp数组的含义）
 * 2. 找出状态转移方程
 * 3. 确定初始条件
 * 4. 确定计算顺序
 * 5. 返回结果
 */

// ==================== 1. 斐波那契数列 ====================

/**
 * 斐波那契数列 - 动态规划解法
 * 
 * 问题：F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)
 * 
 * 状态定义：dp[i] 表示第i个斐波那契数
 * 状态转移：dp[i] = dp[i-1] + dp[i-2]
 * 初始条件：dp[0]=0, dp[1]=1
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(n)，可优化到O(1)
 * 
 * @param {number} n
 * @returns {number}
 */
function fibonacci(n) {
    if (n <= 1) {
        return n;
    }
    
    // 方法1：完整dp数组
    const dp = new Array(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

/**
 * 斐波那契 - 空间优化版
 * 
 * 观察：只需要前两个值，不需要整个数组
 * 空间复杂度：O(1)
 */
function fibonacciOptimized(n) {
    if (n <= 1) {
        return n;
    }
    
    let prev2 = 0; // dp[i-2]
    let prev1 = 1; // dp[i-1]
    
    for (let i = 2; i <= n; i++) {
        const current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}

// ==================== 2. 爬楼梯 ====================

/**
 * 爬楼梯问题
 * 
 * 问题：有n阶楼梯，每次可以爬1或2阶，有多少种方法爬到顶？
 * 
 * 思路：
 * 到第n阶的方法 = 到第n-1阶的方法 + 到第n-2阶的方法
 * 因为可以从n-1爬1步，或从n-2爬2步
 * 
 * 状态定义：dp[i] 表示爬到第i阶的方法数
 * 状态转移：dp[i] = dp[i-1] + dp[i-2]
 * 初始条件：dp[1]=1, dp[2]=2
 * 
 * @param {number} n - 楼梯阶数
 * @returns {number} - 方法数
 */
function climbStairs(n) {
    if (n <= 2) {
        return n;
    }
    
    let prev2 = 1; // dp[1]
    let prev1 = 2; // dp[2]
    
    for (let i = 3; i <= n; i++) {
        const current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}

// ==================== 3. 零钱兑换 ====================

/**
 * 零钱兑换 - 最少硬币数
 * 
 * 问题：给定不同面额的硬币和总金额，求凑成总金额所需的最少硬币数
 * 
 * 思路：
 * 对于金额i，尝试每种硬币coin
 * dp[i] = min(dp[i], dp[i-coin] + 1)
 * 
 * 状态定义：dp[i] 表示凑成金额i所需的最少硬币数
 * 状态转移：dp[i] = min(dp[i], dp[i-coins[j]] + 1)
 * 初始条件：dp[0] = 0
 * 
 * 时间复杂度：O(amount * coins.length)
 * 空间复杂度：O(amount)
 * 
 * @param {number[]} coins - 硬币面额
 * @param {number} amount - 总金额
 * @returns {number} - 最少硬币数，无法凑成返回-1
 */
function coinChange(coins, amount) {
    // 初始化dp数组，用Infinity表示无法凑成
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0; // 金额0需要0个硬币
    
    // 遍历每个金额
    for (let i = 1; i <= amount; i++) {
        // 尝试每种硬币
        for (let coin of coins) {
            if (i >= coin && dp[i - coin] !== Infinity) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    
    return dp[amount] === Infinity ? -1 : dp[amount];
}

// ==================== 4. 最长递增子序列 ====================

/**
 * 最长递增子序列（LIS）
 * 
 * 问题：找到数组中最长严格递增子序列的长度
 * 
 * 思路：
 * 对于每个位置i，查看前面所有位置j
 * 如果nums[j] < nums[i]，说明可以接在j后面
 * dp[i] = max(dp[i], dp[j] + 1)
 * 
 * 状态定义：dp[i] 表示以nums[i]结尾的最长递增子序列长度
 * 状态转移：dp[i] = max(dp[i], dp[j] + 1) 其中 j < i 且 nums[j] < nums[i]
 * 初始条件：dp[i] = 1（每个元素本身就是一个子序列）
 * 
 * 时间复杂度：O(n²)
 * 空间复杂度：O(n)
 * 
 * @param {number[]} nums
 * @returns {number} - LIS长度
 */
function lengthOfLIS(nums) {
    if (nums.length === 0) {
        return 0;
    }
    
    const dp = new Array(nums.length).fill(1);
    let maxLength = 1;
    
    for (let i = 1; i < nums.length; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        maxLength = Math.max(maxLength, dp[i]);
    }
    
    return maxLength;
}

// ==================== 5. 最大子数组和 ====================

/**
 * 最大子数组和（Kadane算法）
 * 
 * 问题：找到连续子数组的最大和
 * 
 * 思路：
 * 对于每个位置，决定是延续之前的子数组，还是重新开始
 * 如果之前的和是负数，就重新开始
 * 
 * 状态定义：dp[i] 表示以nums[i]结尾的最大子数组和
 * 状态转移：dp[i] = max(nums[i], dp[i-1] + nums[i])
 * 初始条件：dp[0] = nums[0]
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 * 
 * @param {number[]} nums
 * @returns {number}
 */
function maxSubArray(nums) {
    let maxSum = nums[0];
    let currentSum = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        // 决定是延续还是重新开始
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        // 更新全局最大值
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}

// ==================== 6. 编辑距离 ====================

/**
 * 编辑距离（Levenshtein Distance）
 * 
 * 问题：将word1转换为word2所需的最少操作数
 * 操作：插入、删除、替换
 * 
 * 思路：
 * dp[i][j] 表示word1前i个字符转换为word2前j个字符的最少操作数
 * 
 * 状态转移：
 * - 如果word1[i-1] == word2[j-1]：dp[i][j] = dp[i-1][j-1]
 * - 否则：dp[i][j] = min(
 *     dp[i-1][j] + 1,      // 删除
 *     dp[i][j-1] + 1,      // 插入
 *     dp[i-1][j-1] + 1     // 替换
 *   )
 * 
 * 时间复杂度：O(m * n)
 * 空间复杂度：O(m * n)
 * 
 * @param {string} word1
 * @param {string} word2
 * @returns {number}
 */
function minDistance(word1, word2) {
    const m = word1.length;
    const n = word2.length;
    
    // 创建dp表格
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    // 初始条件
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i; // 删除i个字符
    }
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j; // 插入j个字符
    }
    
    // 填充dp表格
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                // 字符相同，不需要操作
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,      // 删除
                    dp[i][j - 1] + 1,      // 插入
                    dp[i - 1][j - 1] + 1   // 替换
                );
            }
        }
    }
    
    return dp[m][n];
}

// ==================== 7. 背包问题 ====================

/**
 * 0-1背包问题
 * 
 * 问题：有n个物品，每个物品有重量和价值，背包容量为W
 * 求能装入背包的最大价值（每个物品只能选一次）
 * 
 * 思路：
 * 对于每个物品，决定选或不选
 * dp[i][w] 表示前i个物品，容量为w时的最大价值
 * 
 * 状态转移：
 * dp[i][w] = max(
 *   dp[i-1][w],                          // 不选第i个物品
 *   dp[i-1][w-weight[i]] + value[i]     // 选第i个物品
 * )
 * 
 * 时间复杂度：O(n * W)
 * 空间复杂度：O(n * W)，可优化到O(W)
 * 
 * @param {number[]} weights - 物品重量
 * @param {number[]} values - 物品价值
 * @param {number} capacity - 背包容量
 * @returns {number} - 最大价值
 */
function knapsack01(weights, values, capacity) {
    const n = weights.length;
    
    // 创建dp表格
    const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
    
    // 填充dp表格
    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
            // 不选第i个物品
            dp[i][w] = dp[i - 1][w];
            
            // 如果能装下第i个物品，考虑选它
            if (w >= weights[i - 1]) {
                dp[i][w] = Math.max(
                    dp[i][w],
                    dp[i - 1][w - weights[i - 1]] + values[i - 1]
                );
            }
        }
    }
    
    return dp[n][capacity];
}

/**
 * 0-1背包 - 空间优化版
 * 
 * 观察：dp[i] 只依赖于 dp[i-1]
 * 可以用一维数组，从右往左更新
 */
function knapsack01Optimized(weights, values, capacity) {
    const n = weights.length;
    const dp = new Array(capacity + 1).fill(0);
    
    for (let i = 0; i < n; i++) {
        // 从右往左遍历，避免重复使用物品
        for (let w = capacity; w >= weights[i]; w--) {
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    
    return dp[capacity];
}

// ==================== 8. 打家劫舍 ====================

/**
 * 打家劫舍问题
 * 
 * 问题：一条街上的房屋，每个房屋有一定金额
 * 不能抢劫相邻的房屋，求能抢劫的最大金额
 * 
 * 思路：
 * 对于每个房屋，决定抢或不抢
 * 如果抢，就不能抢前一个
 * 如果不抢，就可以继承前一个的最大值
 * 
 * 状态定义：dp[i] 表示前i个房屋能抢劫的最大金额
 * 状态转移：dp[i] = max(dp[i-1], dp[i-2] + nums[i])
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 * 
 * @param {number[]} nums - 每个房屋的金额
 * @returns {number}
 */
function rob(nums) {
    if (nums.length === 0) {
        return 0;
    }
    if (nums.length === 1) {
        return nums[0];
    }
    
    let prev2 = 0; // dp[i-2]
    let prev1 = 0; // dp[i-1]
    
    for (let num of nums) {
        const current = Math.max(prev1, prev2 + num);
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}

// ==================== 测试代码 ====================

console.log('===== 1. 斐波那契数列 =====\n');

console.log('Fibonacci(10):', fibonacci(10)); // 55
console.log('Fibonacci优化(10):', fibonacciOptimized(10)); // 55
console.log();

console.log('===== 2. 爬楼梯 =====\n');

for (let i = 1; i <= 10; i++) {
    console.log(`${i}阶楼梯: ${climbStairs(i)} 种方法`);
}
console.log();

console.log('===== 3. 零钱兑换 =====\n');

const coins1 = [1, 2, 5];
const amount1 = 11;
console.log(`硬币: [${coins1}], 金额: ${amount1}`);
console.log('最少硬币数:', coinChange(coins1, amount1)); // 3 (5+5+1)

const coins2 = [2];
const amount2 = 3;
console.log(`\n硬币: [${coins2}], 金额: ${amount2}`);
console.log('最少硬币数:', coinChange(coins2, amount2)); // -1
console.log();

console.log('===== 4. 最长递增子序列 =====\n');

const nums1 = [10, 9, 2, 5, 3, 7, 101, 18];
console.log('数组:', nums1);
console.log('LIS长度:', lengthOfLIS(nums1)); // 4 ([2,3,7,101])

const nums2 = [0, 1, 0, 3, 2, 3];
console.log('\n数组:', nums2);
console.log('LIS长度:', lengthOfLIS(nums2)); // 4
console.log();

console.log('===== 5. 最大子数组和 =====\n');

const arr1 = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
console.log('数组:', arr1);
console.log('最大子数组和:', maxSubArray(arr1)); // 6 ([4,-1,2,1])

const arr2 = [1];
console.log('\n数组:', arr2);
console.log('最大子数组和:', maxSubArray(arr2)); // 1
console.log();

console.log('===== 6. 编辑距离 =====\n');

const word1 = 'horse';
const word2 = 'ros';
console.log(`"${word1}" -> "${word2}"`);
console.log('编辑距离:', minDistance(word1, word2)); // 3

const word3 = 'intention';
const word4 = 'execution';
console.log(`\n"${word3}" -> "${word4}"`);
console.log('编辑距离:', minDistance(word3, word4)); // 5
console.log();

console.log('===== 7. 0-1背包问题 =====\n');

const weights = [2, 3, 4, 5];
const values = [3, 4, 5, 6];
const capacity = 8;

console.log('物品重量:', weights);
console.log('物品价值:', values);
console.log('背包容量:', capacity);
console.log('最大价值:', knapsack01(weights, values, capacity)); // 10
console.log('最大价值(优化):', knapsack01Optimized(weights, values, capacity)); // 10
console.log();

console.log('===== 8. 打家劫舍 =====\n');

const houses1 = [1, 2, 3, 1];
console.log('房屋金额:', houses1);
console.log('最大金额:', rob(houses1)); // 4

const houses2 = [2, 7, 9, 3, 1];
console.log('\n房屋金额:', houses2);
console.log('最大金额:', rob(houses2)); // 12
console.log();

// 性能测试
console.log('===== 性能对比 =====\n');

function measureTime(func, ...args) {
    const start = Date.now();
    const result = func(...args);
    const end = Date.now();
    return { result, time: end - start };
}

// 大数斐波那契
const fibN = 1000;
console.log(`Fibonacci(${fibN}):`);
const fibResult = measureTime(fibonacciOptimized, fibN);
console.log(`  结果位数: ${fibResult.result.toString().length}`);
console.log(`  耗时: ${fibResult.time}ms`);
console.log();

// 大规模LIS
const largeNums = Array.from({ length: 1000 }, () => Math.floor(Math.random() * 10000));
console.log('LIS (1000个元素):');
const lisResult = measureTime(lengthOfLIS, largeNums);
console.log(`  LIS长度: ${lisResult.result}`);
console.log(`  耗时: ${lisResult.time}ms`);

// 导出函数（如果在Node.js环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fibonacci,
        fibonacciOptimized,
        climbStairs,
        coinChange,
        lengthOfLIS,
        maxSubArray,
        minDistance,
        knapsack01,
        knapsack01Optimized,
        rob
    };
}
