# 💡 Day 11 - 练习题答案详解

> **哈希表详解**  
> **参考答案与解析**

---

## 一、基础概念题答案

### 题目 1：什么是哈希表？（10 分）

**参考答案：**
```
哈希表是一种通过哈希函数
将键映射到数组索引的数据结构，
可以实现快速的插入、查找和删除。
就像字典的拼音索引一样。
```

**评分要点：**
- ✅ 提到"哈希函数"和"映射"（4 分）
- ✅ 有自己的比喻（3 分）
- ✅ 提到"快速查找"（3 分）

---

### 题目 2：哈希表的原理（15 分）

**参考答案：**

**基本思想：**（6 分）
```
通过哈希函数将键转换为数组索引，
直接定位到存储位置，
避免遍历整个数据结构。
```

**哈希函数的作用：**（3 分）
```
将任意类型的键转换为固定范围的整数，
作为数组的索引。
好的哈希函数应该均匀分布，减少冲突。
```

**冲突处理的方法：**（4 分）

**1. 链地址法**
```
每个数组位置是一个链表，
冲突的元素放在同一个链表中。
```

**2. 开放寻址法**
```
冲突时寻找下一个空位置，
如线性探测、二次探测等。
```

**为什么查找快：**（额外加分）
```
因为通过哈希函数直接计算位置，
不需要遍历，平均时间复杂度 O(1)。
```

**评分要点：**
- 基本思想 6 分
- 哈希函数作用 3 分
- 两种方法各 2 分

---

### 题目 3：Map vs Object（10 分）

**参考答案：**

**相同点：**（2 分）
```
都可以存储键值对，
都支持快速的查找操作。
```

**不同点：**（8 分）

**1. 键的类型：**
```
Map: 可以是任意类型（对象、函数等）
Object: 只能是字符串或 Symbol
```

**2. 遍历顺序：**
```
Map: 按插入顺序
Object: 不保证顺序（虽然现代引擎通常保持）
```

**3. 性能：**
```
Map: 频繁增删时性能更好
Object: 简单场景下略快
```

**4. 大小获取：**
```
Map: map.size（直接获取）
Object: 需要手动计算 Object.keys(obj).length
```

**你会选择哪种：**（额外加分）
```
一般情况用 Map，
需要 JSON 序列化时用 Object。
```

**评分要点：**
- 相同点 2 分
- 不同点每项 2 分

---

## 二、代码实践题答案

### 题目 4：两数之和（25 分）

**参考答案：**

```javascript
/**
 * 两数之和
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
    
    return [];
}

// 测试
console.log(twoSum([2, 7, 11, 15], 9));   // [0, 1] ✓
console.log(twoSum([3, 2, 4], 6));        // [1, 2] ✓
console.log(twoSum([3, 3], 6));           // [0, 1] ✓

// 进阶：返回所有可能的组合
function twoSumAll(nums, target) {
    const result = [];
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            const indices = map.get(complement);
            for (const idx of indices) {
                result.push([idx, i]);
            }
        }
        
        if (!map.has(nums[i])) {
            map.set(nums[i], []);
        }
        map.get(nums[i]).push(i);
    }
    
    return result;
}

console.log(twoSumAll([2, 7, 11, 15, 7], 9));
// [[0, 1], [0, 4]] ✓
```

**解题思路：**
```
核心思想：空间换时间

暴力解法：O(n²)
- 两层循环，检查所有组合

哈希表优化：O(n)
- 遍历一次数组
- 对于每个数 num，检查 target - num 是否在表中
- 如果在，就找到了答案
- 如果不在，把 num 存入表中

为什么这样更快：
- 避免了第二层循环
- 哈希表查找是 O(1)
- 总时间从 O(n²) 降到 O(n)
```

**评分要点：**
- 基础版本正确 15 分
- 进阶版本正确 8 分
- 能通过测试 2 分

**常见错误：**
❌ 先存后查 → ✅ 应该先查后存，避免使用同一个元素
❌ 忘记返回值 → ✅ 必须返回索引数组
❌ 处理重复元素错误 → ✅ 进阶版要用数组存储多个索引

---

### 题目 5：有效的字母异位词（20 分）

**参考答案：**

```javascript
/**
 * 有效的字母异位词
 */
function isAnagram(s, t) {
    if (s.length !== t.length) {
        return false;
    }
    
    const charCount = new Map();
    
    // 统计 s 中每个字符的出现次数
    for (const char of s) {
        charCount.set(char, (charCount.get(char) || 0) + 1);
    }
    
    // 检查 t 中的字符
    for (const char of t) {
        if (!charCount.has(char)) {
            return false;
        }
        
        charCount.set(char, charCount.get(char) - 1);
        
        if (charCount.get(char) === 0) {
            charCount.delete(char);
        }
    }
    
    return charCount.size === 0;
}

// 测试
console.log(isAnagram('anagram', 'nagaram'));  // true ✓
console.log(isAnagram('rat', 'car'));          // false ✓
console.log(isAnagram('', ''));                // true ✓

// 进阶：支持 Unicode 字符
function isAnagramUnicode(s, t) {
    // 同样的实现，JavaScript 的 Map 天然支持 Unicode
    return isAnagram(s, t);
}

console.log(isAnagramUnicode('你好', '好你'));  // true ✓
```

**替代方案（排序法）：**
```javascript
function isAnagramSort(s, t) {
    if (s.length !== t.length) return false;
    
    return s.split('').sort().join('') === 
           t.split('').sort().join('');
}
```

**评分要点：**
- 哈希表方法正确 15 分
- 边界处理正确 3 分
- 能通过测试 2 分

---

### 题目 6：最长无重复字符子串（15 分）

**参考答案：**

```javascript
/**
 * 最长无重复字符子串
 */
function lengthOfLongestSubstring(s) {
    const charIndex = new Map();
    let maxLength = 0;
    let left = 0;
    
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        
        // 如果字符已存在且在窗口内，移动左边界
        if (charIndex.has(char) && charIndex.get(char) >= left) {
            left = charIndex.get(char) + 1;
        }
        
        // 更新字符的最新位置
        charIndex.set(char, right);
        
        // 更新最大长度
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}

// 测试
console.log(lengthOfLongestSubstring('abcabcbb'));  // 3 ✓
console.log(lengthOfLongestSubstring('bbbbb'));     // 1 ✓
console.log(lengthOfLongestSubstring('pwwkew'));    // 3 ✓
console.log(lengthOfLongestSubstring(''));          // 0 ✓
```

**执行过程演示：**
```
s = "abcabcbb"

right=0, char='a': charIndex={a:0}, left=0, max=1
right=1, char='b': charIndex={a:0,b:1}, left=0, max=2
right=2, char='c': charIndex={a:0,b:1,c:2}, left=0, max=3
right=3, char='a': a 已在位置 0，left=1, charIndex={a:3,b:1,c:2}, max=3
right=4, char='b': b 已在位置 1，但 1<left，不移动，max=3
...

最终结果：3 ("abc")
```

**评分要点：**
- 滑动窗口逻辑正确 8 分
- 哈希表使用正确 4 分
- 边界处理正确 2 分
- 能通过测试 1 分

---

## 三、理解应用题答案

### 题目 7：实际应用场景（10 分）

**参考答案：**

**适用场景：**（3 分）
```
1. 快速查找和去重
2. 计数和统计
3. 缓存系统
4. 数据库索引
5. 编译器符号表
```

**优点：**（3 分）
```
✓ 平均 O(1) 的查找、插入、删除
✓ 实现相对简单
✓ 应用广泛
```

**缺点/限制：**（2 分）
```
✗ 最坏情况 O(n)（所有键都冲突）
✗ 需要额外的空间
✗ 不支持有序遍历
✗ 哈希函数设计困难
```

**实际应用举例：**（2 分）

**1. 浏览器缓存**
```
URL → 页面内容
快速判断是否已缓存
```

**2. 数据库索引**
```
主键 → 记录位置
加速查询
```

**3. 编译器符号表**
```
变量名 → 内存地址
快速查找变量
```

**评分要点：**
- 适用场景 3 分
- 优点 3 分
- 缺点 2 分
- 应用举例 2 分

---

### 题目 8：性能分析（10 分）

**参考答案：**

**最好情况：**（2 分）
```
时间复杂度：O(1)
发生条件：没有冲突，哈希函数完美分布
```

**平均情况：**（2 分）
```
时间复杂度：O(1)
发生条件：负载因子适中，冲突较少
```

**最坏情况：**（2 分）
```
时间复杂度：O(n)
发生条件：所有键都冲突（如哈希函数很差）
```

**影响性能的因素：**（2 分）
```
1. 哈希函数的质量
2. 负载因子的大小
3. 冲突处理方法
```

**如何优化：**（2 分）
```
- 使用好的哈希函数
- 控制负载因子（通常 < 0.75）
- 及时扩容
- 选择合适的冲突处理方法
```

**评分要点：**
- 三种情况各 2 分
- 影响因素 2 分
- 优化方法 2 分

---

## 四、费曼输出答案

### 题目 9：小老师时间（10 分）

**参考模板：**

```
大家好，今天我要讲的是"哈希表"。

你们可能会问，什么是哈希表呢？

其实啊，哈希表就像一个超级智能的储物柜。

你去健身房，有个储物柜系统。
你告诉工作人员你的会员卡号，
他用一个特殊的公式计算，
直接告诉你："你的柜子是 23 号"。

你不用一个一个去找，
直接走到 23 号柜子就行。

这就是哈希表的核心思想：
通过一个公式（哈希函数），
直接把钥匙（键）转换成位置（索引）。

举个例子：
你要存 {"name": "Alice", "age": 25}

哈希表会：
1. 对 "name" 计算哈希值，得到位置 5
2. 把 "Alice" 存在位置 5
3. 对 "age" 计算哈希值，得到位置 12
4. 把 25 存在位置 12

下次要找 "name" 时：
1. 对 "name" 再算一次哈希
2. 直接去位置 5 拿
3. 瞬间找到！

但是要注意：
有时候两个不同的键可能算出相同的位置，
这叫"冲突"。
解决方法是让一个位置可以放多个东西，
或者找下一个空位置。

所以，哈希表就是：
用公式直接定位，
实现超快速查找的数据结构！

谢谢大家！
```

**评分要点：**
- 不用专业术语（3 分）
- 用了生活例子（储物柜）（3 分）
- 逻辑清晰（2 分）
- 容易听懂（2 分）

**加分项：**
- 解释了冲突（+2 分）
- 有多个例子（+2 分）
- 表达生动（+2 分）

---

## 📊 总分统计

| 题号 | 满分 | 你的得分 | 评语 |
|-----|------|---------|------|
| 题目 1 | 10 | ___ | _____ |
| 题目 2 | 15 | ___ | _____ |
| 题目 3 | 10 | ___ | _____ |
| 题目 4 | 25 | ___ | _____ |
| 题目 5 | 20 | ___ | _____ |
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

**哈希表是最实用的数据结构之一！**

**明天学习图结构，加油！** ✨
