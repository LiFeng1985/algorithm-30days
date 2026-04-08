# 💡 Day 23 - 练习题答案详解

> **哈希表**  
> **参考答案与解析**

---

## 一、基础概念题答案

### 题目 1：什么是哈希表？（10 分）

**参考答案：**
```
哈希表是一种高效的数据结构，
通过哈希函数将键映射到数组的索引，
实现快速的插入、删除和查找操作。
就像用标签快速找到储物柜一样。
```

**评分要点：**
- ✅ 提到"哈希函数"或"映射"（3 分）
- ✅ 有自己的比喻（3 分）
- ✅ 提到快速操作（4 分）

---

### 题目 2：哈希表的原理（15 分）

**参考答案：**

**基本思想：**（6 分）
```
使用哈希函数将键转换为数组索引，
直接访问对应位置来获取值，
从而实现 O(1) 的平均时间复杂度。
```

**核心组件：**（6 分）

**1. 哈希函数：**（2 分）
```
将任意长度的键转换为固定范围的整数（索引）。
要求：相同键得到相同索引，不同键尽量得到不同索引。
```

**2. 存储结构：**（2 分）
```
通常用数组作为底层存储，
每个位置称为一个"桶"（bucket）。
```

**3. 冲突处理：**（2 分）
```
当两个不同的键映射到同一个索引时，需要特殊处理。
常用方法：链地址法、开放地址法等。
```

**为什么查找速度快：**（3 分）
```
不需要遍历或比较，
直接通过哈希函数计算出索引位置，
一次访问就能找到目标（理想情况下）。
```

**评分要点：**
- 基本思想 6 分
- 三个组件各 2 分
- 速度快说明 3 分

---

### 题目 3：哈希冲突分析（10 分）

**参考答案：**

**什么是哈希冲突：**（3 分）
```
当两个或多个不同的键，
通过哈希函数计算后得到相同的索引，
这种现象称为哈希冲突。
```

**为什么会发生冲突：**（2 分）
```
因为键的数量通常远大于数组大小，
根据鸽巢原理，必然会有冲突。
即使数组很大，也无法完全避免。
```

**解决方法：**（4 分）

**1. 链地址法：**（2 分）
```
每个桶存储一个链表（或数组），
所有映射到同一位置的元素都存放在这个链表中。
查找时在链表中顺序查找。
```

**2. 开放地址法：**（2 分）
```
如果目标位置被占用，就按照某种规则寻找下一个空位。
常见方法：线性探测、二次探测、双重哈希等。
```

**负载因子的作用：**（额外加分）
```
负载因子 = 元素个数 / 数组大小

作用：
1. 衡量哈希表的装满程度
2. 决定何时扩容（通常 > 0.75 时扩容）
3. 影响性能：太大则冲突多，太小则浪费空间
```

**评分要点：**
- 冲突定义 3 分
- 原因说明 2 分
- 两种方法各 2 分

---

## 二、代码实践题答案

### 题目 4：实现哈希函数（20 分）

**参考答案：**

```javascript
/**
 * 简单的字符串哈希函数
 * @param {string} key - 键
 * @param {number} tableSize - 哈希表大小
 * @return {number} 哈希值（索引）
 */
function hashString(key, tableSize) {
    let hash = 0;
    
    // 遍历字符串的每个字符
    for (let i = 0; i < key.length; i++) {
        // 使用质数 31 进行乘法运算，使分布更均匀
        hash = (hash * 31 + key.charCodeAt(i)) % tableSize;
    }
    
    return hash;
}

/**
 * 数字哈希函数
 * @param {number} num - 数字
 * @param {number} tableSize - 哈希表大小
 * @return {number} 哈希值（索引）
 */
function hashNumber(num, tableSize) {
    // 简单版本：直接取模
    // return Math.abs(num) % tableSize;
    
    // 改进版本：使用乘法散列
    const A = 0.6180339887;  // 黄金比例的小数部分
    const frac = (Math.abs(num) * A) % 1;
    return Math.floor(tableSize * frac);
}

// 测试
console.log(hashString('name', 16));
console.log(hashString('age', 16));
console.log(hashString('city', 16));

console.log(hashNumber(123, 16));
console.log(hashNumber(456, 16));

// 验证：相同的输入应该返回相同的输出
console.log(hashString('name', 16) === hashString('name', 16)); // true ✓
```

**哈希函数设计要点：**
```
1. 确定性：相同输入必须得到相同输出
2. 均匀性：不同输入尽量均匀分布
3. 高效性：计算要快
4. 范围合适：返回值在 0 到 tableSize-1 之间

常用技巧：
- 字符串：累加字符编码，乘以质数（如 31、37）
- 数字：取模、乘法散列
- 对象：JSON.stringify 后当字符串处理
```

**评分要点：**
- 字符串哈希正确 8 分
- 数字哈希正确 6 分
- 满足确定性 3 分
- 分布均匀 3 分

**常见错误：**
❌ 没有取模 → ✅ 必须 % tableSize
❌ 分布不均匀 → ✅ 用质数乘法
❌ 负数处理不当 → ✅ 用 Math.abs()

---

### 题目 5：实现完整的哈希表（25 分）

**参考答案：**

```javascript
/**
 * 哈希表类（使用链地址法处理冲突）
 */
class HashTable {
    constructor(size = 16) {
        this.size = size;
        this.buckets = new Array(size);
        this.count = 0;
    }
    
    /**
     * 哈希函数
     */
    hash(key) {
        if (typeof key === 'string') {
            let hash = 0;
            for (let i = 0; i < key.length; i++) {
                hash = (hash * 31 + key.charCodeAt(i)) % this.size;
            }
            return hash;
        } else if (typeof key === 'number') {
            const A = 0.6180339887;
            const frac = (Math.abs(key) * A) % 1;
            return Math.floor(this.size * frac);
        } else {
            // 其他类型转为字符串
            return this.hash(String(key));
        }
    }
    
    /**
     * 插入或更新键值对
     */
    put(key, value) {
        const index = this.hash(key);
        
        // 如果这个位置还没有元素，创建数组
        if (!this.buckets[index]) {
            this.buckets[index] = [];
        }
        
        const bucket = this.buckets[index];
        
        // 查找是否已存在该键
        for (const entry of bucket) {
            if (entry.key === key) {
                // 更新已有值
                entry.value = value;
                return;
            }
        }
        
        // 插入新键值对
        bucket.push({ key, value });
        this.count++;
        
        // 检查是否需要扩容
        if (this.count / this.size > 0.75) {
            this.resize();
        }
    }
    
    /**
     * 获取值
     */
    get(key) {
        const index = this.hash(key);
        const bucket = this.buckets[index];
        
        // 如果桶不存在，返回 undefined
        if (!bucket) {
            return undefined;
        }
        
        // 在链表中查找
        for (const entry of bucket) {
            if (entry.key === key) {
                return entry.value;
            }
        }
        
        return undefined;  // 没找到
    }
    
    /**
     * 删除键值对
     */
    remove(key) {
        const index = this.hash(key);
        const bucket = this.buckets[index];
        
        if (!bucket) {
            return false;
        }
        
        // 在链表中查找并删除
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i].key === key) {
                bucket.splice(i, 1);
                this.count--;
                
                // 如果桶为空，可以删除（可选）
                if (bucket.length === 0) {
                    this.buckets[index] = undefined;
                }
                
                return true;
            }
        }
        
        return false;  // 没找到
    }
    
    /**
     * 检查是否包含某个键
     */
    containsKey(key) {
        return this.get(key) !== undefined;
    }
    
    /**
     * 获取哈希表的大小
     */
    size() {
        return this.count;
    }
    
    /**
     * 扩容（私有方法）
     */
    resize() {
        const oldBuckets = this.buckets;
        this.size *= 2;
        this.buckets = new Array(this.size);
        this.count = 0;
        
        // 重新哈希所有元素
        for (const bucket of oldBuckets) {
            if (bucket) {
                for (const entry of bucket) {
                    this.put(entry.key, entry.value);
                }
            }
        }
    }
}

// 测试
const hashTable = new HashTable();
hashTable.put('name', 'Alice');
hashTable.put('age', 25);
hashTable.put('city', 'Beijing');

console.log(hashTable.get('name'));  // 'Alice' ✓
console.log(hashTable.get('age'));   // 25 ✓
console.log(hashTable.get('city'));  // 'Beijing' ✓
console.log(hashTable.get('country')); // undefined ✓

console.log(hashTable.containsKey('name')); // true ✓
console.log(hashTable.containsKey('country')); // false ✓

hashTable.remove('age');
console.log(hashTable.get('age')); // undefined ✓
```

**评分要点：**
- hash 函数正确 4 分
- put 方法正确 6 分
- get 方法正确 5 分
- remove 方法正确 5 分
- 辅助方法正确 3 分
- 能通过测试 2 分

**关键理解：**
```
1. 为什么用链地址法？
   - 实现简单
   - 适合频繁插入删除
   - 不会像开放地址法那样聚集

2. 为什么要扩容？
   - 保持负载因子在合理范围
   - 减少冲突，保证性能
   - 通常负载因子 > 0.75 时扩容

3. 为什么扩容后要重新哈希？
   - 因为数组大小变了
   - 哈希函数依赖数组大小
   - 元素的索引可能改变
```

---

### 题目 6：哈希表应用题（15 分）

**参考答案：**

```javascript
/**
 * 问题 1：统计数组中每个元素出现的次数
 */
function countOccurrences(arr) {
    const map = new Map();
    
    for (const item of arr) {
        if (map.has(item)) {
            map.set(item, map.get(item) + 1);
        } else {
            map.set(item, 1);
        }
    }
    
    return map;
}

/**
 * 问题 2：找出数组中的重复元素
 */
function findDuplicates(arr) {
    const seen = new Set();
    const duplicates = new Set();
    
    for (const num of arr) {
        if (seen.has(num)) {
            duplicates.add(num);
        } else {
            seen.add(num);
        }
    }
    
    return Array.from(duplicates);
}

/**
 * 问题 3：两数之和
 */
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];  // 没找到
}

// 测试
console.log(countOccurrences(['a', 'b', 'a', 'c', 'b']));
// Map { 'a' => 2, 'b' => 2, 'c' => 1 } ✓

console.log(findDuplicates([1, 2, 3, 2, 4, 3, 5]));
// [2, 3] ✓

console.log(twoSum([2, 7, 11, 15], 9));
// [0, 1] ✓
```

**解题思路：**

**问题 1（统计次数）：**
```
遍历数组，用哈希表记录每个元素出现的次数。
时间复杂度：O(n)
空间复杂度：O(n)
```

**问题 2（找重复）：**
```
用两个集合：
- seen 记录已经见过的元素
- duplicates 记录重复的元素
时间复杂度：O(n)
```

**问题 3（两数之和）：**
```
遍历数组，对于每个元素 nums[i]：
- 计算 complement = target - nums[i]
- 如果 complement 在哈希表中，返回其索引
- 否则将当前元素加入哈希表
时间复杂度：O(n)
空间复杂度：O(n)
```

**评分要点：**
- 问题 1 正确 5 分
- 问题 2 正确 5 分
- 问题 3 正确 5 分

---

## 三、理解应用题答案

### 题目 7：实际应用场景（10 分）

**参考答案：**

**适用场景：**（4 分）
```
1. 快速查找（字典、缓存）
2. 去重（Set 的实现）
3. 计数（统计频率）
4. 数据库索引
5. 编译器符号表
```

**优点：**（3 分）
```
✓ 查找速度快，平均 O(1)
✓ 插入删除也快
✓ 实现相对简单
✓ 应用广泛
```

**缺点/限制：**（3 分）
```
✗ 最坏情况 O(n)
✗ 需要好的哈希函数
✗ 不保持顺序
✗ 占用较多内存
```

**实际应用举例：**（额外加分）
```
1. JavaScript 的 Object 和 Map
2. Python 的 dict
3. Java 的 HashMap
4. 浏览器的 localStorage
5. Redis 的哈希存储
6. 密码学的哈希算法
```

**评分要点：**
- 适用场景 4 分（至少 2 点）
- 优点 3 分（至少 2 点）
- 缺点 3 分（至少 2 点）

---

### 题目 8：性能对比（10 分）

**参考答案：**

**线性查找：**（2 分）
```
平均时间复杂度：O(n)
```

**二分查找（有序数组）：**（2 分）
```
平均时间复杂度：O(log n)
```

**哈希表查找：**（2 分）
```
平均时间复杂度：O(1)
```

**当 n = 10000 时：**（2 分）
```
线性查找平均需要：5000 次比较
二分查找平均需要：log₂10000 ≈ 14 次比较
哈希表查找平均需要：1-2 次比较（考虑冲突）

性能差距：
哈希表 >> 二分查找 > 线性查找
```

**结论：**（2 分）
```
1. 哈希表在查找方面性能最优
2. 但前提是数据无序且只需要查找
3. 如果需要有序遍历，用平衡树更好
4. 实际选择要根据具体需求
```

**评分要点：**
- 三种复杂度各 2 分
- 具体数值 2 分
- 结论合理 2 分

---

## 四、费曼输出答案

### 题目 9：小老师时间（10 分）

**参考模板：**

```
大家好，今天我要讲的是"哈希表"。

你们可能会问，什么是哈希表呢？

其实啊，哈希表就像一个智能储物柜。
想象你去健身房，有一个储物柜区域。

普通的方法：
你要找一个东西，得一个一个柜子打开看，
这样很慢，可能要打开很多个柜子。

哈希表的方法：
每个柜子都有一个号码牌，
你告诉管理员你要存什么，
管理员用一个特殊的规则算出号码，
直接带你到对应的柜子。

比如：
- "name"这个词，算出来是 5 号柜
- "age"这个词，算出来是 12 号柜
下次要找的时候，再算一次，直接去那个柜子拿！

那如果两个词算出来是同一个号码怎么办呢？
这就是"哈希冲突"。
解决方法很简单：
在那个柜子里放一个小格子，
把多个东西都放在里面，找的时候翻一下就行。

举个例子：
你要管理班级同学的信息：
小明 -> 学号 001 -> 柜子 3
小红 -> 学号 002 -> 柜子 7
小刚 -> 学号 003 -> 柜子 3（冲突了！）

没关系，3 号柜有两个小格子，
一个放小明的，一个放小刚的。

所以，哈希表就是：
用一个聪明的规则，
快速找到东西放在哪里！

谢谢大家！
```

**评分要点：**
- 不用专业术语（3 分）
- 用了生活例子（健身房屋储物柜）（3 分）
- 逻辑清晰（2 分）
- 容易听懂（2 分）

**加分项：**
- 解释了冲突处理（+2 分）
- 有具体例子（+2 分）
- 表达生动（+2 分）

---

## 📊 总分统计

| 题号 | 满分 | 你的得分 | 评语 |
|-----|------|---------|------|
| 题目 1 | 10 | ___ | _____ |
| 题目 2 | 15 | ___ | _____ |
| 题目 3 | 10 | ___ | _____ |
| 题目 4 | 20 | ___ | _____ |
| 题目 5 | 25 | ___ | _____ |
| 题目 6 | 15 | ___ | _____ |
| 题目 7 | 10 | ___ | _____ |
| 题目 8 | 10 | ___ | _____ |
| 题目 9 | 10 | ___ | _____ |
| **总分** | **125** | **___** | _____ |

**评级标准：**
- 🌟🌟🌟 100-125 分：优秀！你对哈希表有了很好的理解
- 🌟🌟 80-99 分：良好！基本概念掌握了
- 🌟 60-79 分：合格！还需要多加练习
- 💪 60 分以下：需要重新学习

---

**🎉 完成答案订正后，记得给自己一个奖励！**

**明天学习 BFS 和 DFS，加油！** ✨
