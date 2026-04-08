# 💡 Day 14 - 练习题答案详解

> **最短路径 + 第二周复习**  
> **参考答案与解析**

---

## 一、基础概念题答案

### 题目 1：Dijkstra算法原理（15 分）

**参考答案：**

**基本思想：**
```
从起点开始，每次选择距离最小的未访问节点，
更新其邻居的距离，直到所有节点都被访问。
这是一种贪心策略。
```

**核心步骤：**
```
1. 初始化：起点距离为0，其他为无穷大
2. 选择：从未访问节点中选距离最小的
3. 松弛：更新邻居的距离
4. 标记：将当前节点标记为已访问
```

**为什么不能用负权边：**
```
因为Dijkstra基于贪心策略，
一旦确定某节点的最短距离，就不再更新。
但负权边可能导致后续出现更短的路径，
导致结果错误。
```

**时间复杂度：**
```
- 朴素实现：O(V²)
- 优先队列优化：O((V+E) log V)
```

**评分要点：**
- 基本思想 5 分
- 核心步骤 4 分
- 负权边解释 3 分
- 复杂度 3 分

---

### 题目 2：第二周知识总结（15 分）

**参考答案：**

**树结构：**
```
- 基本概念：节点、边、根、叶子、深度
- 遍历方式：前序、中序、后序、层序
```

**二叉搜索树：**
```
- 特点：左子树 < 根 < 右子树
- 操作复杂度：平均 O(log n)，最坏 O(n)
```

**堆：**
```
- 类型：最大堆、最小堆
- 应用：优先队列、堆排序、Top K问题
```

**哈希表：**
```
- 原理：哈希函数映射键到索引
- 冲突处理：链地址法、开放寻址
```

**图：**
```
- 表示方法：邻接矩阵、邻接表
- 遍历算法：BFS、DFS
```

**最短路径：**
```
- 算法：Dijkstra（加权）、BFS（无权）
- 适用场景：地图导航、网络路由
```

**评分要点：**
- 每个知识点约 2.5 分

---

### 题目 3：算法对比（10 分）

**参考答案：**

**相同点：**
```
- 都能找最短路径
- 都使用队列/优先队列
- 都需要标记已访问
```

**不同点：**

**1. 适用图类型：**
```
BFS: 无权图
Dijkstra: 加权图（非负权）
```

**2. 时间复杂度：**
```
BFS: O(V+E)
Dijkstra: O((V+E) log V)（优先队列优化）
```

**3. 实现难度：**
```
BFS: 简单
Dijkstra: 较复杂
```

**选择原则：**
```
- 无权图 → BFS（简单高效）
- 加权图 → Dijkstra
- 有负权 → Bellman-Ford
```

**评分要点：**
- 相同点 3 分
- 不同点 5 分
- 选择原则 2 分

---

## 二、代码实践题答案

### 题目 4：实现Dijkstra算法（25 分）

**参考答案：**

```javascript
function dijkstra(graph, start) {
    const distances = {};
    const parents = {};
    const visited = new Set();
    
    // 简化版优先队列（数组模拟）
    const pq = [];
    
    // 初始化
    for (const vertex of graph.vertices) {
        distances[vertex] = Infinity;
        parents[vertex] = null;
    }
    distances[start] = 0;
    
    pq.push({ vertex: start, distance: 0 });
    
    while (pq.length > 0) {
        // 找距离最小的
        pq.sort((a, b) => a.distance - b.distance);
        const { vertex: current, distance: dist } = pq.shift();
        
        if (visited.has(current)) {
            continue;
        }
        
        visited.add(current);
        
        const neighbors = graph.getNeighbors(current);
        for (const neighbor of neighbors) {
            const nextVertex = neighbor.vertex;
            const weight = neighbor.weight;
            
            if (!visited.has(nextVertex)) {
                const newDist = dist + weight;
                
                if (newDist < distances[nextVertex]) {
                    distances[nextVertex] = newDist;
                    parents[nextVertex] = current;
                    pq.push({ vertex: nextVertex, distance: newDist });
                }
            }
        }
    }
    
    // 构建路径
    const paths = {};
    for (const vertex of graph.vertices) {
        const path = [];
        let current = vertex;
        while (current !== null) {
            path.unshift(current);
            current = parents[current];
        }
        paths[vertex] = path;
    }
    
    return { distances, paths };
}

// 测试通过 ✓
```

**评分要点：**
- 算法逻辑正确 12 分
- 路径回溯正确 6 分
- 边界处理 4 分
- 能通过测试 3 分

---

### 题目 5：综合应用题（20 分）

**参考答案：**

```javascript
function sixDegrees(graph, person1, person2) {
    if (!graph.adjList.has(person1) || !graph.adjList.has(person2)) {
        return -1;
    }
    
    const visited = new Set();
    const queue = [[person1, 0]];  // [顶点, 距离]
    visited.add(person1);
    
    while (queue.length > 0) {
        const [current, degree] = queue.shift();
        
        if (current === person2) {
            return degree;
        }
        
        // 超过6度，停止
        if (degree >= 6) {
            continue;
        }
        
        const neighbors = graph.getNeighbors(current);
        for (const neighbor of neighbors) {
            const nextVertex = neighbor.vertex || neighbor;
            if (!visited.has(nextVertex)) {
                visited.add(nextVertex);
                queue.push([nextVertex, degree + 1]);
            }
        }
    }
    
    return -1;  // 不可达或超过6度
}

// 测试通过 ✓
```

**评分要点：**
- BFS逻辑正确 10 分
- 度数限制正确 5 分
- 边界处理 3 分
- 能通过测试 2 分

---

### 题目 6：数据结构选择（15 分）

**参考答案：**

**场景 1：频繁查找用户信息**
```
选择：哈希表
理由：O(1) 查找，最适合键值对存储
```

**场景 2：按优先级处理任务**
```
选择：堆（优先队列）
理由：O(log n) 插入和删除最大值/最小值
```

**场景 3：表示层级关系**
```
选择：树
理由：天然适合表示父子关系、层级结构
```

**场景 4：找最短路径**
```
选择：图 + BFS/Dijkstra
理由：图表示关系，BFS/Dijkstra找最短路径
```

**评分要点：**
- 每个场景 3.75 分

---

## 三、理解应用题答案

### 题目 7：学习心得（10 分）

**参考模板：**

```
最大的收获：
建立了完整的数据结构知识体系，
从线性结构到树、图，层层递进。

最难理解的部分：
图的遍历和最短路径算法，
通过画图和多练习克服了困难。

最有用的知识点：
哈希表和堆，在实际开发中经常用到。

给初学者的建议：
1. 一定要动手写代码
2. 多画图理解过程
3. 不要急于求成
4. 坚持每天学习
```

**评分要点：**
- 内容真实具体 4 分
- 反思深入 3 分
- 建议实用 3 分

---

### 题目 8：第三周预习（10 分）

**参考模板：**

```
你了解的排序算法：
1. 冒泡排序
2. 快速排序
3. 归并排序

想重点学习的：
各种排序算法的原理和性能对比

预期难点：
快速排序的分区操作

学习计划：
每天学习一种排序算法，
手写实现并分析复杂度
```

**评分要点：**
- 预习充分 4 分
- 计划可行 3 分
- 目标明确 3 分

---

## 四、费曼输出答案

### 题目 9：第二周总结演讲（10 分）

**参考模板：**

```
大家好！

第二周我学习了高级数据结构。

首先，我学会了：
树、堆、哈希表、图这四种重要的数据结构，
以及它们的实现和应用。

其次，我明白了：
不同的数据结构适合不同的场景，
选择合适的数据结构能大幅提升程序性能。

最重要的是：
我建立了系统化的知识结构，
不再是零散地学习，而是理解了它们之间的联系。

这些知识的联系：
树是特殊的图，
堆是完全二叉树，
哈希表用数组+链表实现，
图可以表示任意复杂的关系。

给第三周的建议：
继续保持学习的热情，
排序算法也很重要，
加油！

谢谢大家！
```

**评分要点：**
- 内容完整 3 分
- 逻辑清晰 2 分
- 真情实感 2 分
- 鼓励他人 2 分
- 表达流畅 1 分

---

## 📊 总分统计

| 题号 | 满分 | 你的得分 | 评语 |
|-----|------|---------|------|
| 题目 1 | 15 | ___ | _____ |
| 题目 2 | 15 | ___ | _____ |
| 题目 3 | 10 | ___ | _____ |
| 题目 4 | 25 | ___ | _____ |
| 题目 5 | 20 | ___ | _____ |
| 题目 6 | 15 | ___ | _____ |
| 题目 7 | 10 | ___ | _____ |
| 题目 8 | 10 | ___ | _____ |
| 题目 9 | 10 | ___ | _____ |
| **总分** | **130** | **___** | _____ |

**评级标准：**
- 🌟🌟🌟 100-130 分：优秀！你对第二周内容有了很好的掌握
- 🌟🌟 80-99 分：良好！基础扎实
- 🌟 60-79 分：合格！还需要多加练习
- 💪 60 分以下：需要重新学习

---

**🎉 恭喜完成第二周的学习！**

**你已经掌握了高级数据结构！**

**准备迎接第三周的排序算法挑战！** ✨✨✨
