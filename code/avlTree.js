/**
 * =====================================================
 * AVL 树（自平衡二叉搜索树）
 * =====================================================
 * 
 * 【什么是AVL树？】
 * AVL树是最早的自平衡二叉搜索树，由G.M. Adelson-Velsky和E.M. Landis于1962年发明。
 * 
 * 【核心特性】
 * - 是一棵二叉搜索树（左 < 根 < 右）
 * - 任意节点的左右子树高度差不超过1
 * - 通过旋转操作保持平衡
 * 
 * 【为什么要平衡？】
 * 普通二叉搜索树在极端情况下会退化成链表，查找复杂度从O(log n)变成O(n)。
 * AVL树通过旋转保证树的高度始终是O(log n)。
 * 
 * 【平衡因子】
 * balanceFactor = 左子树高度 - 右子树高度
 * - balanceFactor > 1: 左子树过高，需要右旋
 * - balanceFactor < -1: 右子树过高，需要左旋
 * 
 * 【4种旋转情况】
 * 1. LL型（左左）：左孩子的左子树过高 → 右旋
 * 2. RR型（右右）：右孩子的右子树过高 → 左旋
 * 3. LR型（左右）：左孩子的右子树过高 → 先左旋再右旋
 * 4. RL型（右左）：右孩子的左子树过高 → 先右旋再左旋
 * 
 * 【时间复杂度】
 * - 插入：O(log n)
 * - 删除：O(log n)
 * - 查找：O(log n)
 * 
 * 【空间复杂度】
 * - O(n)
 * 
 * 【应用场景】
 * - 数据库索引
 * - 内存中的有序数据集合
 * - 需要频繁查找的场景（比红黑树查找更快）
 */

class AVLNode {
    /**
     * AVL树节点
     * @param {*} key - 键值
     */
    constructor(key) {
        this.key = key;
        this.left = null;
        this.right = null;
        this.height = 1; // 新增：节点高度
    }
}

class AVLTree {
    constructor() {
        this.root = null;
    }

    /**
     * 获取节点高度
     * @param {AVLNode} node - 节点
     * @returns {number} 高度
     */
    getHeight(node) {
        if (!node) return 0;
        return node.height;
    }

    /**
     * 计算平衡因子
     * @param {AVLNode} node - 节点
     * @returns {number} 平衡因子
     */
    getBalanceFactor(node) {
        if (!node) return 0;
        return this.getHeight(node.left) - this.getHeight(node.right);
    }

    /**
     * 更新节点高度
     * @param {AVLNode} node - 节点
     */
    updateHeight(node) {
        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    }

    /**
     * 右旋（LL型）
     * 
     * 旋转前：         旋转后：
     *      y               x
     *     / \             / \
     *    x   T3   →      T1  y
     *   / \                 / \
     *  T1  T2              T2  T3
     * 
     * @param {AVLNode} y - 要旋转的节点
     * @returns {AVLNode} 新的根节点
     */
    rightRotate(y) {
        const x = y.left;
        const T2 = x.right;

        // 旋转
        x.right = y;
        y.left = T2;

        // 更新高度（先更新y，再更新x）
        this.updateHeight(y);
        this.updateHeight(x);

        return x;
    }

    /**
     * 左旋（RR型）
     * 
     * 旋转前：         旋转后：
     *    x                 y
     *   / \               / \
     *  T1  y      →      x   T3
     *     / \           / \
     *    T2  T3        T1  T2
     * 
     * @param {AVLNode} x - 要旋转的节点
     * @returns {AVLNode} 新的根节点
     */
    leftRotate(x) {
        const y = x.right;
        const T2 = y.left;

        // 旋转
        y.left = x;
        x.right = T2;

        // 更新高度
        this.updateHeight(x);
        this.updateHeight(y);

        return y;
    }

    /**
     * 插入节点
     * @param {*} key - 键值
     */
    insert(key) {
        this.root = this._insert(this.root, key);
    }

    /**
     * 递归插入
     * @param {AVLNode} node - 当前节点
     * @param {*} key - 键值
     * @returns {AVLNode} 新的根节点
     */
    _insert(node, key) {
        // 1. 执行普通BST插入
        if (!node) {
            return new AVLNode(key);
        }

        if (key < node.key) {
            node.left = this._insert(node.left, key);
        } else if (key > node.key) {
            node.right = this._insert(node.right, key);
        } else {
            // 不允许重复键
            return node;
        }

        // 2. 更新当前节点高度
        this.updateHeight(node);

        // 3. 获取平衡因子
        const balance = this.getBalanceFactor(node);

        // 4. 根据平衡因子进行旋转

        // LL型：左孩子的左子树插入
        if (balance > 1 && key < node.left.key) {
            return this.rightRotate(node);
        }

        // RR型：右孩子的右子树插入
        if (balance < -1 && key > node.right.key) {
            return this.leftRotate(node);
        }

        // LR型：左孩子的右子树插入
        if (balance > 1 && key > node.left.key) {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        // RL型：右孩子的左子树插入
        if (balance < -1 && key < node.right.key) {
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    /**
     * 查找最小值节点
     * @param {AVLNode} node - 起始节点
     * @returns {AVLNode} 最小值节点
     */
    findMin(node) {
        let current = node;
        while (current.left) {
            current = current.left;
        }
        return current;
    }

    /**
     * 删除节点
     * @param {*} key - 要删除的键值
     */
    delete(key) {
        this.root = this._delete(this.root, key);
    }

    /**
     * 递归删除
     * @param {AVLNode} node - 当前节点
     * @param {*} key - 要删除的键值
     * @returns {AVLNode} 新的根节点
     */
    _delete(node, key) {
        if (!node) return node;

        // 1. 执行普通BST删除
        if (key < node.key) {
            node.left = this._delete(node.left, key);
        } else if (key > node.key) {
            node.right = this._delete(node.right, key);
        } else {
            // 找到要删除的节点

            // 情况1：叶子节点或只有一个子节点
            if (!node.left || !node.right) {
                const temp = node.left || node.right;

                // 没有子节点
                if (!temp) {
                    return null;
                } else {
                    // 有一个子节点
                    return temp;
                }
            } else {
                // 情况2：有两个子节点
                // 找到右子树的最小值（后继节点）
                const temp = this.findMin(node.right);
                node.key = temp.key;
                node.right = this._delete(node.right, temp.key);
            }
        }

        // 2. 更新高度
        this.updateHeight(node);

        // 3. 获取平衡因子
        const balance = this.getBalanceFactor(node);

        // 4. 平衡树

        // LL型
        if (balance > 1 && this.getBalanceFactor(node.left) >= 0) {
            return this.rightRotate(node);
        }

        // LR型
        if (balance > 1 && this.getBalanceFactor(node.left) < 0) {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        // RR型
        if (balance < -1 && this.getBalanceFactor(node.right) <= 0) {
            return this.leftRotate(node);
        }

        // RL型
        if (balance < -1 && this.getBalanceFactor(node.right) > 0) {
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    /**
     * 查找节点
     * @param {*} key - 键值
     * @returns {AVLNode|null} 节点
     */
    search(key) {
        return this._search(this.root, key);
    }

    /**
     * 递归查找
     * @param {AVLNode} node - 当前节点
     * @param {*} key - 键值
     * @returns {AVLNode|null} 节点
     */
    _search(node, key) {
        if (!node || node.key === key) {
            return node;
        }

        if (key < node.key) {
            return this._search(node.left, key);
        } else {
            return this._search(node.right, key);
        }
    }

    /**
     * 中序遍历（升序）
     * @returns {Array} 遍历结果
     */
    inorder() {
        const result = [];
        this._inorder(this.root, result);
        return result;
    }

    /**
     * 递归中序遍历
     * @param {AVLNode} node - 当前节点
     * @param {Array} result - 结果数组
     */
    _inorder(node, result) {
        if (node) {
            this._inorder(node.left, result);
            result.push(node.key);
            this._inorder(node.right, result);
        }
    }

    /**
     * 获取树的高度
     * @returns {number} 高度
     */
    height() {
        return this.getHeight(this.root);
    }

    /**
     * 检查是否平衡
     * @param {AVLNode} node - 当前节点
     * @returns {boolean} 是否平衡
     */
    isBalanced(node = this.root) {
        if (!node) return true;

        const balance = this.getBalanceFactor(node);
        if (Math.abs(balance) > 1) return false;

        return this.isBalanced(node.left) && this.isBalanced(node.right);
    }
}

// ========== 使用示例 ==========

console.log('=== AVL树示例 ===\n');

const avl = new AVLTree();

// 插入节点
const values = [10, 20, 30, 40, 50, 25];
console.log('插入序列:', values);
values.forEach(v => avl.insert(v));

console.log('中序遍历:', avl.inorder());
console.log('树的高度:', avl.height());
console.log('是否平衡:', avl.isBalanced());

// 查找
console.log('\n查找 30:', avl.search(30) ? '找到' : '未找到');
console.log('查找 100:', avl.search(100) ? '找到' : '未找到');

// 删除
console.log('\n删除 30');
avl.delete(30);
console.log('中序遍历:', avl.inorder());
console.log('是否平衡:', avl.isBalanced());

// ========== 性能对比：AVL树 vs 普通BST ==========

console.log('\n=== 性能对比：AVL树 vs 普通BST ===\n');

class BSTNode {
    constructor(key) {
        this.key = key;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }

    insert(key) {
        this.root = this._insert(this.root, key);
    }

    _insert(node, key) {
        if (!node) return new BSTNode(key);
        if (key < node.key) {
            node.left = this._insert(node.left, key);
        } else if (key > node.key) {
            node.right = this._insert(node.right, key);
        }
        return node;
    }

    getHeight(node) {
        if (!node) return 0;
        return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    }

    search(key) {
        return this._search(this.root, key);
    }

    _search(node, key) {
        if (!node || node.key === key) return node;
        if (key < node.key) return this._search(node.left, key);
        return this._search(node.right, key);
    }
}

// 测试：有序数据插入（最坏情况）
console.log('测试：有序数据插入 [1, 2, 3, ..., 10000]\n');

const bst = new BST();
const avl2 = new AVLTree();

const n = 10000;
const startTime1 = Date.now();
for (let i = 1; i <= n; i++) {
    bst.insert(i);
}
const endTime1 = Date.now();

const startTime2 = Date.now();
for (let i = 1; i <= n; i++) {
    avl2.insert(i);
}
const endTime2 = Date.now();

console.log('普通BST:');
console.log('  插入耗时:', endTime1 - startTime1, 'ms');
console.log('  树高度:', bst.getHeight(bst.root), '(应该是', n, ')');

console.log('\nAVL树:');
console.log('  插入耗时:', endTime2 - startTime2, 'ms');
console.log('  树高度:', avl2.height(), '(应该是 ~', Math.log2(n).toFixed(0), ')');

// 查找性能对比
const searchTarget = n;
const startTime3 = Date.now();
for (let i = 0; i < 10000; i++) {
    bst.search(searchTarget);
}
const endTime3 = Date.now();

const startTime4 = Date.now();
for (let i = 0; i < 10000; i++) {
    avl2.search(searchTarget);
}
const endTime4 = Date.now();

console.log('\n查找性能（查找10000次最大值）:');
console.log('  普通BST耗时:', endTime3 - startTime3, 'ms');
console.log('  AVL树耗时:', endTime4 - startTime4, 'ms');
console.log('  性能提升:', ((endTime3 - startTime3) / (endTime4 - startTime4)).toFixed(1), '倍');
