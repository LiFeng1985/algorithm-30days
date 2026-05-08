/**
 * React Server Components (RSC) 简化版实现
 * 核心：流式渲染 + 组件序列化
 */

// 模拟服务端环境
class ReactServer {
    constructor() {
        this.components = new Map();
    }

    // 注册服务端组件
    registerComponent(name, component) {
        this.components.set(name, component);
    }

    // 渲染组件为 RSC Payload
    async renderToStream(componentName, props) {
        const Component = this.components.get(componentName);
        if (!Component) throw new Error(`Component ${componentName} not found`);

        // 执行组件函数（服务端）
        const result = await Component(props);
        
        // 序列化为 RSC 协议格式
        return this.serialize(result);
    }

    // 简化的序列化逻辑
    serialize(node) {
        if (typeof node === 'string') {
            return `S:${JSON.stringify(node)}`;
        }
        if (Array.isArray(node)) {
            return `A:[${node.map(child => this.serialize(child)).join(',')}]`;
        }
        if (node && typeof node === 'object' && node.type) {
            const propsStr = JSON.stringify(node.props || {});
            return `J:${node.type},${propsStr}`;
        }
        return 'null';
    }
}

// 模拟客户端环境
class ReactClient {
    constructor(serverPayload) {
        this.payload = serverPayload;
        this.root = null;
    }

    // 解析 RSC Payload
    parsePayload(payload) {
        const tokens = payload.split(',');
        return this.parseTokens(tokens, 0).root;
    }

    parseTokens(tokens, index) {
        const token = tokens[index];
        if (token.startsWith('S:')) {
            return { root: JSON.parse(token.slice(2)), nextIndex: index + 1 };
        }
        if (token.startsWith('J:')) {
            const parts = token.slice(2).split(',');
            const type = parts[0];
            const props = JSON.parse(parts.slice(1).join(','));
            return { 
                root: { type, props, children: [] }, 
                nextIndex: index + 1 
            };
        }
        return { root: null, nextIndex: index + 1 };
    }

    // 挂载到 DOM
    mount(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const vdom = this.parsePayload(this.payload);
        container.innerHTML = this.renderVdomToHtml(vdom);
    }

    renderVdomToHtml(vdom) {
        if (!vdom) return '';
        if (typeof vdom === 'string') return vdom;
        if (vdom.type) {
            const children = (vdom.children || []).map(child => this.renderVdomToHtml(child)).join('');
            return `<${vdom.type}>${children}</${vdom.type}>`;
        }
        return '';
    }
}

// ========================================
// 测试代码
// ========================================

console.log('=== React Server Components (RSC) 测试 ===\n');

// 1. 定义服务端组件
const Article = ({ title, content }) => {
    return {
        type: 'article',
        props: { className: 'post' },
        children: [
            { type: 'h1', props: {}, children: [title] },
            { type: 'p', props: {}, children: [content] }
        ]
    };
};

const App = ({ id }) => {
    // 模拟服务端数据获取
    const data = { title: 'RSC 深度解析', content: '这是来自服务端的内容...' };
    return {
        type: 'div',
        props: { id: `app-${id}` },
        children: [Article(data)]
    };
};

// 2. 服务端渲染
const server = new ReactServer();
server.registerComponent('App', App);

(async () => {
    console.log('🚀 服务端开始渲染...');
    const payload = await server.renderToStream('App', { id: 1 });
    console.log('📦 RSC Payload:', payload);

    // 3. 客户端接收并挂载
    console.log('\n💻 客户端接收 Payload 并挂载...');
    // 模拟 DOM 环境
    global.document = {
        getElementById: (id) => ({ innerHTML: '' })
    };
    
    const client = new ReactClient(payload);
    client.mount('root');
    
    console.log('\n✅ RSC 流程测试完成！');
})();
