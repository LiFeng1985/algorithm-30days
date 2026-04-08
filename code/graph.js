/**
 * 图 - Graph
 * 
 * 什么是图？
 * 图是由顶点（Vertex）和边（Edge）组成的数据结构
 * 用于表示对象之间的关系
 * 
 * 图的类型：
 * 1. 有向图：边有方向（如单向街道）
 * 2. 无向图：边没有方向（如双向街道）
 * 3. 加权图：边有权重（如距离、成本）
 * 4. 无权图：边没有权重
 * 
 * 图的表示方法：
 * 1. 邻接矩阵：二维数组，适合稠密图
 * 2. 邻接表：数组+链表，适合稀疏图
 * 
 * 核心算法：
 * 1. BFS（广度优先搜索）- 用队列实现
 * 2. DFS（深度优先搜索）- 用递归或栈实现
 * 3. Dijkstra算法 - 最短路径
 * 4. 拓扑排序 - 有向无环图
 * 
 * 应用场景：
 * - 社交网络（好友关系）
 * - 地图导航（最短路径）
 * - 网页链接（PageRank）
 * - 任务调度（依赖关系）
 * - 推荐系统
 */

/**
 * 图类 - 使用邻接表实现
 */
class Graph {
    /**
     * 构造函数
     * @param {boolean} isDirected - 是否是有向图
     */
    constructor(isDirected = false) {
        this.adjacencyList = new Map(); // 邻接表
        this.isDirected = isDirected;   // 是否有向
        this.vertices = 0;              // 顶点数量
        this.edges = 0;                 // 边数量
    }
    
    /**
     * 添加顶点
     * 时间复杂度：O(1)
     * @param {*} vertex - 顶点
     */
    addVertex(vertex) {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
            this.vertices++;
        }
    }
    
    /**
     * 添加边
     * 时间复杂度：O(1)
     * @param {*} from - 起点
     * @param {*} to - 终点
     * @param {number} weight - 权重（可选）
     */
    addEdge(from, to, weight = 1) {
        // 确保顶点存在
        this.addVertex(from);
        this.addVertex(to);
        
        // 添加边
        this.adjacencyList.get(from).push({ vertex: to, weight });
        
        // 如果是无向图，还要添加反向边
        if (!this.isDirected) {
            this.adjacencyList.get(to).push({ vertex: from, weight });
        }
        
        this.edges++;
    }
    
    /**
     * 删除顶点
     * 时间复杂度：O(V + E)
     * @param {*} vertex - 要删除的顶点
     */
    removeVertex(vertex) {
        if (!this.adjacencyList.has(vertex)) {
            return;
        }
        
        // 删除与该顶点相关的所有边
        for (let [v, neighbors] of this.adjacencyList) {
            this.adjacencyList.set(
                v,
                neighbors.filter(n => n.vertex !== vertex)
            );
        }
        
        // 删除顶点
        this.adjacencyList.delete(vertex);
        this.vertices--;
    }
    
    /**
     * 删除边
     * 时间复杂度：O(E)
     * @param {*} from - 起点
     * @param {*} to - 终点
     */
    removeEdge(from, to) {
        if (!this.adjacencyList.has(from)) {
            return;
        }
        
        const neighbors = this.adjacencyList.get(from);
        const index = neighbors.findIndex(n => n.vertex === to);
        
        if (index !== -1) {
            neighbors.splice(index, 1);
            this.edges--;
            
            // 如果是无向图，还要删除反向边
            if (!this.isDirected && this.adjacencyList.has(to)) {
                const toNeighbors = this.adjacencyList.get(to);
                const toIndex = toNeighbors.findIndex(n => n.vertex === from);
                if (toIndex !== -1) {
                    toNeighbors.splice(toIndex, 1);
                }
            }
        }
    }
    
    /**
     * 获取顶点的邻居
     * @param {*} vertex - 顶点
     * @returns {Array} - 邻居列表
     */
    getNeighbors(vertex) {
        return this.adjacencyList.get(vertex) || [];
    }
    
    /**
     * 获取所有顶点
     * @returns {Array}
     */
    getVertices() {
        return Array.from(this.adjacencyList.keys());
    }
    
    /**
     * 获取顶点数量
     * @returns {number}
     */
    getVertexCount() {
        return this.vertices;
    }
    
    /**
     * 获取边数量
     * @returns {number}
     */
    getEdgeCount() {
        return this.edges;
    }
    
    /**
     * 判断两个顶点之间是否有边
     * @param {*} from - 起点
     * @param {*} to - 终点
     * @returns {boolean}
     */
    hasEdge(from, to) {
        const neighbors = this.adjacencyList.get(from);
        if (!neighbors) {
            return false;
        }
        return neighbors.some(n => n.vertex === to);
    }
    
    /**
     * 打印图
     */
    print() {
        console.log(`图类型: ${this.isDirected ? '有向图' : '无向图'}`);
        console.log(`顶点数: ${this.vertices}, 边数: ${this.edges}\n`);
        
        for (let [vertex, neighbors] of this.adjacencyList) {
            const neighborStr = neighbors
                .map(n => `${n.vertex}${n.weight !== 1 ? `(权重:${n.weight})` : ''}`)
                .join(', ');
            console.log(`${vertex} -> [${neighborStr}]`);
        }
    }
}

/**
 * BFS - 广度优先搜索
 * 
 * 思路：
 * 1. 从起始顶点开始，放入队列
 * 2. 取出队首顶点，访问它
 * 3. 把它的所有未访问邻居放入队列
 * 4. 重复直到队列为空
 * 
 * 应用：
 * - 最短路径（无权图）
 * - 连通分量
 * - 层序遍历
 * 
 * 时间复杂度：O(V + E)
 * 空间复杂度：O(V)
 * 
 * @param {Graph} graph - 图
 * @param {*} startVertex - 起始顶点
 * @param {Function} callback - 访问回调
 */
function bfs(graph, startVertex, callback) {
    const visited = new Set();
    const queue = [startVertex];
    visited.add(startVertex);
    
    while (queue.length > 0) {
        const vertex = queue.shift();
        callback(vertex);
        
        const neighbors = graph.getNeighbors(vertex);
        for (let neighbor of neighbors) {
            if (!visited.has(neighbor.vertex)) {
                visited.add(neighbor.vertex);
                queue.push(neighbor.vertex);
            }
        }
    }
}

/**
 * DFS - 深度优先搜索（递归版）
 * 
 * 思路：
 * 1. 从起始顶点开始，访问它
 * 2. 递归访问它的每个未访问邻居
 * 
 * 应用：
 * - 路径查找
 * - 环检测
 * - 拓扑排序
 * 
 * 时间复杂度：O(V + E)
 * 空间复杂度：O(V) - 递归栈
 * 
 * @param {Graph} graph - 图
 * @param {*} vertex - 当前顶点
 * @param {Set} visited - 已访问集合
 * @param {Function} callback - 访问回调
 */
function dfs(graph, vertex, visited = new Set(), callback) {
    visited.add(vertex);
    callback(vertex);
    
    const neighbors = graph.getNeighbors(vertex);
    for (let neighbor of neighbors) {
        if (!visited.has(neighbor.vertex)) {
            dfs(graph, neighbor.vertex, visited, callback);
        }
    }
}

/**
 * DFS - 深度优先搜索（迭代版，使用栈）
 * 
 * @param {Graph} graph - 图
 * @param {*} startVertex - 起始顶点
 * @param {Function} callback - 访问回调
 */
function dfsIterative(graph, startVertex, callback) {
    const visited = new Set();
    const stack = [startVertex];
    
    while (stack.length > 0) {
        const vertex = stack.pop();
        
        if (!visited.has(vertex)) {
            visited.add(vertex);
            callback(vertex);
            
            const neighbors = graph.getNeighbors(vertex);
            // 逆序入栈，保证访问顺序
            for (let i = neighbors.length - 1; i >= 0; i--) {
                if (!visited.has(neighbors[i].vertex)) {
                    stack.push(neighbors[i].vertex);
                }
            }
        }
    }
}

/**
 * Dijkstra算法 - 最短路径
 * 
 * 思路：
 * 1. 初始化所有顶点的距离为无穷大，起始点为0
 * 2. 每次选择距离最小的未访问顶点
 * 3. 更新它的邻居的距离
 * 4. 重复直到所有顶点都访问过
 * 
 * 时间复杂度：O(V²) 或使用优先队列 O((V+E)logV)
 * 空间复杂度：O(V)
 * 
 * @param {Graph} graph - 加权图
 * @param {*} startVertex - 起始顶点
 * @returns {Object} - 最短距离和前驱节点
 */
function dijkstra(graph, startVertex) {
    const distances = {};
    const previous = {};
    const vertices = graph.getVertices();
    
    // 初始化
    for (let vertex of vertices) {
        distances[vertex] = Infinity;
        previous[vertex] = null;
    }
    distances[startVertex] = 0;
    
    const unvisited = new Set(vertices);
    
    while (unvisited.size > 0) {
        // 找到距离最小的未访问顶点
        let currentVertex = null;
        let minDistance = Infinity;
        
        for (let vertex of unvisited) {
            if (distances[vertex] < minDistance) {
                minDistance = distances[vertex];
                currentVertex = vertex;
            }
        }
        
        if (currentVertex === null || minDistance === Infinity) {
            break; // 剩余的顶点不可达
        }
        
        unvisited.delete(currentVertex);
        
        // 更新邻居的距离
        const neighbors = graph.getNeighbors(currentVertex);
        for (let neighbor of neighbors) {
            const alt = distances[currentVertex] + neighbor.weight;
            
            if (alt < distances[neighbor.vertex]) {
                distances[neighbor.vertex] = alt;
                previous[neighbor.vertex] = currentVertex;
            }
        }
    }
    
    return { distances, previous };
}

/**
 * 重建最短路径
 * 
 * @param {Object} previous - 前驱节点映射
 * @param {*} startVertex - 起始顶点
 * @param {*} endVertex - 终止顶点
 * @returns {Array} - 路径上的顶点列表
 */
function reconstructPath(previous, startVertex, endVertex) {
    const path = [];
    let current = endVertex;
    
    while (current !== null) {
        path.unshift(current);
        current = previous[current];
    }
    
    // 如果路径不包含起始点，说明不可达
    if (path[0] !== startVertex) {
        return [];
    }
    
    return path;
}

/**
 * 拓扑排序 - 有向无环图（DAG）
 * 
 * 思路（Kahn算法）：
 * 1. 计算每个顶点的入度
 * 2. 把入度为0的顶点加入队列
 * 3. 取出队首顶点，加入结果
 * 4. 减少它邻居的入度，如果变为0就加入队列
 * 5. 重复直到队列为空
 * 
 * 应用：
 * - 课程安排
 * - 任务调度
 * - 编译顺序
 * 
 * @param {Graph} graph - 有向图
 * @returns {Array} - 拓扑排序结果
 */
function topologicalSort(graph) {
    const inDegree = new Map();
    const vertices = graph.getVertices();
    
    // 初始化入度
    for (let vertex of vertices) {
        inDegree.set(vertex, 0);
    }
    
    // 计算入度
    for (let vertex of vertices) {
        const neighbors = graph.getNeighbors(vertex);
        for (let neighbor of neighbors) {
            inDegree.set(neighbor.vertex, inDegree.get(neighbor.vertex) + 1);
        }
    }
    
    // 把入度为0的顶点加入队列
    const queue = [];
    for (let [vertex, degree] of inDegree) {
        if (degree === 0) {
            queue.push(vertex);
        }
    }
    
    const result = [];
    
    while (queue.length > 0) {
        const vertex = queue.shift();
        result.push(vertex);
        
        const neighbors = graph.getNeighbors(vertex);
        for (let neighbor of neighbors) {
            inDegree.set(neighbor.vertex, inDegree.get(neighbor.vertex) - 1);
            if (inDegree.get(neighbor.vertex) === 0) {
                queue.push(neighbor.vertex);
            }
        }
    }
    
    // 如果结果不包含所有顶点，说明有环
    if (result.length !== vertices.length) {
        console.warn('图中存在环，无法进行拓扑排序');
        return [];
    }
    
    return result;
}

// ==================== 测试代码 ====================

console.log('===== 无向图测试 =====\n');

const undirectedGraph = new Graph(false);
undirectedGraph.addEdge('A', 'B');
undirectedGraph.addEdge('A', 'C');
undirectedGraph.addEdge('B', 'D');
undirectedGraph.addEdge('C', 'D');
undirectedGraph.addEdge('D', 'E');
undirectedGraph.print();
console.log();

console.log('===== 有向图测试 =====\n');

const directedGraph = new Graph(true);
directedGraph.addEdge('A', 'B');
directedGraph.addEdge('A', 'C');
directedGraph.addEdge('B', 'D');
directedGraph.addEdge('C', 'D');
directedGraph.addEdge('D', 'E');
directedGraph.print();
console.log();

console.log('===== BFS 测试 =====\n');

console.log('BFS遍历（从A开始）:');
const bfsResult = [];
bfs(undirectedGraph, 'A', vertex => {
    bfsResult.push(vertex);
    process.stdout.write(vertex + ' ');
});
console.log('\n结果:', bfsResult);
console.log();

console.log('===== DFS 测试 =====\n');

console.log('DFS遍历（递归，从A开始）:');
const dfsResult = [];
dfs(undirectedGraph, 'A', new Set(), vertex => {
    dfsResult.push(vertex);
    process.stdout.write(vertex + ' ');
});
console.log('\n结果:', dfsResult);
console.log();

console.log('DFS遍历（迭代，从A开始）:');
const dfsIterResult = [];
dfsIterative(undirectedGraph, 'A', vertex => {
    dfsIterResult.push(vertex);
    process.stdout.write(vertex + ' ');
});
console.log('\n结果:', dfsIterResult);
console.log();

console.log('===== Dijkstra 最短路径测试 =====\n');

const weightedGraph = new Graph(false);
weightedGraph.addEdge('A', 'B', 4);
weightedGraph.addEdge('A', 'C', 2);
weightedGraph.addEdge('B', 'C', 1);
weightedGraph.addEdge('B', 'D', 5);
weightedGraph.addEdge('C', 'D', 8);
weightedGraph.addEdge('C', 'E', 10);
weightedGraph.addEdge('D', 'E', 2);
weightedGraph.addEdge('D', 'F', 6);
weightedGraph.addEdge('E', 'F', 3);

console.log('加权图:');
weightedGraph.print();
console.log();

const { distances, previous } = dijkstra(weightedGraph, 'A');
console.log('从 A 到各顶点的最短距离:');
for (let [vertex, distance] of Object.entries(distances)) {
    console.log(`  A -> ${vertex}: ${distance}`);
}
console.log();

console.log('从 A 到 F 的最短路径:');
const path = reconstructPath(previous, 'A', 'F');
console.log('  路径:', path.join(' -> '));
console.log('  距离:', distances['F']);
console.log();

console.log('===== 拓扑排序测试 =====\n');

const dag = new Graph(true);
dag.addEdge('课程A', '课程B');
dag.addEdge('课程A', '课程C');
dag.addEdge('课程B', '课程D');
dag.addEdge('课程C', '课程D');
dag.addEdge('课程D', '课程E');

console.log('课程依赖图:');
dag.print();
console.log();

console.log('推荐学习顺序:');
const order = topologicalSort(dag);
console.log(order.join(' -> '));
console.log();

// 导出类和函数（如果在Node.js环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Graph,
        bfs,
        dfs,
        dfsIterative,
        dijkstra,
        reconstructPath,
        topologicalSort
    };
}
