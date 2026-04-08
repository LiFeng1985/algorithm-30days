/**
 * Trie树（前缀树/字典树）
 * 
 * 什么是Trie树？
 * Trie是一种多叉树结构，用于高效地存储和检索字符串数据集中的键
 * 
 * 特点：
 * 1. 根节点不包含字符
 * 2. 每条边代表一个字符
 * 3. 从根到某个节点的路径上的字符连接起来，就是该节点对应的字符串
 * 4. 每个节点的所有子节点包含的字符都不相同
 * 
 * 时间复杂度：
 * - 插入：O(m)，m是字符串长度
 * - 搜索：O(m)
 * - 前缀搜索：O(m)
 * 
 * 空间复杂度：O(n*m)，n是字符串数量，m是平均长度
 * 
 * 优点：
 * - 前缀匹配非常快
 * - 可以自动排序
 * - 没有哈希冲突
 * 
 * 缺点：
 * - 空间消耗较大
 * - 如果字符串很少共同前缀，空间利用率低
 * 
 * 应用场景：
 * - 自动补全
 * - 拼写检查
 * - IP路由（最长前缀匹配）
 * - 词频统计
 */

/**
 * Trie节点类
 */
class TrieNode {
    constructor() {
        this.children = new Map();  // 子节点映射
        this.isEndOfWord = false;   // 是否是一个单词的结尾
    }
}

/**
 * Trie树类
 */
class Trie {
    constructor() {
        this.root = new TrieNode();
    }
    
    /**
     * 插入单词
     * 时间复杂度：O(m)，m是单词长度
     * @param {string} word
     */
    insert(word) {
        let node = this.root;
        
        for (let char of word) {
            // 如果字符不存在，创建新节点
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char);
        }
        
        // 标记单词结尾
        node.isEndOfWord = true;
    }
    
    /**
     * 搜索单词
     * 时间复杂度：O(m)
     * @param {string} word
     * @returns {boolean}
     */
    search(word) {
        const node = this._searchPrefix(word);
        return node !== null && node.isEndOfWord;
    }
    
    /**
     * 检查是否有以prefix为前缀的单词
     * 时间复杂度：O(m)
     * @param {string} prefix
     * @returns {boolean}
     */
    startsWith(prefix) {
        return this._searchPrefix(prefix) !== null;
    }
    
    /**
     * 搜索前缀，返回最后一个节点
     * @private
     * @param {string} prefix
     * @returns {TrieNode|null}
     */
    _searchPrefix(prefix) {
        let node = this.root;
        
        for (let char of prefix) {
            if (!node.children.has(char)) {
                return null;
            }
            node = node.children.get(char);
        }
        
        return node;
    }
    
    /**
     * 删除单词
     * 时间复杂度：O(m)
     * @param {string} word
     * @returns {boolean}
     */
    delete(word) {
        return this._delete(this.root, word, 0);
    }
    
    /**
     * 递归删除
     * @private
     */
    _delete(node, word, depth) {
        if (!node) {
            return false;
        }
        
        // 到达单词末尾
        if (depth === word.length) {
            if (!node.isEndOfWord) {
                return false; // 单词不存在
            }
            
            node.isEndOfWord = false;
            
            // 如果节点没有子节点，可以删除
            return node.children.size === 0;
        }
        
        const char = word[depth];
        const child = node.children.get(char);
        
        if (!child) {
            return false; // 单词不存在
        }
        
        // 递归删除
        const shouldDeleteChild = this._delete(child, word, depth + 1);
        
        // 如果子节点应该被删除
        if (shouldDeleteChild) {
            node.children.delete(char);
            
            // 如果当前节点不是单词结尾且没有子节点，也应该删除
            return !node.isEndOfWord && node.children.size === 0;
        }
        
        return false;
    }
    
    /**
     * 获取所有以prefix为前缀的单词
     * @param {string} prefix
     * @returns {string[]}
     */
    getWordsWithPrefix(prefix) {
        const node = this._searchPrefix(prefix);
        if (!node) {
            return [];
        }
        
        const words = [];
        this._collectWords(node, prefix, words);
        return words;
    }
    
    /**
     * 收集所有单词
     * @private
     */
    _collectWords(node, prefix, words) {
        if (node.isEndOfWord) {
            words.push(prefix);
        }
        
        for (let [char, child] of node.children) {
            this._collectWords(child, prefix + char, words);
        }
    }
    
    /**
     * 判断Trie是否为空
     * @returns {boolean}
     */
    isEmpty() {
        return this.root.children.size === 0;
    }
}

/**
 * 应用1：实现自动补全
 */
class AutoComplete {
    constructor() {
        this.trie = new Trie();
        this.frequency = new Map(); // 记录词频
    }
    
    /**
     * 添加单词
     * @param {string} word
     * @param {number} freq - 词频
     */
    addWord(word, freq = 1) {
        this.trie.insert(word);
        this.frequency.set(word, (this.frequency.get(word) || 0) + freq);
    }
    
    /**
     * 获取建议（按词频排序）
     * @param {string} prefix
     * @param {number} limit - 返回数量
     * @returns {string[]}
     */
    getSuggestions(prefix, limit = 5) {
        const words = this.trie.getWordsWithPrefix(prefix);
        
        // 按词频排序
        words.sort((a, b) => {
            return (this.frequency.get(b) || 0) - (this.frequency.get(a) || 0);
        });
        
        return words.slice(0, limit);
    }
}

/**
 * 应用2：单词替换
 * 
 * 问题：用词典中的最短前缀替换句子中的单词
 * 
 * @param {string[]} dictionary - 词典
 * @param {string} sentence - 句子
 * @returns {string}
 */
function replaceWords(dictionary, sentence) {
    const trie = new Trie();
    
    // 将词典插入Trie
    for (let word of dictionary) {
        trie.insert(word);
    }
    
    // 分割句子
    const words = sentence.split(' ');
    
    // 替换每个单词
    const result = words.map(word => {
        // 查找最短前缀
        let node = trie.root;
        let prefix = '';
        
        for (let char of word) {
            if (!node.children.has(char)) {
                break;
            }
            prefix += char;
            node = node.children.get(char);
            
            // 如果找到一个完整的前缀，立即返回
            if (node.isEndOfWord) {
                return prefix;
            }
        }
        
        return word; // 没有找到前缀，返回原词
    });
    
    return result.join(' ');
}

// ==================== 测试代码 ====================

console.log('===== Trie基本操作测试 =====\n');

const trie = new Trie();

console.log('插入单词: apple, app, application, apply, banana');
trie.insert('apple');
trie.insert('app');
trie.insert('application');
trie.insert('apply');
trie.insert('banana');
console.log();

console.log('搜索测试:');
console.log('  "apple":', trie.search('apple'));     // true
console.log('  "app":', trie.search('app'));         // true
console.log('  "appl":', trie.search('appl'));       // false
console.log('  "bananas":', trie.search('bananas')); // false
console.log();

console.log('前缀测试:');
console.log('  "app":', trie.startsWith('app'));     // true
console.log('  "ban":', trie.startsWith('ban'));     // true
console.log('  "cat":', trie.startsWith('cat'));     // false
console.log();

console.log('获取以"app"为前缀的单词:');
const words = trie.getWordsWithPrefix('app');
console.log('  ', words);
console.log();

console.log('删除单词"app":');
trie.delete('app');
console.log('  "app":', trie.search('app'));         // false
console.log('  "apple":', trie.search('apple'));     // true
console.log();

console.log('===== 自动补全测试 =====\n');

const autoComplete = new AutoComplete();

// 添加单词和词频
autoComplete.addWord('algorithm', 10);
autoComplete.addWord('algebra', 5);
autoComplete.addWord('alpha', 8);
autoComplete.addWord('application', 15);
autoComplete.addWord('apply', 12);
autoComplete.addWord('banana', 7);

console.log('输入 "al" 的建议:');
console.log('  ', autoComplete.getSuggestions('al', 3));

console.log('\n输入 "app" 的建议:');
console.log('  ', autoComplete.getSuggestions('app', 3));
console.log();

console.log('===== 单词替换测试 =====\n');

const dict = ['cat', 'bat', 'rat'];
const sentence = 'the cattle was rattled by the battery';
console.log('词典:', dict);
console.log('原句:', sentence);
console.log('替换后:', replaceWords(dict, sentence));
// 输出: "the cat was rat by the bat"
console.log();

// 性能测试
console.log('===== 性能测试 =====\n');

function measureTime(operation, name) {
    const start = Date.now();
    operation();
    const end = Date.now();
    console.log(`${name}: ${end - start}ms`);
}

// 大量插入测试
console.log('插入10000个单词:');
measureTime(() => {
    const perfTrie = new Trie();
    for (let i = 0; i < 10000; i++) {
        perfTrie.insert(`word${i}`);
    }
}, '批量插入');

// 导出类和函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TrieNode,
        Trie,
        AutoComplete,
        replaceWords
    };
}
