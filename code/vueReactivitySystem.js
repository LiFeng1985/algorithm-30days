/**
 * Vue 3 响应式系统深度实现：依赖收集与调度
 */

// 依赖收集器
class Dep {
    constructor() {
        this.subscribers = new Set();
    }

    depend() {
        if (activeEffect) {
            this.subscribers.add(activeEffect);
        }
    }

    notify() {
        this.subscribers.forEach(effect => {
            effect.scheduler ? effect.scheduler() : effect();
        });
    }
}

let activeEffect = null;
const targetMap = new WeakMap();

// 追踪依赖
function track(target, key) {
    if (!activeEffect) return;

    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }

    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Dep();
        depsMap.set(key, dep);
    }

    dep.depend();
}

// 触发更新
function trigger(target, key) {
    const depsMap = targetMap.get(target);
    if (!depsMap) return;

    const dep1 = depsMap.get(key);
    if (dep) {
        dep.notify();
    }
}

// 副作用函数
function effect(fn, options = {}) {
    const _effect = function() {
        activeEffect = _effect;
        try {
            return fn();
        } finally {
            activeEffect = null;
        }
    };
    
    _effect.scheduler = options.scheduler;
    _effect(); // 立即执行一次以收集依赖
    return _effect;
}

// 响应式代理
function reactive(target) {
    return new Proxy(target, {
        get(target, key, receiver) {
            const res = Reflect.get(target, key, receiver);
            track(target, key);
            return typeof res === 'object' ? reactive(res) : res;
        },
        set(target, key, value, receiver) {
            const oldValue = target[key];
            const result = Reflect.set(target, key, value, receiver);
            if (oldValue !== value) {
                trigger(target, key);
            }
            return result;
        }
    });
}

// ========================================
// 测试代码
// ========================================

console.log('=== Vue 3 响应式系统测试 ===\n');

const state = reactive({ count: 0 });

effect(() => {
    console.log(`🔄 视图更新: count 变成了 ${state.count}`);
});

console.log('\n⏳ 模拟状态变化...');
state.count++;
state.count++;

console.log('\n✅ 响应式系统测试完成！');
