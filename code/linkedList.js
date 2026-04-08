/**
 * 链表 - Linked List
 * 
 * 什么是链表？
 * 链表是一种线性数据结构，由一系列节点组成，每个节点包含：
 * 1. 数据域：存储实际的值
 * 2. 指针域：指向下一个节点的引用
 * 
 * 与数组的区别：
 * - 数组：连续内存，支持随机访问，插入删除慢
 * - 链表：非连续内存，不支持随机访问，插入删除快
 * 
 * 链表的类型：
 * 1. 单向链表：每个节点只指向下一个节点
 * 2. 双向链表：每个节点指向前一个和后一个节点
 * 3. 循环链表：最后一个节点指向第一个节点
 * 
 * 时间复杂度：
 * - 访问：O(n) - 需要从头遍历
 * - 搜索：O(n) - 需要遍历
 * - 插入（已知位置）：O(1) - 只需修改指针
 * - 删除（已知位置）：O(1) - 只需修改指针
 * 
 * 空间复杂度：O(n) - 每个节点需要额外存储指针
 * 
 * 适用场景：
 * - 频繁插入删除操作
 * - 不需要随机访问
 * - 实现栈、队列等数据结构
 * - LRU缓存
 */

/**
 * 链表节点类
 */
class ListNode {
    /**
     * 构造函数
     * @param {*} value - 节点的值
     */
    constructor(value) {
        this.value = value;
        this.next = null; // 指向下一个节点的指针
    }
}

/**
 * 单向链表类
 */
class LinkedList {
    constructor() {
        this.head = null; // 头节点
        this.tail = null; // 尾节点
        this.length = 0;  // 链表长度
    }
    
    /**
     * 在链表尾部添加节点
     * 时间复杂度：O(1)
     * @param {*} value - 要添加的值
     * @returns {LinkedList} - 返回链表本身，支持链式调用
     */
    append(value) {
        const newNode = new ListNode(value);
        
        if (!this.head) {
            // 如果链表为空，新节点既是头也是尾
            this.head = newNode;
            this.tail = newNode;
        } else {
            // 否则，把新节点添加到尾部
            this.tail.next = newNode;
            this.tail = newNode;
        }
        
        this.length++;
        return this;
    }
    
    /**
     * 在链表头部添加节点
     * 时间复杂度：O(1)
     * @param {*} value - 要添加的值
     * @returns {LinkedList}
     */
    prepend(value) {
        const newNode = new ListNode(value);
        
        if (!this.head) {
            // 如果链表为空，新节点既是头也是尾
            this.head = newNode;
            this.tail = newNode;
        } else {
            // 否则，新节点指向原来的头节点
            newNode.next = this.head;
            this.head = newNode;
        }
        
        this.length++;
        return this;
    }
    
    /**
     * 在指定位置插入节点
     * 时间复杂度：O(n) - 需要找到插入位置
     * @param {number} index - 插入位置（从0开始）
     * @param {*} value - 要插入的值
     * @returns {boolean} - 是否插入成功
     */
    insertAt(index, value) {
        // 检查索引是否有效
        if (index < 0 || index > this.length) {
            return false;
        }
        
        // 在头部插入
        if (index === 0) {
            this.prepend(value);
            return true;
        }
        
        // 在尾部插入
        if (index === this.length) {
            this.append(value);
            return true;
        }
        
        // 在中间插入
        const newNode = new ListNode(value);
        const prevNode = this._getNodeAt(index - 1);
        
        newNode.next = prevNode.next;
        prevNode.next = newNode;
        
        this.length++;
        return true;
    }
    
    /**
     * 删除指定位置的节点
     * 时间复杂度：O(n) - 需要找到删除位置
     * @param {number} index - 要删除的位置
     * @returns {*} - 被删除节点的值，如果失败返回 null
     */
    removeAt(index) {
        // 检查索引是否有效
        if (index < 0 || index >= this.length) {
            return null;
        }
        
        let removedNode;
        
        // 删除头节点
        if (index === 0) {
            removedNode = this.head;
            this.head = this.head.next;
            
            // 如果链表变为空，tail也要设为null
            if (!this.head) {
                this.tail = null;
            }
        } else {
            // 找到要删除节点的前一个节点
            const prevNode = this._getNodeAt(index - 1);
            removedNode = prevNode.next;
            
            // 跳过被删除的节点
            prevNode.next = removedNode.next;
            
            // 如果删除的是尾节点，更新tail
            if (index === this.length - 1) {
                this.tail = prevNode;
            }
        }
        
        this.length--;
        return removedNode.value;
    }
    
    /**
     * 查找指定值的节点
     * 时间复杂度：O(n)
     * @param {*} value - 要查找的值
     * @returns {ListNode|null} - 找到的节点，如果不存在返回 null
     */
    find(value) {
        let current = this.head;
        
        while (current) {
            if (current.value === value) {
                return current;
            }
            current = current.next;
        }
        
        return null;
    }
    
    /**
     * 获取指定位置的节点
     * 时间复杂度：O(n)
     * @private
     * @param {number} index - 位置索引
     * @returns {ListNode|null} - 找到的节点
     */
    _getNodeAt(index) {
        if (index < 0 || index >= this.length) {
            return null;
        }
        
        let current = this.head;
        for (let i = 0; i < index; i++) {
            current = current.next;
        }
        
        return current;
    }
    
    /**
     * 获取指定位置的值
     * 时间复杂度：O(n)
     * @param {number} index - 位置索引
     * @returns {*} - 该位置的值
     */
    get(index) {
        const node = this._getNodeAt(index);
        return node ? node.value : null;
    }
    
    /**
     * 更新指定位置的值
     * 时间复杂度：O(n)
     * @param {number} index - 位置索引
     * @param {*} value - 新值
     * @returns {boolean} - 是否更新成功
     */
    set(index, value) {
        const node = this._getNodeAt(index);
        if (node) {
            node.value = value;
            return true;
        }
        return false;
    }
    
    /**
     * 反转链表
     * 时间复杂度：O(n)
     * 思路：遍历链表，逐个改变节点的next指针方向
     * @returns {LinkedList}
     */
    reverse() {
        if (!this.head || !this.head.next) {
            return this; // 空链表或只有一个节点，无需反转
        }
        
        let prev = null;
        let current = this.head;
        let next = null;
        
        // 交换head和tail
        this.tail = this.head;
        
        while (current) {
            next = current.next; // 保存下一个节点
            current.next = prev; // 反转指针
            prev = current;      // prev前进一步
            current = next;      // current前进一步
        }
        
        this.head = prev; // 更新head
        return this;
    }
    
    /**
     * 判断链表是否有环
     * 时间复杂度：O(n)
     * 使用快慢指针（Floyd判圈算法）
     * @returns {boolean} - 是否有环
     */
    hasCycle() {
        if (!this.head || !this.head.next) {
            return false;
        }
        
        let slow = this.head;
        let fast = this.head.next;
        
        while (fast && fast.next) {
            if (slow === fast) {
                return true; // 快慢指针相遇，说明有环
            }
            slow = slow.next;       // 慢指针走一步
            fast = fast.next.next;  // 快指针走两步
        }
        
        return false;
    }
    
    /**
     * 获取链表长度
     * @returns {number}
     */
    size() {
        return this.length;
    }
    
    /**
     * 判断链表是否为空
     * @returns {boolean}
     */
    isEmpty() {
        return this.length === 0;
    }
    
    /**
     * 清空链表
     */
    clear() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }
    
    /**
     * 将链表转换为数组
     * @returns {Array}
     */
    toArray() {
        const arr = [];
        let current = this.head;
        
        while (current) {
            arr.push(current.value);
            current = current.next;
        }
        
        return arr;
    }
    
    /**
     * 打印链表
     */
    print() {
        const values = [];
        let current = this.head;
        
        while (current) {
            values.push(String(current.value));
            current = current.next;
        }
        
        console.log(values.join(' -> '));
    }
}

// ==================== 测试代码 ====================

console.log('===== 链表基本操作测试 =====\n');

// 创建链表
const list = new LinkedList();
console.log('创建空链表');
list.print();
console.log('长度:', list.size());
console.log();

// 尾部添加
console.log('尾部添加: 10, 20, 30');
list.append(10).append(20).append(30);
list.print();
console.log('长度:', list.size());
console.log();

// 头部添加
console.log('头部添加: 5');
list.prepend(5);
list.print();
console.log();

// 在指定位置插入
console.log('在位置2插入: 15');
list.insertAt(2, 15);
list.print();
console.log();

// 获取元素
console.log('获取位置0的元素:', list.get(0));
console.log('获取位置2的元素:', list.get(2));
console.log('获取位置4的元素:', list.get(4));
console.log();

// 查找元素
console.log('查找值为20的节点:', list.find(20));
console.log('查找值为99的节点:', list.find(99));
console.log();

// 删除元素
console.log('删除位置1的元素:', list.removeAt(1));
list.print();
console.log();

// 更新元素
console.log('更新位置2的值为99');
list.set(2, 99);
list.print();
console.log();

// 反转链表
console.log('反转链表');
list.reverse();
list.print();
console.log();

// 转换为数组
console.log('转换为数组:', list.toArray());
console.log();

console.log('===== 环检测测试 =====\n');

// 创建无环链表
const list1 = new LinkedList();
list1.append(1).append(2).append(3).append(4);
console.log('无环链表:', list1.hasCycle() ? '有环' : '无环');

// 创建有环链表（手动制造环）
const node1 = new ListNode(1);
const node2 = new ListNode(2);
const node3 = new ListNode(3);
const node4 = new ListNode(4);
node1.next = node2;
node2.next = node3;
node3.next = node4;
node4.next = node2; // 制造环：4 -> 2

const list2 = new LinkedList();
list2.head = node1;
list2.tail = node4;
list2.length = 4;
console.log('有环链表:', list2.hasCycle() ? '有环' : '无环');
console.log();

console.log('===== 边界情况测试 =====\n');

// 空链表
const emptyList = new LinkedList();
console.log('空链表长度:', emptyList.size());
console.log('空链表是否为空:', emptyList.isEmpty());
emptyList.print();
console.log();

// 单元素链表
const singleList = new LinkedList();
singleList.append(42);
console.log('单元素链表:');
singleList.print();
console.log('删除唯一元素:', singleList.removeAt(0));
console.log('删除后长度:', singleList.size());
singleList.print();
console.log();

// 导出类（如果在Node.js环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ListNode,
        LinkedList
    };
}
