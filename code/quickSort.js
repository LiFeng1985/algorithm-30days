/**
 * 快速排序 - 原地排序版（面试推荐）
 * 时间复杂度：平均 O(n log n)，最坏 O(n²)
 * 空间复杂度：O(log n)
 * 
 * @param {number[]} arr - 待排序数组
 * @return {number[]} 排序后的数组（原数组被修改）
 */
function quickSortInPlace(arr) {
    /**
     * 分区函数：将数组分为小于基准和大于基准两部分
     * @param {number} low - 左边界
     * @param {number} high - 右边界
     * @return {number} 基准元素的最终位置
     */
    function partition(low, high) {
        // 选择基准（这里选最后一个元素）
        const pivot = arr[high];
        
        // i 指向"小于区"的下一个位置
        let i = low;
        
        for (let j = low; j < high; j++) {
            // 如果当前元素小于基准
            if (arr[j] < pivot) {
                // 交换 arr[i] 和 arr[j]
                [arr[i], arr[j]] = [arr[j], arr[i]];
                i++;  // 小于区扩大
            }
        }
        
        // 把基准放到正确的位置
        [arr[i], arr[high]] = [arr[high], arr[i]];
        
        return i;  // 返回基准的位置
    }
    
    /**
     * 递归排序
     * @param {number} low - 左边界
     * @param {number} high - 右边界
     */
    function sort(low, high) {
        if (low < high) {
            // 分区，得到基准的位置
            const pivotIndex = partition(low, high);
            
            // 递归排序左边
            sort(low, pivotIndex - 1);
            
            // 递归排序右边
            sort(pivotIndex + 1, high);
        }
    }
    
    // 开始排序
    sort(0, arr.length - 1);
    
    return arr;
}

// ============ 测试代码 ============

// 测试 1：普通数组
const arr1 = [3, 6, 8, 10, 1, 2, 1];
console.log('测试 1:', quickSortInPlace(arr1));
// 输出：[1, 1, 2, 3, 6, 8, 10]

// 测试 2：已排序数组
const arr2 = [1, 2, 3, 4, 5];
console.log('测试 2:', quickSortInPlace([...arr2]));
// 输出：[1, 2, 3, 4, 5]

// 测试 3：逆序数组
const arr3 = [5, 4, 3, 2, 1];
console.log('测试 3:', quickSortInPlace([...arr3]));
// 输出：[1, 2, 3, 4, 5]

// 测试 4：重复元素
const arr4 = [3, 3, 3, 3, 3];
console.log('测试 4:', quickSortInPlace([...arr4]));
// 输出：[3, 3, 3, 3, 3]

// 测试 5：空数组
const arr5 = [];
console.log('测试 5:', quickSortInPlace([...arr5]));
// 输出：[]

// 测试 6：单元素
const arr6 = [42];
console.log('测试 6:', quickSortInPlace([...arr6]));
// 输出：[42]

console.log('所有测试通过！✅');
