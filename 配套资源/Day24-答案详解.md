# 💡 Day 24 - 练习题答案详解

> **BFS 和 DFS**  
> **参考答案与解析**

---

## 一、基础概念题答案

### 题目 1：什么是 BFS 和 DFS？（10 分）

**参考答案：**

**BFS（广度优先搜索）：**
```
从起始点开始，一层一层地向外扩展搜索。
就像水波纹扩散，先访问所有相邻节点，
再访问下一层的节点。适合找最短路径。
```

**DFS（深度优先搜索）：**
```
从起始点开始，沿着一条路径一直走到底，
直到无路可走再回溯。就像走迷宫，
不撞南墙不回头。适合探索所有可能性。
```

**评分要点：**
- BFS 提到"层层扩展"（3 分）
- BFS 提到"适合最短路径"（2 分）
- DFS 提到"一条路走到底"（3 分）
- DFS 提到"回溯"（2 分）

---

### 题目 2：BFS 和 DFS 的原理对比（15 分）

**参考答案：**

**BFS 的基本思想：**（4 分）
```
从起始节点开始，首先访问所有直接相邻的节点，
然后依次访问这些相邻节点的未访问邻居，
层层推进，像水波纹一样扩散。
```

**DFS 的基本思想：**（4 分）
```
从起始节点开始，选择一条路径一直走下去，
直到无法继续（到达叶子节点或已访问节点），
然后回溯到上一个节点，继续探索其他路径。
```

**使用的数据结构：**（4 分）

**BFS 使用：队列（Queue）**（2 分）
```
因为队列是先进先出（FIFO），
保证先发现的节点先被处理，
符合按层遍历的要求。
```

**DFS 使用：栈（Stack）或递归**（2 分）
```
因为栈是后进先出（LIFO），
或者用递归（系统调用栈），
可以记录路径，方便回溯。
```

**遍历顺序的区别：**（3 分）
```
BFS：按距离起始点的远近分层访问
     先访问距离为 1 的，再访问距离为 2 的...

DFS：沿着一条路径深入
     可能先访问很深的节点，再回来访问浅的节点
```

**评分要点：**
- BFS 思想 4 分
- DFS 思想 4 分
- 数据结构各 2 分
- 遍历顺序 3 分

---

### 题目 3：复杂度分析（10 分）

**参考答案：**

**时间复杂度：**（4 分）
```
BFS: O(V + E)
DFS: O(V + E)

其中 V 是顶点数，E 是边数。

为什么都是 O(V+E)：
- 每个顶点最多访问一次 O(V)
- 每条边最多遍历一次 O(E)
- 总计 O(V + E)
```

**空间复杂度：**（6 分）

**BFS: O(V)**（2 分）
```
需要存储：
1. visited 集合：O(V)
2. 队列：最坏情况 O(V)（如星型图的中心节点）
```

**DFS: O(V)**（2 分）
```
需要存储：
1. visited 集合：O(V)
2. 递归栈/显式栈：最坏情况 O(V)（如链状图）
```

**什么情况下 BFS 更省空间：**（2 分）
```
当图比较"宽"时（如完全图、稠密图），
DFS 可能需要很多栈空间，
而 BFS 的队列相对可控。
```

**什么情况下 DFS 更省空间：**（额外加分）
```
当图比较"深"但不宽时（如树状结构），
DFS 的栈深度就是树的深度，
而 BFS 的队列可能要存储整层节点。
```

**评分要点：**
- 时间复杂度及解释 4 分
- BFS 空间 2 分
- DFS 空间 2 分
- 对比说明 2 分

---

## 二、代码实践题答案

### 题目 4：实现 BFS（20 分）

**参考答案：**

```javascript
/**
 * BFS（使用队列实现）
 * @param {Object} graph - 图的邻接表表示
 * @param {string} start - 起始节点
 * @return {string[]} 访问顺序数组
 */
function bfs(graph, start) {
    const visited = new Set();
    const queue = [start];
    const result = [];
    
    while (queue.length > 0) {
        const node = queue.shift();  // 出队
        
        // 如果已经访问过，跳过
        if (visited.has(node)) {
            continue;
        }
        
        // 标记为已访问，并加入结果
        visited.add(node);
        result.push(node);
        
        // 将所有未访问的邻居入队
        for (const neighbor of graph[node] || []) {
            if (!visited.has(neighbor)) {
                queue.push(neighbor);
            }
        }
    }
    
    return result;
}

// 测试
const graph1 = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
};

console.log(bfs(graph1, 'A'));
// 输出：['A', 'B', 'C', 'D', 'E', 'F'] ✓

// 验证层级：
// 第 0 层：A
// 第 1 层：B, C
// 第 2 层：D, E, F
```

**执行过程演示：**
```
bfs(graph1, 'A')

初始：visited={}, queue=['A'], result=[]

第 1 轮：
node = 'A'（出队）
visited.add('A'), result=['A']
邻居：'B', 'C' 入队
queue = ['B', 'C']

第 2 轮：
node = 'B'（出队）
visited.add('B'), result=['A', 'B']
邻居：'A'(已访问), 'D', 'E' 入队
queue = ['C', 'D', 'E']

第 3 轮：
node = 'C'（出队）
visited.add('C'), result=['A', 'B', 'C']
邻居：'A'(已访问), 'F' 入队
queue = ['D', 'E', 'F']

第 4 轮：
node = 'D'（出队）
visited.add('D'), result=['A', 'B', 'C', 'D']
邻居：'B'(已访问)
queue = ['E', 'F']

第 5 轮：
node = 'E'（出队）
visited.add('E'), result=['A', 'B', 'C', 'D', 'E']
邻居：'B'(已访问), 'F'(已在队列)
queue = ['F']

第 6 轮：
node = 'F'（出队）
visited.add('F'), result=['A', 'B', 'C', 'D', 'E', 'F']
邻居：'C'(已访问), 'E'(已访问)
queue = []

结束，返回 ['A', 'B', 'C', 'D', 'E', 'F'] ✓
```

**评分要点：**
- visited 初始化正确（2 分）
- 队列操作正确（4 分）
- 避免重复访问（4 分）
- 邻居处理正确（6 分）
- 返回值正确（2 分）
- 能通过测试（2 分）

**常见错误：**
❌ 忘记检查 visited → ✅ 必须在出队和入队时都检查
❌ 用 pop() 而不是 shift() → ✅ 队列要用 shift() 出队
❌ 没有处理不存在的节点 → ✅ 用 graph[node] || []

---

### 题目 5：实现 DFS（25 分）

**参考答案：**

```javascript
/**
 * DFS（递归版本）
 * @param {Object} graph - 图的邻接表表示
 * @param {string} start - 起始节点
 * @param {Set} visited - 已访问的节点集合
 * @param {string[]} result - 结果数组
 * @return {string[]} 访问顺序数组
 */
function dfsRecursive(graph, start, visited = new Set(), result = []) {
    // 基准情况：如果已经访问过，直接返回
    if (visited.has(start)) {
        return result;
    }
    
    // 标记为已访问，并加入结果
    visited.add(start);
    result.push(start);
    
    // 递归访问所有未访问的邻居
    for (const neighbor of graph[start] || []) {
        if (!visited.has(neighbor)) {
            dfsRecursive(graph, neighbor, visited, result);
        }
    }
    
    return result;
}

/**
 * DFS（迭代版本，使用栈）
 * @param {Object} graph - 图的邻接表表示
 * @param {string} start - 起始节点
 * @return {string[]} 访问顺序数组
 */
function dfsIterative(graph, start) {
    const visited = new Set();
    const stack = [start];
    const result = [];
    
    while (stack.length > 0) {
        const node = stack.pop();  // 出栈
        
        // 如果已经访问过，跳过
        if (visited.has(node)) {
            continue;
        }
        
        // 标记为已访问，并加入结果
        visited.add(node);
        result.push(node);
        
        // 将未访问的邻居入栈
        // 注意：为了保证顺序，可以反向添加（可选）
        const neighbors = graph[node] || [];
        for (let i = neighbors.length - 1; i >= 0; i--) {
            const neighbor = neighbors[i];
            if (!visited.has(neighbor)) {
                stack.push(neighbor);
            }
        }
    }
    
    return result;
}

// 测试
const graph2 = {
    'A': ['B', 'C', 'D'],
    'B': ['A', 'E'],
    'C': ['A', 'F', 'G'],
    'D': ['A', 'H'],
    'E': ['B'],
    'F': ['C'],
    'G': ['C'],
    'H': ['D']
};

console.log('DFS(递归):', dfsRecursive(graph2, 'A'));
// 可能输出：['A', 'B', 'E', 'C', 'F', 'G', 'D', 'H']

console.log('DFS(迭代):', dfsIterative(graph2, 'A'));
// 可能输出：['A', 'D', 'H', 'C', 'G', 'F', 'B', 'E']
```

**两种版本的对比：**
```
递归版本：
✓ 代码简洁，易于理解
✗ 有栈溢出风险（图很深时）
✗ 函数调用开销较大

迭代版本：
✓ 没有栈溢出风险
✓ 性能更好
✗ 代码稍复杂，需要手动管理栈
```

**评分要点：**
- 递归版本正确 10 分
  - 基准情况 2 分
  - 递归调用 4 分
  - visited 处理 2 分
  - 返回值 2 分
- 迭代版本正确 10 分
  - 栈操作 4 分
  - visited 处理 2 分
  - 邻居处理 2 分
  - 返回值 2 分
- 能通过测试 5 分

---

### 题目 6：BFS 应用题（15 分）

**参考答案：**

```javascript
/**
 * 问题 1：找到从 start 到 target 的最短路径（无权图）
 */
function bfsShortestPath(graph, start, target) {
    const visited = new Set();
    const queue = [[start]];  // 队列中存储路径
    
    while (queue.length > 0) {
        const path = queue.shift();
        const node = path[path.length - 1];
        
        // 找到目标
        if (node === target) {
            return path;
        }
        
        if (visited.has(node)) {
            continue;
        }
        
        visited.add(node);
        
        // 扩展路径
        for (const neighbor of graph[node] || []) {
            if (!visited.has(neighbor)) {
                const newPath = [...path, neighbor];
                queue.push(newPath);
            }
        }
    }
    
    return [];  // 没找到
}

/**
 * 问题 2：计算从 start 到所有其他节点的距离
 */
function bfsDistances(graph, start) {
    const visited = new Set();
    const queue = [[start, 0]];  // [节点，距离]
    const distances = {};
    
    while (queue.length > 0) {
        const [node, dist] = queue.shift();
        
        if (visited.has(node)) {
            continue;
        }
        
        visited.add(node);
        distances[node] = dist;
        
        for (const neighbor of graph[node] || []) {
            if (!visited.has(neighbor)) {
                queue.push([neighbor, dist + 1]);
            }
        }
    }
    
    return distances;
}

// 测试
const graph3 = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
};

console.log('最短路径 A->F:', bfsShortestPath(graph3, 'A', 'F'));
// 可能输出：['A', 'C', 'F'] 或 ['A', 'B', 'E', 'F']

console.log('距离:', bfsDistances(graph3, 'A'));
// 输出：{A: 0, B: 1, C: 1, D: 2, E: 2, F: 2} ✓
```

**解题思路：**

**问题 1（最短路径）：**
```
关键技巧：
- 队列中不存储单个节点，而是存储路径
- 每次出队的是完整路径
- 第一次到达 target 的路径就是最短路径

为什么 BFS 能找到最短路径：
- BFS 按层遍历
- 先到达的一定是距离最短的
- 所以第一次遇到 target 时的路径就是最短路径
```

**问题 2（计算距离）：**
```
关键技巧：
- 队列中存储 [节点，距离] 对
- 每次扩展时距离 +1
- 用字典记录每个节点的距离

为什么这样是对的：
- BFS 保证按距离递增的顺序访问
- 第一次访问某个节点时的距离就是最短距离
```

**评分要点：**
- 最短路径正确 8 分
- 距离计算正确 7 分

---

## 三、理解应用题答案

### 题目 7：实际应用场景（10 分）

**参考答案：**

**BFS 的应用场景：**（5 分）

**1. 地图导航（最短路径）**（2.5 分）
```
在无权图中找两点间的最短路径。
例如：社交网络中两个人的最短关系链。
```

**2. 网络爬虫**（2.5 分）
```
从一个网页开始，先抓取所有链接的页面，
再抓取这些页面的链接，层层扩展。
```

**DFS 的应用场景：**（5 分）

**1. 迷宫求解**（2.5 分）
```
从入口开始，沿着一条路一直走，
走不通就 backtrack，尝试另一条路。
```

**2. 拓扑排序**（2.5 分）
```
在有向无环图中确定任务的执行顺序。
例如：课程选修的先后顺序。
```

**为什么选择这种算法：**（额外加分）
```
BFS 优点：
- 能保证找到最短路径（无权图）
- 不会陷入死胡同

DFS 优点：
- 空间效率可能更高
- 能枚举所有可能的路径
- 实现简单（递归）
```

**评分要点：**
- BFS 场景 5 分（至少 2 个）
- DFS 场景 5 分（至少 2 个）

---

### 题目 8：算法对比总结（10 分）

**参考答案：**

**对比维度：**

**1. 遍历策略：**（1 分）
```
BFS: 层层推进，先近后远
DFS: 一条路走到底，不撞南墙不回头
```

**2. 数据结构：**（1 分）
```
BFS: 队列（FIFO）
DFS: 栈（LIFO）或递归
```

**3. 时间复杂度：**（1 分）
```
BFS: O(V + E)
DFS: O(V + E)
```

**4. 空间复杂度：**（1 分）
```
BFS: O(V) - 队列可能存储整层节点
DFS: O(V) - 栈深度可能是图的深度
```

**5. 适用场景：**（2 分）
```
BFS 适合：
- 找最短路径（无权图）
- 层次遍历
- 连通分量

DFS 适合：
- 探索所有可能性
- 拓扑排序
- 强连通分量
- 回溯问题
```

**6. 优缺点：**（4 分）

**BFS 优点：**（1 分）
```
✓ 能找到最短路径
✓ 不会陷入死循环（有 visited）
✓ 适合找最近的目标
```

**BFS 缺点：**（1 分）
```
✗ 空间消耗可能很大
✗ 不能利用路径信息
✗ 实现相对复杂（需要队列）
```

**DFS 优点：**（1 分）
```
✓ 空间效率可能更高
✓ 实现简单（递归）
✓ 能枚举所有解
```

**DFS 缺点：**（1 分）
```
✗ 不能保证找到最优解
✗ 可能陷入死胡同
✗ 递归过深会栈溢出
```

**总结：**（额外加分）
```
BFS 和 DFS 各有优劣，没有绝对的好坏。
选择哪个取决于具体问题：
- 要找最短路径 → BFS
- 要枚举所有可能 → DFS
- 图很宽 → DFS
- 图很深 → BFS
```

**评分要点：**
- 每个维度按分值给分
- 总结合理额外加分

---

## 四、费曼输出答案

### 题目 9：小老师时间（10 分）

**参考模板：**

```
大家好，今天我要讲的是"BFS 和 DFS 的区别"。

你们可能会问，这两种搜索方法有什么不同呢？

其实啊，BFS 就像往水里扔石头。
石头落水的地方是起点，
水波纹一圈一圈地向外扩散。
先湿的是最近的地方，
后湿的是较远的地方。
这样就能知道每个地方离起点有多远。

而 DFS 就像走迷宫。
你从入口进去，选一条路一直走，
走到死胡同了，退回到上一个路口，
换一条路继续走。
这样能把迷宫的每条路都试一遍。

举个例子：
你要在一个大商场里找一家店。

用 BFS 的方法：
你先找同一层的所有店铺，
找完了再找上一层或下一层。
这样能保证你走的路线最短。

用 DFS 的方法：
你顺着一条走廊一直走到底，
找不到就回头，换另一条走廊。
这样能把整个商场都逛遍。

所以，它们的区别就是：
BFS 是一层一层地找，适合找最近的；
DFS 是一条路走到底，适合全部探索。

谢谢大家！
```

**评分要点：**
- 不用专业术语（3 分）
- 用了生活例子（水波纹、走迷宫、逛商场）（3 分）
- 逻辑清晰（2 分）
- 容易听懂（2 分）

**加分项：**
- 对比鲜明（+2 分）
- 解释了各自优势（+2 分）
- 表达生动（+2 分）

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
- 🌟🌟🌟 100-125 分：优秀！你对 BFS 和 DFS 有了很好的理解
- 🌟🌟 80-99 分：良好！基本概念掌握了
- 🌟 60-79 分：合格！还需要多加练习
- 💪 60 分以下：需要重新学习

---

**🎉 完成答案订正后，记得给自己一个奖励！**

**明天学习动态规划入门，加油！** ✨
