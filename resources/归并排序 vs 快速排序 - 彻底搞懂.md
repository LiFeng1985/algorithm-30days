# 归并排序 vs 快速排序 - 彻底搞懂分治双雄

> 🎯 **目标：一眼区分两个 O(n log n) 的排序算法**  
> 💡 **关键：理解"分"的顺序和"合"的方式**

---

## 🔍 一、为什么容易混淆？

### **相似点：**

```javascript
✅ 都用分治思想（Divide and Conquer）
✅ 时间复杂度都是 O(n log n)
✅ 都要递归
✅ 代码结构看起来有点像
```

### **但本质完全不同！**

> **归并排序：先拆到最小，再合并有序**  
> **快速排序：先分区到位，再递归处理**

---

## 📊 二、核心差异对比表

| 特征 | 归并排序 | 快速排序 |
|------|---------|---------|
| **分治顺序** | 先分后合 | 边分边排 |
| **核心操作** | merge（合并） | partition（分区） |
| **基准值** | ❌ 不需要 | ✅ 必须选 pivot |
| **额外空间** | O(n) - 需要新数组 | O(log n) - 原地排序 |
| **稳定性** | ✅ 稳定排序 | ❌ 不稳定 |
| **分解方式** | 从中间劈开 | 按大小分区 |
| **完成时机** | 合并时完成排序 | 分区时元素到位 |
| **适用场景** | 要求稳定、链表 | 通用、追求速度 |

---

## 💡 三、一句话区分

### **归并排序：**

> **"拆成单个，两两合并"**

**关键词：** 拆分、合并、有序拼接

**代码特征：**
```javascript
let left = mergeSort(arr.slice(0, mid))   // ← 拆左边
let right = mergeSort(arr.slice(mid))     // ← 拆右边
return merge(left, right)                 // ← 合并两个有序的
```

---

### **快速排序：**

> **"选个基准，分成两堆，递归继续"**

**关键词：** 基准、分区、交换

**代码特征：**
```javascript
let pivotIndex = partition(arr, low, high)  // ← 分区
quickSort(arr, low, pivotIndex - 1)         // ← 递归左边
quickSort(arr, pivotIndex + 1, high)        // ← 递归右边
```

---

## 🎨 四、形象比喻对比

### **归并排序：整理两摞牌**

```
你手里有两摞已经排好序的牌：
左摞：[2, 5, 8]    ✅ 已排序
右摞：[3, 6, 9]    ✅ 已排序

你要合并成一摞：

过程：
1. 比较两摞的顶牌：2 vs 3
   → 2 小，放下面 → [2]
   
2. 比较：5 vs 3
   → 3 小，放下面 → [2, 3]
   
3. 比较：5 vs 6
   → 5 小，放下面 → [2, 3, 5]
   
4. 比较：8 vs 6
   → 6 小，放下面 → [2, 3, 5, 6]
   
5. 左摞剩 8，右摞剩 9
   → 8 小 → [2, 3, 5, 6, 8]
   → 9 放最后 → [2, 3, 5, 6, 8, 9]

完成！✅

核心：
✅ 前提是两摞都已经有序
✅ 每次取较小的那个
✅ 合并成一个大的有序序列
```

---

### **快速排序：体育老师分队**

```
一队人：[3, 1, 4, 1, 5, 9, 2, 6]
选小刚（6）当基准

体育老师：
"比 6 矮的站左边！"
"比 6 高的站右边！"

同学们开始换位：
[3, 1, 4, 1, 5, 2]  6  [9]
        ↑            ↑   ↑
     都小于 6      到位  都大于 6

现在 6 已经在正确位置了！

然后对左右两队重复：
左边：[3, 1, 4, 1, 5, 2] → 选基准 → 分区
右边：[9] → 只有 1 个，不用排

完成！✅

核心：
✅ 选个基准（pivot）
✅ 小的换左边，大的换右边
✅ 基准到达最终位置
✅ 左右继续递归
```

---

## 📝 五、代码结构对比

### **归并排序：先分后合**

```javascript
// ⭐ 主函数：负责拆分
function mergeSort(arr) {
    // 1. 递归终止条件
    if(arr.length <= 1) return arr
    
    // 2. 从中间拆开
    let mid = Math.floor(arr.length / 2)
    let left = mergeSort(arr.slice(0, mid))   // 拆左边
    let right = mergeSort(arr.slice(mid))     // 拆右边
    
    // 3. 合并两个有序数组
    return merge(left, right)  // ⭐ 调用 merge
}

// ⭐ 辅助函数：负责合并
function merge(left, right) {
    let result = []
    let i = 0, j = 0
    
    // 1. 两个有序数组合并
    while(i < left.length && j < right.length){
        if(left[i] < right[j]){
            result.push(left[i])  // ⭐ 谁小取谁
            i++
        } else {
            result.push(right[j])
            j++
        }
    }
    
    // 2. 处理剩余元素
    while(i < left.length){
        result.push(left[i])
        i++
    }
    while(j < right.length){
        result.push(right[j])
        j++
    }
    
    return result  // ⭐ 返回新数组
}
```

**执行流程：**
```
mergeSort([5, 2, 8, 1])
       ↓
   拆成两半
   ↙     ↘
[5, 2]   [8, 1]
  ↓        ↓
继续拆   继续拆
 ↙↘      ↙↘
[5][2]  [8][1]
  ↓      ↓
单个元素  单个元素
  ↓      ↓
 合并    合并
 ↘      ↙
 [2,5]  [1,8]
   ↘    ↙
   再次合并
      ↓
  [1,2,5,8] ✅
```

---

### **快速排序：边分边排**

```javascript
// ⭐ 主函数：负责递归
function quickSort(arr, low = 0, high = arr.length - 1) {
    // 1. 递归终止条件
    if(low < high) {
        // 2. 分区（核心！）
        let pivotIndex = partition(arr, low, high)
        
        // 3. 递归排序左右两边
        quickSort(arr, low, pivotIndex - 1)   // ⭐ 排左边
        quickSort(arr, pivotIndex + 1, high)  // ⭐ 排右边
    }
    return arr
}

// ⭐ 辅助函数：负责分区
function partition(arr, low, high) {
    let pivot = arr[high]  // ⭐ 选基准（最后一个）
    let i = low - 1        // i 指向小于区末尾
    
    for(let j = low; j < high; j++) {
        // 发现比基准小的
        if(arr[j] < pivot) {
            i++  // 扩展小于区
            [arr[i], arr[j]] = [arr[j], arr[i]]  // ⭐ 交换
        }
    }
    
    // 把基准放到中间
    [arr[i+1], arr[high]] = [arr[high], arr[i+1]]
    
    return i + 1  // ⭐ 返回基准位置
}
```

**执行流程：**
```
quickSort([5, 2, 8, 1])
    pivot = 1（最后一个）
         ↓
      分区
         ↓
   [ ]  1  [5,2,8]
   ↑     ↑     ↑
 空    到位   递归右边
         ↓
    pivot = 8
         ↓
      分区
         ↓
   [5,2]  8  [ ]
     ↓
   递归左边
     ↓
   pivot = 2
     ↓
   分区
     ↓
   [ ]  2  [5]
   ↓        ↓
 空        空
 
完成！✅
[1, 2, 5, 8]
```

---

## 🎯 六、关键区别详解

### **区别 1：分的顺序不同**

```javascript
// 归并排序：先无脑拆到底
mergeSort(arr)
    ↓
拆成 left 和 right
    ↓
继续拆...直到单个元素
    ↓
开始合并（这时候才排序）
    ↓
完成

特点：先分后合，合的时候才排序


// 快速排序：边分边排
quickSort(arr)
    ↓
先分区（这时候就排序了）
    ↓
pivot 到达正确位置
    ↓
递归左右继续分区
    ↓
完成

特点：边分边排，分的时候已排序
```

---

### **区别 2：是否需要额外空间**

```javascript
// 归并排序
function merge(left, right) {
    let result = []  // ⭐ 需要新数组！
    // ...
    return result
}

空间复杂度：O(n)
原因：每次合并都要创建新数组


// 快速排序
function partition(arr, low, high) {
    // ⭐ 原地交换，不需要新数组
    [arr[i], arr[j]] = [arr[j], arr[i]]
    // ...
}

空间复杂度：O(log n)
原因：只需要递归栈的空间
```

---

### **区别 3：稳定性不同**

```javascript
// 归并排序：✅ 稳定
merge([2a, 5], [2b, 6])
→ [2a, 2b, 5, 6]  // 2a 和 2b 相对位置不变

因为合并时是依次取较小的
相同元素不会交换位置


// 快速排序：❌ 不稳定
partition([2a, 2b, 5], pivot=5)
→ 可能会变成交换后的顺序
→ [2b, 2a, 5]  // 2a 和 2b 可能换位

因为分区时长距离交换
相同元素可能被打乱
```

---

### **区别 4：基准值的作用**

```javascript
// 归并排序：❌ 不需要基准
function mergeSort(arr) {
    let mid = arr.length / 2  // ⭐ 只是找中点
    // 不是基准值！
}


// 快速排序：✅ 必须有基准
function partition(arr, low, high) {
    let pivot = arr[high]  // ⭐ 基准是关键！
    // 所有元素都要跟它比
}
```

---

## 📊 七、执行过程详细对比

### **归并排序完整过程**

```
初始：[5, 2, 8, 1, 9, 3]

第 1 层分解：
[5, 2, 8, 1, 9, 3]
      ↓
   [5, 2, 8]     [1, 9, 3]
   
第 2 层分解：
[5, 2, 8]       [1, 9, 3]
   ↓               ↓
[5]  [2, 8]     [1]  [9, 3]

第 3 层分解：
[5]  [2]  [8]   [1]  [9]  [3]
      ↓              ↓
   单个元素       单个元素

开始合并（从底向上）：

第 1 次合并：
[2] 和 [8] → [2, 8]  ✅ 有序
[9] 和 [3] → [3, 9]  ✅ 有序

第 2 次合并：
[5] 和 [2, 8] → [2, 5, 8]  ✅ 有序
[1] 和 [3, 9] → [1, 3, 9]  ✅ 有序

第 3 次合并：
[2, 5, 8] 和 [1, 3, 9] 
→ 比较 2 vs 1 → 取 1
→ 比较 2 vs 3 → 取 2
→ 比较 5 vs 3 → 取 3
→ 比较 5 vs 9 → 取 5
→ 比较 8 vs 9 → 取 8
→ 剩下 9 → 取 9
→ [1, 2, 3, 5, 8, 9] ✅

完成！
```

---

### **快速排序完整过程**

```
初始：[5, 2, 8, 1, 9, 3]
          ↑
       pivot=3

第 1 次分区：
比 3 小的：[2, 1]
比 3 大的：[5, 8, 9]
结果：[2, 1]  3  [5, 8, 9]
             ↑
          到位了！

第 2 次分区（左边）：
[2, 1]
  ↑
pivot=1

比 1 小的：[]
比 1 大的：[2]
结果：[]  1  [2]
      ↑   ↑
     空   到位

第 3 次分区（右边）：
[5, 8, 9]
      ↑
   pivot=9

比 9 小的：[5, 8]
比 9 大的：[]
结果：[5, 8]  9  []
           ↑
        到位

第 4 次分区：
[5, 8]
  ↑
pivot=8

比 8 小的：[5]
比 8 大的：[]
结果：[5]  8  []
       ↑   ↑
     到位  到位

完成！
[1, 2, 3, 5, 8, 9] ✅
```

---

## 🔑 八、记忆技巧

### **方法 1：关键字联想**

```
归并排序：
🔪 刀劈木头 → 从中间断开
🧩 拼拼图 → 一块一块拼起来
🤝 握手合并 → 两手合在一起

快速排序：
⚖️ 天平秤 → 左边轻右边重
👨‍🏫 分队 → 高的左边的右边
🎯 靶心 → 基准是目标
```

### **方法 2：动作记忆**

```
归并排序手势：
✋ 手掌下劈（拆分）
🤲 双手合十（合并）
口诀："劈~ 合~ 劈~ 合~"

快速排序手势：
👆 食指点一下（选基准）
👐 双手分开（分区）
🔄 转圈圈（递归）
口诀："点~ 分~ 递~ 归~"
```

### **方法 3：声音记忆**

```
归并排序：
"拆拆拆... 合合合" （先拆后合）

快速排序：
"分分分... 排排排" （边分边排）
```

---

## 🧪 九、自测练习

### **练习 1：填空**

```javascript
// 归并排序
function mergeSort(arr) {
    if(___________) return arr
    let mid = _________________
    let left = _________________
    let right = ________________
    return _________________
}

// 快速排序
function quickSort(arr, low, high) {
    if(___________) {
        let pivotIndex = _________________
        quickSort(arr, low, _____________)
        quickSort(arr, _____________, high)
    }
}
```

---

### **练习 2：判断正误**

```javascript
// 代码 A
function sort(arr) {
    if(arr.length <= 1) return arr
    let mid = arr.length / 2
    let left = sort(arr.slice(0, mid))
    let right = sort(arr.slice(mid))
    return merge(left, right)
}

问题：这是归并排序还是快速排序？
答案：__________
解析：看到 slice、merge → 归并排序 ✅


// 代码 B
function sort(arr, low, high) {
    if(low < high) {
        let pivot = arr[high]
        let i = low - 1
        for(let j = low; j < high; j++) {
            if(arr[j] < pivot) {
                i++
                swap(i, j)
            }
        }
        swap(i+1, high)
    }
}

问题：这是归并排序还是快速排序？
答案：__________
解析：看到 pivot、partition → 快速排序 ✅
```

---

## 💡 十、选择建议

### **什么时候用归并排序？**

```
✅ 要求稳定性（相同元素保持原顺序）
✅ 数据量很大
✅ 链表排序
✅ 外部排序（数据在磁盘上）
✅ 需要保证最坏情况也是 O(n log n)

例子：
- 数据库 ORDER BY（要求稳定）
- Excel 排序（用户期望稳定）
- 大文件排序（内存放不下）
```

---

### **什么时候用快速排序？**

```
✅ 追求速度（通常比归并快）
✅ 内存紧张（原地排序）
✅ 不要求稳定性
✅ 大规模随机数据
✅ 通用排序（默认选择）

例子：
- C 标准库的 qsort()
- Java Arrays.sort()（早期版本）
- 一般编程题（除非要求稳定）
```

---

## 📊 十一、性能对比

### **时间复杂度对比**

| 情况 | 归并排序 | 快速排序 |
|------|---------|---------|
| **最好** | O(n log n) | O(n log n) |
| **平均** | O(n log n) | O(n log n) |
| **最坏** | O(n log n) | O(n²) |

**关键点：**
- 归并排序总是 O(n log n)，很稳定
- 快速排序最坏是 O(n²)，但可以通过随机化避免

---

### **空间复杂度对比**

| 算法 | 空间复杂度 | 原因 |
|------|-----------|------|
| **归并排序** | O(n) | 需要额外数组 |
| **快速排序** | O(log n) | 只需要递归栈 |

**实际影响：**
- 100 万元素，归并需要约 4MB 额外空间
- 快速排序只需要几 KB 栈空间

---

## ✅ 十二、总结

### **核心区别一句话：**

> **归并排序：先拆散，再合并（合的时候排序）**  
> **快速排序：先分区，再递归（分的时候排序）**

---

### **三个关键差异：**

| 方面 | 归并排序 | 快速排序 |
|------|---------|---------|
| **思想** | 分而治之 | 分而治之 |
| **实现** | 合并有序数组 | 分区交换元素 |
| **特点** | 稳定、费空间 | 不稳定、省空间 |

---

### **如何选择：**

```
如果题目要求稳定 → 归并排序
如果内存紧张 → 快速排序
如果没有特殊要求 → 快速排序（通常更快）
如果是链表 → 归并排序
如果是数组 → 快速排序
```

---

### **最后的建议：**

```
1. 不要死记硬背代码
2. 理解核心思想最重要
3. 多画图模拟过程
4. 记住关键词：
   - 归并：拆分、合并
   - 快速：基准、分区
5. 多练习几次就熟了

现在你已经完全掌握两者的区别了！💪
```

---

## 📚 附录：标准代码模板

### **归并排序模板**

```javascript
function mergeSort(arr) {
    if(arr.length <= 1) return arr
    
    let mid = Math.floor(arr.length / 2)
    let left = mergeSort(arr.slice(0, mid))
    let right = mergeSort(arr.slice(mid))
    
    return merge(left, right)
}

function merge(left, right) {
    let result = []
    let i = 0, j = 0
    
    while(i < left.length && j < right.length){
        if(left[i] < right[j]){
            result.push(left[i])
            i++
        } else {
            result.push(right[j])
            j++
        }
    }
    
    return [...result, ...left.slice(i), ...right.slice(j)]
}
```

---

### **快速排序模板**

```javascript
function quickSort(arr, low = 0, high = arr.length - 1) {
    if(low < high) {
        let pivotIndex = partition(arr, low, high)
        quickSort(arr, low, pivotIndex - 1)
        quickSort(arr, pivotIndex + 1, high)
    }
    return arr
}

function partition(arr, low, high) {
    let pivot = arr[high]
    let i = low - 1
    
    for(let j = low; j < high; j++) {
        if(arr[j] < pivot) {
            i++
            [arr[i], arr[j]] = [arr[j], arr[i]]
        }
    }
    
    [arr[i+1], arr[high]] = [arr[high], arr[i+1]]
    return i + 1
}
```

---

*现在你可以自信地说：我完全理解归并排序和快速排序的区别了！* 🎊
