# 💡 Day 10 - 练习题答案详解

> **堆和优先队列**  
> **参考答案与解析**

---

## 一、基础概念题答案

### 题目 1：什么是堆？（10 分）

**参考答案：**
```
堆是一种特殊的完全二叉树，
分为大顶堆和小顶堆。
大顶堆的根节点最大，小顶堆的根节点最小。
就像金字塔，最重要的在最上面。
```

**评分要点：**
- ✅ 提到"完全二叉树"或"树形结构"（3 分）
- ✅ 有自己的比喻（3 分）
- ✅ 提到大顶堆/小顶堆的特点（4 分）

---

### 题目 2：大顶堆 vs 小顶堆（15 分）

**参考答案：**

**相同点：**（3 分）
```
都是完全二叉树
都满足父节点与子节点的大小关系
都适合实现优先队列
```

**不同点：**（6 分）
```
大顶堆：
- 父节点 ≥ 子节点
- 根节点是最大值

小顶堆：
- 父节点 ≤ 子节点
- 根节点是最小值
```

**应用场景：**（6 分）
```
大顶堆：
- 找最大的元素
- Top K 大问题
- 任务调度（优先级高的先执行）

小顶堆：
- 找最小的元素
- Top K 小问题
- 实时数据流的中位数
```

**评分要点：**
- 相同点 3 分
- 不同点 6 分
- 应用场景 6 分

---

### 题目 3：完全二叉树（10 分）

**参考答案：**

**完全二叉树的定义：**（5 分）
```
除了最后一层，其他层都是满的，
最后一层的节点都靠左排列。
就像坐公交车，前面坐满再坐后面。
```

**为什么堆要用完全二叉树：**（5 分）
```
1. 可以用数组紧凑存储，不浪费空间
2. 父子节点的索引有固定关系：
   parent = (i-1)/2
   left = 2i+1
   right = 2i+2
3. 保证树的高度为 log n，操作效率高
```

**评分要点：**
- 定义正确 5 分
- 原因说明 5 分（至少答出 2 点）

---

## 二、代码实践题答案

### 题目 4：实现大顶堆（30 分）

**参考答案：**

```javascript
class MaxHeap {
    constructor() {
        this.heap = [];
    }
    
    // 获取父节点索引
    getParentIndex(i) {
        return Math.floor((i - 1) / 2);
    }
    
    // 获取左子节点索引
    getLeftIndex(i) {
        return 2 * i + 1;
    }
    
    // 获取右子节点索引
    getRightIndex(i) {
        return 2 * i + 2;
    }
    
    // 交换元素
    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
    
    // 上滤操作
    shiftUp(index) {
        while (index > 0) {
            const parentIndex = this.getParentIndex(index);
            if (this.heap[index] > this.heap[parentIndex]) {
                this.swap(index, parentIndex);
                index = parentIndex;
            } else {
                break;
            }
        }
    }
    
    // 下滤操作
    shiftDown(index) {
        const length = this.heap.length;
        while (true) {
            let largest = index;
            const left = this.getLeftIndex(index);
            const right = this.getRightIndex(index);
            
            if (left < length && this.heap[left] > this.heap[largest]) {
                largest = left;
            }
            if (right < length && this.heap[right] > this.heap[largest]) {
                largest = right;
            }
            
            if (largest !== index) {
                this.swap(index, largest);
                index = largest;
            } else {
                break;
            }
        }
    }
    
    // 插入元素
    insert(val) {
        this.heap.push(val);
        this.shiftUp(this.heap.length - 1);
    }
    
    // 删除并返回最大值
    extractMax() {
        if (this.heap.length === 0) return null;
        
        const max = this.heap[0];
        this.heap[0] = this.heap[this.heap.length - 1];
        this.heap.pop();
        
        if (this.heap.length > 0) {
            this.shiftDown(0);
        }
        
        return max;
    }
    
    // 获取堆顶元素
    peek() {
        return this.heap.length > 0 ? this.heap[0] : null;
    }
    
    // 获取堆的大小
    size() {
        return this.heap.length;
    }
}

// 测试
const heap = new MaxHeap();
heap.insert(10);
heap.insert(15);
heap.insert(8);
heap.insert(20);
console.log(heap.extractMax());  // 20 ✓
console.log(heap.peek());        // 15 ✓
```

**执行过程演示：**
```
插入序列：10, 15, 8, 20

插入 10:
heap: [10]

插入 10:
heap: [10]
     10

插入 15:
heap: [10, 15] → 15 > 10，上滤 → [15, 10]
      15
     /
    10

插入 8:
heap: [15, 10, 8]
      15
     /  \
    10   8

插入 20:
heap: [15, 10, 8, 20] 
→ 20 > 15，上滤 → [20, 10, 8, 15]
      20
     /  \
    10   8
   /
  15

extractMax():
返回 20，用末尾 15 替换根，下滤
heap: [15, 10, 8]
      15
     /  \
    10   8

peek():
返回 15 ✓
```

**评分要点：**
- 索引计算正确（6 分）
- 上滤操作正确（8 分）
- 下滤操作正确（8 分）
- 插入和删除正确（6 分）
- 能通过测试（2 分）

**常见错误：**
❌ 索引计算错误 → ✅ 记住公式：parent=(i-1)/2, left=2i+1, right=2i+2
❌ 忘记边界检查 → ✅ 访问前先检查索引是否越界
❌ 上滤下滤搞混 → ✅ 上滤是和父母比，下滤是和孩子比

---

### 题目 5：Top K 问题（20 分）

**参考答案：**

**方法 1：用小顶堆**
```javascript
function findKthLargest(nums, k) {
    // 维护一个大小为 k 的小顶堆
    const minHeap = [];
    
    for (const num of nums) {
        if (minHeap.length < k) {
            minHeap.push(num);
            // 上滤调整
            let i = minHeap.length - 1;
            while (i > 0) {
                const parent = Math.floor((i - 1) / 2);
                if (minHeap[i] < minHeap[parent]) {
                    [minHeap[i], minHeap[parent]] = [minHeap[parent], minHeap[i]];
                    i = parent;
                } else {
                    break;
                }
            }
        } else if (num > minHeap[0]) {
            // 替换堆顶
            minHeap[0] = num;
            // 下滤调整
            let i = 0;
            while (true) {
                let smallest = i;
                const left = 2 * i + 1;
                const right = 2 * i + 2;
                
                if (left < k && minHeap[left] < minHeap[smallest]) {
                    smallest = left;
                }
                if (right < k && minHeap[right] < minHeap[smallest]) {
                    smallest = right;
                }
                
                if (smallest !== i) {
                    [minHeap[i], minHeap[smallest]] = [minHeap[smallest], minHeap[i]];
                    i = smallest;
                } else {
                    break;
                }
            }
        }
    }
    
    return minHeap[0];
}
```

**方法 2：用大顶堆（更简单）**
```javascript
function findKthLargest(nums, k) {
    // 建立大顶堆
    const maxHeap = new MaxHeap();
    
    // 所有元素入堆
    for (const num of nums) {
        maxHeap.insert(num);
    }
    
    // 弹出 k-1 次
    for (let i = 0; i < k - 1; i++) {
        maxHeap.extractMax();
    }
    
    // 第 k 次就是第 k 大的元素
    return maxHeap.extractMax();
}
```

**评分要点：**
- 方法 1（小顶堆优化）：12 分
- 方法 2（大顶堆简单）：8 分
- 思路清晰，代码正确即可得分

---

### 题目 6：优先队列（15 分）

**参考答案：**

```javascript
class PriorityQueue {
    constructor() {
        this.heap = new MaxHeap();
    }
    
    // 入队
    enqueue(val) {
        this.heap.insert(val);
    }
    
    // 出队（优先级最高的先出）
    dequeue() {
        return this.heap.extractMax();
    }
    
    // 查看队头元素
    peek() {
        return this.heap.peek();
    }
    
    // 判断是否为空
    isEmpty() {
        return this.heap.size() === 0;
    }
}

// 测试
const pq = new PriorityQueue();
pq.enqueue(5);
pq.enqueue(10);
pq.enqueue(3);
console.log(pq.dequeue());  // 10 ✓
console.log(pq.dequeue());  // 5 ✓
```

**评分要点：**
- enqueue 正确（4 分）
- dequeue 正确（4 分）
- peek 正确（3 分）
- isEmpty 正确（2 分）
- 能通过测试（2 分）

---

## 三、理解应用题答案

### 题目 7：堆的应用场景（10 分）

**参考答案示例：**

**场景 1：任务调度系统**
```
如何使用堆：
用大顶堆实现优先队列
优先级高的任务先执行
操作系统进程调度常用
```

**场景 2：Top K 问题**
```
如何使用堆：
找最大的 K 个数用小顶堆
找最小的 K 个数用小顶堆
电商网站的热销榜单
```

**场景 3：数据流中位数**
```
如何使用堆：
一个大顶堆存较小的一半
一个小顶堆存较大的一半
动态维护中位数
```

**其他可接受答案：**
- Dijkstra 最短路径算法
- Huffman 编码
- 合并 K 个有序链表

**评分要点：**
- 每个场景 3 分（合理 2 分，说明 1 分）
- 至少答出 3 个场景

---

### 题目 8：堆排序思路（10 分）

**参考答案：**

**我的思路：**
```
1. 建立大顶堆
2. 把堆顶元素（最大）和末尾元素交换
3. 堆的大小减 1，对新的根节点下滤
4. 重复步骤 2-3，直到堆为空

这样数组就从小到大排好序了。
```

**时间复杂度：** O(n log n)
**空间复杂度：** O(1)

**评分要点：**
- 思路正确 6 分
- 时间复杂度正确 2 分
- 空间复杂度正确 2 分

---

## 四、费曼输出答案

### 题目 9：小老师时间（10 分）

**参考模板：**

```
大家好，今天我要讲的是"堆"。

你们可能会问，什么是堆呢？

其实啊，堆就像一个金字塔形的排行榜。
如果是大顶堆，最上面的就是最大的；
如果是小顶堆，最上面的就是最小的。

每次你要找最大（或最小）的东西，
直接看最上面就行了，非常快。

举个例子：
班级里选班长，
如果按成绩排名，
成绩最好的站在最上面，
一眼就能看到。

所以，堆就是一种快速找最大或最小值的结构！

谢谢大家！
```

**评分要点：**
- 不用专业术语（3 分）
- 用了生活例子（排行榜、金字塔等）（3 分）
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
- 🌟🌟🌟 110-130 分：优秀！你对堆有了很好的理解
- 🌟🌟 90-109 分：良好！基本概念掌握了
- 🌟 70-89 分：合格！还需要多加练习
- 💪 70 分以下：需要重新学习

---

**🎉 完成答案订正后，记得给自己一个奖励！**

**明天学习哈希表，加油！** ✨
