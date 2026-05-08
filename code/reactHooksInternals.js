/**
 * React Hooks 原理深度剖析：链表与闭包的协奏曲
 */

// 模拟 React Fiber 节点中的 Hooks 链表
let currentFiber = null;
let workInProgressHook = null;
let isMount = true;

// Hook 节点结构
class Hook {
    constructor() {
        this.memoizedState = null; // 状态值
        this.baseState = null;
        this.baseQueue = null;
        this.queue = null;         // 更新队列
        this.next = null;          // 指向下一个 Hook
    }
}

// useState 实现
function useState(initialState) {
    // 1. 确定当前操作的 Hook 节点
    let hook;
    if (isMount) {
        hook = new Hook();
        hook.memoizedState = initialState;
        
        // 挂载到 Fiber 节点
        if (!currentFiber.memoizedState) {
            currentFiber.memoizedState = hook;
        } else {
            workInProgressHook.next = hook;
        }
        workInProgressHook = hook;
    } else {
        // 复用已有的 Hook 节点
        hook = workInProgressHook;
        workInProgressHook = workInProgressHook.next;
    }

    // 2. 返回状态和 dispatch
    const dispatch = dispatchAction.bind(null, hook);
    return [hook.memoizedState, dispatch];
}

// useEffect 实现
function useEffect(create, deps) {
    let hook;
    if (isMount) {
        hook = new Hook();
        hook.memoizedState = { create, deps };
        
        if (!currentFiber.memoizedState) {
            currentFiber.memoizedState = hook;
        } else {
            workInProgressHook.next = hook;
        }
        workInProgressHook = hook;
    } else {
        hook = workInProgressHook;
        const prevDeps = hook.memoizedState?.deps;
        
        // 浅比较依赖项
        if (deps && prevDeps && deps.every((d, i) => d === prevDeps[i])) {
            // 依赖没变，跳过执行
        } else {
            hook.memoizedState = { create, deps };
            // 实际环境中会调度副作用执行
            create();
        }
        workInProgressHook = workInProgressHook.next;
    }
}

// 状态更新逻辑
function dispatchAction(hook, action) {
    // 简化版：直接更新并触发重渲染
    if (typeof action === 'function') {
        hook.memoizedState = action(hook.memoizedState);
    } else {
        hook.memoizedState = action;
    }
    
    // 触发组件重新渲染（简化处理）
    console.log(`🔄 状态更新为: ${hook.memoizedState}`);
}

// ========================================
// 测试代码
// ========================================

console.log('=== React Hooks 原理测试 ===\n');

// 模拟一个函数组件
function Counter() {
    const [count, setCount] = useState(0);
    const [name, setName] = useState('Lee');
    
    useEffect(() => {
        console.log(`Effect triggered: count is ${count}`);
    }, [count]);

    return { count, name, setCount, setName };
}

// 初始化 Fiber
currentFiber = { memoizedState: null };
isMount = true;
workInProgressHook = null;

console.log('1️⃣ 首次渲染 (Mount):');
const instance = Counter();
console.log(`   State: count=${instance.count}, name=${instance.name}`);

console.log('\n2️⃣ 触发更新 (Update):');
isMount = false;
workInProgressHook = currentFiber.memoizedState; // 重置指针
instance.setCount(prev => prev + 1);

console.log('\n3️⃣ 再次渲染 (Re-render):');
workInProgressHook = currentFiber.memoizedState; // 重置指针
const newInstance = Counter();
console.log(`   State: count=${newInstance.count}, name=${newInstance.name}`);

console.log('\n✅ Hooks 链表原理测试完成！');
