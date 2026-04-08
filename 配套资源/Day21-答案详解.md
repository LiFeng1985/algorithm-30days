# 💡 Day 21 - 练习题答案详解

> **排序算法总结与对比**  
> **参考答案与解析**

---

## 一、基础概念题答案

### 题目 1：排序算法分类（10 分）

**参考答案：**

**按时间复杂度分类：**（3 分）

**O(n²) 级别：**
```
冒泡排序、选择排序、插入排序
```

**O(n log n) 级别：**
```
归并排序、快速排序、堆排序
```

**按空间复杂度分类：**（2 分）

**原地排序（O(1)）：**
```
冒泡排序、选择排序、插入排序、快速排序（原地版本）、堆排序
```

**非原地排序（O(n)）：**
```
归并排序
```

**按稳定性分类：**（2 分）

**稳定排序：**
```
冒泡排序、插入排序、归并排序
```

**不稳定排序：**
```
选择排序、快速排序、堆排序
```

**按算法思想分类：**（3 分）

**交换类：**
```
冒泡排序、快速排序
```

**选择类：**
```
选择排序、堆排序
```

**插入类：**
```
插入排序
```

**分治类：**
```
归并排序、快速排序
```

**堆结构类：**
```
堆排序
```

**评分要点：**
- 时间复杂度分类 3 分
- 空间复杂度分类 2 分
- 稳定性分类 2 分
- 算法思想分类 3 分

---

### 题目 2：性能对比表（15 分）

**参考答案：**

| 算法 | 最好情况 | 平均情况 | 最坏情况 | 空间复杂度 | 稳定性 |
|------|---------|---------|---------|-----------|--------|
| 冒泡排序 | O(n) | O(n²) | O(n²) | O(1) | 稳定 |
| 选择排序 | O(n²) | O(n²) | O(n²) | O(1) | 不稳定 |
| 插入排序 | O(n) | O(n²) | O(n²) | O(1) | 稳定 |
| 归并排序 | O(n log n) | O(n log n) | O(n log n) | O(n) | 稳定 |
| 快速排序 | O(n log n) | O(n log n) | O(n²) | O(log n) | 不稳定 |
| 堆排序 | O(n log n) | O(n log n) | O(n log n) | O(1) | 不稳定 |

**详细说明：**

**冒泡排序：**
```
最好情况：数组已有序，只需一轮比较 O(n)
平均情况：O(n²)
最坏情况：完全逆序，O(n²)
空间：只需要常数个临时变量 O(1)
稳定：相等元素不会交换位置 ✓
```

**选择排序：**
```
所有情况都是 O(n²)，因为总要遍历找最小值
不稳定：可能改变相等元素的相对顺序
例如：[5, 5', 3] → [3, 5', 5]
```

**插入排序：**
```
最好情况：已有序，每次直接插入 O(n)
平均和最坏：O(n²)
稳定：向后移动时不会改变相等元素的顺序 ✓
```

**归并排序：**
```
始终是 O(n log n)，分治法保证了稳定性
需要额外数组存储合并结果 O(n)
稳定：merge 时用 <= 保证顺序不变 ✓
```

**快速排序：**
```
最好和平均：O(n log n)
最坏：O(n²)（已有序且 pivot 选择不当）
空间：递归调用栈 O(log n)
不稳定：分区时可能改变相等元素的顺序
```

**堆排序：**
```
始终是 O(n log n)
原地排序 O(1)
不稳定：建堆和交换时可能改变顺序
```

**评分要点：**
- 每行 2.5 分，共 15 分
- 时间复杂度 9 分
- 空间复杂度 3 分
- 稳定性 3 分

---

### 题目 3：适用场景分析（10 分）

**参考答案：**

**场景 1：数据量很小（n < 50）**
```
选择：插入排序或冒泡排序
理由：简单算法在小数据上表现不错，
      而且代码简单，常数因子小。
      快速排序等反而可能因为递归而慢。
```

**场景 2：数据基本有序**
```
选择：插入排序
理由：插入排序在基本有序时接近 O(n)，
      因为每个元素只需要移动很少的距离。
```

**场景 3：大规模随机数据**
```
选择：快速排序或归并排序
理由：O(n log n) 的算法适合大规模数据。
      快速排序通常更快，但归并排序更稳定。
```

**场景 4：要求稳定性**
```
选择：归并排序或插入排序
理由：这两种是稳定排序，
      能保持相等元素的相对顺序不变。
```

**场景 5：内存有限**
```
选择：堆排序或快速排序（原地版本）
理由：原地排序只需要 O(1) 或 O(log n) 的额外空间，
      归并排序需要 O(n) 额外空间不适合。
```

**评分要点：**
- 每个场景 2 分（选择 1 分 + 理由 1 分）

---

## 二、代码实践题答案

### 题目 4：实现所有排序算法（30 分）

**参考答案：**

```javascript
/**
 * 1. 冒泡排序
 */
function bubbleSort(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        
        if (!swapped) break;
    }
    
    return arr;
}

/**
 * 2. 选择排序
 */
function selectionSort(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        }
    }
    
    return arr;
}

/**
 * 3. 插入排序
 */
function insertionSort(arr) {
    const n = arr.length;
    
    for (let i = 1; i < n; i++) {
        const current = arr[i];
        let j = i - 1;
        
        while (j >= 0 && arr[j] > current) {
            arr[j + 1] = arr[j];
            j--;
        }
        
        arr[j + 1] = current;
    }
    
    return arr;
}

/**
 * 4. 归并排序
 */
function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
    
    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }
    
    return result.concat(left.slice(i)).concat(right.slice(j));
}

/**
 * 5. 快速排序（Lomuto 分区）
 */
function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low >= high) {
        return arr;
    }
    
    const pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
    
    return arr;
}

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

/**
 * 6. 堆排序
 */
function heapSort(arr) {
    const n = arr.length;
    
    // 建堆
    buildMaxHeap(arr);
    
    // 排序
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        heapify(arr, i, 0);
    }
    
    return arr;
}

function buildMaxHeap(arr) {
    const n = arr.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
}

function heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }
    
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }
    
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest);
    }
}

// 测试
const testData = [64, 34, 25, 12, 22, 11, 90];

console.log('冒泡排序:', bubbleSort([...testData]));
console.log('选择排序:', selectionSort([...testData]));
console.log('插入排序:', insertionSort([...testData]));
console.log('归并排序:', mergeSort([...testData]));
console.log('快速排序:', quickSort([...testData]));
console.log('堆排序:', heapSort([...testData]));

// 都应该输出：[11, 12, 22, 25, 34, 64, 90] ✓
```

**评分要点：**
- 每种排序 5 分（共 30 分）
- 实现正确 3 分
- 能通过测试 1 分
- 代码规范 1 分

**常见错误：**
❌ 冒泡排序忘记优化标志 → ✅ 添加 swapped 标志提前结束
❌ 选择排序总是交换 → ✅ 检查 minIndex 是否变化
❌ 插入排序边界错误 → ✅ 注意 j >= 0 的条件
❌ 归并排序忘记 slice → ✅ 创建新数组
❌ 快速排序基准情况遗漏 → ✅ 检查 low >= high
❌ 堆排序索引计算错误 → ✅ left=2i+1, right=2i+2

---

### 题目 5：性能测试与分析（20 分）

**参考答案：**

```javascript
/**
 * 性能测试函数
 */
function performanceTest() {
    const sizes = [10, 100, 1000, 5000];
    
    console.log('=== 排序算法性能对比 ===\n');
    
    for (const size of sizes) {
        console.log(`\n=== 数据规模：${size} ===`);
        
        // 生成随机数组
        const randomArr = Array.from({ length: size }, () => 
            Math.floor(Math.random() * size * 10)
        );
        
        // 测试每种排序
        const sorts = [
            { name: '冒泡排序', fn: bubbleSort },
            { name: '选择排序', fn: selectionSort },
            { name: '插入排序', fn: insertionSort },
            { name: '归并排序', fn: mergeSort },
            { name: '快速排序', fn: quickSort },
            { name: '堆排序', fn: heapSort }
        ];
        
        for (const sort of sorts) {
            const arr = [...randomArr];
            const start = performance.now();
            sort.fn(arr);
            const time = performance.now() - start;
            console.log(`${sort.name.padEnd(6)}: ${time.toFixed(3).padStart(8)} ms`);
        }
    }
}

performanceTest();
```

**预期结果示例：**
```
=== 排序算法性能对比 ===

=== 数据规模：10 ===
冒泡排序：0.050 ms
选择排序：0.045 ms
插入排序：0.040 ms
归并排序：0.065 ms
快速排序：0.055 ms
堆排序：0.070 ms

=== 数据规模：100 ===
冒泡排序：5.200 ms
选择排序：4.800 ms
插入排序：4.500 ms
归并排序：0.850 ms
快速排序：0.720 ms
堆排序：0.900 ms

=== 数据规模：1000 ===
冒泡排序：520.000 ms
选择排序：480.000 ms
插入排序：450.000 ms
归并排序：12.500 ms
快速排序：10.200 ms
堆排序：13.800 ms

=== 数据规模：5000 ===
冒泡排序：13000.000 ms
选择排序：12000.000 ms
插入排序：11500.000 ms
归并排序：75.000 ms
快速排序：68.000 ms
堆排序：82.000 ms
```

**观察规律：**
```
1. O(n²) 算法（冒泡、选择、插入）：
   - n=10 时很快
   - n=100 时开始变慢
   - n=1000 时非常慢
   - n=5000 时几乎不可用

2. O(n log n) 算法（归并、快速、堆）：
   - 在所有规模下都很快
   - 快速排序通常最快
   - 差距随规模增大而明显

3. 结论：
   - 小数据（n<50）：简单算法可以接受
   - 中等数据（n=100-1000）：必须用 O(n log n) 算法
   - 大数据（n>1000）：只能用 O(n log n) 算法
```

**评分要点：**
- 测试程序正确 8 分
- 能运行出结果 4 分
- 观察到规律 4 分
- 总结合理 4 分

---

### 题目 6：实际应用题（15 分）

**参考答案：**

```javascript
/**
 * 问题 1：找出数组中第 k 小的元素
 */
function findKthSmallest(arr, k) {
    // 方法 1：排序后直接取（简单但不够优）
    // quickSort(arr, 0, arr.length - 1);
    // return arr[k - 1];
    
    // 方法 2：快速选择算法（更优）
    function partition(low, high) {
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
    
    function quickSelect(low, high, k) {
        const pivotIndex = partition(low, high);
        
        if (pivotIndex === k - 1) {
            return arr[pivotIndex];
        } else if (pivotIndex > k - 1) {
            return quickSelect(low, pivotIndex - 1, k);
        } else {
            return quickSelect(pivotIndex + 1, high, k);
        }
    }
    
    return quickSelect(0, arr.length - 1, k);
}

/**
 * 问题 2：合并两个有序数组
 */
function mergeTwoSortedArrays(arr1, arr2) {
    const result = [];
    let i = 0, j = 0;
    
    while (i < arr1.length && j < arr2.length) {
        if (arr1[i] <= arr2[j]) {
            result.push(arr1[i++]);
        } else {
            result.push(arr2[j++]);
        }
    }
    
    return result.concat(arr1.slice(i)).concat(arr2.slice(j));
}

/**
 * 问题 3：对几乎有序的数组排序
 */
function sortNearlySorted(arr, k) {
    // 使用大小为 k+1 的最小堆
    // 这里用简化版本：插入排序的变种
    
    const n = arr.length;
    
    for (let i = 1; i < n; i++) {
        const current = arr[i];
        let j = i - 1;
        
        // 只需要向前检查最多 k 个位置
        while (j >= 0 && j > i - k - 1 && arr[j] > current) {
            arr[j + 1] = arr[j];
            j--;
        }
        
        arr[j + 1] = current;
    }
    
    return arr;
}

// 测试
console.log(findKthSmallest([7, 10, 4, 3, 20, 15], 3)); // 7 ✓
console.log(mergeTwoSortedArrays([1, 3, 5], [2, 4, 6])); // [1,2,3,4,5,6] ✓
console.log(sortNearlySorted([3, 2, 1, 5, 4, 7, 6], 2)); // [1,2,3,4,5,6,7] ✓
```

**评分要点：**
- 问题 1 正确 5 分
- 问题 2 正确 5 分
- 问题 3 正确 5 分

**解题思路：**
```
问题 1：
- 可以用完全排序 O(n log n)
- 也可以用快速选择 O(n) 平均

问题 2：
- 直接用归并排序的 merge 函数
- 时间复杂度 O(m+n)

问题 3：
- 利用"几乎有序"的特点
- 插入排序只需要向前检查 k 个位置
- 时间复杂度 O(nk)
```

---

## 三、理解应用题答案

### 题目 7：算法选择策略（10 分）

**参考答案：**

**因素分析：**
```
1. 数据规模：可能有成千上万的商品
2. 数据特点：价格、销量等经常变化
3. 性能要求：用户期望快速响应
4. 内存限制：服务器内存有限
5. 稳定性要求：可能需要（相同价格保持原有顺序）
```

**我的选择：**
```
选择：快速排序或归并排序

理由说明：
1. 数据量大，需要 O(n log n) 算法
2. 如果需要稳定性，用归并排序
3. 如果追求速度，用快速排序
4. 实际应用中，很多语言的标准库
   都用快速排序的变种（如 C++ STL sort）

备选方案：
如果数据有特殊性质（如范围有限），
可以考虑计数排序等非比较排序。
```

**评分要点：**
- 因素分析合理 3 分
- 选择正确 3 分
- 理由充分 4 分

---

### 题目 8：改进与创新（10 分）

**参考答案：**

**改进思路 1：混合排序**
```
结合多种排序的优点：
- 大数据用快速排序
- 小数据（如 n<50）用插入排序
- 这样既快又简单

例如：Timsort（Python 的 sort）
就是归并 + 插入的混合
```

**改进思路 2：三路快速排序**
```
处理大量重复元素：
- 将数组分成三部分：< pivot, = pivot, > pivot
- 等于 pivot 的部分不需要再排序
- 在有大量重复元素时非常快
```

**混合排序策略：**
```
function hybridSort(arr, low, high) {
    // 小规模用插入排序
    if (high - low < 50) {
        insertionSort(arr, low, high);
        return;
    }
    
    // 大规模用快速排序
    if (low < high) {
        const pivotIndex = partition(arr, low, high);
        hybridSort(arr, low, pivotIndex - 1);
        hybridSort(arr, pivotIndex + 1, high);
    }
}
```

**实际应用场景：**
```
1. 数据库排序：考虑稳定性和内存
2. 实时系统：考虑最坏情况
3. 嵌入式设备：考虑空间效率
4. 大数据分析：考虑并行化
```

**评分要点：**
- 改进思路 1 3 分
- 改进思路 2 3 分
- 混合策略 2 分
- 应用场景 2 分

---

## 四、费曼输出答案

### 题目 9：小老师时间（10 分）

**参考模板：**

```
大家好，今天我要讲的是"如何选择排序方法"。

你们可能会问，有这么多排序方法，该怎么选呢？

其实啊，选择排序方法就像选择交通工具。
不同的距离，用不同的交通工具。

近距离（数据量小）：
就像去附近的超市，走路或骑自行车就好。
对应数据量小（比如少于 50 个），
用简单的冒泡排序或插入排序就行，
代码简单，速度也不慢。

中距离（数据基本有序）：
就像去几公里外的地方，坐公交车最合适。
对应数据基本有序的情况，
用插入排序特别快，
因为每个元素只需要移动一点点。

远距离（大规模数据）：
就像去另一个城市，要坐高铁或飞机。
对应大规模数据（比如上千上万个），
必须用快速排序、归并排序或堆排序，
这些虽然复杂，但是速度快得多。

特殊需求：
如果要求稳定性（保持相等元素的顺序），
就像带老人出行要稳一点，
用归并排序或插入排序。

如果内存有限，
就像预算有限要省钱，
用堆排序或快速排序，
它们占用的额外空间少。

举个例子：
你要整理班级的考试成绩单：
- 如果只有 30 个人，用插入排序，简单快速
- 如果有 1000 个人，用快速排序，效率高
- 如果要保持同分同学的原有顺序，用归并排序

所以，选择排序方法就是：
根据数据规模、特点和需求，
选择最合适的工具！

谢谢大家！
```

**评分要点：**
- 不用专业术语（3 分）
- 用了生活例子（交通工具比喻）（3 分）
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
| 题目 4 | 30 | ___ | _____ |
| 题目 5 | 20 | ___ | _____ |
| 题目 6 | 15 | ___ | _____ |
| 题目 7 | 10 | ___ | _____ |
| 题目 8 | 10 | ___ | _____ |
| 题目 9 | 10 | ___ | _____ |
| **总分** | **130** | **___** | _____ |

**评级标准：**
- 🌟🌟🌟 110-130 分：优秀！你对排序算法有了全面的掌握
- 🌟🌟 90-109 分：良好！基本概念很清楚了
- 🌟 70-89 分：合格！还需要多加练习
- 💪 70 分以下：需要重新学习

---

**🎉 完成答案订正后，记得给自己一个奖励！**

**恭喜完成第三周的所有内容！**

**明天开始第四周：查找算法与高级算法，加油！** ✨
