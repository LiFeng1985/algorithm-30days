/**
 * 字符串处理算法集合
 * 
 * 字符串是编程中最常用的数据结构之一
 * 本章涵盖常见的字符串操作和算法
 */

// ==================== 1. 反转字符串 ====================

/**
 * 反转字符串
 * 
 * 方法1：双指针法
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 * 
 * @param {string} s
 * @returns {string}
 */
function reverseString(s) {
    const chars = s.split('');
    let left = 0;
    let right = chars.length - 1;
    
    while (left < right) {
        [chars[left], chars[right]] = [chars[right], chars[left]];
        left++;
        right--;
    }
    
    return chars.join('');
}

/**
 * 反转字符串 - 递归版
 */
function reverseStringRecursive(s) {
    if (s.length <= 1) {
        return s;
    }
    return reverseStringRecursive(s.slice(1)) + s[0];
}

// ==================== 2. 验证回文串 ====================

/**
 * 验证回文串
 * 
 * 问题：判断字符串是否是回文（忽略大小写和非字母数字字符）
 * 
 * 思路：双指针从两端向中间比较
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 * 
 * @param {string} s
 * @returns {boolean}
 */
function isPalindrome(s) {
    // 预处理：转小写，只保留字母数字
    const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    let left = 0;
    let right = clean.length - 1;
    
    while (left < right) {
        if (clean[left] !== clean[right]) {
            return false;
        }
        left++;
        right--;
    }
    
    return true;
}

// ==================== 3. 最长公共前缀 ====================

/**
 * 最长公共前缀
 * 
 * 问题：找到字符串数组中所有字符串的最长公共前缀
 * 
 * 思路：以第一个字符串为基准，逐个字符比较
 * 
 * 时间复杂度：O(S)，S是所有字符总数
 * 
 * @param {string[]} strs
 * @returns {string}
 */
function longestCommonPrefix(strs) {
    if (strs.length === 0) {
        return '';
    }
    
    let prefix = strs[0];
    
    for (let i = 1; i < strs.length; i++) {
        // 缩短前缀直到匹配
        while (strs[i].indexOf(prefix) !== 0) {
            prefix = prefix.substring(0, prefix.length - 1);
            if (prefix === '') {
                return '';
            }
        }
    }
    
    return prefix;
}

// ==================== 4. 字符串匹配（KMP算法）====================

/**
 * KMP算法 - 字符串匹配
 * 
 * 问题：在文本串中查找模式串的位置
 * 
 * 核心思想：
 * 利用已匹配的信息，避免回溯
 * 通过next数组记录模式串的最长相同前后缀
 * 
 * 时间复杂度：O(n + m)，n是文本长度，m是模式长度
 * 空间复杂度：O(m)
 * 
 * @param {string} text - 文本串
 * @param {string} pattern - 模式串
 * @returns {number} - 第一次出现的位置，未找到返回-1
 */
function kmpSearch(text, pattern) {
    if (pattern.length === 0) {
        return 0;
    }
    
    // 构建next数组
    const next = buildNextArray(pattern);
    
    let i = 0; // 文本串指针
    let j = 0; // 模式串指针
    
    while (i < text.length) {
        if (text[i] === pattern[j]) {
            i++;
            j++;
        }
        
        if (j === pattern.length) {
            // 找到匹配
            return i - j;
        } else if (i < text.length && text[i] !== pattern[j]) {
            if (j !== 0) {
                j = next[j - 1]; // 回溯到next数组指示的位置
            } else {
                i++;
            }
        }
    }
    
    return -1;
}

/**
 * 构建KMP的next数组
 * next[i] 表示 pattern[0...i] 的最长相同前后缀的长度
 * 
 * @param {string} pattern
 * @returns {number[]}
 */
function buildNextArray(pattern) {
    const next = new Array(pattern.length).fill(0);
    let len = 0; // 前一个最长前后缀的长度
    let i = 1;
    
    while (i < pattern.length) {
        if (pattern[i] === pattern[len]) {
            len++;
            next[i] = len;
            i++;
        } else {
            if (len !== 0) {
                len = next[len - 1];
            } else {
                next[i] = 0;
                i++;
            }
        }
    }
    
    return next;
}

// ==================== 5. 最长回文子串 ====================

/**
 * 最长回文子串
 * 
 * 方法：中心扩展法
 * 
 * 思路：
 * 遍历每个位置，以该位置为中心向两边扩展
 * 考虑奇数长度和偶数长度两种情况
 * 
 * 时间复杂度：O(n²)
 * 空间复杂度：O(1)
 * 
 * @param {string} s
 * @returns {string}
 */
function longestPalindrome(s) {
    if (s.length < 2) {
        return s;
    }
    
    let start = 0;
    let maxLen = 1;
    
    /**
     * 从中心向两边扩展
     * @param {number} left - 左边界
     * @param {number} right - 右边界
     */
    function expandAroundCenter(left, right) {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            const len = right - left + 1;
            if (len > maxLen) {
                start = left;
                maxLen = len;
            }
            left--;
            right++;
        }
    }
    
    for (let i = 0; i < s.length; i++) {
        // 奇数长度的回文（以i为中心）
        expandAroundCenter(i, i);
        
        // 偶数长度的回文（以i和i+1为中心）
        expandAroundCenter(i, i + 1);
    }
    
    return s.substring(start, start + maxLen);
}

// ==================== 6. 有效的括号序列 ====================

/**
 * 有效的括号（已在stack.js中实现）
 * 这里提供另一种实现
 */
function isValidBrackets(s) {
    const stack = [];
    const mapping = {
        ')': '(',
        ']': '[',
        '}': '{'
    };
    
    for (let char of s) {
        if (char === '(' || char === '[' || char === '{') {
            stack.push(char);
        } else if (char === ')' || char === ']' || char === '}') {
            if (stack.length === 0 || stack.pop() !== mapping[char]) {
                return false;
            }
        }
    }
    
    return stack.length === 0;
}

// ==================== 7. 字符串转换整数（atoi）====================

/**
 * 字符串转换整数（atoi）
 * 
 * 问题：实现类似C语言的atoi函数
 * 
 * 步骤：
 * 1. 跳过前导空格
 * 2. 检查正负号
 * 3. 读取数字字符
 * 4. 处理溢出
 * 
 * 时间复杂度：O(n)
 * 
 * @param {string} str
 * @returns {number}
 */
function myAtoi(str) {
    const INT_MAX = 2147483647;
    const INT_MIN = -2147483648;
    
    let i = 0;
    const n = str.length;
    
    // 1. 跳过前导空格
    while (i < n && str[i] === ' ') {
        i++;
    }
    
    if (i === n) {
        return 0;
    }
    
    // 2. 检查符号
    let sign = 1;
    if (str[i] === '+' || str[i] === '-') {
        sign = str[i] === '+' ? 1 : -1;
        i++;
    }
    
    // 3. 读取数字
    let result = 0;
    while (i < n && str[i] >= '0' && str[i] <= '9') {
        const digit = parseInt(str[i]);
        
        // 检查溢出
        if (result > Math.floor(INT_MAX / 10) || 
            (result === Math.floor(INT_MAX / 10) && digit > 7)) {
            return sign === 1 ? INT_MAX : INT_MIN;
        }
        
        result = result * 10 + digit;
        i++;
    }
    
    return sign * result;
}

// ==================== 8. 实现strStr() ====================

/**
 * 实现strStr() - 查找子串
 * 
 * 问题：在haystack中查找needle第一次出现的位置
 * 
 * 方法：暴力匹配
 * 时间复杂度：O(n*m)
 * 
 * @param {string} haystack - 主串
 * @param {string} needle - 子串
 * @returns {number}
 */
function strStr(haystack, needle) {
    if (needle.length === 0) {
        return 0;
    }
    
    for (let i = 0; i <= haystack.length - needle.length; i++) {
        let j = 0;
        while (j < needle.length && haystack[i + j] === needle[j]) {
            j++;
        }
        if (j === needle.length) {
            return i;
        }
    }
    
    return -1;
}

// ==================== 9. 异位词分组 ====================

/**
 * 字母异位词分组
 * 
 * 问题：将字母异位词组合在一起
 * 字母异位词：由相同字母重新排列形成的单词
 * 
 * 思路：
 * 对每个单词排序，排序后相同的就是一组
 * 
 * 时间复杂度：O(N * K log K)，N是单词数，K是最长单词长度
 * 
 * @param {string[]} strs
 * @returns {string[][]}
 */
function groupAnagrams(strs) {
    const map = new Map();
    
    for (let str of strs) {
        // 排序后的字符串作为key
        const key = str.split('').sort().join('');
        
        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key).push(str);
    }
    
    return Array.from(map.values());
}

// ==================== 10. 无重复字符的最长子串 ====================

/**
 * 无重复字符的最长子串
 * 
 * 方法：滑动窗口
 * 
 * 思路：
 * 维护一个窗口，保证窗口内没有重复字符
 * 使用哈希表记录字符最后出现的位置
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(min(m,n))，m是字符集大小
 * 
 * @param {string} s
 * @returns {number}
 */
function lengthOfLongestSubstring(s) {
    const charIndex = new Map(); // 字符 -> 最后出现的索引
    let maxLength = 0;
    let start = 0; // 窗口起始位置
    
    for (let end = 0; end < s.length; end++) {
        const char = s[end];
        
        // 如果字符已经在窗口中，移动start
        if (charIndex.has(char) && charIndex.get(char) >= start) {
            start = charIndex.get(char) + 1;
        }
        
        // 更新字符位置
        charIndex.set(char, end);
        
        // 更新最大长度
        maxLength = Math.max(maxLength, end - start + 1);
    }
    
    return maxLength;
}

// ==================== 测试代码 ====================

console.log('===== 1. 反转字符串 =====\n');

const str1 = 'hello';
console.log(`"${str1}" -> "${reverseString(str1)}"`);
console.log(`递归: "${reverseStringRecursive(str1)}"`);
console.log();

console.log('===== 2. 验证回文串 =====\n');

const testStrings = [
    'A man, a plan, a canal: Panama',
    'race a car',
    '',
    'a'
];

testStrings.forEach(s => {
    console.log(`"${s}" -> ${isPalindrome(s) ? '是回文' : '不是回文'}`);
});
console.log();

console.log('===== 3. 最长公共前缀 =====\n');

const strs1 = ['flower', 'flow', 'flight'];
console.log('数组:', strs1);
console.log('最长公共前缀:', `"${longestCommonPrefix(strs1)}"`); // "fl"

const strs2 = ['dog', 'racecar', 'car'];
console.log('\n数组:', strs2);
console.log('最长公共前缀:', `"${longestCommonPrefix(strs2)}"`); // ""
console.log();

console.log('===== 4. KMP算法 =====\n');

const text = 'ABABDABACDABABCABAB';
const pattern = 'ABABCABAB';
console.log(`文本: "${text}"`);
console.log(`模式: "${pattern}"`);
console.log('匹配位置:', kmpSearch(text, pattern));
console.log();

console.log('===== 5. 最长回文子串 =====\n');

const s1 = 'babad';
console.log(`"${s1}" -> "${longestPalindrome(s1)}"`); // "bab" 或 "aba"

const s2 = 'cbbd';
console.log(`"${s2}" -> "${longestPalindrome(s2)}"`); // "bb"
console.log();

console.log('===== 6. 有效括号 =====\n');

const brackets = ['()', '()[]{}', '(]', '([)]', '{[]}'];
brackets.forEach(s => {
    console.log(`"${s}" -> ${isValidBrackets(s) ? '有效' : '无效'}`);
});
console.log();

console.log('===== 7. atoi =====\n');

const testCases = [
    '42',
    '   -42',
    '4193 with words',
    'words and 987',
    '-91283472332'
];

testCases.forEach(s => {
    console.log(`"${s}" -> ${myAtoi(s)}`);
});
console.log();

console.log('===== 8. strStr =====\n');

const haystack = 'hello';
const needle = 'll';
console.log(`"${haystack}" 中查找 "${needle}":`, strStr(haystack, needle)); // 2
console.log();

console.log('===== 9. 异位词分组 =====\n');

const anagrams = ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'];
console.log('输入:', anagrams);
const groups = groupAnagrams(anagrams);
console.log('分组结果:');
groups.forEach(group => console.log('  ', group));
console.log();

console.log('===== 10. 无重复字符的最长子串 =====\n');

const substrings = [
    'abcabcbb',
    'bbbbb',
    'pwwkew',
    ''
];

substrings.forEach(s => {
    console.log(`"${s}" -> 长度: ${lengthOfLongestSubstring(s)}`);
});
console.log();

// 导出函数（如果在Node.js环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        reverseString,
        reverseStringRecursive,
        isPalindrome,
        longestCommonPrefix,
        kmpSearch,
        longestPalindrome,
        isValidBrackets,
        myAtoi,
        strStr,
        groupAnagrams,
        lengthOfLongestSubstring
    };
}
