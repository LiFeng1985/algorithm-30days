# 💡 Day 22 - 练习题答案详解

> **二分查找**  
> **参考答案与解析**

---

## 一、基础概念题答案

### 题目 1：什么是二分查找？（10 分）

**参考答案：**
```
二分查找是一种高效的查找算法，
在有序数组中通过不断缩小范围来查找目标值。
就像猜数字游戏，每次排除一半的可能性。
```

**评分要点：**
- ✅ 提到"有序数组"（3 分）
- ✅ 有自己的比喻（3 分）
- ✅ 提到缩小范围或排除一半（4 分）

---

### 题目 2：二分查找的原理（15 分）

**参考答案：**

**基本思想：**（6 分）
```
在有序数组中，通过比较中间元素，
每次排除一半的元素，
快速定位目标值的位置。
```

**执行步骤：**（6 分）

**1. 确定中间位置：**（2 分）
```
计算中间索引 mid = left + (right - left) / 2
```

**2. 比较中间元素：**（2 分）
```
如果 arr[mid] == target，找到目标
如果 arr[mid] < target，目标在右半部分
如果 arr[mid] > target，目标在左半部分
```

**3. 缩小范围：**（2 分）
```
根据比较结果，调整 left 或 right 边界，
继续在缩小的范围内查找。
```

**为什么需要有序数组：**（3 分）
```
因为只有数组有序，才能通过比较中间元素
判断目标值在左边还是右边。
如果无序，无法确定目标值的位置。
```

**时间复杂度为什么是 O(log n)：**（额外加分）
```
每次排除一半元素，
n → n/2 → n/4 → ... → 1
需要 log₂n 次操作，
所以时间复杂度是 O(log n)。
```

**评分要点：**
- 基本思想 6 分
- 三个步骤各 2 分
- 有序数组说明 3 分

---

### 题目 3：边界条件分析（10 分）

**参考答案：**

**循环条件：**（4 分）
```
while (left <= right)

用 <= 而不是 < 的理由：
当 left == right 时，区间 [left, right] 仍然包含一个元素
如果只用 <，会漏掉这个元素
例如：[5]，left=0, right=0，需要进入循环检查这个元素
```

**中间位置计算：**（3 分）
```
mid = Math.floor(left + (right - left) / 2)

为什么要用 left + (right - left) / 2：
1. 避免溢出：当 left 和 right 都很大时，(left + right) 可能溢出
2. 数学等价：left + (right - left) / 2 = (left + right) / 2
3. 更安全：在所有情况下都能正确计算
```

**找不到元素时返回：**（3 分）
```
return -1

约定俗成的做法，表示元素不存在
```

**评分要点：**
- 循环条件及理由 4 分
- 中间位置计算 3 分
- 返回值 3 分

---

## 二、代码实践题答案

### 题目 4：实现迭代版本（20 分）

**参考答案：**

```javascript
/**
 * 二分查找（迭代版本）
 * @param {number[]} arr - 有序数组（升序）
 * @param {number} target - 目标值
 * @return {number} 目标值的索引，找不到返回 -1
 */
function binarySearchIterative(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        // 防止溢出的写法
        const mid = Math.floor(left + (right - left) / 2);
        
        if (arr[mid] === target) {
            return mid;  // 找到目标
        } else if (arr[mid] < target) {
            // 目标在右半部分
            left = mid + 1;
        } else {
            // 目标在左半部分
            right = mid - 1;
        }
    }
    
    return -1;  // 没找到
}

// 测试
console.log(binarySearchIterative([1, 3, 5, 7, 9, 11, 13], 7));   // 3 ✓
console.log(binarySearchIterative([1, 3, 5, 7, 9, 11, 13], 6));   // -1 ✓
console.log(binarySearchIterative([1, 3, 5, 7, 9, 11, 13], 1));   // 0 ✓
console.log(binarySearchIterative([1, 3, 5, 7, 9, 11, 13], 13));  // 6 ✓
console.log(binarySearchIterative([], 5));                        // -1 ✓
console.log(binarySearchIterative([5], 5));                       // 0 ✓
console.log(binarySearchIterative([5], 3));                       // -1 ✓
```

**执行过程演示：**
```
查找 [1, 3, 5, 7, 9, 11, 13] 中的 7

初始：left=0, right=6

第 1 轮：
mid = 0 + (6-0)/2 = 3
arr[3] = 7
arr[3] === target → 返回 3 ✓

查找 [1, 3, 5, 7, 9, 11, 13] 中的 6

初始：left=0, right=6

第 1 轮：
mid = 3
arr[3] = 7
arr[3] > 6 → right = mid - 1 = 2

第 2 轮：
left=0, right=2
mid = 0 + (2-0)/2 = 1
arr[1] = 3
arr[1] < 6 → left = mid + 1 = 2

第 3 轮：
left=2, right=2
mid = 2
arr[2] = 5
arr[2] < 6 → left = mid + 1 = 3

第 4 轮：
left=3, right=2
left > right，退出循环
返回 -1 ✓
```

**评分要点：**
- 初始化正确（2 分）
- 循环条件正确（3 分）
- mid 计算正确（3 分）
- 比较逻辑正确（6 分）
- 边界更新正确（4 分）
- 返回值正确（2 分）

**常见错误：**
❌ 用 (left + right) / 2 → ✅ 用 left + (right - left) / 2
❌ while (left < right) → ✅ 用 <=
❌ left = mid 或 right = mid → ✅ 要 +1 或 -1
❌ 忘记返回 -1 → ✅ 循环外返回 -1

---

### 题目 5：实现递归版本（20 分）

**参考答案：**

```javascript
/**
 * 二分查找（递归版本）
 * @param {number[]} arr - 有序数组（升序）
 * @param {number} target - 目标值
 * @param {number} left - 左边界
 * @param {number} right - 右边界
 * @return {number} 目标值的索引，找不到返回 -1
 */
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
    // 基准情况：区间为空
    if (left > right) {
        return -1;
    }
    
    const mid = Math.floor(left + (right - left) / 2);
    
    if (arr[mid] === target) {
        return mid;
    } else if (arr[mid] < target) {
        // 在右半部分查找
        return binarySearchRecursive(arr, target, mid + 1, right);
    } else {
        // 在左半部分查找
        return binarySearchRecursive(arr, target, left, mid - 1);
    }
}

// 测试（同题目 4）
console.log(binarySearchRecursive([1, 3, 5, 7, 9, 11, 13], 7));   // 3 ✓
console.log(binarySearchRecursive([1, 3, 5, 7, 9, 11, 13], 6));   // -1 ✓
```

**执行过程演示：**
```
binarySearchRecursive([1, 3, 5, 7, 9, 11, 13], 6)

调用 1: left=0, right=6, mid=3, arr[3]=7
7 > 6 → 递归左半部分

调用 2: left=0, right=2, mid=1, arr[1]=3
3 < 6 → 递归右半部分

调用 3: left=2, right=2, mid=2, arr[2]=5
5 < 6 → 递归右半部分

调用 4: left=3, right=2
left > right → 返回 -1 ✓
```

**评分要点：**
- 基准情况正确（4 分）
- mid 计算正确（3 分）
- 比较逻辑正确（6 分）
- 递归调用正确（5 分）
- 返回值正确（2 分）

**关键理解：**
```
1. 递归 vs 迭代：
   - 功能相同，实现方式不同
   - 递归更简洁，但有函数调用开销
   - 迭代更高效，但代码稍长

2. 空间复杂度：
   - 迭代：O(1)
   - 递归：O(log n) - 递归调用栈

3. 选择建议：
   - 实际工程：优先迭代（避免栈溢出）
   - 学习理解：两种都要掌握
```

---

### 题目 6：变体问题（15 分）

**参考答案：**

```javascript
/**
 * 变体 1：查找第一个等于目标值的位置
 */
function binarySearchFirst(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    let result = -1;
    
    while (left <= right) {
        const mid = Math.floor(left + (right - left) / 2);
        
        if (arr[mid] === target) {
            result = mid;      // 记录找到的位置
            right = mid - 1;   // 继续在左边查找
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}

/**
 * 变体 2：查找最后一个等于目标值的位置
 */
function binarySearchLast(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    let result = -1;
    
    while (left <= right) {
        const mid = Math.floor(left + (right - left) / 2);
        
        if (arr[mid] === target) {
            result = mid;      // 记录找到的位置
            left = mid + 1;    // 继续在右边查找
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}

/**
 * 变体 3：查找第一个大于等于目标值的位置
 */
function binarySearchLowerBound(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    let result = arr.length;  // 默认返回数组长度（所有元素都小于 target）
    
    while (left <= right) {
        const mid = Math.floor(left + (right - left) / 2);
        
        if (arr[mid] >= target) {
            result = mid;      // 记录位置
            right = mid - 1;   // 继续找更小的
        } else {
            left = mid + 1;
        }
    }
    
    return result;
}

// 测试
const arr = [1, 2, 2, 2, 3, 4, 5];
console.log('第一个 2:', binarySearchFirst(arr, 2));  // 1 ✓
console.log('最后一个 2:', binarySearchLast(arr, 2)); // 3 ✓
console.log('第一个>=3:', binarySearchLowerBound(arr, 3)); // 4 ✓
```

**解题思路：**

**变体 1（第一个等于）：**
```
关键点：找到目标后不立即返回
- 记录当前位置
- 继续在左半部分查找（right = mid - 1）
- 最终得到最左边的位置
```

**变体 2（最后一个等于）：**
```
关键点：找到目标后不立即返回
- 记录当前位置
- 继续在右半部分查找（left = mid + 1）
- 最终得到最右边的位置
```

**变体 3（第一个>=target）：**
```
关键点：找下界
- 如果 arr[mid] >= target，记录并继续向左
- 如果 arr[mid] < target，向右查找
- 返回第一个满足条件的位置
```

**评分要点：**
- 变体 1 正确 5 分
- 变体 2 正确 5 分
- 变体 3 正确 5 分

---

## 三、理解应用题答案

### 题目 7：实际应用场景（10 分）

**参考答案：**

**适用场景：**（4 分）
```
1. 在有序数据中快速查找
2. 字典、词典查询
3. 数据库索引查找
4. 数值计算中的根求解
5. 优化问题中的二分答案
```

**优点：**（3 分）
```
✓ 查找速度快，O(log n)
✓ 实现简单
✓ 空间效率高，O(1)
✓ 适用于大规模数据
```

**缺点/限制：**（3 分）
```
✗ 只适用于有序数组
✗ 需要随机访问（不适合链表）
✗ 插入删除操作慢（需要保持有序）
✗ 对于频繁变化的数据不适用
```

**实际应用举例：**（额外加分）
```
1. Git 的版本查找（commit hash 有序）
2. 文件系统的目录索引
3. 浏览器的历史记录查找
4. 游戏中的排行榜查询
```

**评分要点：**
- 适用场景 4 分（至少 2 点）
- 优点 3 分（至少 2 点）
- 缺点 3 分（至少 2 点）

---

### 题目 8：性能对比（10 分）

**参考答案：**

**线性查找：**（3 分）
```
最好情况：O(1) - 第一个元素就是目标
平均情况：O(n) - 需要查找 n/2 个元素
最坏情况：O(n) - 查找到最后一个元素
```

**二分查找：**（3 分）
```
最好情况：O(1) - 中间元素就是目标
平均情况：O(log n)
最坏情况：O(log n)
```

**当 n = 1000 时：**（2 分）
```
线性查找最多比较：1000 次
二分查找最多比较：log₂1000 ≈ 10 次

性能差距：100 倍！
```

**结论：**（2 分）
```
1. 二分查找在大数据量时优势明显
2. 但前提是数组必须有序
3. 如果数据无序，需要先排序
4. 对于小规模数据（n<50），两者差距不大
```

**评分要点：**
- 线性查找复杂度 3 分
- 二分查找复杂度 3 分
- 具体数值对比 2 分
- 结论合理 2 分

---

## 四、费曼输出答案

### 题目 9：小老师时间（10 分）

**参考模板：**

```
大家好，今天我要讲的是"二分查找"。

你们可能会问，什么是二分查找呢？

其实啊，二分查找就像玩"猜数字"游戏。
我心里想了一个 1 到 100 之间的数字，你要猜出来。

如果你一个一个猜，可能要猜很多次。
但是聪明的小朋友会这样猜：
先猜 50，我说"太大了"，
你就知道答案在 1 到 49 之间。
再猜 25，我说"太小了"，
你就知道答案在 26 到 49 之间。
这样每次排除一半，
很快就能猜到答案！

举个例子：
要在 [1, 3, 5, 7, 9, 11, 13] 中找 7

第一步：看中间的数，是 7
哇，一下子就找到了！

如果要找 6：
第一步：中间是 7，6 比 7 小，在左边找
第二步：左边部分是 [1, 3, 5]，中间是 3，6 比 3 大，在右边找
第三步：剩下 [5]，不是 6，找不到

所以，二分查找就是：
每次看中间，排除一半，
很快就能找到目标！

谢谢大家！
```

**评分要点：**
- 不用专业术语（3 分）
- 用了生活例子（猜数字游戏）（3 分）
- 逻辑清晰（2 分）
- 容易听懂（2 分）

**加分项：**
- 用了多个比喻（+2 分）
- 解释了核心思想（+2 分）
- 有创意（+2 分）

---

## 📊 总分统计

| 题号 | 满分 | 你的得分 | 评语 |
|-----|------|---------|------|
| 题目 1 | 10 | ___ | _____ |
| 题目 2 | 15 | ___ | _____ |
| 题目 3 | 10 | ___ | _____ |
| 题目 4 | 20 | ___ | _____ |
| 题目 5 | 20 | ___ | _____ |
| 题目 6 | 15 | ___ | _____ |
| 题目 7 | 10 | ___ | _____ |
| 题目 8 | 10 | ___ | _____ |
| 题目 9 | 10 | ___ | _____ |
| **总分** | **120** | **___** | _____ |

**评级标准：**
- 🌟🌟🌟 100-120 分：优秀！你对二分查找有了很好的理解
- 🌟🌟 80-99 分：良好！基本概念掌握了
- 🌟 60-79 分：合格！还需要多加练习
- 💪 60 分以下：需要重新学习

---

**🎉 完成答案订正后，记得给自己一个奖励！**

**明天学习哈希表查找，加油！** ✨
