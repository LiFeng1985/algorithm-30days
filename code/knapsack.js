/**
 * =====================================================
 * 背包问题（动态规划经典）
 * =====================================================
 * 
 * 【什么是背包问题？】
 * 给定一个容量为W的背包和n个物品，每个物品有重量和价值，
 * 如何选择物品使得总价值最大且不超过背包容量？
 * 
 * 【三种类型】
 * 1. 0-1背包：每个物品只能选一次
 * 2. 完全背包：每个物品可以选无限次
 * 3. 多重背包：每个物品有数量限制
 * 
 * 【0-1背包核心思想】
 * dp[i][j] = 前i个物品，背包容量为j时的最大价值
 * 
 * 状态转移方程：
 * dp[i][j] = max(
 *   dp[i-1][j],                    // 不选第i个物品
 *   dp[i-1][j-weight[i]] + value[i] // 选第i个物品
 * )
 * 
 * 【时间复杂度】
 * - 0-1背包：O(n * W)
 * - 完全背包：O(n * W)
 * 
 * 【空间复杂度】
 * - 原始：O(n * W)
 * - 优化后：O(W)（滚动数组）
 * 
 * 【应用场景】
 * - 资源分配
 * - 投资决策
 * - 货物装载
 * - 面试必考（LeetCode 416、474、494）
 */

// ========== 0-1背包（每个物品只能选一次） ==========

console.log('=== 0-1背包问题 ===\n');

/**
 * 0-1背包（二维DP）
 * @param {number[]} weights - 物品重量
 * @param {number[]} values - 物品价值
 * @param {number} capacity - 背包容量
 * @returns {number} 最大价值
 */
function knapsack01_2D(weights, values, capacity) {
    const n = weights.length;
    // dp[i][j]表示前i个物品，背包容量为j时的最大价值
    const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        for (let j = 0; j <= capacity; j++) {
            // 不选第i个物品
            dp[i][j] = dp[i - 1][j];

            // 如果容量够，考虑选第i个物品
            if (j >= weights[i - 1]) {
                dp[i][j] = Math.max(
                    dp[i][j],
                    dp[i - 1][j - weights[i - 1]] + values[i - 1]
                );
            }
        }
    }

    return dp[n][capacity];
}

/**
 * 0-1背包（空间优化版，一维DP）
 * @param {number[]} weights - 物品重量
 * @param {number[]} values - 物品价值
 * @param {number} capacity - 背包容量
 * @returns {number} 最大价值
 */
function knapsack01_1D(weights, values, capacity) {
    const dp = new Array(capacity + 1).fill(0);

    for (let i = 0; i < weights.length; i++) {
        // 逆序遍历（防止重复选择同一物品）
        for (let j = capacity; j >= weights[i]; j--) {
            dp[j] = Math.max(dp[j], dp[j - weights[i]] + values[i]);
        }
    }

    return dp[capacity];
}

/**
 * 回溯找出选择的物品
 * @param {number[]} weights - 物品重量
 * @param {number[]} values - 物品价值
 * @param {number} capacity - 背包容量
 * @returns {Object} {maxValue, selectedItems}
 */
function knapsack01WithItems(weights, values, capacity) {
    const n = weights.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

    // 填表
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j <= capacity; j++) {
            dp[i][j] = dp[i - 1][j];
            if (j >= weights[i - 1]) {
                dp[i][j] = Math.max(
                    dp[i][j],
                    dp[i - 1][j - weights[i - 1]] + values[i - 1]
                );
            }
        }
    }

    // 回溯找出选择的物品
    const selectedItems = [];
    let j = capacity;
    for (let i = n; i > 0 && j > 0; i--) {
        if (dp[i][j] !== dp[i - 1][j]) {
            selectedItems.unshift(i - 1); // 选择了第i个物品
            j -= weights[i - 1];
        }
    }

    return {
        maxValue: dp[n][capacity],
        selectedItems
    };
}

// 测试0-1背包
const weights1 = [2, 3, 4, 5];
const values1 = [3, 4, 5, 6];
const capacity1 = 8;

console.log('物品信息：');
weights1.forEach((w, i) => {
    console.log(`  物品${i}: 重量=${w}, 价值=${values1[i]}`);
});
console.log(`背包容量：${capacity1}\n`);

console.log('0-1背包（二维DP）最大价值：', knapsack01_2D(weights1, values1, capacity1));
console.log('0-1背包（一维DP）最大价值：', knapsack01_1D(weights1, values1, capacity1));

const result1 = knapsack01WithItems(weights1, values1, capacity1);
console.log('\n选择的物品：');
result1.selectedItems.forEach(idx => {
    console.log(`  物品${idx}: 重量=${weights1[idx]}, 价值=${values1[idx]}`);
});
console.log(`总重量: ${result1.selectedItems.reduce((sum, idx) => sum + weights1[idx], 0)}`);
console.log(`总价值: ${result1.maxValue}`);

// ========== 完全背包（每个物品可以选无限次） ==========

console.log('\n=== 完全背包问题 ===\n');

/**
 * 完全背包
 * @param {number[]} weights - 物品重量
 * @param {number[]} values - 物品价值
 * @param {number} capacity - 背包容量
 * @returns {number} 最大价值
 */
function knapsackComplete(weights, values, capacity) {
    const dp = new Array(capacity + 1).fill(0);

    for (let i = 0; i < weights.length; i++) {
        // 正序遍历（允许重复选择同一物品）
        for (let j = weights[i]; j <= capacity; j++) {
            dp[j] = Math.max(dp[j], dp[j - weights[i]] + values[i]);
        }
    }

    return dp[capacity];
}

const weights2 = [2, 3, 4];
const values2 = [3, 4, 5];
const capacity2 = 10;

console.log('物品信息：');
weights2.forEach((w, i) => {
    console.log(`  物品${i}: 重量=${w}, 价值=${values2[i]}（可重复选择）`);
});
console.log(`背包容量：${capacity2}\n`);

console.log('完全背包最大价值：', knapsackComplete(weights2, values2, capacity2));

// ========== 实际应用：投资决策 ==========

console.log('\n=== 实际应用：投资决策 ===\n');

// 场景：你有10万元，有5个项目可投资
// 每个项目需要一定资金，预期有一定收益
// 如何选择项目使得总收益最大？

const projects = [
    { name: '电商项目', cost: 3, profit: 4 },
    { name: 'AI项目', cost: 4, profit: 5 },
    { name: '区块链项目', cost: 5, profit: 6 },
    { name: '社交项目', cost: 2, profit: 3 },
    { name: '游戏项目', cost: 3, profit: 4 }
];

const budget = 10; // 10万元
const projectCosts = projects.map(p => p.cost);
const projectProfits = projects.map(p => p.profit);

console.log('投资项目：');
projects.forEach((p, i) => {
    console.log(`  ${p.name}: 投资${p.cost}万，预期收益${p.profit}万`);
});
console.log(`总预算：${budget}万\n`);

const investment = knapsack01WithItems(projectCosts, projectProfits, budget);
console.log('最优投资方案：');
investment.selectedItems.forEach(idx => {
    console.log(`  投资${projects[idx].name}（${projects[idx].cost}万）`);
});
console.log(`总投资: ${investment.selectedItems.reduce((sum, idx) => sum + projects[idx].cost, 0)}万`);
console.log(`预期总收益: ${investment.maxValue}万`);

// ========== 实际应用：零钱兑换（完全背包） ==========

console.log('\n=== 实际应用：零钱兑换 ===\n');

/**
 * 零钱兑换（完全背包）
 * @param {number[]} coins - 硬币面额
 * @param {number} amount - 目标金额
 * @returns {number} 最少硬币数量
 */
function coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;

    for (let coin of coins) {
        for (let i = coin; i <= amount; i++) {
            dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }
    }

    return dp[amount] === Infinity ? -1 : dp[amount];
}

const coins = [1, 2, 5];
const amount = 11;

console.log(`硬币面额：${coins}`);
console.log(`目标金额：${amount}\n`);

const minCoins = coinChange(coins, amount);
console.log(`最少需要${minCoins}枚硬币`);

// 回溯找出具体方案
function coinChangeWithCoins(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    const used = new Array(amount + 1).fill(-1);
    dp[0] = 0;

    for (let coin of coins) {
        for (let i = coin; i <= amount; i++) {
            if (dp[i - coin] + 1 < dp[i]) {
                dp[i] = dp[i - coin] + 1;
                used[i] = coin;
            }
        }
    }

    // 回溯找出硬币组合
    const result = [];
    let current = amount;
    while (current > 0) {
        result.push(used[current]);
        current -= used[current];
    }

    return { minCoins: dp[amount], coins: result };
}

const change = coinChangeWithCoins(coins, amount);
console.log(`硬币组合：${change.coins.join(' + ')} = ${amount}`);

// ========== 性能测试 ==========

console.log('\n=== 性能测试 ===\n');

const n = 1000;
const W = 10000;
const weights3 = Array.from({ length: n }, () => Math.floor(Math.random() * 100) + 1);
const values3 = Array.from({ length: n }, () => Math.floor(Math.random() * 100) + 1);

console.log(`物品数量：${n}`);
console.log(`背包容量：${W}\n`);

const startTime = Date.now();
const maxVal = knapsack01_1D(weights3, values3, W);
const endTime = Date.now();

console.log(`最大价值：${maxVal}`);
console.log(`计算耗时：${endTime - startTime}ms`);
