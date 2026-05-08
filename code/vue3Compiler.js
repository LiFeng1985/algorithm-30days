/**
 * Vue 3 编译器简化版实现
 * 核心：静态提升 + PatchFlags 标记
 */

// PatchFlags 枚举
const PatchFlags = {
    TEXT: 1,
    CLASS: 2,
    STYLE: 4,
    PROPS: 8,
    FULL_PROPS: 16,
    HOISTED: -1
};

// AST 节点类型
const NodeTypes = {
    ELEMENT: 1,
    TEXT: 2,
    INTERPOLATION: 3,
    COMPOUND_EXPRESSION: 4
};

// 编译器主类
class VueCompiler {
    constructor() {
        this.hoists = []; // 静态提升的节点
    }
    
    // 编译入口
    compile(template) {
        // 1. 解析模板为 AST
        const ast = this.parse(template);
        
        // 2. 转换 AST（静态提升、PatchFlags 标记）
        this.transform(ast);
        
        // 3. 生成渲染函数代码
        const code = this.generate(ast);
        
        return {
            ast,
            code,
            hoists: this.hoists
        };
    }
    
    // 简化的模板解析器
    parse(template) {
        // 这里省略完整的 HTML 解析逻辑
        // 实际实现需要使用正则或状态机解析标签、属性、文本
        
        // 示例：简单解析 <div><span>静态文本</span><p>{{ dynamic }}</p></div>
        return {
            type: NodeTypes.ELEMENT,
            tag: 'div',
            props: [],
            children: [
                {
                    type: NodeTypes.ELEMENT,
                    tag: 'span',
                    props: [],
                    children: [
                        { type: NodeTypes.TEXT, content: '静态文本' }
                    ]
                },
                {
                    type: NodeTypes.ELEMENT,
                    tag: 'p',
                    props: [],
                    children: [
                        { type: NodeTypes.INTERPOLATION, content: 'dynamic' }
                    ]
                }
            ]
        };
    }
    
    // AST 转换
    transform(node) {
        if (node.type === NodeTypes.ELEMENT) {
            // 检查是否是静态节点
            if (this.isStaticNode(node)) {
                node.patchFlag = PatchFlags.HOISTED;
                this.hoists.push(node);
            } else {
                // 标记动态节点的 PatchFlags
                node.patchFlag = this.analyzeDynamicFlags(node);
            }
            
            // 递归处理子节点
            for (const child of node.children) {
                this.transform(child);
            }
        }
    }
    
    // 判断是否是静态节点
    isStaticNode(node) {
        if (node.type !== NodeTypes.ELEMENT) {
            return node.type === NodeTypes.TEXT;
        }
        
        // 检查是否有动态绑定
        for (const prop of node.props) {
            if (prop.type === 'directive' || prop.type === 'interpolation') {
                return false;
            }
        }
        
        // 递归检查子节点
        for (const child of node.children) {
            if (!this.isStaticNode(child)) {
                return false;
            }
        }
        
        return true;
    }
    
    // 分析动态节点的 PatchFlags
    analyzeDynamicFlags(node) {
        let flags = 0;
        
        for (const child of node.children) {
            if (child.type === NodeTypes.INTERPOLATION) {
                flags |= PatchFlags.TEXT;
            }
        }
        
        for (const prop of node.props) {
            if (prop.name === 'class' && prop.isDynamic) {
                flags |= PatchFlags.CLASS;
            } else if (prop.name === 'style' && prop.isDynamic) {
                flags |= PatchFlags.STYLE;
            } else if (prop.type === 'directive') {
                flags |= PatchFlags.PROPS;
            }
        }
        
        return flags || PatchFlags.FULL_PROPS;
    }
    
    // 生成渲染函数代码
    generate(ast) {
        const hoistedCode = this.hoists.map((node, index) => {
            return `const _hoisted_${index + 1} = ${this.generateNode(node)};`;
        }).join('\n');
        
        const renderCode = `function render(_ctx) {
    return ${this.generateNode(ast, true)};
}`;
        
        return `${hoistedCode}\n\n${renderCode}`;
    }
    
    // 生成单个节点的代码
    generateNode(node, isRoot = false) {
        if (node.patchFlag === PatchFlags.HOISTED) {
            const index = this.hoists.indexOf(node);
            return `_hoisted_${index + 1}`;
        }
        
        if (node.type === NodeTypes.TEXT) {
            return JSON.stringify(node.content);
        }
        
        if (node.type === NodeTypes.INTERPOLATION) {
            return `_ctx.${node.content}`;
        }
        
        if (node.type === NodeTypes.ELEMENT) {
            const props = this.generateProps(node.props);
            const children = node.children.map(child => this.generateNode(child)).join(', ');
            const flag = node.patchFlag ? `, ${node.patchFlag} /* ${this.getFlagName(node.patchFlag)} */` : '';
            
            return `h('${node.tag}'${props ? ', ' + props : ''}${children ? ', ' + children : ''}${flag})`;
        }
        
        return 'null';
    }
    
    // 生成属性代码
    generateProps(props) {
        if (props.length === 0) return null;
        
        const obj = {};
        for (const prop of props) {
            obj[prop.name] = prop.value || `$_ctx.${prop.name}`;
        }
        
        return JSON.stringify(obj);
    }
    
    // 获取 PatchFlags 名称
    getFlagName(flag) {
        const names = {
            [PatchFlags.TEXT]: 'TEXT',
            [PatchFlags.CLASS]: 'CLASS',
            [PatchFlags.STYLE]: 'STYLE',
            [PatchFlags.PROPS]: 'PROPS',
            [PatchFlags.FULL_PROPS]: 'FULL_PROPS',
            [PatchFlags.HOISTED]: 'HOISTED'
        };
        return names[flag] || 'UNKNOWN';
    }
}

// ========================================
// 测试代码
// ========================================

console.log('=== Vue 3 编译器测试 ===\n');

const compiler = new VueCompiler();

const template = `
<div class="container">
    <h1>静态标题</h1>
    <p>静态段落</p>
    <p>{{ dynamicText }}</p>
    <span :class="dynamicClass">动态 class</span>
</div>
`;

const result = compiler.compile(template);

console.log('📝 生成的代码：\n');
console.log(result.code);

console.log('\n📊 静态提升节点数：', result.hoists.length);
console.log('\n✅ 编译器测试完成！');
