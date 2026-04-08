# 💡 Day 12 - 练习题答案详解

> **图结构基础**  
> **参考答案与解析**

---

## 一、基础概念题答案

### 题目 1：什么是图？（10 分）

**参考答案：**
```
图是由顶点（节点）和边（连线）组成的数据结构，
用来表示事物之间的关系。
就像社交网络中的人和好友关系。
```

**评分要点：**
- ✅ 提到"顶点和边"（4 分）
- ✅ 有自己的比喻（3 分）
- ✅ 提到"表示关系"（3 分）

---

### 题目 2：图的表示方法（15 分）

**参考答案：**

**邻接矩阵：**（7 分）

**优点：**
```
✓ 查询边是否存在很快 O(1)
✓ 实现简单
✓ 适合稠密图
```

**缺点：**
```
✗ 空间复杂度 O(V²)，浪费空间
✗ 遍历邻居需要 O(V)
✗ 添加/删除顶点慢
```

**空间复杂度：** O(V²)

**适用场景：** 稠密图（边很多）

**邻接表：**（8 分）

**优点：**
```
✓ 空间复杂度 O(V+E)，节省空间
✓ 遍历邻居快 O(度)
✓ 适合稀疏图
```

**缺点：**
```
✗ 查询边是否存在慢 O(度)
✗ 实现稍复杂
```

**空间复杂度：** O(V+E)

**适用场景：** 稀疏图（边较少）

**你会选择哪种：**（额外加分）
```
一般情况用邻接表，
除非是稠密图或需要频繁查询边。
```

**评分要点：**
- 邻接矩阵 7 分
- 邻接表 8 分

---

### 题目 3：图的类型（10 分）

**参考答案：**

**有向图 vs 无向图：**
```
区别：有向图的边有方向，无向图的边没有方向
例子：有向图 - 单向街道；无向图 - 双向街道
```

**加权图 vs 无权图：**
```
区别：加权图的边有权重（成本、距离等），无权图没有
例子：加权图 - 地图上的距离；无权图 - 社交网络
```

**连通图 vs 非连通图：**
```
区别：连通图中任意两个顶点都有路径，非连通图不是
例子：连通图 - 完整的社交网络；非连通图 - 多个独立群体
```

**评分要点：**
- 每种类型对比约 3.3 分

---

## 二、代码实践题答案

### 题目 4：实现图的类（25 分）

**参考答案：**

```javascript
class Graph {
    constructor(isDirected = false) {
        this.isDirected = isDirected;
        this.vertices = [];
        this.adjList = new Map();
    }
    
    addVertex(vertex) {
        if (!this.adjList.has(vertex)) {
            this.vertices.push(vertex);
            this.adjList.set(vertex, []);
        }
    }
    
    addEdge(v1, v2, weight = 1) {
        this.addVertex(v1);
        this.addVertex(v2);
        
        this.adjList.get(v1).push({ vertex: v2, weight });
        
        if (!this.isDirected) {
            this.adjList.get(v2).push({ vertex: v1, weight });
        }
    }
    
    removeVertex(vertex) {
        if (!this.adjList.has(vertex)) return;
        
        // 删除所有相关边
        for (const v of this.vertices) {
            const neighbors = this.adjList.get(v);
            this.adjList.set(v, neighbors.filter(n => n.vertex !== vertex));
        }
        
        // 删除顶点
        this.adjList.delete(vertex);
        this.vertices = this.vertices.filter(v => v !== vertex);
    }
    
    removeEdge(v1, v2) {
        if (!this.adjList.has(v1) || !this.adjList.has(v2)) return;
        
        let neighbors = this.adjList.get(v1);
        this.adjList.set(v1, neighbors.filter(n => n.vertex !== v2));
        
        if (!this.isDirected) {
            neighbors = this.adjList.get(v2);
            this.adjList.set(v2, neighbors.filter(n => n.vertex !== v1));
        }
    }
    
    getNeighbors(vertex) {
        return this.adjList.get(vertex) || [];
    }
    
    vertexCount() {
        return this.vertices.length;
    }
    
    edgeCount() {
        let count = 0;
        for (const neighbors of this.adjList.values()) {
            count += neighbors.length;
        }
        return this.isDirected ? count : count / 2;
    }
    
    toString() {
        let result = '';
        for (const vertex of this.vertices) {
            const neighbors = this.adjList.get(vertex);
            const neighborStr = neighbors.map(n => n.vertex).join(', ');
            result += `${vertex} -> ${neighborStr}\n`;
        }
        return result.trim();
    }
}

// 测试通过 ✓
```

**评分要点：**
- 基本功能正确 15 分
- 删除功能正确 5 分
- 计数功能正确 3 分
- 能通过测试 2 分

---

### 题目 5：判断是否有路径（20 分）

**参考答案：**

```javascript
function hasPath(graph, start, end) {
    if (!graph.adjList.has(start) || !graph.adjList.has(end)) {
        return false;
    }
    
    const visited = new Set();
    const queue = [start];
    visited.add(start);
    
    while (queue.length > 0) {
        const current = queue.shift();
        
        if (current === end) {
            return true;
        }
        
        const neighbors = graph.getNeighbors(current);
        for (const neighbor of neighbors) {
            const nextVertex = neighbor.vertex || neighbor;
            if (!visited.has(nextVertex)) {
                visited.add(nextVertex);
                queue.push(nextVertex);
            }
        }
    }
    
    return false;
}

// 测试通过 ✓
```

**评分要点：**
- BFS/DFS 逻辑正确 12 分
- 边界处理正确 4 分
- 能通过测试 4 分

---

### 题目 6：计算顶点的度（15 分）

**参考答案：**

```javascript
function getDegrees(graph) {
    const degrees = {};
    
    for (const vertex of graph.vertices) {
        degrees[vertex] = graph.getNeighbors(vertex).length;
    }
    
    return degrees;
}

function getInAndOutDegrees(graph) {
    const result = {};
    
    // 初始化
    for (const vertex of graph.vertices) {
        result[vertex] = { inDegree: 0, outDegree: 0 };
    }
    
    // 计算出度
    for (const vertex of graph.vertices) {
        result[vertex].outDegree = graph.getNeighbors(vertex).length;
    }
    
    // 计算入度
    for (const vertex of graph.vertices) {
        const neighbors = graph.getNeighbors(vertex);
        for (const neighbor of neighbors) {
            const nextVertex = neighbor.vertex || neighbor;
            result[nextVertex].inDegree++;
        }
    }
    
    return result;
}

// 测试通过 ✓
```

**评分要点：**
- 无向图度数正确 7 分
- 有向图入度出度正确 8 分

---

## 三、理解应用题答案

### 题目 7：实际应用场景（10 分）

**参考答案：**

**适用场景：**
```
1. 社交网络（人和关系）
2. 地图导航（地点和道路）
3. 依赖关系（任务调度）
4. 网络拓扑（路由）
5. 推荐系统（用户和物品）
```

**优点：**
```
✓ 灵活表示复杂关系
✓ 支持多种算法（最短路径、连通性等）
✓ 应用广泛
```

**缺点/限制：**
```
✗ 实现相对复杂
✗ 某些操作效率低
✗ 需要选择合适的表示方法
```

**实际应用举例：**

**1. 社交网络分析**
```
人是顶点，好友关系是边
可以找共同好友、推荐好友
```

**2. 地图导航**
```
地点是顶点，道路是边
可以找最短路径
```

**3. 课程依赖**
```
课程是顶点，先修关系是边
可以安排学习计划
```

**评分要点：**
- 适用场景 3 分
- 优点 3 分
- 缺点 2 分
- 应用举例 2 分

---

### 题目 8：性能分析（10 分）

**参考答案：**

**邻接矩阵：**
```
- 添加顶点：O(V²)（需要扩容）
- 添加边：O(1)
- 查询边是否存在：O(1)
- 遍历邻居：O(V)
- 空间复杂度：O(V²)
```

**邻接表：**
```
- 添加顶点：O(1)
- 添加边：O(1)
- 查询边是否存在：O(度)
- 遍历邻居：O(度)
- 空间复杂度：O(V+E)
```

**如何选择：**
```
- 稠密图（E ≈ V²）→ 邻接矩阵
- 稀疏图（E << V²）→ 邻接表
- 需要频繁查询边 → 邻接矩阵
- 需要频繁遍历邻居 → 邻接表
- 一般情况 → 邻接表（更常用）
```

**评分要点：**
- 邻接矩阵性能 4 分
- 邻接表性能 4 分
- 选择建议 2 分

---

## 四、费曼输出答案

### 题目 9：小老师时间（10 分）

**参考模板：**

```
大家好，今天我要讲的是"图"。

你们可能会问，什么是图呢？

其实啊，图就像一张人际关系网。

每个人是一个点（顶点），
两个人如果是朋友，就用线连起来（边）。

这样就能看出谁和谁认识，
谁的朋友圈更大。

举个例子：
小明、小红、小刚三个人。
小明和小红是朋友，
小红和小刚是朋友。

用图表示就是：
小明 — 小红 — 小刚

从这个图可以看出：
- 小明和小刚不直接认识
- 但可以通过小红认识
- 小红是中间人

所以，图就是：
用点和线表示事物和关系的数据结构！

它可以用来：
- 分析社交网络
- 规划路线
- 管理依赖关系
- 还有很多其他用途

谢谢大家！
```

**评分要点：**
- 不用专业术语（3 分）
- 用了生活例子（人际关系）（3 分）
- 逻辑清晰（2 分）
- 容易听懂（2 分）

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
- 🌟🌟🌟 100-125 分：优秀！你对图有了很好的理解
- 🌟🌟 80-99 分：良好！基本概念掌握了
- 🌟 60-79 分：合格！还需要多加练习
- 💪 60 分以下：需要重新学习

---

**🎉 完成答案订正后，记得给自己一个奖励！**

**图是非常重要的数据结构！**

**明天学习图的遍历，加油！** ✨
