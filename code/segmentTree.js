/**
 * 线段树 - Segment Tree
 * 
 * 什么是线段树？
 * 线段树是一种二叉树结构，用于高效处理区间查询和更新操作
 * 
 * 核心思想：
 * 将区间递归地分成两半，每个节点存储一个区间的信息
 * 
 * 支持的操作：
 * 1. 区间查询：O(log n)
 * 2. 单点更新：O(log n)
 * 3. 区间更新：O(log n)（需要懒标记）
 * 
 * 时间复杂度：
 * - 构建：O(n)
 * - 查询：O(log n)
 * - 更新：O(log n)
 * 
 * 空间复杂度：O(4n)
 * 
 * 应用场景：
 * - 区间求和
 * - 区间最大值/最小值
 * - 区间染色
 * - 逆序对计数
 */

class SegmentTree {
    /**
     * 构造函数
     * @param {number[]} nums - 原始数组
     */
    constructor(nums) {
        this.nums = nums;
        this.n = nums.length;
        this.tree = new Array(4 * this.n).fill(0);
        
        if (this.n > 0) {
            this._build(1, 0, this.n - 1);
        }
    }
    
    /**
     * 构建线段树
     * @private
     * @param {number} node - 当前节点索引
     * @param {number} start - 区间起始
     * @param {number} end - 区间结束
     */
    _build(node, start, end) {
        if (start === end) {
            // 叶子节点
            this.tree[node] = this.nums[start];
        } else {
            const mid = Math.floor((start + end) / 2);
            const leftNode = 2 * node;
            const rightNode = 2 * node + 1;
            
            // 递归构建左右子树
            this._build(leftNode, start, mid);
            this._build(rightNode, mid + 1, end);
            
            // 合并左右子树的信息（这里是求和）
            this.tree[node] = this.tree[leftNode] + this.tree[rightNode];
        }
    }
    
    /**
     * 区间查询
     * 时间复杂度：O(log n)
     * @param {number} left - 查询区间左边界
     * @param {number} right - 查询区间右边界
     * @returns {number}
     */
    query(left, right) {
        return this._query(1, 0, this.n - 1, left, right);
    }
    
    /**
     * 递归查询
     * @private
     */
    _query(node, start, end, left, right) {
        // 完全在查询区间外
        if (right < start || end < left) {
            return 0;
        }
        
        // 完全在查询区间内
        if (left <= start && end <= right) {
            return this.tree[node];
        }
        
        // 部分重叠，查询左右子树
        const mid = Math.floor((start + end) / 2);
        const leftSum = this._query(2 * node, start, mid, left, right);
        const rightSum = this._query(2 * node + 1, mid + 1, end, left, right);
        
        return leftSum + rightSum;
    }
    
    /**
     * 单点更新
     * 时间复杂度：O(log n)
     * @param {number} index - 要更新的索引
     * @param {number} value - 新值
     */
    update(index, value) {
        this.nums[index] = value;
        this._update(1, 0, this.n - 1, index, value);
    }
    
    /**
     * 递归更新
     * @private
     */
    _update(node, start, end, index, value) {
        if (start === end) {
            // 叶子节点
            this.tree[node] = value;
        } else {
            const mid = Math.floor((start + end) / 2);
            
            if (index <= mid) {
                // 在左子树
                this._update(2 * node, start, mid, index, value);
            } else {
                // 在右子树
                this._update(2 * node + 1, mid + 1, end, index, value);
            }
            
            // 更新当前节点
            this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];
        }
    }
}

/**
 * 应用1：区域和检索
 * 
 * LeetCode 307题
 */
class NumArray {
    constructor(nums) {
        this.segmentTree = new SegmentTree(nums);
    }
    
    /**
     * 更新数组元素
     * @param {number} index
     * @param {number} val
     */
    update(index, val) {
        this.segmentTree.update(index, val);
    }
    
    /**
     * 查询区间和
     * @param {number} left
     * @param {number} right
     * @returns {number}
     */
    sumRange(left, right) {
        return this.segmentTree.query(left, right);
    }
}

// ==================== 测试代码 ====================

console.log('===== 线段树基本操作测试 =====\n');

const nums = [1, 3, 5, 7, 9, 11];
console.log('原始数组:', nums);

const segTree = new SegmentTree(nums);

console.log('\n区间查询:');
console.log('  sum(0, 2):', segTree.query(0, 2)); // 1+3+5=9
console.log('  sum(1, 4):', segTree.query(1, 4)); // 3+5+7+9=24
console.log('  sum(0, 5):', segTree.query(0, 5)); // 36

console.log('\n单点更新:');
console.log('  更新 index 1 为 10');
segTree.update(1, 10);
console.log('  sum(0, 2):', segTree.query(0, 2)); // 1+10+5=16
console.log();

console.log('===== NumArray 测试 =====\n');

const numArray = new NumArray([1, 3, 5]);
console.log('初始数组: [1, 3, 5]');
console.log('sumRange(0, 2):', numArray.sumRange(0, 2)); // 9

console.log('更新 index 1 为 2');
numArray.update(1, 2);
console.log('sumRange(0, 2):', numArray.sumRange(0, 2)); // 8
console.log();

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SegmentTree,
        NumArray
    };
}
