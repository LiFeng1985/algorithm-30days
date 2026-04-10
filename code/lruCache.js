/**
 * =====================================================
 * LRU 缓存（最近最少使用）
 * =====================================================
 * 
 * 【什么是LRU缓存？】
 * LRU = Least Recently Used（最近最少使用）
 * 当缓存满了，删除最久没被访问的数据。
 * 
 * 【核心思想】
 * - 刚访问过的数据放在最前面
 * - 最久没访问的数据放在最后面
 * - 缓存满时，删除最后一个
 * 
 * 【实现方式】
 * 哈希表 + 双向链表
 * - 哈希表：O(1)查找
 * - 双向链表：O(1)插入/删除
 * 
 * 【时间复杂度】
 * - get(key): O(1)
 * - put(key, value): O(1)
 * 
 * 【空间复杂度】
 * - O(capacity)
 * 
 * 【应用场景】
 * - Redis缓存淘汰策略
 * - 浏览器缓存
 * - 操作系统页面置换
 * - 数据库查询缓存
 * 
 * 【面试考点】
 * 这是LeetCode第146题，美团、字节、阿里必考题。
 * 要求用O(1)时间复杂度实现。
 */

// 双向链表节点
class LRUNode {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

class LRUCache {
    /**
     * 初始化LRU缓存
     * @param {number} capacity - 缓存容量
     */
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map(); // 哈希表：key -> Node
        this.size = 0;
        
        // 创建伪头部和伪尾部节点（简化边界处理）
        this.head = new LRUNode(0, 0);
        this.tail = new LRUNode(0, 0);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    /**
     * 获取缓存值
     * @param {number} key - 键
     * @returns {number} 值，不存在返回-1
     */
    get(key) {
        if (!this.cache.has(key)) {
            return -1;
        }

        // 获取节点
        const node = this.cache.get(key);
        
        // 移动到头部（标记为最近使用）
        this._moveToHead(node);
        
        return node.value;
    }

    /**
     * 放入缓存
     * @param {number} key - 键
     * @param {number} value - 值
     */
    put(key, value) {
        // 如果key已存在，更新值并移到头部
        if (this.cache.has(key)) {
            const node = this.cache.get(key);
            node.value = value;
            this._moveToHead(node);
            return;
        }

        // 创建新节点
        const newNode = new LRUNode(key, value);
        
        // 添加到哈希表和链表头部
        this.cache.set(key, newNode);
        this._addToHead(newNode);
        this.size++;

        // 如果超出容量，删除尾部节点
        if (this.size > this.capacity) {
            const tailNode = this._removeTail();
            this.cache.delete(tailNode.key);
            this.size--;
        }
    }

    /**
     * 添加节点到头部
     * @param {LRUNode} node - 节点
     */
    _addToHead(node) {
        node.prev = this.head;
        node.next = this.head.next;
        this.head.next.prev = node;
        this.head.next = node;
    }

    /**
     * 删除节点
     * @param {LRUNode} node - 节点
     */
    _removeNode(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    /**
     * 移动节点到头部
     * @param {LRUNode} node - 节点
     */
    _moveToHead(node) {
        this._removeNode(node);
        this._addToHead(node);
    }

    /**
     * 删除尾部节点
     * @returns {LRUNode} 被删除的节点
     */
    _removeTail() {
        const node = this.tail.prev;
        this._removeNode(node);
        return node;
    }

    /**
     * 打印缓存内容（调试用）
     */
    print() {
        const result = [];
        let current = this.head.next;
        while (current !== this.tail) {
            result.push(`(${current.key}:${current.value})`);
            current = current.next;
        }
        console.log('Cache:', result.join(' -> '));
    }
}

// ========== 使用示例 ==========

console.log('=== LRU缓存示例 ===\n');

const lru = new LRUCache(2); // 容量为2

lru.put(1, 1);
console.log('put(1, 1)');
lru.print(); // [1:1]

lru.put(2, 2);
console.log('put(2, 2)');
lru.print(); // [2:2 -> 1:1]

console.log('get(1):', lru.get(1)); // 返回1，并将1移到头部
lru.print(); // [1:1 -> 2:2]

lru.put(3, 3); // 超出容量，删除最久未使用的2
console.log('put(3, 3)，删除2');
lru.print(); // [3:3 -> 1:1]

console.log('get(2):', lru.get(2)); // 返回-1（未找到）

lru.put(4, 4); // 超出容量，删除最久未使用的1
console.log('put(4, 4)，删除1');
lru.print(); // [4:4 -> 3:3]

console.log('get(1):', lru.get(1)); // 返回-1
console.log('get(3):', lru.get(3)); // 返回3
console.log('get(4):', lru.get(4)); // 返回4
lru.print(); // [4:4 -> 3:3]
