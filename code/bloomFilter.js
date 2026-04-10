/**
 * =====================================================
 * 布隆过滤器（Bloom Filter）
 * =====================================================
 * 
 * 【什么是布隆过滤器？】
 * 布隆过滤器是一种空间效率极高的概率型数据结构，用于判断"一个元素是否在集合中"。
 * 
 * 【核心特性】
 * - 说"不在" → 一定不在（100%准确）
 * - 说"在" → 可能在（有误判率）
 * 
 * 【为什么会有误判？】
 * 因为多个元素可能映射到相同的位位置，导致"误命中"。
 * 但绝对不会"漏判"（说不存在，实际存在）。
 * 
 * 【核心思想】
 * 1. 一个很长的二进制位数组（初始全0）
 * 2. 多个哈希函数
 * 3. 插入：将元素用多个哈希函数映射到位数组，对应位置设为1
 * 4. 查询：检查所有映射位置是否都是1
 *    - 都是1 → 可能存在
 *    - 有0 → 一定不存在
 * 
 * 【时间复杂度】
 * - 插入：O(k)，k是哈希函数个数
 * - 查询：O(k)
 * 
 * 【空间复杂度】
 * - O(m)，m是位数组长度
 * - 比哈希表省空间10-100倍
 * 
 * 【应用场景】
 * - Redis缓存穿透防护（缓存中不存在的数据，直接拦截）
 * - 网页爬虫URL去重
 * - 垃圾邮件过滤
 * - 比特币SPV验证
 * - 数据库查询优化（避免查询不存在的key）
 * 
 * 【参数选择】
 * 误判率 f = (1 - e^(-kn/m))^k
 * 
 * 最优哈希函数个数：k = (m/n) * ln2
 * 最优位数组大小：m = -(n * ln f) / (ln2)^2
 * 
 * 其中：
 * - n: 预期插入的元素个数
 * - f: 期望的误判率
 * - m: 位数组长度
 * - k: 哈希函数个数
 */

class BloomFilter {
    /**
     * 初始化布隆过滤器
     * @param {number} capacity - 预期容量（元素个数）
     * @param {number} errorRate - 允许的误判率（如0.01表示1%）
     */
    constructor(capacity, errorRate = 0.01) {
        this.capacity = capacity;
        this.errorRate = errorRate;
        
        // 计算位数组大小
        // m = -(n * ln f) / (ln2)^2
        this.bitSize = Math.ceil(
            -(capacity * Math.log(errorRate)) / (Math.LN2 * Math.LN2)
        );
        
        // 计算哈希函数个数
        // k = (m/n) * ln2
        this.hashCount = Math.ceil((this.bitSize / capacity) * Math.LN2);
        
        // 位数组（用Uint8Array模拟，每个元素存8位）
        this.bitArray = new Uint8Array(Math.ceil(this.bitSize / 8));
        
        console.log(`布隆过滤器初始化：`);
        console.log(`  容量: ${capacity}`);
        console.log(`  误判率: ${errorRate * 100}%`);
        console.log(`  位数组大小: ${this.bitSize} bits (${Math.ceil(this.bitSize / 8)} bytes)`);
        console.log(`  哈希函数个数: ${this.hashCount}`);
    }

    /**
     * 哈希函数1（djb2算法）
     */
    hash1(str) {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i);
        }
        return Math.abs(hash) % this.bitSize;
    }

    /**
     * 哈希函数2（sdbm算法）
     */
    hash2(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
        }
        return Math.abs(hash) % this.bitSize;
    }

    /**
     * 哈希函数3（FNV-1a算法）
     */
    hash3(str) {
        let hash = 2166136261;
        for (let i = 0; i < str.length; i++) {
            hash ^= str.charCodeAt(i);
            hash *= 16777619;
        }
        return Math.abs(hash) % this.bitSize;
    }

    /**
     * 获取所有哈希函数
     */
    getHashes() {
        return [this.hash1, this.hash2, this.hash3];
    }

    /**
     * 插入元素
     * @param {string} item - 要插入的元素
     */
    add(item) {
        const hashes = this.getHashes();
        const str = String(item);
        
        for (let i = 0; i < this.hashCount; i++) {
            const hash = hashes[i % hashes.length](str);
            const byteIndex = Math.floor(hash / 8);
            const bitIndex = hash % 8;
            
            // 设置对应位为1
            this.bitArray[byteIndex] |= (1 << bitIndex);
        }
    }

    /**
     * 查询元素是否存在
     * @param {string} item - 要查询的元素
     * @returns {boolean} 可能存在（true）或一定不存在（false）
     */
    mightContain(item) {
        const hashes = this.getHashes();
        const str = String(item);
        
        for (let i = 0; i < this.hashCount; i++) {
            const hash = hashes[i % hashes.length](str);
            const byteIndex = Math.floor(hash / 8);
            const bitIndex = hash % 8;
            
            // 检查对应位是否为1
            if (!((this.bitArray[byteIndex] >> bitIndex) & 1)) {
                return false; // 有0，一定不存在
            }
        }
        
        return true; // 都是1，可能存在
    }

    /**
     * 获取当前误判率估算
     * @returns {number} 误判率
     */
    getFalsePositiveRate() {
        // 计算已设置的位数
        let setBits = 0;
        for (let byte of this.bitArray) {
            for (let i = 0; i < 8; i++) {
                if ((byte >> i) & 1) {
                    setBits++;
                }
            }
        }
        
        // f = (1 - e^(-kn/m))^k
        const ratio = setBits / this.bitSize;
        return Math.pow(ratio, this.hashCount);
    }

    /**
     * 获取已插入元素数量估算
     * @returns {number} 估算的元素个数
     */
    estimatedCount() {
        let setBits = 0;
        for (let byte of this.bitArray) {
            for (let i = 0; i < 8; i++) {
                if ((byte >> i) & 1) {
                    setBits++;
                }
            }
        }
        
        // n = -(m/k) * ln(1 - setBits/m)
        if (setBits === 0) return 0;
        return Math.round(
            -(this.bitSize / this.hashCount) * Math.log(1 - setBits / this.bitSize)
        );
    }
}

// ========== 使用示例 ==========

console.log('=== 布隆过滤器示例 ===\n');

// 创建布隆过滤器：预期1000个元素，误判率1%
const bloom = new BloomFilter(1000, 0.01);

// 插入数据
console.log('\n插入数据：');
const items = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
items.forEach(item => {
    bloom.add(item);
    console.log(`  add('${item}')`);
});

// 查询
console.log('\n查询测试：');
const testItems = ['apple', 'banana', 'grape', 'orange', 'cherry'];
testItems.forEach(item => {
    const result = bloom.mightContain(item);
    console.log(`  mightContain('${item}'): ${result ? '可能存在' : '一定不存在'}`);
});

// 误判率测试
console.log('\n=== 误判率测试 ===\n');

const bloom2 = new BloomFilter(10000, 0.01);

// 插入10000个元素
console.log('\n插入10000个元素...');
for (let i = 0; i < 10000; i++) {
    bloom2.add(`item_${i}`);
}

// 测试误判率
const testCount = 10000;
let falsePositive = 0;

for (let i = 10000; i < 10000 + testCount; i++) {
    if (bloom2.mightContain(`item_${i}`)) {
        falsePositive++;
    }
}

console.log(`\n误判率测试：`);
console.log(`  测试元素: ${testCount}`);
console.log(`  误判次数: ${falsePositive}`);
console.log(`  实际误判率: ${(falsePositive / testCount * 100).toFixed(2)}%`);
console.log(`  估算误判率: ${(bloom2.getFalsePositiveRate() * 100).toFixed(2)}%`);

// ========== 空间对比 ==========

console.log('\n=== 空间效率对比 ===\n');

const bloom3 = new BloomFilter(1000000, 0.01);

console.log('\n存储100万个字符串（平均长度20字节）：');
console.log(`  布隆过滤器: ${Math.ceil(bloom3.bitSize / 8 / 1024)} KB`);
console.log(`  哈希表（估算）: ${Math.ceil(1000000 * 20 / 1024 / 1024)} MB`);
console.log(`  空间节省: ${(1000000 * 20 / (bloom3.bitSize / 8)).toFixed(0)} 倍`);
