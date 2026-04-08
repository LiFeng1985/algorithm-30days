/**
 * 回溯算法经典问题集合
 * 
 * 什么是回溯算法？
 * 回溯算法是一种通过探索所有可能的候选解来找出所有解的算法
 * 如果候选解被确认不是一个解，就回退到上一步，尝试其他选择
 * 
 * 核心思想：
 * - 深度优先搜索（DFS）
 * - 试错法：走不通就回头
 * - 剪枝：提前排除不可能的情况
 * 
 * 回溯模板：
 * ```
 * function backtrack(路径, 选择列表) {
 *     if (满足结束条件) {
 *         记录结果;
 *         return;
 *     }
 *     
 *     for (选择 in 选择列表) {
 *         做选择;
 *         backtrack(路径, 选择列表);
 *         撤销选择; // 回溯
 *     }
 * }
 * ```
 * 
 * 应用场景：
 * - 排列组合
 * - 子集问题
 * - N皇后
 * - 数独
 * - 迷宫问题
 */

// ==================== 1. 全排列 ====================

/**
 * 全排列
 * 
 * 问题：给定一个不含重复数字的数组，返回所有可能的全排列
 * 
 * 思路：
 * 对于每个位置，尝试所有未使用的数字
 * 
 * 时间复杂度：O(n!)
 * 空间复杂度：O(n)
 * 
 * @param {number[]} nums
 * @returns {number[][]}
 */
function permute(nums) {
    const result = [];
    const used = new Array(nums.length).fill(false);
    
    function backtrack(path) {
        // 结束条件：路径长度等于数组长度
        if (path.length === nums.length) {
            result.push([...path]);
            return;
        }
        
        // 遍历所有数字
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) {
                continue; // 已经使用过，跳过
            }
            
            // 做选择
            path.push(nums[i]);
            used[i] = true;
            
            // 递归
            backtrack(path);
            
            // 撤销选择
            path.pop();
            used[i] = false;
        }
    }
    
    backtrack([]);
    return result;
}

// ==================== 2. 组合总和 ====================

/**
 * 组合总和
 * 
 * 问题：给定候选数字和目标值，找出所有使数字和为目标的组合
 * 每个数字可以无限次使用
 * 
 * 思路：
 * 对于每个数字，可以选择或不选择
 * 如果选择，目标值减少，继续从当前数字开始
 * 
 * 时间复杂度：O(2^n)
 * 
 * @param {number[]} candidates - 候选数字
 * @param {number} target - 目标值
 * @returns {number[][]}
 */
function combinationSum(candidates, target) {
    const result = [];
    
    function backtrack(start, remaining, path) {
        // 结束条件
        if (remaining === 0) {
            result.push([...path]);
            return;
        }
        
        if (remaining < 0) {
            return; // 剪枝：超过目标值
        }
        
        // 从start开始，避免重复组合
        for (let i = start; i < candidates.length; i++) {
            // 做选择
            path.push(candidates[i]);
            
            // 递归（注意：i而不是i+1，因为可以重复使用）
            backtrack(i, remaining - candidates[i], path);
            
            // 撤销选择
            path.pop();
        }
    }
    
    backtrack(0, target, []);
    return result;
}

// ==================== 3. 子集 ====================

/**
 * 子集（幂集）
 * 
 * 问题：给定一个不含重复元素的数组，返回所有可能的子集
 * 
 * 思路：
 * 对于每个元素，有选和不选两种选择
 * 
 * 时间复杂度：O(2^n)
 * 
 * @param {number[]} nums
 * @returns {number[][]}
 */
function subsets(nums) {
    const result = [];
    
    function backtrack(start, path) {
        // 每个节点都是一个子集，都要记录
        result.push([...path]);
        
        // 从start开始，避免重复
        for (let i = start; i < nums.length; i++) {
            // 做选择
            path.push(nums[i]);
            
            // 递归
            backtrack(i + 1, path);
            
            // 撤销选择
            path.pop();
        }
    }
    
    backtrack(0, []);
    return result;
}

// ==================== 4. N皇后问题 ====================

/**
 * N皇后问题
 * 
 * 问题：在N×N的棋盘上放置N个皇后，使得它们互不攻击
 * 皇后可以攻击同行、同列、同对角线的棋子
 * 
 * 思路：
 * 逐行放置皇后，检查是否冲突
 * 
 * 时间复杂度：O(N!)
 * 
 * @param {number} n - 棋盘大小
 * @returns {string[][]} - 所有解法
 */
function solveNQueens(n) {
    const result = [];
    const board = Array(n).fill().map(() => Array(n).fill('.'));
    const cols = new Set();       // 已占用的列
    const diag1 = new Set();      // 主对角线 (row - col)
    const diag2 = new Set();      // 副对角线 (row + col)
    
    function backtrack(row) {
        // 结束条件：所有行都放置了皇后
        if (row === n) {
            result.push(board.map(r => r.join('')));
            return;
        }
        
        // 尝试在当前行的每一列放置皇后
        for (let col = 0; col < n; col++) {
            // 检查是否冲突
            if (cols.has(col) || 
                diag1.has(row - col) || 
                diag2.has(row + col)) {
                continue;
            }
            
            // 做选择
            board[row][col] = 'Q';
            cols.add(col);
            diag1.add(row - col);
            diag2.add(row + col);
            
            // 递归
            backtrack(row + 1);
            
            // 撤销选择
            board[row][col] = '.';
            cols.delete(col);
            diag1.delete(row - col);
            diag2.delete(row + col);
        }
    }
    
    backtrack(0);
    return result;
}

// ==================== 5. 括号生成 ====================

/**
 * 括号生成
 * 
 * 问题：生成n对括号的所有有效组合
 * 
 * 思路：
 * 左括号数量 < n时可以添加左括号
 * 右括号数量 < 左括号数量时可以添加右括号
 * 
 * 时间复杂度：O(4^n / sqrt(n))
 * 
 * @param {number} n - 括号对数
 * @returns {string[]}
 */
function generateParenthesis(n) {
    const result = [];
    
    function backtrack(current, open, close) {
        // 结束条件：字符串长度达到2*n
        if (current.length === 2 * n) {
            result.push(current);
            return;
        }
        
        // 如果左括号数量 < n，可以添加左括号
        if (open < n) {
            backtrack(current + '(', open + 1, close);
        }
        
        // 如果右括号数量 < 左括号数量，可以添加右括号
        if (close < open) {
            backtrack(current + ')', open, close + 1);
        }
    }
    
    backtrack('', 0, 0);
    return result;
}

// ==================== 6. 单词搜索 ====================

/**
 * 单词搜索
 * 
 * 问题：在二维网格中搜索单词
 * 单词可以由相邻单元格的字母构成（上下左右）
 * 
 * 思路：
 * 从每个单元格开始DFS，尝试匹配单词
 * 
 * 时间复杂度：O(M * N * 4^L)，M*N是网格大小，L是单词长度
 * 
 * @param {string[][]} board - 二维网格
 * @param {string} word - 要搜索的单词
 * @returns {boolean}
 */
function exist(board, word) {
    const rows = board.length;
    const cols = board[0].length;
    
    function backtrack(row, col, index) {
        // 结束条件：匹配完整个单词
        if (index === word.length) {
            return true;
        }
        
        // 边界检查和字符匹配检查
        if (row < 0 || row >= rows || 
            col < 0 || col >= cols || 
            board[row][col] !== word[index]) {
            return false;
        }
        
        // 标记为已访问
        const temp = board[row][col];
        board[row][col] = '#';
        
        // 向四个方向搜索
        const found = backtrack(row + 1, col, index + 1) ||
                      backtrack(row - 1, col, index + 1) ||
                      backtrack(row, col + 1, index + 1) ||
                      backtrack(row, col - 1, index + 1);
        
        // 恢复原状
        board[row][col] = temp;
        
        return found;
    }
    
    // 从每个单元格开始尝试
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (backtrack(i, j, 0)) {
                return true;
            }
        }
    }
    
    return false;
}

// ==================== 7. 电话号码的字母组合 ====================

/**
 * 电话号码的字母组合
 * 
 * 问题：给定数字字符串，返回所有可能的字母组合
 * 数字到字母的映射类似电话键盘
 * 
 * 思路：
 * 对于每个数字，尝试所有对应的字母
 * 
 * 时间复杂度：O(4^n)，n是数字长度
 * 
 * @param {string} digits
 * @returns {string[]}
 */
function letterCombinations(digits) {
    if (!digits || digits.length === 0) {
        return [];
    }
    
    const phoneMap = {
        '2': 'abc',
        '3': 'def',
        '4': 'ghi',
        '5': 'jkl',
        '6': 'mno',
        '7': 'pqrs',
        '8': 'tuv',
        '9': 'wxyz'
    };
    
    const result = [];
    
    function backtrack(index, current) {
        // 结束条件：处理完所有数字
        if (index === digits.length) {
            result.push(current);
            return;
        }
        
        const letters = phoneMap[digits[index]];
        
        // 尝试每个字母
        for (let letter of letters) {
            backtrack(index + 1, current + letter);
        }
    }
    
    backtrack(0, '');
    return result;
}

// ==================== 8. 复原IP地址 ====================

/**
 * 复原IP地址
 * 
 * 问题：给定只包含数字的字符串，返回所有可能的有效IP地址
 * 
 * 思路：
 * IP地址由4段组成，每段0-255
 * 尝试在不同位置插入点号
 * 
 * 时间复杂度：O(1) - 最多3^4种可能
 * 
 * @param {string} s
 * @returns {string[]}
 */
function restoreIpAddresses(s) {
    const result = [];
    
    function backtrack(start, parts) {
        // 结束条件：已经有4段
        if (parts.length === 4) {
            if (start === s.length) {
                result.push(parts.join('.'));
            }
            return;
        }
        
        // 尝试长度为1、2、3的段
        for (let len = 1; len <= 3; len++) {
            if (start + len > s.length) {
                break;
            }
            
            const segment = s.substring(start, start + len);
            
            // 检查有效性
            // 不能有前导零（除非就是"0"）
            if (segment.length > 1 && segment[0] === '0') {
                continue;
            }
            
            // 必须在0-255范围内
            const num = parseInt(segment);
            if (num > 255) {
                continue;
            }
            
            // 做选择
            parts.push(segment);
            
            // 递归
            backtrack(start + len, parts);
            
            // 撤销选择
            parts.pop();
        }
    }
    
    backtrack(0, []);
    return result;
}

// ==================== 测试代码 ====================

console.log('===== 1. 全排列 =====\n');

const nums1 = [1, 2, 3];
console.log('数组:', nums1);
const perms = permute(nums1);
console.log('全排列:');
perms.forEach(p => console.log('  ', p));
console.log('总数:', perms.length); // 6
console.log();

console.log('===== 2. 组合总和 =====\n');

const candidates = [2, 3, 6, 7];
const target = 7;
console.log(`候选数字: [${candidates}], 目标: ${target}`);
const combinations = combinationSum(candidates, target);
console.log('组合:');
combinations.forEach(c => console.log('  ', c));
console.log();

console.log('===== 3. 子集 =====\n');

const nums2 = [1, 2, 3];
console.log('数组:', nums2);
const subs = subsets(nums2);
console.log('所有子集:');
subs.forEach(s => console.log('  ', s));
console.log('总数:', subs.length); // 8
console.log();

console.log('===== 4. N皇后问题 =====\n');

const n = 4;
console.log(`${n}皇后问题的解:`);
const queens = solveNQueens(n);
queens.forEach((solution, idx) => {
    console.log(`\n解法 ${idx + 1}:`);
    solution.forEach(row => console.log('  ', row));
});
console.log(`\n总解法数: ${queens.length}`);
console.log();

console.log('===== 5. 括号生成 =====\n');

const n_pairs = 3;
console.log(`${n_pairs}对括号的所有有效组合:`);
const parens = generateParenthesis(n_pairs);
parens.forEach(p => console.log('  ', p));
console.log('总数:', parens.length); // 5
console.log();

console.log('===== 6. 单词搜索 =====\n');

const board = [
    ['A', 'B', 'C', 'E'],
    ['S', 'F', 'C', 'S'],
    ['A', 'D', 'E', 'E']
];

const word1 = 'ABCCED';
console.log('网格:');
board.forEach(row => console.log('  ', row.join(' ')));
console.log(`\n搜索 "${word1}":`, exist(board, word1)); // true

const word2 = 'SEE';
console.log(`搜索 "${word2}":`, exist(board, word2)); // true

const word3 = 'ABCB';
console.log(`搜索 "${word3}":`, exist(board, word3)); // false
console.log();

console.log('===== 7. 电话号码字母组合 =====\n');

const digits = '23';
console.log(`数字: "${digits}"`);
const combos = letterCombinations(digits);
console.log('字母组合:');
combos.forEach(c => console.log('  ', c));
console.log();

console.log('===== 8. 复原IP地址 =====\n');

const ip = '25525511135';
console.log(`字符串: "${ip}"`);
const ips = restoreIpAddresses(ip);
console.log('有效IP地址:');
ips.forEach(addr => console.log('  ', addr));
console.log();

// 导出函数（如果在Node.js环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        permute,
        combinationSum,
        subsets,
        solveNQueens,
        generateParenthesis,
        exist,
        letterCombinations,
        restoreIpAddresses
    };
}
