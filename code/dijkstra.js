/**
 * =====================================================
 * Dijkstra 最短路径算法
 * =====================================================
 * 
 * 【什么是Dijkstra算法？】
 * Dijkstra算法用于求解**单源最短路径**问题，
 * 即从一个起点到其他所有节点的最短距离。
 * 
 * 【核心思想】
 * 贪心策略：
 * 1. 维护一个"已确定最短路径的节点集合"
 * 2. 每次从"未确定节点"中选出距离起点最近的节点
 * 3. 用这个节点更新其他节点的距离
 * 4. 重复直到所有节点都确定
 * 
 * 【类比】
 * 想象你在一个城市，想找从A地到所有地方的最短路线：
 * 1. 先去最近的B地
 * 2. 从B地出发，看看能不能找到更近的路线到其他地
 * 3. 再去第二近的C地
 * 4. 重复...
 * 
 * 【时间复杂度】
 * - 朴素实现：O(V²)，V是节点数
 * - 堆优化：O((V+E)log V)，E是边数
 * 
 * 【空间复杂度】
 * - O(V + E)
 * 
 * 【限制】
 * ⚠️ **不能有负权边！**（负权边要用Bellman-Ford算法）
 * 
 * 【应用场景】
 * - 地图导航（高德、百度地图）
 * - 网络路由（OSPF协议）
 * - 社交网络（六度空间）
 * - 游戏AI寻路
 */

// 优先队列（最小堆）
class PriorityQueue {
    constructor() {
        this.heap = [];
    }

    push(item, priority) {
        this.heap.push({ item, priority });
        this._siftUp(this.heap.length - 1);
    }

    pop() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this._siftDown(0);
        return min;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    _siftUp(index) {
        let current = index;
        while (current > 0) {
            const parent = Math.floor((current - 1) / 2);
            if (this.heap[current].priority < this.heap[parent].priority) {
                [this.heap[current], this.heap[parent]] = 
                [this.heap[parent], this.heap[current]];
                current = parent;
            } else break;
        }
    }

    _siftDown(index) {
        let current = index;
        const size = this.heap.length;
        while (true) {
            const left = 2 * current + 1;
            const right = 2 * current + 2;
            let smallest = current;

            if (left < size && this.heap[left].priority < this.heap[smallest].priority) {
                smallest = left;
            }
            if (right < size && this.heap[right].priority < this.heap[smallest].priority) {
                smallest = right;
            }

            if (smallest === current) break;

            [this.heap[current], this.heap[smallest]] = 
            [this.heap[smallest], this.heap[current]];
            current = smallest;
        }
    }
}

/**
 * Dijkstra算法（堆优化版）
 * @param {Object} graph - 邻接表表示的图
 * @param {string|number} start - 起点
 * @returns {Object} {distances, predecessors}
 */
function dijkstra(graph, start) {
    // 初始化距离数组（无穷大）
    const distances = {};
    const predecessors = {};
    const visited = new Set();

    // 初始化所有节点距离为无穷大
    for (let node in graph) {
        distances[node] = Infinity;
        predecessors[node] = null;
    }

    // 起点距离为0
    distances[start] = 0;

    // 优先队列：存储{node, distance}
    const pq = new PriorityQueue();
    pq.push(start, 0);

    while (!pq.isEmpty()) {
        // 取出距离最小的节点
        const { item: current } = pq.pop();

        // 如果已访问过，跳过
        if (visited.has(current)) continue;
        visited.add(current);

        // 遍历邻居
        for (let neighbor in graph[current]) {
            const weight = graph[current][neighbor];
            const newDistance = distances[current] + weight;

            // 如果找到更短的路径，更新
            if (newDistance < distances[neighbor]) {
                distances[neighbor] = newDistance;
                predecessors[neighbor] = current;
                pq.push(neighbor, newDistance);
            }
        }
    }

    return { distances, predecessors };
}

/**
 * 重建最短路径
 * @param {Object} predecessors - 前驱节点
 * @param {string|number} start - 起点
 * @param {string|number} end - 终点
 * @returns {Array} 路径
 */
function getPath(predecessors, start, end) {
    const path = [];
    let current = end;

    while (current !== null) {
        path.unshift(current);
        current = predecessors[current];
    }

    // 如果路径不以起点开始，说明不可达
    if (path[0] !== start) {
        return [];
    }

    return path;
}

// ========== 使用示例 ==========

console.log('=== Dijkstra最短路径算法 ===\n');

// 构建图（邻接表）
const graph = {
    'A': { 'B': 4, 'C': 2 },
    'B': { 'C': 1, 'D': 5 },
    'C': { 'D': 8, 'E': 10 },
    'D': { 'E': 2 },
    'E': {}
};

console.log('图结构：');
console.log('A --4--> B --5--> D --2--> E');
console.log(' |        |                 ^');
console.log(' 2        1                 |');
console.log(' v        v                 |');
console.log('C --10-> E <--8-------------+');
console.log();

// 计算从A到其他所有节点的最短路径
const startNode = 'A';
const { distances, predecessors } = dijkstra(graph, startNode);

console.log(`从 ${startNode} 出发的最短路径：`);
for (let node in distances) {
    if (node !== startNode) {
        const path = getPath(predecessors, startNode, node);
        console.log(`  ${startNode} -> ${node}: 距离=${distances[node]}, 路径=${path.join(' -> ')}`);
    }
}

// ========== 实际场景：地图导航 ==========

console.log('\n=== 实际场景：城市间最短距离 ===\n');

const cities = {
    '北京': { '上海': 1200, '广州': 2000, '成都': 1500 },
    '上海': { '广州': 1300, '武汉': 800 },
    '广州': { '成都': 1200 },
    '成都': { '武汉': 1000 },
    '武汉': {}
};

console.log('城市距离图：');
console.log('北京 --1200--> 上海 --800--> 武汉');
console.log(' |             |              ^');
console.log(' 2000          1300           |');
console.log(' v             v              |');
console.log('广州 <--1200-- 成都 --1000----+');
console.log();

const result = dijkstra(cities, '北京');

console.log('从北京到各城市的最短距离：');
for (let city in result.distances) {
    if (city !== '北京') {
        const path = getPath(result.predecessors, '北京', city);
        console.log(`  北京 -> ${city}: ${result.distances[city]}km, 路线=${path.join(' -> ')}`);
    }
}

// ========== 性能测试 ==========

console.log('\n=== 性能测试：大规模图 ===\n');

// 生成大型图（1000个节点）
const largeGraph = {};
const numNodes = 1000;

for (let i = 0; i < numNodes; i++) {
    largeGraph[i] = {};
    // 每个节点连接3-5个邻居
    const numEdges = Math.floor(Math.random() * 3) + 3;
    for (let j = 0; j < numEdges; j++) {
        const neighbor = Math.floor(Math.random() * numNodes);
        if (neighbor !== i) {
            largeGraph[i][neighbor] = Math.floor(Math.random() * 100) + 1;
        }
    }
}

console.log(`图规模：${numNodes}个节点`);
const startTime = Date.now();
const largeResult = dijkstra(largeGraph, 0);
const endTime = Date.now();

console.log(`计算耗时：${endTime - startTime}ms`);
console.log(`找到最短路径的节点数：${Object.values(largeResult.distances).filter(d => d !== Infinity).length}`);
