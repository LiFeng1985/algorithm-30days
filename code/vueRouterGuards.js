/**
 * Vue Router 导航守卫底层实现
 * 核心：链式调用 + 异步队列
 */

// 导航守卫类型
const NavigationGuardType = {
    GLOBAL_BEFORE: 'globalBefore',
    GLOBAL_AFTER: 'globalAfter',
    ROUTE_BEFORE: 'routeBefore',
    COMPONENT_BEFORE: 'componentBefore',
    COMPONENT_AFTER: 'componentAfter'
};

// 守卫队列管理器
class NavigationGuardQueue {
    constructor() {
        this.guards = {
            [NavigationGuardType.GLOBAL_BEFORE]: [],
            [NavigationGuardType.GLOBAL_AFTER]: [],
            [NavigationGuardType.ROUTE_BEFORE]: [],
            [NavigationGuardType.COMPONENT_BEFORE]: [],
            [NavigationGuardType.COMPONENT_AFTER]: []
        };
    }
    
    // 添加守卫
    addGuard(type, guard) {
        if (!this.guards[type]) {
            throw new Error(`Unknown guard type: ${type}`);
        }
        this.guards[type].push(guard);
    }
    
    // 提取组件内的守卫
    extractComponentGuards(components, type) {
        const guards = [];
        
        for (const component of components) {
            if (component && component[type]) {
                guards.push({
                    guard: component[type].bind(component),
                    component
                });
            }
        }
        
        return guards;
    }
    
    // 执行守卫队列
    async executeQueue(guards, to, from, failure) {
        for (const guard of guards) {
            // 处理对象形式的守卫 { guard, component }
            const guardFn = guard.guard || guard;
            const component = guard.component;
            
            try {
                const result = await guardFn(to, from, failure);
                
                // 处理返回值
                if (result === false) {
                    // 取消导航
                    return { aborted: true };
                }
                
                if (result instanceof Error) {
                    // 导航失败
                    return { error: result };
                }
                
                if (typeof result === 'string' || result?.to) {
                    // 重定向
                    return { redirect: result };
                }
                
                // 继续执行下一个守卫
            } catch (error) {
                return { error };
            }
        }
        
        return { completed: true };
    }
}

// 路由匹配器
class RouteMatcher {
    constructor() {
        this.routes = [];
    }
    
    addRoute(route) {
        this.routes.push(route);
    }
    
    match(path) {
        for (const route of this.routes) {
            const match = path.match(route.regex);
            if (match) {
                return {
                    ...route,
                    params: this.extractParams(route, match)
                };
            }
        }
        return null;
    }
    
    extractParams(route, match) {
        const params = {};
        for (let i = 0; i < route.paramNames.length; i++) {
            params[route.paramNames[i]] = match[i + 1];
        }
        return params;
    }
}

// Vue Router 核心类
class VueRouter {
    constructor(options = {}) {
        this.mode = options.mode || 'hash';
        this.routes = options.routes || [];
        this.currentRoute = null;
        this.isReady = false;
        
        this.guardQueue = new NavigationGuardQueue();
        this.routeMatcher = new RouteMatcher();
        
        // 注册路由
        this.routes.forEach(route => this.addRoute(route));
        
        // 初始化守卫
        this._initGuards();
    }
    
    // 初始化全局守卫
    _initGuards() {
        // beforeEach
        this.beforeEach = (guard) => {
            this.guardQueue.addGuard(NavigationGuardType.GLOBAL_BEFORE, guard);
        };
        
        // afterEach
        this.afterEach = (guard) => {
            this.guardQueue.addGuard(NavigationGuardType.GLOBAL_AFTER, guard);
        };
    }
    
    // 添加路由
    addRoute(route) {
        this.routeMatcher.addRoute({
            ...route,
            regex: this._compilePath(route.path),
            paramNames: this._extractParamNames(route.path)
        });
    }
    
    // 编译路径为正则
    _compilePath(path) {
        const pattern = path.replace(/:[^/]+/g, '([^/]+)');
        return new RegExp(`^${pattern}$`);
    }
    
    // 提取参数名
    _extractParamNames(path) {
        const names = [];
        const regex = /:([^/]+)/g;
        let match;
        while ((match = regex.exec(path)) !== null) {
            names.push(match[1]);
        }
        return names;
    }
    
    // 导航核心方法
    async push(location) {
        const to = this.routeMatcher.match(location);
        const from = this.currentRoute;
        
        if (!to) {
            console.error(`Route not found: ${location}`);
            return false;
        }
        
        // 执行导航守卫链
        const result = await this._navigate(to, from);
        
        if (result.completed) {
            this.currentRoute = to;
            this._updateURL(to);
            this._triggerAfterHooks(to, from);
            return true;
        }
        
        if (result.aborted) {
            console.log('Navigation aborted');
            return false;
        }
        
        if (result.redirect) {
            console.log(`Redirecting to: ${result.redirect}`);
            return this.push(result.redirect);
        }
        
        if (result.error) {
            console.error('Navigation error:', result.error);
            return false;
        }
    }
    
    // 执行完整的守卫链
    async _navigate(to, from) {
        // 1. 全局前置守卫
        const globalBeforeResult = await this.guardQueue.executeQueue(
            this.guardQueue.guards[NavigationGuardType.GLOBAL_BEFORE],
            to,
            from
        );
        
        if (!globalBeforeResult.completed) {
            return globalBeforeResult;
        }
        
        // 2. 路由独享守卫
        if (to.beforeEnter) {
            const routeGuardResult = await to.beforeEnter(to, from);
            if (routeGuardResult !== undefined && routeGuardResult !== true) {
                return { aborted: routeGuardResult === false };
            }
        }
        
        // 3. 组件内守卫（按顺序：失活组件 → 激活组件）
        const deactivated = this._getDeactivatedComponents(from);
        const activated = this._getActivatedComponents(to);
        
        const componentBeforeGuards = [
            ...this.guardQueue.extractComponentGuards(deactivated, 'beforeRouteLeave'),
            ...this.guardQueue.extractComponentGuards(activated, 'beforeRouteEnter')
        ];
        
        const componentResult = await this.guardQueue.executeQueue(
            componentBeforeGuards,
            to,
            from
        );
        
        if (!componentResult.completed) {
            return componentResult;
        }
        
        return { completed: true };
    }
    
    // 获取失活组件
    _getDeactivatedComponents(route) {
        if (!route || !route.components) return [];
        return Object.values(route.components);
    }
    
    // 获取激活组件
    _getActivatedComponents(route) {
        if (!route || !route.components) return [];
        return Object.values(route.components);
    }
    
    // 触发后置守卫
    _triggerAfterHooks(to, from) {
        this.guardQueue.guards[NavigationGuardType.GLOBAL_AFTER].forEach(guard => {
            guard(to, from);
        });
    }
    
    // 更新 URL
    _updateURL(route) {
        if (this.mode === 'hash') {
            window.location.hash = route.path;
        } else {
            history.pushState({}, '', route.path);
        }
    }
    
    // 初始化（监听 URL 变化）
    init() {
        if (this.mode === 'hash') {
            window.addEventListener('hashchange', () => {
                const path = window.location.hash.slice(1);
                this.push(path);
            });
            
            // 初始导航
            const path = window.location.hash.slice(1) || '/';
            this.push(path);
        } else {
            window.addEventListener('popstate', () => {
                this.push(window.location.pathname);
            });
            
            this.push(window.location.pathname);
        }
        
        this.isReady = true;
    }
}

// ========================================
// 测试代码
// ========================================

console.log('=== Vue Router 导航守卫测试 ===\n');

// 创建路由实例
const router = new VueRouter({
    mode: 'hash',
    routes: [
        { path: '/', component: { name: 'Home' } },
        { path: '/user/:id', component: { name: 'User' } },
        { path: '/admin', component: { name: 'Admin' } }
    ]
});

// 注册全局前置守卫
router.beforeEach((to, from) => {
    console.log(`🔒 全局前置守卫：${from?.path || 'none'} → ${to.path}`);
    
    // 模拟权限检查
    if (to.path === '/admin' && !localStorage.getItem('isAdmin')) {
        console.log('❌ 无权限访问，重定向到首页');
        return '/';
    }
    
    return true;
});

// 注册全局后置守卫
router.afterEach((to, from) => {
    console.log(`✅ 导航完成：${from?.path || 'none'} → ${to.path}`);
});

// 模拟导航
(async () => {
    console.log('\n--- 测试 1: 正常导航 ---');
    await router.push('/');
    
    console.log('\n--- 测试 2: 带参数的路由 ---');
    await router.push('/user/123');
    
    console.log('\n--- 测试 3: 权限拦截 ---');
    await router.push('/admin');
    
    console.log('\n✅ Vue Router 导航守卫测试完成！');
})();
