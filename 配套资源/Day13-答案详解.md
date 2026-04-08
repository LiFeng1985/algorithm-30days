# 💡 Day 13 - 练习题答案详解

> **图的遍历详解**  
> **参考答案与解析**

---

## 一、基础概念题答案

### 题目 1：BFS和DFS的区别（15 分）

**参考答案：**

**BFS（广度优先搜索）：**
```
实现方式：队列（FIFO）
遍历顺序：按层遍历，先访问距离近的节点
特点：保证最短路径（无权图），需要较多内存
适用场景：找最短路径、层次遍历
```

**DFS（深度优先搜索）：**
```
实现方式：栈或递归
遍历顺序：一条路走到黑，再回溯
特点：内存使用少，不保证最短路径
适用场景：检测环、拓扑排序、连通性检查
```

**主要区别：**
```
1. 数据结构：BFS用队列，DFS用栈
2. 遍历顺序：BFS按层，DFS深入
3. 最短路径：BFS保证，DFS不保证
4. 内存使用：BFS较多，DFS较少
```

**评分要点：**
- BFS描述 6 分
- DFS描述 6 分
- 区别总结 3 分

---

### 题目 2：为什么要标记已访问？（10 分）

**参考答案：**

**原因：**
```
图中可能有环或回路，
如果不标记已访问，会无限循环。
```

**如果不标记会怎样：**
```
- 重复访问同一节点
- 可能进入死循环
- 结果不正确
- 程序崩溃（栈溢出）
```

**如何实现标记：**
```
使用 Set 或布尔数组记录已访问的节点，
访问前检查，访问后标记。
```

**评分要点：**
- 原因 4 分
- 后果 3 分
- 实现方法 3 分

---

### 题目 3：时间复杂度分析（10 分）

**参考答案：**

**BFS 时间复杂度：** O(V + E)
```
解释：每个顶点访问一次 O(V)，每条边检查一次 O(E)
```

**DFS 时间复杂度：** O(V + E)
```
解释：同样每个顶点和每条边都处理一次
```

**空间复杂度：**
```
BFS: O(V) - 队列最多存储所有顶点
DFS: O(V) - 递归栈或显式栈最多V层
```

**为什么相同：**
```
因为两种遍历都要访问所有顶点和边，
只是访问顺序不同。
```

**评分要点：**
- 时间复杂度各 2 分
- 空间复杂度 2 分
- 解释 2 分

---

## 二、代码实践题答案

### 题目 4：实现BFS和DFS（25 分）

**参考答案：**

```javascript
function bfs(graph, startVertex) {
    const visited = new Set();
    const queue = [startVertex];
    const result = [];
    
    visited.add(startVertex);
    
    while (queue.length > 0) {
        const vertex = queue.shift();
        result.push(vertex);
        
        const neighbors = graph.getNeighbors(vertex);
        for (const neighbor of neighbors) {
            const nextVertex = neighbor.vertex || neighbor;
            if (!visited.has(nextVertex)) {
                visited.add(nextVertex);
                queue.push(nextVertex);
            }
        }
    }
    
    return result;
}

function dfsRecursive(graph, startVertex) {
    const visited = new Set();
    const result = [];
    
    function dfs(vertex) {
        visited.add(vertex);
        result.push(vertex);
        
        const neighbors = graph.getNeighbors(vertex);
        for (const neighbor of neighbors) {
            const nextVertex = neighbor.vertex || neighbor;
            if (!visited.has(nextVertex)) {
                dfs(nextVertex);
            }
        }
    }
    
    dfs(startVertex);
    return result;
}

function dfsIterative(graph, startVertex) {
    const visited = new Set();
    const stack = [startVertex];
    const result = [];
    
    visited.add(startVertex);
    
    while (stack.length > 0) {
        const vertex = stack.pop();
        result.push(vertex);
        
        const neighbors = graph.getNeighbors(vertex);
        // 逆序入栈，保证正序访问
        for (let i = neighbors.length - 1; i >= 0; i--) {
            const nextVertex = neighbors[i].vertex || neighbors[i];
            if (!visited.has(nextVertex)) {
                visited.add(nextVertex);
                stack.push(nextVertex);
            }
        }
    }
    
    return result;
}

// 测试通过 ✓
```

**评分要点：**
- BFS正确 8 分
- DFS递归正确 8 分
- DFS迭代正确 7 分
- 能通过测试 2 分

---

### 题目 5：找最短路径（20 分）

**参考答案：**

```javascript
function shortestPath(graph, start, end) {
    if (!graph.adjList.has(start) || !graph.adjList.has(end)) {
        return [];
    }
    
    const visited = new Set();
    const queue = [start];
    const parent = {};  // 记录前驱节点
    
    visited.add(start);
    parent[start] = null;
    
    while (queue.length > 0) {
        const vertex = queue.shift();
        
        if (vertex === end) {
            // 找到目标，回溯路径
            const path = [];
            let current = end;
            while (current !== null) {
                path.unshift(current);
                current = parent[current];
            }
            return path;
        }
        
        const neighbors = graph.getNeighbors(vertex);
        for (const neighbor of neighbors) {
            const nextVertex = neighbor.vertex || neighbor;
            if (!visited.has(nextVertex)) {
                visited.add(nextVertex);
                parent[nextVertex] = vertex;
                queue.push(nextVertex);
            }
        }
    }
    
    return [];  // 不存在路径
}

// 测试通过 ✓
```

**评分要点：**
- BFS逻辑正确 8 分
- parent追踪正确 6 分
- 路径回溯正确 4 分
- 边界处理 2 分

---

### 题目 6：判断连通性（15 分）

**参考答案：**

```javascript
function isConnected(graph) {
    if (graph.vertices.length === 0) {
        return true;
    }
    
    // 从第一个顶点开始BFS
    const start = graph.vertices[0];
    const visited = new Set();
    const queue = [start];
    visited.add(start);
    
    while (queue.length > 0) {
        const vertex = queue.shift();
        const neighbors = graph.getNeighbors(vertex);
        
        for (const neighbor of neighbors) {
            const nextVertex = neighbor.vertex || neighbor;
            if (!visited.has(nextVertex)) {
                visited.add(nextVertex);
                queue.push(nextVertex);
            }
        }
    }
    
    // 检查是否访问了所有顶点
    return visited.size === graph.vertices.length;
}

// 测试通过 ✓
```

**评分要点：**
- 遍历逻辑正确 8 分
- 连通性判断正确 5 分
- 边界处理 2 分

---

## 三、理解应用题答案

### 题目 7：实际应用场景（10 分）

**参考答案：**

**BFS 的应用：**

**1. 最短路径（无权图）**
```
地图导航中找最少转弯的路径
```

**2. 社交网络中的共同好友**
```
找二度人脉、三度人脉
```

**DFS 的应用：**

**1. 检测环**
```
判断图中是否有环
```

**2. 拓扑排序**
```
课程依赖关系、任务调度
```

**评分要点：**
- BFS应用 5 分
- DFS应用 5 分

---

### 题目 8：算法选择（10 分）

**参考答案：**

**场景 1：找最短路径**
```
选择：BFS
理由：BFS按层遍历，先到达的一定是最短路径
```

**场景 2：检测环**
```
选择：DFS
理由：DFS更容易发现回边，从而检测环
```

**场景 3：拓扑排序**
```
选择：DFS
理由：DFS的后序遍历反转就是拓扑序
```

**场景 4：迷宫求解**
```
选择：都可以
理由：BFS找最短路径，DFS更快找到任意路径
```

**总结选择原则：**
```
- 需要最短路径 → BFS
- 需要检测环或拓扑 → DFS
- 内存紧张 → DFS
- 其他情况根据需求选择
```

**评分要点：**
- 每个场景 2 分
- 总结原则 2 分

---

## 四、费曼输出答案

### 题目 9：小老师时间（10 分）

**参考模板：**

```
大家好，今天我要讲的是"图的遍历"。

你们可能会问，什么是BFS和DFS呢？

其实啊，BFS就像扔石头到水里。

石头落水的地方是起点，
水波一圈一圈向外扩散。

第一圈是距离为1的点，
第二圈是距离为2的点，
以此类推。

这就是BFS：一层一层地探索！

而DFS就像走迷宫。

你选一条路一直走，
走到死胡同就退回来，
换另一条路继续走。

这就是DFS：一条路走到黑！

举个例子：
你要从家到学校，有很多条路。

BFS的做法：
先看所有离家1站的地方，
再看所有离家2站的地方，
这样能保证找到最近的路。

DFS的做法：
选一条路一直走，
不通就回头换路，
直到找到学校。

所以：
BFS适合找最短路径，
DFS适合探索所有可能。

谢谢大家！
```

**评分要点：**
- 不用专业术语（3 分）
- 用了生活例子（水波、迷宫）（3 分）
- 逻辑清晰（2 分）
- 容易听懂（2 分）

---

## 📊 总分统计

| 题号 | 满分 | 你的得分 | 评语 |
|-----|------|---------|------|
| 题目 1 | 15 | ___ | _____ |
| 题目 2 | 10 | ___ | _____ |
| 题目 3 | 10 | ___ | _____ |
| 题目 4 | 25 | ___ | _____ |
| 题目 5 | 20 | ___ | _____ |
| 题目 6 | 15 | ___ | _____ |
| 题目 7 | 10 | ___ | _____ |
| 题目 8 | 10 | ___ | _____ |
| 题目 9 | 10 | ___ | _____ |
| **总分** | **125** | **___** | _____ |

**评级标准：**
- 🌟🌟🌟 100-125 分：优秀！你对图的遍历有了很好的理解
- 🌟🌟 80-99 分：良好！基本概念掌握了
- 🌟 60-79 分：合格！还需要多加练习
- 💪 60 分以下：需要重新学习

---

**🎉 完成答案订正后，记得给自己一个奖励！**

**图的遍历是图算法的基础！**

**明天学习最短路径，加油！** ✨
