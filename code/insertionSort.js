/**
 * 插入排序 - 就像整理扑克牌
 * 
 * @param {number[]} arr - 待排序的数组
 * @returns {number[]} 排好序的数组
 * 
 * 💡 记忆口诀：
 * "从第二张开始，每张往前找，大的往后挪，找到就插入"
 */
function insertionSort(arr) {
    // 从第 2 张牌开始（第 1 张默认有序）
    // 为什么从 1 开始？因为索引 0 只有一张牌，天然有序
    for (let j = 1; j < arr.length; j++) {
        
        const key = arr[j];  // 手上这张牌（要插入的）
        let i = j - 1;       // 前面已排序的最后一张
        
        // ⚠️ 关键步骤：把比 key 大的牌都往后挪
        // while 条件：
        // 1. i >= 0: 还没到头
        // 2. arr[i] > key: 前面的牌比当前牌大
        while (i >= 0 && arr[i] > key) {
            arr[i + 1] = arr[i];  // 大的往后挪一个位置
            i--;                   // 继续往前找下一个
        }
        
        // 🔑 找到合适位置了！插入 key
        // 为什么是 i+1？因为退出循环时 arr[i] <= key
        arr[i + 1] = key;
    }
    
    return arr;  // 返回排好序的数组
}

console.log(insertionSort([1,3,4,2,6,8,3,2]))