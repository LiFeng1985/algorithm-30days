/**
 * =====================================================
 * 拓扑排序（Topological Sort）
 * =====================================================
 * 
 * 【什么是拓扑排序？】
 * 拓扑排序是对有向无环图（DAG）的顶点进行排序，使得：
 * 对于每一条有向边(u, v)，u在排序中都出现在v之前。
 * 
 * 【通俗理解】
 * 就像大学的课程依赖关系：
 * - 必须先学"高等数学"才能学"线性代数"
 * - 必须先学"线性代数"才能学"机器学习"
 * 
 * 拓扑排序就是找出一个合法的学习顺序。
 * 
 * 【核心算法】
 * Kahn算法（基于入度）：
 * 1. 统计所有节点的入度
 * 2. 将入度为0的节点加入队列
 * 3. 依次取出队列中的节点，删除其所有出边
 * 4. 如果有节点入度变为0，加入队列
 * 5. 重复直到队列为空
 * 
 * 【时间复杂度】
 * - O(V + E)，V是节点数，E是边数
 * 
 * 【空间复杂度】
 * - O(V + E)
 * 
 * 【应用场景】
 * - 任务调度（Jenkins、Makefile）
 * - 课程安排（LeetCode 207/210题）
 * - 依赖关系解析（npm install）
 * - 编译顺序（C++头文件依赖）
 * - 数据流水线（Airflow）
 * 
 * 【检测环】
 * 如果拓扑排序完成后，排序的节点数 < 总节点数，说明有环！
 */

class TopologicalSort {
    /**
     * 初始化
     * @param {number} numCourses - 节点数量
     */
    constructor(numCourses) {
        this.numCourses = numCourses;
        this.adjacencyList = Array.from({ length: numCourses }, () => []);
        this.inDegree = new Array(numCourses).fill(0);
    }

    /**
     * 添加有向边（u -> v）
     * @param {number} u - 起点
     * @param {number} v - 终点
     */
    addEdge(u, v) {
        this.adjacencyList[u].push(v);
        this.inDegree[v]++;
    }

    /**
     * Kahn算法：基于入度的拓扑排序
     * @returns {Array|null} 拓扑排序结果，有环返回null
     */
    kahnAlgorithm() {
        const queue = [];
        const result = [];

        // 1. 将所有入度为0的节点加入队列
        for (let i = 0; i < this.numCourses; i++) {
            if (this.inDegree[i] === 0) {
                queue.push(i);
            }
        }

        // 2. BFS处理
        while (queue.length > 0) {
            const course = queue.shift();
            result.push(course);

            // 遍历邻居
            for (let neighbor of this.adjacencyList[course]) {
                this.inDegree[neighbor]--;
                
                // 入度为0，加入队列
                if (this.inDegree[neighbor] === 0) {
                    queue.push(neighbor);
                }
            }
        }

        // 3. 检测环
        if (result.length !== this.numCourses) {
            return null; // 有环
        }

        return result;
    }

    /**
     * DFS算法：基于深度优先搜索的拓扑排序
     * @returns {Array|null} 拓扑排序结果，有环返回null
     */
    dfsAlgorithm() {
        const visited = new Array(this.numCourses).fill(0); // 0:未访问, 1:访问中, 2:已完成
        const result = [];

        const dfs = (node) => {
            // 标记为访问中
            visited[node] = 1;

            // 遍历邻居
            for (let neighbor of this.adjacencyList[node]) {
                if (visited[neighbor] === 1) {
                    return false; // 发现环
                }
                if (visited[neighbor] === 0) {
                    if (!dfs(neighbor)) {
                        return false;
                    }
                }
            }

            // 标记为已完成
            visited[node] = 2;
            result.unshift(node); // 逆序加入
            return true;
        };

        // 对所有未访问的节点执行DFS
        for (let i = 0; i < this.numCourses; i++) {
            if (visited[i] === 0) {
                if (!dfs(i)) {
                    return null; // 有环
                }
            }
        }

        return result;
    }
}

// ========== 使用示例：课程安排 ==========

console.log('=== 课程安排问题 ===\n');

// 场景：4门课程，依赖关系如下
// 课程0 -> 课程1（学完0才能学1）
// 课程0 -> 课程2
// 课程1 -> 课程3
// 课程2 -> 课程3

const topo1 = new TopologicalSort(4);
topo1.addEdge(0, 1);
topo1.addEdge(0, 2);
topo1.addEdge(1, 3);
topo1.addEdge(2, 3);

console.log('课程依赖图：');
console.log('  0 -> 1 -> 3');
console.log('  0 -> 2 -> 3');
console.log();

const order1 = topo1.kahnAlgorithm();
console.log('Kahn算法结果：', order1);
console.log('推荐学习顺序：');
order1.forEach((course, index) => {
    console.log(`  第${index + 1}步：学习课程${course}`);
});

// ========== 使用示例：检测环 ==========

console.log('\n=== 检测环 ===\n');

// 场景：有环的依赖关系
// 0 -> 1 -> 2 -> 0（环！）

const topo2 = new TopologicalSort(3);
topo2.addEdge(0, 1);
topo2.addEdge(1, 2);
topo2.addEdge(2, 0); // 形成环

console.log('依赖图：0 -> 1 -> 2 -> 0（有环）');
const order2 = topo2.kahnAlgorithm();
console.log('拓扑排序结果：', order2); // null

if (order2 === null) {
    console.log('检测到环！无法完成所有课程。');
}

// ========== 实际场景：任务调度 ==========

console.log('\n=== 任务调度：构建系统 ===\n');

// 场景：构建一个项目，有6个模块
// A -> B -> D
// A -> C -> D
// D -> E
// C -> F -> E

const tasks = ['A(基础库)', 'B(网络层)', 'C(数据层)', 'D(业务层)', 'E(展示层)', 'F(缓存层)'];
const topo3 = new TopologicalSort(6);

// 添加依赖关系
topo3.addEdge(0, 1); // A -> B
topo3.addEdge(0, 2); // A -> C
topo3.addEdge(1, 3); // B -> D
topo3.addEdge(2, 3); // C -> D
topo3.addEdge(3, 4); // D -> E
topo3.addEdge(2, 5); // C -> F
topo3.addEdge(5, 4); // F -> E

console.log('构建依赖图：');
console.log('  A(基础库) -> B(网络层) -> D(业务层) -> E(展示层)');
console.log('       \\                           ^');
console.log('        -> C(数据层) -> F(缓存层) --+');
console.log('                        \\         /');
console.log('                         -> D(业务层)');
console.log();

const buildOrder = topo3.kahnAlgorithm();
console.log('推荐构建顺序：');
buildOrder.forEach((task, index) => {
    console.log(`  第${index + 1}步：构建${tasks[task]}`);
});

// ========== 实际场景：npm依赖解析 ==========

console.log('\n=== 实际场景：npm依赖解析 ===\n');

const packages = ['react', 'react-dom', 'scheduler', 'object-assign', 'loose-envify'];
const packageMap = {};
packages.forEach((pkg, idx) => packageMap[pkg] = idx);

const topo4 = new TopologicalSort(5);

// React依赖关系（简化版）
topo4.addEdge(packageMap['scheduler'], packageMap['react']);
topo4.addEdge(packageMap['object-assign'], packageMap['react']);
topo4.addEdge(packageMap['loose-envify'], packageMap['react']);
topo4.addEdge(packageMap['react'], packageMap['react-dom']);

console.log('npm依赖图：');
console.log('  scheduler -----> react -----> react-dom');
console.log('  object-assign --/');
console.log('  loose-envify ---/');
console.log();

const installOrder = topo4.kahnAlgorithm();
console.log('npm安装顺序：');
installOrder.forEach((pkgIdx, index) => {
    console.log(`  第${index + 1}个：${packages[pkgIdx]}`);
});

// ========== 性能测试 ==========

console.log('\n=== 性能测试：大规模任务调度 ===\n');

const numTasks = 10000;
const topo5 = new TopologicalSort(numTasks);

// 生成随机依赖关系
for (let i = 0; i < numTasks; i++) {
    // 每个任务依赖1-3个前置任务
    const numDeps = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numDeps; j++) {
        const dep = Math.floor(Math.random() * i); // 只能依赖前面的任务（避免环）
        if (dep !== i) {
            topo5.addEdge(dep, i);
        }
    }
}

console.log(`任务数量：${numTasks}`);
const startTime = Date.now();
const order5 = topo5.kahnAlgorithm();
const endTime = Date.now();

console.log(`排序耗时：${endTime - startTime}ms`);
console.log(`排序结果：${order5 ? '成功' : '失败（有环）'}`);
console.log(`排序长度：${order5 ? order5.length : 0}`);
