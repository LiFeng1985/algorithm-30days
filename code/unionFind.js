/**
 * 并查集 - Union Find / Disjoint Set Union (DSU)
 * 
 * 什么是并查集？
 * 并查集是一种树型数据结构，用于处理不相交集合的合并和查询问题
 * 
 * 核心操作：
 * 1. Find(x)：查找元素x所属的集合（根节点）
 * 2. Union(x, y)：合并x和y所在的集合
 * 
 * 优化技巧：
 * 1. 路径压缩：查找时将路径上的节点直接指向根
 * 2. 按秩合并：总是将较矮的树合并到较高的树上
 * 
 * 时间复杂度（带优化）：
 * - Find: O(α(n)) ≈ O(1)，α是反阿克曼函数
 * - Union: O(α(n)) ≈ O(1)
 * 
 * 空间复杂度：O(n)
 * 
 * 应用场景：
 * - 连通分量检测
 * - Kruskal最小生成树
 * - 朋友圈问题
 * - 岛屿数量
 * - 等价关系
 */

class UnionFind {
    /**
     * 构造函数
     * @param {number} n - 元素数量
     */
    constructor(n) {
        this.parent = new Array(n);  // 父节点数组
        this.rank = new Array(n).fill(0);  // 秩（树的高度）
        this.count = n;  // 连通分量数量
        
        // 初始化：每个元素的父节点是自己
        for (let i = 0; i < n; i++) {
            this.parent[i] = i;
        }
    }
    
    /**
     * 查找根节点（带路径压缩）
     * 
     * 路径压缩：
     * 在查找过程中，将路径上的所有节点直接连接到根节点
     * 这样下次查找会更快
     * 
     * 时间复杂度：O(α(n)) ≈ O(1)
     * 
     * @param {number} x
     * @returns {number} - 根节点
     */
    find(x) {
        if (this.parent[x] !== x) {
            // 路径压缩：递归查找并将父节点设为根
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }
    
    /**
     * 合并两个集合（按秩合并）
     * 
     * 按秩合并：
     * 总是将较矮的树合并到较高的树上
     * 这样可以保持树的平衡，避免退化
     * 
     * 时间复杂度：O(α(n)) ≈ O(1)
     * 
     * @param {number} x
     * @param {number} y
     * @returns {boolean} - 是否成功合并
     */
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        // 如果已经在同一个集合，不需要合并
        if (rootX === rootY) {
            return false;
        }
        
        // 按秩合并
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            // 秩相同，任选一个作为根，并增加秩
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }
        
        this.count--;
        return true;
    }
    
    /**
     * 判断两个元素是否在同一个集合
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    connected(x, y) {
        return this.find(x) === this.find(y);
    }
    
    /**
     * 获取连通分量数量
     * @returns {number}
     */
    getCount() {
        return this.count;
    }
    
    /**
     * 获取集合大小（需要额外维护）
     */
    getSize(x) {
        const root = this.find(x);
        let size = 0;
        for (let i = 0; i < this.parent.length; i++) {
            if (this.find(i) === root) {
                size++;
            }
        }
        return size;
    }
}

/**
 * 应用1：朋友圈问题
 * 
 * 问题：N个学生，M[i][j]=1表示i和j是朋友
 * 求有多少个朋友圈
 * 
 * @param {number[][]} M - 邻接矩阵
 * @returns {number} - 朋友圈数量
 */
function findCircleNum(M) {
    const n = M.length;
    const uf = new UnionFind(n);
    
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (M[i][j] === 1) {
                uf.union(i, j);
            }
        }
    }
    
    return uf.getCount();
}

/**
 * 应用2：岛屿数量
 * 
 * 问题：二维网格中，'1'表示陆地，'0'表示水
 * 求岛屿数量（上下左右相连的陆地算一个岛屿）
 * 
 * @param {string[][]} grid
 * @returns {number}
 */
function numIslands(grid) {
    if (!grid || grid.length === 0) {
        return 0;
    }
    
    const rows = grid.length;
    const cols = grid[0].length;
    const uf = new UnionFind(rows * cols);
    let waterCount = 0;
    
    // 方向数组：上下左右
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === '1') {
                // 与相邻的陆地合并
                for (let [dx, dy] of directions) {
                    const ni = i + dx;
                    const nj = j + dy;
                    
                    if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && grid[ni][nj] === '1') {
                        uf.union(i * cols + j, ni * cols + nj);
                    }
                }
            } else {
                waterCount++;
            }
        }
    }
    
    return uf.getCount() - waterCount;
}

/**
 * 应用3：冗余连接
 * 
 * 问题：在无向图中找到一条可以删除的边，使得图变成树
 * 
 * @param {number[][]} edges
 * @returns {number[]}
 */
function findRedundantConnection(edges) {
    const n = edges.length;
    const uf = new UnionFind(n + 1);
    
    for (let [u, v] of edges) {
        // 如果u和v已经连通，这条边就是冗余的
        if (uf.connected(u, v)) {
            return [u, v];
        }
        uf.union(u, v);
    }
    
    return [];
}

// ==================== 测试代码 ====================

console.log('===== 并查集基本操作测试 =====\n');

const uf = new UnionFind(10);
console.log('初始连通分量:', uf.getCount());

console.log('\n合并操作:');
uf.union(0, 1);
console.log('union(0, 1)');
uf.union(2, 3);
console.log('union(2, 3)');
uf.union(4, 5);
console.log('union(4, 5)');
uf.union(0, 2);
console.log('union(0, 2)');

console.log('\n连通分量:', uf.getCount());
console.log('0和3是否连通:', uf.connected(0, 3)); // true
console.log('0和4是否连通:', uf.connected(0, 4)); // false
console.log();

console.log('===== 朋友圈问题 =====\n');

const M1 = [
    [1, 1, 0],
    [1, 1, 0],
    [0, 0, 1]
];
console.log('邻接矩阵:');
M1.forEach(row => console.log('  ', row));
console.log('朋友圈数量:', findCircleNum(M1)); // 2

const M2 = [
    [1, 1, 0],
    [1, 1, 1],
    [0, 1, 1]
];
console.log('\n邻接矩阵:');
M2.forEach(row => console.log('  ', row));
console.log('朋友圈数量:', findCircleNum(M2)); // 1
console.log();

console.log('===== 岛屿数量 =====\n');

const grid1 = [
    ['1', '1', '0', '0', '0'],
    ['1', '1', '0', '0', '0'],
    ['0', '0', '1', '0', '0'],
    ['0', '0', '0', '1', '1']
];

console.log('网格:');
grid1.forEach(row => console.log('  ', row.join(' ')));
console.log('岛屿数量:', numIslands(grid1)); // 3
console.log();

console.log('===== 冗余连接 =====\n');

const edges = [[1, 2], [1, 3], [2, 3]];
console.log('边:', edges);
console.log('冗余边:', findRedundantConnection(edges)); // [2, 3]
console.log();

// 导出类和函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        UnionFind,
        findCircleNum,
        numIslands,
        findRedundantConnection
    };
}
