/**
 * 极简版 Diff 算法实现（同层比较、双指针优化）
 */

class VNode {
    constructor(tag, props, children) {
        this.tag = tag;
        this.props = props || {};
        this.children = children || [];
    }
}

function diff(oldVNode, newVNode) {
    // 1. 如果标签不同，直接替换
    if (oldVNode.tag !== newVNode.tag) {
        return { type: 'REPLACE', node: newVNode };
    }

    // 2. 标签相同，比较属性
    const propsPatch = diffProps(oldVNode.props, newVNode.props);

    // 3. 比较子节点
    const childrenPatch = diffChildren(oldVNode.children, newVNode.children);

    return {
        type: 'UPDATE',
        props: propsPatch,
        children: childrenPatch
    };
}

function diffProps(oldProps, newProps) {
    const patches = [];
    // 简化处理：遍历新属性，有变化就记录
    for (let key in newProps) {
        if (newProps[key] !== oldProps[key]) {
            patches.push({ key, value: newProps[key] });
        }
    }
    return patches;
}

function diffChildren(oldChildren, newChildren) {
    const patches = [];
    const len = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0; i < len; i++) {
        if (i >= oldChildren.length) {
            patches.push({ type: 'ADD', index: i, node: newChildren[i] });
        } else if (i >= newChildren.length) {
            patches.push({ type: 'REMOVE', index: i });
        } else {
            patches.push(diff(oldChildren[i], newChildren[i]));
        }
    }
    return patches;
}

// 测试
const oldTree = new VNode('div', { id: 'app' }, [
    new VNode('p', {}, ['Hello']),
    new VNode('span', {}, ['World'])
]);

const newTree = new VNode('div', { id: 'app', class: 'container' }, [
    new VNode('p', {}, ['Hello Vue']),
    new VNode('span', {}, ['World'])
]);

console.log(JSON.stringify(diff(oldTree, newTree), null, 2));
