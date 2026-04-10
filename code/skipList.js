/**
 * =====================================================
 * 跳表（Skip List）
 * =====================================================
 * 
 * 【什么是跳表？】
 * 跳表是一种随机化的数据结构，由William Pugh在1989年发明。
 * 它通过在链表的基础上增加多层索引，实现快速查找。
 * 
 * 【核心思想】
 * "空间换时间"
 * - 底层是一个有序链表
 * - 每上一层是下一层的"快速通道"
 * - 查找时从最高层开始，快速跳过不需要的节点
 * 
 * 【类比】
 * 想象地铁线路：
 * - 第1层：每站都停（普通链表）
 * - 第2层：隔1站停（快速通道）
 * - 第3层：隔3站停（更快的通道）
 * 
 * 从A到Z，不用每站都下，直接坐快车！
 * 
 * 【时间复杂度】
 * - 查找：O(log n)
 * - 插入：O(log n)
 * - 删除：O(log n)
 * 
 * 【空间复杂度】
 * - O(n)（每个节点平均有2个指针）
 * 
 * 【vs 红黑树/AVL树】
 * 跳表的优势：
 * 1. 实现简单（不需要旋转）
 * 2. 并发友好（容易实现无锁）
 * 3. 范围查询快（链表天然支持）
 * 
 * 【应用场景】
 * - Redis的有序集合（Sorted Set）
 * - LevelDB的MemTable
 * - 需要快速查找+范围查询的场景
 */

// 跳表节点
class SkipListNode {
    /**
     * @param {*} key - 键
     * @param {*} value - 值
     * @param {number} level - 层级
     */
    constructor(key, value, level) {
        this.key = key;
        this.value = value;
        // forward[i]表示第i层的下一个节点
        this.forward = new Array(level).fill(null);
    }
}

class SkipList {
    /**
     * 初始化跳表
     * @param {number} maxLevel - 最大层数
     * @param {number} probability - 层数增长概率
     */
    constructor(maxLevel = 16, probability = 0.5) {
        this.maxLevel = maxLevel;
        this.probability = probability;
        this.level = 1; // 当前最大层数
        
        // 创建头节点（哨兵节点）
        this.head = new SkipListNode(null, null, maxLevel);
        
        this.length = 0;
    }

    /**
     * 随机生成节点层数
     * @returns {number} 层数
     */
    randomLevel() {
        let level = 1;
        while (Math.random() < this.probability && level < this.maxLevel) {
            level++;
        }
        return level;
    }

    /**
     * 查找节点
     * @param {*} key - 键
     * @returns {*} 值，不存在返回null
     */
    search(key) {
        let current = this.head;

        // 从最高层开始查找
        for (let i = this.level - 1; i >= 0; i--) {
            while (current.forward[i] && current.forward[i].key < key) {
                current = current.forward[i];
            }
        }

        // 检查下一层的节点
        current = current.forward[0];
        
        if (current && current.key === key) {
            return current.value;
        }

        return null;
    }

    /**
     * 插入节点
     * @param {*} key - 键
     * @param {*} value - 值
     */
    insert(key, value) {
        // 记录每层需要更新的前驱节点
        const update = new Array(this.maxLevel).fill(null);
        let current = this.head;

        // 从最高层开始查找插入位置
        for (let i = this.level - 1; i >= 0; i--) {
            while (current.forward[i] && current.forward[i].key < key) {
                current = current.forward[i];
            }
            update[i] = current;
        }

        // 检查是否已存在
        current = current.forward[0];
        if (current && current.key === key) {
            current.value = value; // 更新值
            return;
        }

        // 随机生成新节点的层数
        const newLevel = this.randomLevel();

        // 如果新层数大于当前最大层数，更新update数组
        if (newLevel > this.level) {
            for (let i = this.level; i < newLevel; i++) {
                update[i] = this.head;
            }
            this.level = newLevel;
        }

        // 创建新节点
        const newNode = new SkipListNode(key, value, newLevel);

        // 更新每层的指针
        for (let i = 0; i < newLevel; i++) {
            newNode.forward[i] = update[i].forward[i];
            update[i].forward[i] = newNode;
        }

        this.length++;
    }

    /**
     * 删除节点
     * @param {*} key - 键
     * @returns {boolean} 是否删除成功
     */
    delete(key) {
        const update = new Array(this.maxLevel).fill(null);
        let current = this.head;

        // 查找要删除的节点
        for (let i = this.level - 1; i >= 0; i--) {
            while (current.forward[i] && current.forward[i].key < key) {
                current = current.forward[i];
            }
            update[i] = current;
        }

        current = current.forward[0];

        // 检查节点是否存在
        if (!current || current.key !== key) {
            return false;
        }

        // 更新每层的指针
        for (let i = 0; i < this.level; i++) {
            if (update[i].forward[i] !== current) {
                break;
            }
            update[i].forward[i] = current.forward[i];
        }

        // 更新最大层数
        while (this.level > 1 && !this.head.forward[this.level - 1]) {
            this.level--;
        }

        this.length--;
        return true;
    }

    /**
     * 范围查询（获取[key1, key2]之间的所有节点）
     * @param {*} startKey - 起始键
     * @param {*} endKey - 结束键
     * @returns {Array} 节点数组
     */
    rangeQuery(startKey, endKey) {
        const result = [];
        let current = this.head;

        // 找到第一个 >= startKey 的节点
        for (let i = this.level - 1; i >= 0; i--) {
            while (current.forward[i] && current.forward[i].key < startKey) {
                current = current.forward[i];
            }
        }

        current = current.forward[0];

        // 遍历到 endKey
        while (current && current.key <= endKey) {
            result.push({ key: current.key, value: current.value });
            current = current.forward[0];
        }

        return result;
    }

    /**
     * 打印跳表（可视化）
     */
    print() {
        console.log(`\n跳表（共${this.length}个节点，${this.level}层）：`);
        
        for (let i = this.level - 1; i >= 0; i--) {
            let current = this.head.forward[i];
            let line = `Level ${i}: `;
            
            while (current) {
                line += `[${current.key}] -> `;
                current = current.forward[i];
            }
            line += 'null';
            console.log(line);
        }
    }
}

// ========== 使用示例 ==========

console.log('=== 跳表示例 ===\n');

const skipList = new SkipList();

// 插入数据
const data = [
    [3, 'C'],
    [6, 'F'],
    [7, 'G'],
    [9, 'I'],
    [12, 'L'],
    [15, 'O'],
    [18, 'R']
];

console.log('插入数据：');
data.forEach(([key, value]) => {
    skipList.insert(key, value);
    console.log(`  insert(${key}, '${value}')`);
});

skipList.print();

// 查找
console.log('\n查找测试：');
console.log('search(7):', skipList.search(7)); // 'G'
console.log('search(10):', skipList.search(10)); // null

// 删除
console.log('\n删除 9：');
skipList.delete(9);
console.log('search(9):', skipList.search(9)); // null

skipList.print();

// 范围查询
console.log('\n范围查询 [6, 15]：');
const range = skipList.rangeQuery(6, 15);
console.log(range); // [{key:6, value:'F'}, {key:7, value:'G'}, {key:12, value:'L'}, {key:15, value:'O'}]

// ========== 性能测试 ==========

console.log('\n=== 性能测试：跳表 vs 有序数组 ===\n');

const n = 100000;
const skipList2 = new SkipList();
const sortedArray = [];

// 插入测试
console.log(`插入 ${n} 个数据：`);

const start1 = Date.now();
for (let i = 0; i < n; i++) {
    skipList2.insert(Math.random() * n, i);
}
const end1 = Date.now();

const start2 = Date.now();
for (let i = 0; i < n; i++) {
    sortedArray.push(Math.random() * n);
    sortedArray.sort((a, b) => a - b); // 每次插入后排序（模拟有序插入）
}
const end2 = Date.now();

console.log(`跳表插入耗时: ${end1 - start1}ms`);
console.log(`有序数组插入耗时: ${end2 - start2}ms`);

// 查找测试
const searchKey = Math.floor(Math.random() * n);

const start3 = Date.now();
for (let i = 0; i < 1000; i++) {
    skipList2.search(searchKey);
}
const end3 = Date.now();

const start4 = Date.now();
for (let i = 0; i < 1000; i++) {
    sortedArray.includes(searchKey);
}
const end4 = Date.now();

console.log(`\n查找测试（1000次）：`);
console.log(`跳表查找耗时: ${end3 - start3}ms`);
console.log(`有序数组查找耗时: ${end4 - start4}ms`);
