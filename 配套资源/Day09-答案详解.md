# 💡 Day 09 - 练习题答案详解

> **二叉搜索树详解**  
> **参考答案与解析**

---

## 一、基础概念题答案

### 题目 1：什么是 BST？（10 分）

**参考答案：**
```
二叉搜索树是一种特殊的二叉树，
每个节点都比左子树大，比右子树小。
就像整理扑克牌，小的在左，大的在右。
查找时每次排除一半，非常快。
```

**评分要点：**
- ✅ 提到"左小右大"或类似表述（4 分）
- ✅ 有自己的比喻（3 分）
- ✅ 提到查找效率高（3 分）

---

### 题目 2：BST 的性质（15 分）

**参考答案：**

**性质 1：左子树 < 根节点 < 右子树**（5 分）
```
对于任意节点，
它的左子树上所有节点的值都小于它，
右子树上所有节点的值都大于它。
```

**性质 2：中序遍历得到升序序列**（5 分）
```
对 BST 进行中序遍历（左→根→右），
会得到一个从小到大的有序序列。
```

**性质 3：查找时间复杂度平均 O(log n)**（3 分）
```
每次查找都能排除一半的节点，
就像二分查找一样高效。
```

**其他可接受答案：**
- 没有值相等的节点（或规定相等的处理方式）
- 左右子树也都是 BST
- 适合动态插入和删除

**评分要点：**
- 每个性质 5 分
- 至少答出 3 个性质

---

### 题目 3：时间复杂度分析（10 分）

**参考答案：**

```
最好情况：O(1) - 第一次就找到
平均情况：O(log n) - 树比较平衡
最坏情况：O(n) - 退化为链表

最坏情况发生在：
树极度不平衡时，例如：
    1
     \
      2
       \
        3
         \
          4
像一条链子，查找要走遍所有节点。
```

**评分要点：**
- 每种情况正确得 2 分
- 解释最坏情况得 4 分

---

## 二、代码实践题答案

### 题目 4：BST 查找（20 分）

**参考答案：**

```javascript
function searchBST(root, target) {
    // 基准情况：空树或找到
    if (root === null) {
        return null;
    }
    
    // 找到了
    if (target === root.val) {
        return root;
    }
    // 在左子树查找
    else if (target < root.val) {
        return searchBST(root.left, target);
    }
    // 在右子树查找
    else {
        return searchBST(root.right, target);
    }
}

// 测试
const root = new TreeNode(5);
root.left = new TreeNode(3);
root.right = new TreeNode(8);
root.left.left = new TreeNode(2);
root.left.right = new TreeNode(4);
root.right.right = new TreeNode(10);

console.log(searchBST(root, 3));  // TreeNode { val: 3, ... }
console.log(searchBST(root, 7));  // null
```

**执行过程演示：**
```
查找 3：
searchBST(5, 3)
→ 3 < 5，查左子树
→ searchBST(3, 3)
→ 3 === 3，找到！返回节点 3 ✓

查找 7：
searchBST(5, 7)
→ 7 > 5，查右子树
→ searchBST(8, 7)
→ 7 < 8，查左子树
→ searchBST(null, 7)
→ null，没找到，返回 null ✓
```

**评分要点：**
- 基准情况正确（4 分）
- 相等情况处理（4 分）
- 小于时查左子树（6 分）
- 大于时查右子树（6 分）

**常见错误：**
❌ 忘记判空 → ✅ 第一件事检查 `root === null`
❌ 搞反左右 → ✅ 记住：小于查左，大于查右

---

### 题目 5：BST 插入（20 分）

**参考答案：**

```javascript
function insertIntoBST(root, val) {
    // 基准情况：空树，创建新节点
    if (root === null) {
        return new TreeNode(val);
    }
    
    // 根据大小决定插在哪边
    if (val < root.val) {
        root.left = insertIntoBST(root.left, val);
    } else {
        root.right = insertIntoBST(root.right, val);
    }
    
    // 返回根节点
    return root;
}

// 测试
const root = new TreeNode(5);
root.left = new TreeNode(3);
root.right = new TreeNode(8);

insertIntoBST(root, 7);
// 插入后：
//     5
//    / \
//   3   8
//      /
//     7
```

**执行过程：**
```
插入 7：
insertIntoBST(5, 7)
→ 7 > 5，插右边
→ insertIntoBST(8, 7)
→ 7 < 8，插左边
→ insertIntoBST(null, 7)
→ 创建新节点 TreeNode(7)
→ 返回给 8.left
→ 返回给 5.right
→ 完成！✓
```

**评分要点：**
- 基准情况正确（6 分）
- 小于时插左边（6 分）
- 大于时插右边（6 分）
- 返回根节点（2 分）

---

### 题目 6：验证 BST（15 分）

**参考答案：**

**方法 1：递归 + 范围限制**
```javascript
function isValidBST(root) {
    function validate(node, min, max) {
        // 空树是合法的
        if (node === null) {
            return true;
        }
        
        // 当前节点必须在 (min, max) 范围内
        if ((min !== null && node.val <= min) || 
            (max !== null && node.val >= max)) {
            return false;
        }
        
        // 递归检查左右子树
        // 左子树：范围 (min, node.val)
        // 右子树：范围 (node.val, max)
        return validate(node.left, min, node.val) && 
               validate(node.right, node.val, max);
    }
    
    return validate(root, null, null);
}
```

**方法 2：中序遍历**
```javascript
function isValidBST(root) {
    let prev = null;
    
    function inorder(node) {
        if (node === null) {
            return true;
        }
        
        // 检查左子树
        if (!inorder(node.left)) {
            return false;
        }
        
        // 检查当前节点
        if (prev !== null && node.val <= prev) {
            return false;
        }
        prev = node.val;
        
        // 检查右子树
        return inorder(node.right);
    }
    
    return inorder(root);
}
```

**评分要点：**
- 方法 1：
  - 基准情况正确（3 分）
  - 范围判断正确（6 分）
  - 递归调用正确（4 分）
  - 初始调用正确（2 分）

- 方法 2：
  - 中序遍历框架（5 分）
  - prev 变量使用（5 分）
  - 升序判断（5 分）

**难点解析：**
```
错误做法：只检查 node.val > node.left.val
正确做法：要保证整个左子树都小于根节点

例如：
    5
   / \
  3   4  ← 这个 4 虽然大于 3，但小于 5，不合法！
```

---

## 三、理解应用题答案

### 题目 7：BST 的应用场景（10 分）

**参考答案示例：**

**场景 1：数据库索引**
```
如何使用 BST：
用 BST 建立索引，快速查找记录
比如按学号查找学生信息
O(log n) 的时间复杂度很快
```

**场景 2：实现 Map/Set 数据结构**
```
如何使用 BST：
JavaScript 的 Map 和 Set 底层用类似 BST 的结构
保证键值对的有序性和快速查找
```

**其他可接受答案：**
- 文件系统索引
- 符号表（编译器用）
- 优先队列（平衡 BST）

**评分要点：**
- 每个场景 5 分（合理 3 分，说明 2 分）
- 至少答出 2 个场景

---

### 题目 8：BST vs 数组查找（10 分）

**参考答案：**

**相同点：**（3 分）
```
都利用了二分查找的思想
时间复杂度都是 O(log n)（平均）
都要求数据有序
```

**不同点：**（4 分）
```
BST：
- 动态结构，支持高效插入删除
- 不需要连续内存
- 空间开销较大（指针）

有序数组：
- 静态结构，插入删除需要移动元素
- 需要连续内存
- 空间紧凑
```

**各自优势：**（3 分）
```
BST 优势：频繁的插入删除操作
数组优势：随机访问，空间敏感的场景
```

**评分要点：**
- 相同点 3 分
- 不同点 4 分
- 优势分析 3 分

---

## 四、费曼输出答案

### 题目 9：小老师时间（10 分）

**参考模板：**

```
大家好，今天我要讲的是"二叉搜索树"。

你们可能会问，什么是二叉搜索树呢？

其实啊，BST 就像一个智能的寻宝游戏。
你站在一个路口，面前有两条路：
左边的路通向更小的宝藏，
右边的路通向更大的宝藏。

每次你都能排除一半的可能性，
很快就找到了目标。

举个例子：
你要猜我心里想的数字（1-100）。
你问："比 50 大吗？"
我说："大。"
你就排除了 1-50，只剩 51-100。
再问："比 75 大吗？"
...这样很快就能猜到。

所以，BST 就是一种每次排除一半的快速查找结构！

谢谢大家！
```

**评分要点：**
- 不用专业术语（3 分）
- 用了生活例子（寻宝、猜数字等）（3 分）
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
- 🌟🌟🌟 100-120 分：优秀！你对 BST 有了很好的理解
- 🌟🌟 80-99 分：良好！基本概念掌握了
- 🌟 60-79 分：合格！还需要多加练习
- 💪 60 分以下：需要重新学习

---

**🎉 完成答案订正后，记得给自己一个奖励！**

**明天学习堆和优先队列，加油！** ✨
