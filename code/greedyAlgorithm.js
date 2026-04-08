/**
 * 贪心算法经典问题集合
 * 
 * 什么是贪心算法？
 * 贪心算法是在每一步都做出当前看起来最好的选择
 * 希望从而导致结果是全局最优的
 * 
 * 核心思想：
 * - 局部最优 => 全局最优
 * - 一旦做出选择，就不会反悔
 * 
 * 适用条件：
 * 1. 贪心选择性质：局部最优能导致全局最优
 * 2. 最优子结构：问题的最优解包含子问题的最优解
 * 
 * 注意：
 * 贪心算法不一定能得到最优解！
 * 需要证明贪心策略的正确性
 */

// ==================== 1. 活动选择问题 ====================

/**
 * 活动选择问题
 * 
 * 问题：有n个活动，每个活动有开始和结束时间
 * 求最多能参加多少个互不冲突的活动
 * 
 * 贪心策略：
 * 每次都选择结束时间最早的活动
 * 这样可以为后面的活动留出更多时间
 * 
 * 步骤：
 * 1. 按结束时间排序
 * 2. 选择第一个活动
 * 3. 跳过与已选活动冲突的活动
 * 4. 选择下一个不冲突的活动
 * 
 * 时间复杂度：O(n log n) - 主要是排序
 * 空间复杂度：O(1)
 * 
 * @param {Array} activities - 活动数组 [{start, end}]
 * @returns {Array} - 选中的活动索引
 */
function activitySelection(activities) {
    // 创建带索引的活动列表
    const indexedActivities = activities.map((act, index) => ({
        ...act,
        index
    }));
    
    // 按结束时间排序
    indexedActivities.sort((a, b) => a.end - b.end);
    
    const selected = [];
    let lastEndTime = 0;
    
    for (let act of indexedActivities) {
        // 如果活动的开始时间 >= 上一个活动的结束时间
        if (act.start >= lastEndTime) {
            selected.push(act.index);
            lastEndTime = act.end;
        }
    }
    
    return selected;
}

// ==================== 2. 分发饼干 ====================

/**
 * 分发饼干
 * 
 * 问题：有g个孩子和s块饼干，每个孩子有一个胃口值
 * 每块饼干有一个尺寸，只有尺寸>=胃口才能满足孩子
 * 求最多能满足多少个孩子
 * 
 * 贪心策略：
 * 用最小的饼干满足最小胃口的孩子
 * 
 * 步骤：
 * 1. 对孩子胃口和饼干尺寸排序
 * 2. 从小到大尝试匹配
 * 
 * 时间复杂度：O(g log g + s log s)
 * 
 * @param {number[]} g - 孩子的胃口值
 * @param {number[]} s - 饼干尺寸
 * @returns {number} - 满足的孩子数
 */
function findContentChildren(g, s) {
    // 排序
    g.sort((a, b) => a - b);
    s.sort((a, b) => a - b);
    
    let childIndex = 0;
    let cookieIndex = 0;
    
    while (childIndex < g.length && cookieIndex < s.length) {
        // 如果当前饼干能满足当前孩子
        if (s[cookieIndex] >= g[childIndex]) {
            childIndex++; // 满足一个孩子
        }
        cookieIndex++; // 尝试下一块饼干
    }
    
    return childIndex;
}

// ==================== 3. 跳跃游戏 ====================

/**
 * 跳跃游戏 I
 * 
 * 问题：给定一个数组，每个元素表示在该位置能跳跃的最大长度
 * 判断是否能到达最后一个位置
 * 
 * 贪心策略：
 * 维护一个最远可达位置
 * 遍历数组，更新最远可达位置
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 * 
 * @param {number[]} nums
 * @returns {boolean}
 */
function canJump(nums) {
    let maxReach = 0; // 最远可达位置
    
    for (let i = 0; i < nums.length; i++) {
        // 如果当前位置不可达，返回false
        if (i > maxReach) {
            return false;
        }
        
        // 更新最远可达位置
        maxReach = Math.max(maxReach, i + nums[i]);
        
        // 如果已经可以到达最后，提前返回
        if (maxReach >= nums.length - 1) {
            return true;
        }
    }
    
    return true;
}

/**
 * 跳跃游戏 II
 * 
 * 问题：求到达最后位置的最少跳跃次数
 * 
 * 贪心策略：
 * 在每一步都选择能跳得最远的位置
 * 
 * 时间复杂度：O(n)
 * 
 * @param {number[]} nums
 * @returns {number} - 最少跳跃次数
 */
function jump(nums) {
    if (nums.length <= 1) {
        return 0;
    }
    
    let jumps = 0;        // 跳跃次数
    let currentEnd = 0;   // 当前跳跃能到达的边界
    let farthest = 0;     // 能到达的最远位置
    
    for (let i = 0; i < nums.length - 1; i++) {
        // 更新能到达的最远位置
        farthest = Math.max(farthest, i + nums[i]);
        
        // 如果到达了当前跳跃的边界
        if (i === currentEnd) {
            jumps++;              // 需要再跳一次
            currentEnd = farthest; // 更新边界
            
            // 如果已经可以到达最后
            if (currentEnd >= nums.length - 1) {
                break;
            }
        }
    }
    
    return jumps;
}

// ==================== 4. 买卖股票的最佳时机 ====================

/**
 * 买卖股票的最佳时机 I
 * 
 * 问题：只能买卖一次，求最大利润
 * 
 * 贪心策略：
 * 记录历史最低价，每天都计算如果今天卖出的利润
 * 
 * 时间复杂度：O(n)
 * 
 * @param {number[]} prices - 每天的价格
 * @returns {number} - 最大利润
 */
function maxProfit(prices) {
    if (prices.length === 0) {
        return 0;
    }
    
    let minPrice = Infinity; // 历史最低价
    let maxProfit = 0;       // 最大利润
    
    for (let price of prices) {
        // 更新历史最低价
        minPrice = Math.min(minPrice, price);
        
        // 计算如果今天卖出的利润
        maxProfit = Math.max(maxProfit, price - minPrice);
    }
    
    return maxProfit;
}

/**
 * 买卖股票的最佳时机 II
 * 
 * 问题：可以多次买卖，求最大利润
 * 
 * 贪心策略：
 * 只要明天比今天贵，就今天买明天卖
 * 等价于收集所有上涨的差价
 * 
 * 时间复杂度：O(n)
 * 
 * @param {number[]} prices
 * @returns {number}
 */
function maxProfitII(prices) {
    let profit = 0;
    
    for (let i = 1; i < prices.length; i++) {
        // 如果明天比今天贵，就收集这个差价
        if (prices[i] > prices[i - 1]) {
            profit += prices[i] - prices[i - 1];
        }
    }
    
    return profit;
}

// ==================== 5. 区间调度 ====================

/**
 * 无重叠区间
 * 
 * 问题：给定一些区间，求最少需要移除多少个区间才能使剩余区间不重叠
 * 
 * 贪心策略：
 * 按结束时间排序，选择不重叠的区间
 * 需要移除的数量 = 总数 - 不重叠的数量
 * 
 * 时间复杂度：O(n log n)
 * 
 * @param {Array} intervals - 区间数组 [[start, end]]
 * @returns {number} - 需要移除的区间数
 */
function eraseOverlapIntervals(intervals) {
    if (intervals.length === 0) {
        return 0;
    }
    
    // 按结束时间排序
    intervals.sort((a, b) => a[1] - b[1]);
    
    let count = 1; // 不重叠区间的数量
    let end = intervals[0][1];
    
    for (let i = 1; i < intervals.length; i++) {
        // 如果当前区间的开始 >= 上一个区间的结束
        if (intervals[i][0] >= end) {
            count++;
            end = intervals[i][1];
        }
    }
    
    return intervals.length - count;
}

// ==================== 6. 用最少数量的箭引爆气球 ====================

/**
 * 用最少数量的箭引爆气球
 * 
 * 问题：气球在x轴上有起始和结束位置
 * 一支箭可以引爆所有覆盖的气球
 * 求最少需要多少支箭
 * 
 * 贪心策略：
 * 按结束位置排序，尽可能让一支箭引爆多个气球
 * 
 * 时间复杂度：O(n log n)
 * 
 * @param {Array} points - 气球位置 [[start, end]]
 * @returns {number} - 最少箭数
 */
function findMinArrowShots(points) {
    if (points.length === 0) {
        return 0;
    }
    
    // 按结束位置排序
    points.sort((a, b) => a[1] - b[1]);
    
    let arrows = 1;
    let arrowPos = points[0][1];
    
    for (let i = 1; i < points.length; i++) {
        // 如果当前气球的起始位置 > 箭的位置
        if (points[i][0] > arrowPos) {
            arrows++; // 需要新的箭
            arrowPos = points[i][1]; // 更新箭的位置
        }
    }
    
    return arrows;
}

// ==================== 7. 划分字母区间 ====================

/**
 * 划分字母区间
 * 
 * 问题：将字符串划分为尽可能多的片段，使得每个字母只出现在一个片段中
 * 
 * 贪心策略：
 * 1. 记录每个字母最后出现的位置
 * 2. 遍历字符串，更新当前片段的结束位置
 * 3. 当遍历到结束位置时，就是一个片段
 * 
 * 时间复杂度：O(n)
 * 
 * @param {string} s
 * @returns {number[]} - 每个片段的长度
 */
function partitionLabels(s) {
    // 记录每个字母最后出现的位置
    const lastOccurrence = {};
    for (let i = 0; i < s.length; i++) {
        lastOccurrence[s[i]] = i;
    }
    
    const result = [];
    let start = 0;
    let end = 0;
    
    for (let i = 0; i < s.length; i++) {
        // 更新当前片段的结束位置
        end = Math.max(end, lastOccurrence[s[i]]);
        
        // 如果到达结束位置，就是一个片段
        if (i === end) {
            result.push(end - start + 1);
            start = i + 1;
        }
    }
    
    return result;
}

// ==================== 8. 根据身高重建队列 ====================

/**
 * 根据身高重建队列
 * 
 * 问题：每个人用[h, k]表示，h是身高，k是前面有多少人身高>=h
 * 重建队列
 * 
 * 贪心策略：
 * 1. 按身高降序、k升序排序
 * 2. 依次插入到位置k
 * 
 * 时间复杂度：O(n²)
 * 
 * @param {Array} people - [[height, k]]
 * @returns {Array}
 */
function reconstructQueue(people) {
    // 按身高降序、k升序排序
    people.sort((a, b) => {
        if (a[0] !== b[0]) {
            return b[0] - a[0]; // 身高降序
        }
        return a[1] - b[1]; // k升序
    });
    
    const result = [];
    
    // 依次插入到位置k
    for (let person of people) {
        result.splice(person[1], 0, person);
    }
    
    return result;
}

// ==================== 测试代码 ====================

console.log('===== 1. 活动选择问题 =====\n');

const activities = [
    { start: 1, end: 3 },
    { start: 2, end: 4 },
    { start: 3, end: 5 },
    { start: 0, end: 6 },
    { start: 5, end: 7 },
    { start: 8, end: 9 },
    { start: 5, end: 9 }
];

console.log('活动列表:');
activities.forEach((act, i) => {
    console.log(`  活动${i}: [${act.start}, ${act.end}]`);
});

const selected = activitySelection(activities);
console.log('\n选中的活动索引:', selected);
console.log('选中的活动:');
selected.forEach(i => {
    console.log(`  活动${i}: [${activities[i].start}, ${activities[i].end}]`);
});
console.log();

console.log('===== 2. 分发饼干 =====\n');

const g1 = [1, 2, 3];
const s1_cookies = [1, 1];
console.log(`孩子胃口: [${g1}], 饼干尺寸: [${s1_cookies}]`);
console.log('满足的孩子数:', findContentChildren(g1, s1_cookies)); // 1

const g2 = [1, 2];
const s2 = [1, 2, 3];
console.log(`\n孩子胃口: [${g2}], 饼干尺寸: [${s2}]`);
console.log('满足的孩子数:', findContentChildren(g2, s2)); // 2
console.log();

console.log('===== 3. 跳跃游戏 =====\n');

const nums1 = [2, 3, 1, 1, 4];
console.log('数组:', nums1);
console.log('能否到达终点:', canJump(nums1)); // true
console.log('最少跳跃次数:', jump(nums1)); // 2

const nums2 = [3, 2, 1, 0, 4];
console.log('\n数组:', nums2);
console.log('能否到达终点:', canJump(nums2)); // false
console.log();

console.log('===== 4. 买卖股票 =====\n');

const prices1 = [7, 1, 5, 3, 6, 4];
console.log('价格:', prices1);
console.log('最大利润(一次交易):', maxProfit(prices1)); // 5
console.log('最大利润(多次交易):', maxProfitII(prices1)); // 7

const prices2 = [1, 2, 3, 4, 5];
console.log('\n价格:', prices2);
console.log('最大利润(一次交易):', maxProfit(prices2)); // 4
console.log('最大利润(多次交易):', maxProfitII(prices2)); // 4
console.log();

console.log('===== 5. 无重叠区间 =====\n');

const intervals1 = [[1, 2], [2, 3], [3, 4], [1, 3]];
console.log('区间:', intervals1);
console.log('需要移除的区间数:', eraseOverlapIntervals(intervals1)); // 1

const intervals2 = [[1, 2], [1, 2], [1, 2]];
console.log('\n区间:', intervals2);
console.log('需要移除的区间数:', eraseOverlapIntervals(intervals2)); // 2
console.log();

console.log('===== 6. 引爆气球 =====\n');

const points1 = [[10, 16], [2, 8], [1, 6], [7, 12]];
console.log('气球位置:', points1);
console.log('最少箭数:', findMinArrowShots(points1)); // 2
console.log();

console.log('===== 7. 划分字母区间 =====\n');

const str1 = 'ababcbacadefegdehijhklij';
console.log('字符串:', str1);
console.log('片段长度:', partitionLabels(str1)); // [9,7,8]
console.log();

console.log('===== 8. 重建队列 =====\n');

const people1 = [[7, 0], [4, 4], [7, 1], [5, 0], [6, 1], [5, 2]];
console.log('输入:', people1);
const result = reconstructQueue(people1);
console.log('重建后:');
result.forEach(p => console.log(`  [${p}]`));
console.log();

// 导出函数（如果在Node.js环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        activitySelection,
        findContentChildren,
        canJump,
        jump,
        maxProfit,
        maxProfitII,
        eraseOverlapIntervals,
        findMinArrowShots,
        partitionLabels,
        reconstructQueue
    };
}
