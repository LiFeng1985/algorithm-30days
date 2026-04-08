# 💡 Day 19 - 练习题答案详解

> **快速排序**  
> **参考答案与解析**

---

## 一、基础概念题答案

### 题目 1：什么是快速排序？（10 分）

**参考答案：**
```
快速排序是一种高效的排序算法，
采用分治法的思想，
通过分区操作将数组分成两部分，
递归地对两部分进行排序。
就像按身高排队一样自然。
```

**评分要点：**
- ✅ 提到"分治法"或"分区"（4 分）
- ✅ 有自己的比喻（3 分）
- ✅ 提到递归或分两部分（3 分）

---

### 题目 2：分区操作的原理（15 分）

**参考答案：**

**分区的基本思想：**（6 分）
```
选择一个元素作为基准值（pivot），
重新排列数组，使得：
- 比 pivot 小的元素都在左边
- 比 pivot 大的元素都在右边
- pivot 在中间的正确位置
```

**Lomuto 分区方案的步骤：**（6 分）

**1. 选择基准值：**（2 分）
```
通常选择最后一个元素作为 pivot
```

**2. 划分区域：**（2 分）
```
维护一个指针 i，指向小于 pivot 的区域末尾
遍历数组，发现小于 pivot 的元素就放到左边
```

**3. 交换 pivot：**（2 分）
```
最后将 pivot 与 i+1 位置的元素交换
这样 pivot 就到了正确的位置
```

**为什么分区有效：**（3 分）
```
1. pivot 被放到了最终的正确位置
2. 左边的元素都比它小，右边的都比它大
3. 对左右两部分递归执行同样的操作
4. 最终整个数组有序
```

**评分要点：**
- 基本思想 6 分
- 三个步骤各 2 分
- 有效性说明 3 分

---

### 题目 3：复杂度分析（10 分）

**参考答案：**

```
时间复杂度：
最好情况：O(n log n) - 每次 pivot 都在中间
平均情况：O(n log n)
最坏情况：O(n²) - 每次 pivot 都是最大或最小

空间复杂度：O(log n) - 递归调用栈

稳定性：不稳定排序

最坏情况发生在什么时候：
1. 数组已经有序，每次都选最后一个元素作为 pivot
2. 数组完全逆序，每次都选最后一个元素作为 pivot
3. 所有元素都相同

这些情况下，每次分区只能减少一个元素，
递归树高度为 n，总时间为 O(n²)。
```

**详细解释：**

**最好情况推导：**
```
每次 pivot 都在中间位置
递归树高度为 log n
每层需要 O(n) 时间
总时间 = O(n) × O(log n) = O(n log n)
```

**最坏情况推导：**
```
每次 pivot 都在一端（如最后一个）
递归树高度为 n
每层需要 O(n) 时间
总时间 = O(n) × O(n) = O(n²)
```

**评分要点：**
- 时间复杂度全对得 4 分
- 空间复杂度正确得 2 分
- 稳定性正确得 2 分
- 最坏情况说明 2 分

---

## 二、代码实践题答案

### 题目 4：实现 partition 函数（20 分）

**参考答案：**

```javascript
/**
 * Lomuto 分区方案
 * @param {number[]} arr - 待分区数组
 * @param {number} low - 起始索引
 * @param {number} high - 结束索引
 * @return {number} pivot 的最终位置
 */
function partition(arr, low, high) {
    const pivot = arr[high];  // 选择最后一个元素作为基准
    let i = low - 1;          // i 指向小于 pivot 的区域末尾
    
    for (let j = low; j < high; j++) {
        if (arr[j] <= pivot) {  // 发现小于等于 pivot 的元素
            i++;
            // 交换 arr[i] 和 arr[j]
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    
    // 将 pivot 放到正确位置（i+1）
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    
    return i + 1;  // 返回 pivot 的位置
}

// 测试
const arr1 = [10, 80, 30, 90, 40, 50, 70];
console.log('原数组:', arr1);
const pivotPos = partition(arr1, 0, arr1.length - 1);
console.log('pivot 位置:', pivotPos);
console.log('分区后:', arr1);
```

**执行过程演示：**
```
初始：arr = [10, 80, 30, 90, 40, 50, 70]
low = 0, high = 6
pivot = arr[6] = 70
i = -1

j = 0: arr[0] = 10 <= 70 ✓
  i = 0
  交换 arr[0] 和 arr[0]（不变）
  arr = [10, 80, 30, 90, 40, 50, 70]

j = 1: arr[1] = 80 > 70 ✗
  不操作

j = 2: arr[2] = 30 <= 70 ✓
  i = 1
  交换 arr[1] 和 arr[2]
  arr = [10, 30, 80, 90, 40, 50, 70]

j = 3: arr[3] = 90 > 70 ✗
  不操作

j = 4: arr[4] = 40 <= 70 ✓
  i = 2
  交换 arr[2] 和 arr[4]
  arr = [10, 30, 40, 90, 80, 50, 70]

j = 5: arr[5] = 50 <= 70 ✓
  i = 3
  交换 arr[3] 和 arr[5]
  arr = [10, 30, 40, 50, 80, 90, 70]

循环结束（j = 6 = high）

最后交换 pivot：
交换 arr[i+1] 和 arr[high]
即交换 arr[4] 和 arr[6]
arr = [10, 30, 40, 50, 70, 90, 80]

返回 i + 1 = 4

验证：
pivot(70) 在位置 4
左边：[10, 30, 40, 50] 都 <= 70 ✓
右边：[90, 80] 都 > 70 ✓
```

**评分要点：**
- pivot 选择正确（2 分）
- i 初始化正确（3 分）
- 循环边界正确（4 分）
- 比较条件正确（4 分）
- 交换逻辑正确（4 分）
- 返回值正确（2 分）
- 能通过测试（1 分）

**常见错误：**
❌ i 初始化为 0 → ✅ 应该是 low - 1
❌ 循环到 j <= high → ✅ 应该到 j < high
❌ 忘记最后的交换 → ✅ 必须把 pivot 放到正确位置
❌ 用 < 而不是 <= → ✅ 用 <= 处理相等元素

---

### 题目 5：实现完整的快速排序（25 分）

**参考答案：**

```javascript
/**
 * 快速排序
 * @param {number[]} arr - 待排序数组
 * @param {number} low - 起始索引（默认 0）
 * @param {number} high - 结束索引（默认 arr.length - 1）
 * @return {number[]} 排序后的数组
 */
function quickSort(arr, low = 0, high = arr.length - 1) {
    // 基准情况
    if (low >= high) {
        return arr;
    }
    
    // 分区
    const pivotIndex = partition(arr, low, high);
    
    // 递归排序左右两部分
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
    
    return arr;
}

// 辅助函数
function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}

// 测试
console.log(quickSort([64, 34, 25, 12, 22, 11, 90]));
// [11, 12, 22, 25, 34, 64, 90] ✓

console.log(quickSort([5, 1, 4, 2, 8]));
// [1, 2, 4, 5, 8] ✓

console.log(quickSort([]));
// [] ✓

console.log(quickSort([1]));
// [1] ✓

console.log(quickSort([3, 3, 3, 3]));
// [3, 3, 3, 3] ✓
```

**执行过程演示：**
```
quickSort([10, 80, 30, 90, 40, 50, 70])

第 1 轮：
low=0, high=6
partition 后 pivotIndex=4, arr=[10,30,40,50,70,90,80]
递归：quickSort(左，0,3) 和 quickSort(右，5,6)

左边 quickSort([10,30,40,50,70,90,80], 0, 3)：
处理 [10, 30, 40, 50]
pivot=50, partition 后 pivotIndex=3
递归：quickSort(左，0,2) 和 quickSort(右，4,3)

继续递归...

最终结果：[10, 30, 40, 50, 70, 80, 90] ✓
```

**评分要点：**
- 基准情况正确（4 分）
- 调用 partition 正确（6 分）
- 递归调用正确（8 分）
- 参数传递正确（4 分）
- 能通过所有测试（3 分）

**关键理解：**
```
1. 为什么是原地排序？
   - 直接在原数组上交换
   - 不需要额外的存储空间（除了递归栈）

2. 为什么不稳定？
   - 分区时可能改变相等元素的相对顺序
   - 例如：[5, 3, 5', 2] 分区后可能变成 [3, 2, 5', 5]

3. 时间复杂度为什么平均 O(n log n)？
   - 平均情况下 pivot 大致在中间
   - 递归树高度 O(log n)
   - 每层 O(n) 时间
```

---

### 题目 6：排序过程可视化（15 分）

**参考答案：**

```javascript
/**
 * 带打印的快速排序（用于调试和学习）
 * @param {number[]} arr - 待排序数组
 * @param {number} low - 起始索引
 * @param {number} high - 结束索引
 * @param {string} prefix - 打印前缀（用于显示层级）
 * @return {number[]} 排序后的数组
 */
function quickSortWithLog(arr, low = 0, high = arr.length - 1, prefix = '') {
    console.log(`${prefix}开始排序范围 [${low}, ${high}]:`, arr.slice(low, high + 1));
    
    if (low >= high) {
        console.log(`${prefix}基准情况，返回`);
        return arr;
    }
    
    // 分区
    const pivotIndex = partition(arr, low, high);
    console.log(`${prefix}分区完成，pivot 在位置 ${pivotIndex}，值为 ${arr[pivotIndex]}`);
    console.log(`${prefix}左边:`, arr.slice(low, pivotIndex));
    console.log(`${prefix}右边:`, arr.slice(pivotIndex + 1, high + 1));
    
    // 递归排序
    console.log(`${prefix}递归排序左边...`);
    quickSortWithLog(arr, low, pivotIndex - 1, prefix + '  ');
    
    console.log(`${prefix}递归排序右边...`);
    quickSortWithLog(arr, pivotIndex + 1, high, prefix + '  ');
    
    return arr;
}

// 辅助函数
function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}

// 测试
quickSortWithLog([10, 80, 30, 90, 40, 50, 70]);
```

**预期输出（部分）：**
```
开始排序范围 [0, 6]: [10, 80, 30, 90, 40, 50, 70]
分区完成，pivot 在位置 4，值为 70
左边：[10, 30, 40, 50]
右边：[90, 80]
递归排序左边...
  开始排序范围 [0, 3]: [10, 30, 40, 50]
  分区完成，pivot 在位置 3，值为 50
  左边：[10, 30, 40]
  右边：[]
  递归排序左边...
    开始排序范围 [0, 2]: [10, 30, 40]
    ...
```

**评分要点：**
- 打印当前范围（2 分）
- 打印 pivot 位置（3 分）
- 打印左右分区（3 分）
- 打印递归信息（3 分）
- 能正确运行（2 分）
- 使用 prefix 显示层级（2 分）

---

## 三、理解应用题答案

### 题目 7：快速排序的应用场景（10 分）

**参考答案：**

**适用场景：**（4 分）
```
1. 大规模数据排序（n > 1000）
2. 对性能要求高的场景
3. 不需要稳定排序的场景
4. 内存有限的场景（原地排序）
5. 一般用途的排序（标准库常用）
```

**优点：**（3 分）
```
✓ 平均性能优秀，O(n log n)
✓ 原地排序，空间 O(log n)
✓ 实际应用中通常比其他 O(n log n) 算法快
✓ 缓存命中率高（局部性好）
✓ 实现简单
```

**缺点：**（3 分）
```
✗ 最坏情况 O(n²)
✗ 不稳定排序
✗ 对已有序数据效率低（如果 pivot 选择不当）
✗ 递归实现有栈溢出风险
```

**为什么实际应用广泛：**（额外加分）
```
1. 平均性能最优
2. 空间效率高
3. 可以通过随机化 pivot 避免最坏情况
4. 许多标准库（如 C++ STL 的 sort）都用它
```

**评分要点：**
- 适用场景 4 分（至少 2 点）
- 优点 3 分（至少 2 点）
- 缺点 3 分（至少 2 点）

---

### 题目 8：第 K 大的元素（10 分）

**参考答案：**

**问题描述：**
```
给定一个数组和一个整数 k，找到数组中第 k 大的元素。
例如：[3,2,1,5,6,4] 中第 2 大的元素是 5。
```

**我的思路（快速选择算法）：**
```
基于快速排序的思想：

1. 执行一次 partition 操作
2. pivot 被放到了正确的位置 p
3. 比较 k 和 p：
   - 如果 k == p，返回 arr[p]
   - 如果 k < p，在左边继续查找
   - 如果 k > p，在右边继续查找

关键优势：
- 只需要递归一边，而不是两边
- 平均时间复杂度 O(n)
```

**代码框架：**
```javascript
function findKthLargest(arr, k) {
    const targetIndex = arr.length - k;  // 第 k 大 = 第 (n-k) 小
    return quickSelect(arr, 0, arr.length - 1, targetIndex);
}

function quickSelect(arr, low, high, k) {
    const pivotIndex = partition(arr, low, high);
    
    if (pivotIndex === k) {
        return arr[pivotIndex];
    } else if (pivotIndex > k) {
        return quickSelect(arr, low, pivotIndex - 1, k);
    } else {
        return quickSelect(arr, pivotIndex + 1, high, k);
    }
}
```

**预期时间复杂度：** O(n)
```
第一次 partition：O(n)
第二次：O(n/2)
第三次：O(n/4)
...
总计：O(n + n/2 + n/4 + ...) = O(2n) = O(n)
```

**为什么比完全排序快：**
```
完全排序：O(n log n) - 需要完全有序
快速选择：O(n) - 只需要找到第 k 个元素

节省了不必要的排序工作！
```

**评分要点：**
- 理解问题 2 分
- 提出快速选择思想 4 分
- 说明时间复杂度 2 分
- 解释为什么更快 2 分

---

## 四、费曼输出答案

### 题目 9：小老师时间（10 分）

**参考模板：**

```
大家好，今天我要讲的是"快速排序"。

你们可能会问，什么是快速排序呢？

其实啊，快速排序就像整理一队乱序的小朋友。
我们先选一个小朋友作为标准，比如身高 150cm。
然后让所有比他矮的站左边，比他高的站右边。
这样这个小朋友就站在了正确的位置上。

接下来，我们对左边和右边的小朋友重复这个过程。
左边选一个标准，再分左右两边，
右边也选一个标准，再分左右两边，
这样不断重复，最后所有小朋友就按身高排好队了。

举个例子：
[10, 80, 30, 90, 40, 50, 70]
第一步：选 70 作为标准
分区后：[10, 30, 40, 50, 70, 90, 80]
70 在正确位置，左边都比它小，右边都比它大

第二步：对左边 [10, 30, 40, 50] 排序
选 50 作为标准
分区后：[10, 30, 40, 50]
50 已经在正确位置

第三步：继续对更小的部分排序
...

最后得到：[10, 30, 40, 50, 70, 80, 90]

所以，快速排序就是：
先选一个标准，分区，然后递归地对两边排序！

谢谢大家！
```

**评分要点：**
- 不用专业术语（3 分）
- 用了生活例子（小朋友排队）（3 分）
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
| 题目 5 | 25 | ___ | _____ |
| 题目 6 | 15 | ___ | _____ |
| 题目 7 | 10 | ___ | _____ |
| 题目 8 | 10 | ___ | _____ |
| 题目 9 | 10 | ___ | _____ |
| **总分** | **125** | **___** | _____ |

**评级标准：**
- 🌟🌟🌟 100-125 分：优秀！你对快速排序有了很好的理解
- 🌟🌟 80-99 分：良好！基本概念掌握了
- 🌟 60-79 分：合格！还需要多加练习
- 💪 60 分以下：需要重新学习

---

**🎉 完成答案订正后，记得给自己一个奖励！**

**明天学习堆排序，加油！** ✨
