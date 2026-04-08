# 💡 Day 28 - 练习题答案详解

> **回溯算法**  
> **参考答案与解析**

---

## 一、基础概念题答案

### 题目 1：什么是回溯算法？（10 分）

**参考答案：**
```
回溯算法是一种系统化的搜索方法，
通过尝试所有可能的选择来找到问题的解。
遇到死路就退回上一步，换条路继续走。
就像走迷宫时不断试错一样。
```

**评分要点：**
- ✅ 提到"尝试所有可能"（3 分）
- ✅ 有自己的比喻（3 分）
- ✅ 提到"退回"或"撤销"（4 分）

---

### 题目 2：回溯的原理（15 分）

**参考答案：**

**基本思想：**（6 分）
```
系统地枚举所有可能的解，
在搜索过程中，如果发现当前路径不可能得到解，
就回退到上一步，尝试其他选择。
这是一种"试错"的策略。
```

**核心步骤：**（6 分）

**1. 做选择：**（2 分）
```
在当前状态下，选择一个可行的选项，
将其加入当前路径。
```

**2. 递归：**（2 分）
```
基于新的状态，继续递归搜索。
```

**3. 撤销选择：**（2 分）
```
递归返回后，撤销刚才的选择，
恢复到之前的状态，尝试下一个选项。
```

**为什么要撤销选择：**（3 分）
```
因为回溯要尝试所有可能的组合。
如果不撤销，就会影响后续的搜索。
撤销是为了"恢复现场"，
让下一次尝试在一个干净的状态下进行。
```

**状态空间树：**（额外加分）
```
回溯的搜索过程可以看作一棵树：
- 根节点：初始状态
- 中间节点：部分解
- 叶子节点：完整解或死路

回溯就是深度优先遍历这棵树，
遇到死路就回溯到父节点。
```

**评分要点：**
- 基本思想 6 分
- 三个步骤各 2 分
- 撤销原因 3 分

---

### 题目 3：剪枝优化（10 分）

**参考答案：**

**什么是剪枝：**（3 分）
```
在搜索过程中，提前判断某些分支不可能得到解，
直接跳过这些分支，不再继续搜索。
就像修剪树枝一样，去掉无用的部分。
```

**剪枝的作用：**（3 分）
```
1. 大幅减少搜索空间
2. 提高算法效率
3. 避免不必要的计算
4. 使指数级复杂度变得可接受
```

**常见的剪枝策略：**（4 分）

**1. 可行性剪枝**
```
如果当前选择违反了约束条件，立即停止。
例如：N 皇后中，当前位置与已有皇后冲突。
```

**2. 最优性剪枝**
```
如果当前路径已经不可能优于已知最优解，停止。
例如：背包问题中，剩余价值不够大。
```

**3. 重复性剪枝**
```
跳过重复的选择，避免生成重复解。
例如：有重复元素时，跳过相同的元素。
```

**评分要点：**
- 定义 3 分
- 作用 3 分
- 三种策略各约 1.3 分

---

## 二、代码实践题答案

### 题目 4：全排列问题（25 分）

**参考答案：**

```javascript
/**
 * 全排列
 */
function permute(nums) {
    const result = [];
    const used = new Array(nums.length).fill(false);
    
    function backtrack(path) {
        // 终止条件：路径长度等于数组长度
        if (path.length === nums.length) {
            result.push([...path]);  // 复制一份
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) {
                continue;  // 已使用，跳过
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

// 测试
console.log(permute([1, 2, 3]));
// [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]] ✓

console.log(permute([1]));
// [[1]] ✓

console.log(permute([]));
// [] ✓

// 进阶：有重复元素的全排列
function permuteUnique(nums) {
    const result = [];
    const used = new Array(nums.length).fill(false);
    
    // 先排序，方便去重
    nums.sort((a, b) => a - b);
    
    function backtrack(path) {
        if (path.length === nums.length) {
            result.push([...path]);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) {
                continue;
            }
            
            // 剪枝：跳过重复元素
            if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) {
                continue;
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

console.log('有重复:', permuteUnique([1, 1, 2]));
// [[1,1,2], [1,2,1], [2,1,1]] ✓
```

**执行过程演示（permute([1,2,3])）：**
```
backtrack([])
├─ 选 1: path=[1]
│  ├─ 选 2: path=[1,2]
│  │  └─ 选 3: path=[1,2,3] → 加入结果
│  └─ 选 3: path=[1,3]
│     └─ 选 2: path=[1,3,2] → 加入结果
├─ 选 2: path=[2]
│  ├─ 选 1: path=[2,1]
│  │  └─ 选 3: path=[2,1,3] → 加入结果
│  └─ 选 3: path=[2,3]
│     └─ 选 1: path=[2,3,1] → 加入结果
└─ 选 3: path=[3]
   ├─ 选 1: path=[3,1]
   │  └─ 选 2: path=[3,1,2] → 加入结果
   └─ 选 2: path=[3,2]
      └─ 选 1: path=[3,2,1] → 加入结果

共 6 种排列 ✓
```

**评分要点：**
- 基础版本正确 12 分
  - 终止条件 2 分
  - 选择和撤销 4 分
  - used 数组 2 分
  - 返回值 2 分
  - 能通过测试 2 分
- 去重版本正确 10 分
  - 排序 2 分
  - 剪枝条件 4 分
  - 其他同上 4 分

**常见错误：**
❌ 忘记复制数组 → ✅ 用 [...path] 或 path.slice()
❌ 忘记撤销选择 → ✅ 必须 pop 和设置 false
❌ 去重条件错误 → ✅ 要检查前一个是否未使用

---

### 题目 5：N 皇后问题（20 分）

**参考答案：**

```javascript
/**
 * N 皇后问题
 */
function solveNQueens(n) {
    const result = [];
    const board = Array(n).fill(null).map(() => '.'.repeat(n));
    
    function isValid(row, col) {
        // 检查列
        for (let i = 0; i < row; i++) {
            if (board[i][col] === 'Q') {
                return false;
            }
        }
        
        // 检查左上对角线
        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] === 'Q') {
                return false;
            }
        }
        
        // 检查右上对角线
        for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
            if (board[i][j] === 'Q') {
                return false;
            }
        }
        
        return true;
    }
    
    function backtrack(row) {
        if (row === n) {
            result.push([...board]);
            return;
        }
        
        for (let col = 0; col < n; col++) {
            if (isValid(row, col)) {
                // 放置皇后
                board[row] = board[row].substring(0, col) + 'Q' + board[row].substring(col + 1);
                
                // 递归下一行
                backtrack(row + 1);
                
                // 撤销选择
                board[row] = board[row].substring(0, col) + '.' + board[row].substring(col + 1);
            }
        }
    }
    
    backtrack(0);
    return result;
}

// 测试
const solutions4 = solveNQueens(4);
console.log('4 皇后的解法数:', solutions4.length);  // 2 ✓

if (solutions4.length > 0) {
    console.log('第一个解:');
    solutions4[0].forEach(row => console.log(row));
}
// .Q..
// ...Q
// Q...
// ..Q.

const solutions8 = solveNQueens(8);
console.log('8 皇后的解法数:', solutions8.length);  // 92 ✓
```

**优化版本（用集合加速检查）：**
```javascript
function solveNQueensOptimized(n) {
    const result = [];
    const board = Array(n).fill(null).map(() => '.'.repeat(n));
    const cols = new Set();
    const diag1 = new Set();  // row - col
    const diag2 = new Set();  // row + col
    
    function backtrack(row) {
        if (row === n) {
            result.push([...board]);
            return;
        }
        
        for (let col = 0; col < n; col++) {
            const d1 = row - col;
            const d2 = row + col;
            
            if (cols.has(col) || diag1.has(d1) || diag2.has(d2)) {
                continue;  // 剪枝
            }
            
            // 放置皇后
            board[row] = board[row].substring(0, col) + 'Q' + board[row].substring(col + 1);
            cols.add(col);
            diag1.add(d1);
            diag2.add(d2);
            
            // 递归
            backtrack(row + 1);
            
            // 撤销
            board[row] = board[row].substring(0, col) + '.' + board[row].substring(col + 1);
            cols.delete(col);
            diag1.delete(d1);
            diag2.delete(d2);
        }
    }
    
    backtrack(0);
    return result;
}
```

**评分要点：**
- 基础版本正确 15 分
  - isValid 正确 5 分
  - 回溯逻辑 5 分
  - 字符串操作 3 分
  - 返回值 2 分
- 优化版本额外加分 5 分

**关键理解：**
```
为什么只检查上方？
- 因为是逐行放置
- 下方还没有皇后
- 只需检查列、左上、右上三个方向

对角线的特点：
- 左上到右下：row - col 相同
- 右上到左下：row + col 相同
```

---

### 题目 6：子集问题（15 分）

**参考答案：**

```javascript
/**
 * 子集（幂集）
 */
function subsets(nums) {
    const result = [];
    
    function backtrack(start, path) {
        // 每个节点都是一个解
        result.push([...path]);
        
        for (let i = start; i < nums.length; i++) {
            // 做选择
            path.push(nums[i]);
            
            // 递归（注意是 i+1，不是 start+1）
            backtrack(i + 1, path);
            
            // 撤销选择
            path.pop();
        }
    }
    
    backtrack(0, []);
    return result;
}

// 测试
console.log(subsets([1, 2, 3]));
// [[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]] ✓

console.log(subsets([0]));
// [[], [0]] ✓

// 进阶：有重复元素的子集
function subsetsWithDup(nums) {
    const result = [];
    
    // 先排序
    nums.sort((a, b) => a - b);
    
    function backtrack(start, path) {
        result.push([...path]);
        
        for (let i = start; i < nums.length; i++) {
            // 剪枝：跳过重复元素
            if (i > start && nums[i] === nums[i - 1]) {
                continue;
            }
            
            path.push(nums[i]);
            backtrack(i + 1, path);
            path.pop();
        }
    }
    
    backtrack(0, []);
    return result;
}

console.log('有重复:', subsetsWithDup([1, 2, 2]));
// [[], [1], [2], [1,2], [2,2], [1,2,2]] ✓
```

**执行过程演示（subsets([1,2,3])）：**
```
backtrack(0, [])
  result: [[]]
  ├─ 选 1: path=[1]
  │  result: [[], [1]]
  │  ├─ 选 2: path=[1,2]
  │  │  result: [[], [1], [1,2]]
  │  │  └─ 选 3: path=[1,2,3]
  │  │     result: [[], [1], [1,2], [1,2,3]]
  │  └─ 选 3: path=[1,3]
  │     result: [[], [1], [1,2], [1,2,3], [1,3]]
  ├─ 选 2: path=[2]
  │  result: [[], [1], [1,2], [1,2,3], [1,3], [2]]
  │  └─ 选 3: path=[2,3]
  │     result: [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3]]
  └─ 选 3: path=[3]
     result: [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]

共 8 个子集 = 2^3 ✓
```

**评分要点：**
- 基础版本正确 10 分
  - 每个节点都是解 2 分
  - 从 start 开始 3 分
  - 选择和撤销 3 分
  - 返回值 2 分
- 去重版本正确 5 分

---

## 三、理解应用题答案

### 题目 7：实际应用场景（10 分）

**参考答案：**

**适用场景：**（3 分）
```
1. 排列组合问题
2. 约束满足问题（如 N 皇后、数独）
3. 图的着色问题
4. 路径搜索问题
5. 密码破解（暴力枚举）
```

**优点：**（3 分）
```
✓ 能找到所有解
✓ 实现相对简单
✓ 框架通用，易于套用
✓ 可以通过剪枝优化
```

**缺点/限制：**（2 分）
```
✗ 时间复杂度高（通常指数级）
✗ 不适合大规模问题
✗ 需要大量内存存储递归栈
```

**实际应用举例：**（2 分）

**1. 数独求解器**
```
逐个格子尝试 1-9，
检查是否符合规则，
不符合就回溯。
```

**2. 正则表达式匹配**
```
尝试所有可能的匹配方式，
失败就回溯到上一个位置。
```

**3. 编译器语法分析**
```
尝试不同的语法规则，
不匹配就回溯。
```

**评分要点：**
- 适用场景 3 分
- 优点 3 分
- 缺点 2 分
- 应用举例 2 分

---

### 题目 8：算法对比总结（10 分）

**参考答案：**

**1. 暴力枚举：**（1.5 分）
```
时间复杂度：O(2^n) 或 O(n!)
优点：保证找到所有解，实现最简单
缺点：效率极低，无法处理大规模
```

**2. 回溯算法：**（1.5 分）
```
时间复杂度：O(2^n) 或 O(n!)，但可通过剪枝优化
优点：系统化搜索，能找到所有解
缺点：仍然是指数级，需要剪枝
```

**3. 动态规划：**（1.5 分）
```
时间复杂度：O(n²) 或 O(n³)
优点：保证最优解，效率高
缺点：只适合特定类型问题
```

**4. 贪心算法：**（1.5 分）
```
时间复杂度：O(n) 或 O(n log n)
优点：简单高效
缺点：不一定最优
```

**选择策略：**（2 分）
```
- 需要所有解：回溯算法
- 只需要一个解：回溯 + 找到即停
- 要求最优解：动态规划或回溯
- 时间紧迫：贪心或近似算法
```

**总结：**（2 分）
```
1. 先分析问题类型
2. 看数据规模
3. 看是否需要所有解
4. 看时间要求
5. 选择合适的算法

一般原则：
- 能用贪心不用 DP
- 能用 DP 不用回溯
- 回溯是最后的 resort
```

**评分要点：**
- 四种算法各 1.5 分
- 选择策略 2 分
- 总结合理 2 分

---

## 四、费曼输出答案

### 题目 9：小老师时间（10 分）

**参考模板：**

```
大家好，今天我要讲的是"回溯算法"。

你们可能会问，什么是回溯算法呢？

其实啊，回溯算法就像走迷宫。
你从入口进去，看到有三条路。

你先选第一条路走，
走了几步发现是死胡同。
怎么办？退回来！

回到岔路口，再选第二条路，
又发现是死胡同。
再退回来！

最后选第三条路，
哇，找到出口了！

这就是回溯算法的核心思想：
一条路走到黑，不行就回头，
换条路继续走。

举个例子：
你要找出 [1, 2, 3] 的所有排列。

回溯的做法：
1. 先选 1，剩下 [2, 3]
2. 再选 2，剩下 [3]
3. 最后选 3，得到 [1, 2, 3]
4. 退回来，换 3，得到 [1, 3, 2]
5. 再退回来，换 2 开头...
6. 重复这个过程

所以，回溯算法就是：
系统地尝试所有可能，
不行就退回上一步，
直到找到所有解！

谢谢大家！
```

**评分要点：**
- 不用专业术语（3 分）
- 用了生活例子（走迷宫）（3 分）
- 逻辑清晰（2 分）
- 容易听懂（2 分）

**加分项：**
- 有多个例子（+2 分）
- 解释了核心思想（+2 分）
- 表达生动（+2 分）

---

## 📊 总分统计

| 题号 | 满分 | 你的得分 | 评语 |
|-----|------|---------|------|
| 题目 1 | 10 | ___ | _____ |
| 题目 2 | 15 | ___ | _____ |
| 题目 3 | 10 | ___ | _____ |
| 题目 4 | 25 | ___ | _____ |
| 题目 5 | 20 | ___ | _____ |
| 题目 6 | 15 | ___ | _____ |
| 题目 7 | 10 | ___ | _____ |
| 题目 8 | 10 | ___ | _____ |
| 题目 9 | 10 | ___ | _____ |
| **总分** | **125** | **___** | _____ |

**评级标准：**
- 🌟🌟🌟 100-125 分：优秀！你对回溯算法有了很好的理解
- 🌟🌟 80-99 分：良好！基本概念掌握了
- 🌟 60-79 分：合格！还需要多加练习
- 💪 60 分以下：需要重新学习

---

**🎉 完成答案订正后，记得给自己一个奖励！**

**回溯算法虽然难，但多练习就能掌握！**

**明天学习课程总结与复习，加油！** ✨
