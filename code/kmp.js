/**
 * =====================================================
 * KMP 字符串匹配算法
 * =====================================================
 * 
 * 【什么是KMP算法？】
 * KMP（Knuth-Morris-Pratt）算法用于在一个文本串中查找模式串的位置。
 * 比暴力匹配快很多，核心思想是"利用已经匹配的信息，避免重复比较"。
 * 
 * 【暴力匹配的问题】
 * 文本串：ABABABABCA
 * 模式串：ABABC
 * 
 * 暴力匹配：
 * - 第1次：ABABA...✗（第5个字符不匹配）
 * - 第2次：BABAB...✗（从第2个字符重新开始）
 * - 第3次：ABABA...✗（又从头开始）
 * 
 * 问题：每次失配都要回溯，浪费时间！
 * 
 * 【KMP的核心思想】
 * 失配时，不回溯文本串指针，只移动模式串。
 * 利用"部分匹配表"（next数组）知道模式串应该移动多少位。
 * 
 * 【next数组（部分匹配表）】
 * next[i]表示：模式串前i个字符中，最长相等前后缀的长度。
 * 
 * 例如：模式串"ABABC"
 * - next[0] = -1（规定）
 * - next[1] = 0（"A"没有前后缀）
 * - next[2] = 0（"AB"没有相等前后缀）
 * - next[3] = 1（"ABA"，前缀"A" = 后缀"A"）
 * - next[4] = 2（"ABAB"，前缀"AB" = 后缀"AB"）
 * 
 * 【时间复杂度】
 * - 构建next数组：O(m)，m是模式串长度
 * - 匹配过程：O(n)，n是文本串长度
 * - 总时间复杂度：O(n + m)
 * 
 * 【空间复杂度】
 * - O(m)，存储next数组
 * 
 * 【应用场景】
 * - 文本编辑器查找（Ctrl+F）
 * - DNA序列匹配
 * -  intrusion detection（入侵检测）
 * - 搜索引擎
 */

/**
 * 构建next数组（部分匹配表）
 * @param {string} pattern - 模式串
 * @returns {number[]} next数组
 */
function buildNext(pattern) {
    const m = pattern.length;
    const next = new Array(m);
    
    next[0] = -1;
    let i = 0; // 前缀末尾
    let j = -1; // 后缀末尾
    
    while (i < m - 1) {
        if (j === -1 || pattern[i] === pattern[j]) {
            i++;
            j++;
            next[i] = j;
        } else {
            j = next[j]; // 回溯
        }
    }
    
    return next;
}

/**
 * KMP算法（优化版next数组）
 * @param {string} text - 文本串
 * @param {string} pattern - 模式串
 * @returns {number} 匹配位置，未匹配返回-1
 */
function kmpSearch(text, pattern) {
    if (pattern.length === 0) return 0;
    if (text.length < pattern.length) return -1;
    
    const next = buildNext(pattern);
    let i = 0; // 文本串指针
    let j = 0; // 模式串指针
    
    while (i < text.length && j < pattern.length) {
        if (j === -1 || text[i] === pattern[j]) {
            i++;
            j++;
        } else {
            j = next[j]; // 模式串指针回溯
        }
    }
    
    if (j === pattern.length) {
        return i - j; // 匹配成功，返回起始位置
    }
    
    return -1; // 匹配失败
}

/**
 * 找到所有匹配位置
 * @param {string} text - 文本串
 * @param {string} pattern - 模式串
 * @returns {number[]} 所有匹配的起始位置
 */
function kmpSearchAll(text, pattern) {
    const positions = [];
    if (pattern.length === 0) return positions;
    
    const next = buildNext(pattern);
    let i = 0;
    let j = 0;
    
    while (i < text.length) {
        if (j === -1 || text[i] === pattern[j]) {
            i++;
            j++;
            
            if (j === pattern.length) {
                positions.push(i - j);
                j = next[j - 1] + 1; // 继续查找下一个匹配
            }
        } else {
            j = next[j];
        }
    }
    
    return positions;
}

// ========== 使用示例 ==========

console.log('=== KMP字符串匹配 ===\n');

const text1 = 'ABABABABCA';
const pattern1 = 'ABABC';

console.log('文本串:', text1);
console.log('模式串:', pattern1);
console.log();

// 构建next数组
const next1 = buildNext(pattern1);
console.log('next数组:', next1);
console.log();

// 解释next数组
console.log('next数组解释：');
for (let i = 0; i < pattern1.length; i++) {
    const prefix = pattern1.substring(0, i + 1);
    console.log(`  next[${i}] = ${next1[i]}（"${prefix}"的最长相等前后缀长度）`);
}

console.log();
const pos1 = kmpSearch(text1, pattern1);
console.log(`匹配位置：${pos1}`);
console.log(`验证：text[${pos1}..${pos1 + pattern1.length - 1}] = "${text1.substring(pos1, pos1 + pattern1.length)}"`);

// ========== 找所有匹配 ==========

console.log('\n=== 找所有匹配位置 ===\n');

const text2 = 'ABABDABACDABABCABAB';
const pattern2 = 'ABABCABAB';

console.log('文本串:', text2);
console.log('模式串:', pattern2);

const positions = kmpSearchAll(text2, pattern2);
console.log('所有匹配位置:', positions);

positions.forEach(pos => {
    console.log(`  位置${pos}: "${text2.substring(pos, pos + pattern2.length)}"`);
});

// ========== 实际应用：DNA序列匹配 ==========

console.log('\n=== 实际应用：DNA序列匹配 ===\n');

// DNA序列由A、T、C、G四种碱基组成
const dna = 'ATCGATCGATCGATCGATCGATCGATCGATCG';
const gene = 'ATCGATC';

console.log('DNA序列:', dna);
console.log('目标基因:', gene);

const genePositions = kmpSearchAll(dna, gene);
console.log(`基因出现位置: ${genePositions}`);
console.log(`出现次数: ${genePositions.length}`);

// ========== 实际应用：日志分析 ==========

console.log('\n=== 实际应用：日志分析 ===\n');

const log = `
2024-01-01 10:00:00 INFO User login successful
2024-01-01 10:01:00 ERROR Database connection failed
2024-01-01 10:02:00 WARNING High memory usage
2024-01-01 10:03:00 ERROR Timeout exception
2024-01-01 10:04:00 INFO Request processed
2024-01-01 10:05:00 ERROR Null pointer exception
`;

console.log('查找所有ERROR日志：');
const errorPositions = kmpSearchAll(log, 'ERROR');
errorPositions.forEach(pos => {
    // 找到这一行的内容
    const lineStart = log.lastIndexOf('\n', pos);
    const lineEnd = log.indexOf('\n', pos);
    const line = log.substring(lineStart + 1, lineEnd).trim();
    console.log(`  位置${pos}: ${line}`);
});

// ========== 性能对比 ==========

console.log('\n=== 性能对比：KMP vs 暴力匹配 ===\n');

/**
 * 暴力匹配
 */
function naiveSearch(text, pattern) {
    const n = text.length;
    const m = pattern.length;
    
    for (let i = 0; i <= n - m; i++) {
        let j = 0;
        while (j < m && text[i + j] === pattern[j]) {
            j++;
        }
        if (j === m) {
            return i;
        }
    }
    
    return -1;
}

// 构造测试数据（最坏情况）
const longText = 'A'.repeat(100000) + 'B';
const longPattern = 'A'.repeat(1000) + 'B';

console.log(`文本长度: ${longText.length}`);
console.log(`模式长度: ${longPattern.length}`);
console.log('(最坏情况：前面全部匹配，最后一个字符不匹配)\n');

// 测试暴力匹配
const start1 = Date.now();
naiveSearch(longText, longPattern);
const end1 = Date.now();

// 测试KMP
const start2 = Date.now();
kmpSearch(longText, longPattern);
const end2 = Date.now();

console.log(`暴力匹配耗时: ${end1 - start1}ms`);
console.log(`KMP匹配耗时: ${end2 - start2}ms`);
console.log(`性能提升: ${((end1 - start1) / Math.max(end2 - start2, 1)).toFixed(1)}倍`);
