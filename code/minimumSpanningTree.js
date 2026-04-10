/**
 * =====================================================
 * 最小生成树（Prim & Kruskal算法）
 * =====================================================
 * 
 * 【什么是最小生成树？】
 * 给定一个连通加权无向图，找出一棵生成树，使得所有边的权重之和最小。
 * 
 * 【生成树是什么？】
 * - 包含图中所有顶点
 * - 是一棵树（无环、连通）
 * - 有n-1条边（n是顶点数）
 * 
 * 【类比】
 * 想象要在n个城市之间修路，使得所有城市连通，但修路成本最低。
 * 这就是最小生成树问题！
 * 
 * 【两个经典算法】
 * 1. Prim算法：从一点开始，每次选最短的边扩展（类似Dijkstra）
 * 2. Kruskal算法：按边权排序，从小到大选边（用并查集检测环）
 * 
 * 【时间复杂度】
 * - Prim（朴素）：O(V²)
 * - Prim（堆优化）：O(E log V)
 * - Kruskal：O(E log E)
 * 
 * 【空间复杂度】
 * - O(V + E)
 * 
 * 【应用场景】
 * - 网络设计（电信、电力）
 * - 道路建设
 * - 电路布线
 * - 聚类分析
 */

// ========== Prim算法（堆优化版） ==========

console.log('=== Prim算法求最小生成树 ===\n');

/**
 * Prim算法
 * @param {Object} graph - 邻接表表示的图
 * @param {string|number} start - 起始节点
 * @returns {Object} {mstEdges, totalWeight}
 */
function prim(graph, start) {
    const mstEdges = [];
    const visited = new Set();
    let totalWeight = 0;

    // 优先队列：存储{to, weight, from}
    const pq = [];
    pq.push({ to: start, weight: 0, from: null });

    while (pq.length > 0) {
        // 取出权重最小的边
        pq.sort((a, b) => a.weight - b.weight);
        const { to, weight, from } = pq.shift();

        // 如果已访问，跳过
        if (visited.has(to)) continue;
        visited.add(to);

        // 加入MST（除了起始节点）
        if (from !== null) {
            mstEdges.push({ from, to, weight });
            totalWeight += weight;
        }

        // 遍历邻居
        for (let neighbor in graph[to]) {
            if (!visited.has(neighbor)) {
                pq.push({
                    to: neighbor,
                    weight: graph[to][neighbor],
                    from: to
                });
            }
        }
    }

    return { mstEdges, totalWeight };
}

// 测试Prim算法
const graph1 = {
    'A': { 'B': 4, 'C': 2, 'D': 3 },
    'B': { 'A': 4, 'C': 1, 'D': 2 },
    'C': { 'A': 2, 'B': 1, 'D': 3 },
    'D': { 'A': 3, 'B': 2, 'C': 3 }
};

console.log('图结构：');
console.log('  A --4-- B');
console.log('  | \\   / |');
console.log('  2  3 2  1');
console.log('  |   \\ /  |');
console.log('  C --3-- D');
console.log();

const primResult = prim(graph1, 'A');
console.log('最小生成树边：');
primResult.mstEdges.forEach(edge => {
    console.log(`  ${edge.from} --${edge.weight}--> ${edge.to}`);
});
console.log(`总权重: ${primResult.totalWeight}`);

// ========== Kruskal算法 ==========

console.log('\n=== Kruskal算法求最小生成树 ===\n');

/**
 * Kruskal算法
 * @param {Array} edges - 边数组 [{from, to, weight}]
 * @param {number} numVertices - 顶点数
 * @returns {Object} {mstEdges, totalWeight}
 */
function kruskal(edges, numVertices) {
    // 按权重排序
    edges.sort((a, b) => a.weight - b.weight);

    // 并查集
    const parent = Array.from({ length: numVertices }, (_, i) => i);
    const rank = new Array(numVertices).fill(0);

    function find(x) {
        if (parent[x] !== x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    function union(x, y) {
        const rootX = find(x);
        const rootY = find(y);

        if (rootX === rootY) return false;

        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }

        return true;
    }

    const mstEdges = [];
    let totalWeight = 0;

    // 遍历所有边
    for (let edge of edges) {
        // 如果两个顶点不在同一集合，加入MST
        if (union(edge.from, edge.to)) {
            mstEdges.push(edge);
            totalWeight += edge.weight;

            // 如果已经选了n-1条边，结束
            if (mstEdges.length === numVertices - 1) {
                break;
            }
        }
    }

    return { mstEdges, totalWeight };
}

// 测试Kruskal算法
const edges1 = [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 2 },
    { from: 0, to: 3, weight: 3 },
    { from: 1, to: 2, weight: 1 },
    { from: 1, to: 3, weight: 2 },
    { from: 2, to: 3, weight: 3 }
];

const vertexNames = ['A', 'B', 'C', 'D'];

console.log('边列表：');
edges1.forEach(edge => {
    console.log(`  ${vertexNames[edge.from]} --${edge.weight}--> ${vertexNames[edge.to]}`);
});
console.log();

const kruskalResult = kruskal(edges1, 4);
console.log('最小生成树边：');
kruskalResult.mstEdges.forEach(edge => {
    console.log(`  ${vertexNames[edge.from]} --${edge.weight}--> ${vertexNames[edge.to]}`);
});
console.log(`总权重: ${kruskalResult.totalWeight}`);

// ========== 实际应用：城市修路 ==========

console.log('\n=== 实际应用：城市修路 ===\n');

// 场景：5个城市，要在城市之间修路，使得所有城市连通，成本最低
const cities = ['北京', '上海', '广州', '成都', '武汉'];
const cityEdges = [
    { from: 0, to: 1, weight: 1200 }, // 北京-上海
    { from: 0, to: 2, weight: 2000 }, // 北京-广州
    { from: 0, to: 3, weight: 1500 }, // 北京-成都
    { from: 0, to: 4, weight: 1100 }, // 北京-武汉
    { from: 1, to: 2, weight: 1300 }, // 上海-广州
    { from: 1, to: 4, weight: 800 },  // 上海-武汉
    { from: 2, to: 3, weight: 1200 }, // 广州-成都
    { from: 3, to: 4, weight: 1000 }  // 成都-武汉
];

console.log('城市间修路成本（单位：万元）：');
cityEdges.forEach(edge => {
    console.log(`  ${cities[edge.from]} --${edge.weight}万--> ${cities[edge.to]}`);
});
console.log();

const roadResult = kruskal(cityEdges, 5);
console.log('最优修路方案：');
roadResult.mstEdges.forEach(edge => {
    console.log(`  修建：${cities[edge.from]} -- ${cities[edge.to]}（${edge.weight}万）`);
});
console.log(`总成本: ${roadResult.totalWeight}万`);

// ========== Prim vs Kruskal对比 ==========

console.log('\n=== 算法对比 ===\n');

console.log('Prim算法：');
console.log('  优点：适合稠密图（边多）');
console.log('  缺点：需要指定起点');
console.log('  时间复杂度：O(E log V)');
console.log();

console.log('Kruskal算法：');
console.log('  优点：适合稀疏图（边少），实现简单');
console.log('  缺点：需要对边排序');
console.log('  时间复杂度：O(E log E)');
console.log();

// ========== 性能测试 ==========

console.log('=== 性能测试：大规模图 ===\n');

const numVertices = 1000;
const randomEdges = [];

// 生成随机边
for (let i = 0; i < numVertices; i++) {
    for (let j = i + 1; j < numVertices; j++) {
        if (Math.random() < 0.01) { // 1%的概率有边
            randomEdges.push({
                from: i,
                to: j,
                weight: Math.floor(Math.random() * 100) + 1
            });
        }
    }
}

console.log(`顶点数: ${numVertices}`);
console.log(`边数: ${randomEdges.length}`);

const startTime = Date.now();
const largeResult = kruskal(randomEdges, numVertices);
const endTime = Date.now();

console.log(`Kruskal计算耗时: ${endTime - startTime}ms`);
console.log(`最小生成树边数: ${largeResult.mstEdges.length}`);
console.log(`总权重: ${largeResult.totalWeight}`);
