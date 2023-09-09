import {callHook} from "../lifeCycle.js"
import { updateChildComponent } from "./patch.js"

export function createElementVNode(vm, tag, data, ...children) {
    // createElementVNode()方法生成普通节点的虚拟DOM
    if (data == null) data = {}
    let key = data.key
    if (key !== undefined) delete data.key
    let directives = data.directives
    if (directives) delete data.directives
    if (Array.isArray(children[0])) children = children[0]
    if (isReservedTag(tag)) { // HTML节点
        return vnode(vm, tag, key, data, children, null, undefined, false, directives)
    } else { // 组件节点
        let Ctor = vm.$options.components[tag] // Ctor是组件的构造函数, 是在vm.$options.components的原型链上找到的
        // console.log(vm.$options.components.__proto__)
        return createComponentVnode(vm, tag, key, data, children, Ctor, directives)
    }
}

export function createTextVNode(vm, text) {
    // createTextVNode()方法生成文本节点的虚拟DOM
    return vnode(vm, undefined, undefined, undefined, undefined, text)

}

export function createEmptyVNode() {
    let text = ''
    return vnode(undefined, undefined, undefined, undefined, undefined, text)
}

function createComponentVnode(vm, tag, key, data, children, Ctor, directives) {
    // createComponentVnode()方法生成组件的虚拟DOM
    // Ctor = typeof Ctor === 'object' ? vm.__proto__.constructor.extend(Ctor) : Ctor
    // console.log(vm.__proto__.constructor = vm.$options._base) // 可以不用通过vm.$options._base拿到Vue构造函数上的静态方法
    if (typeof Ctor === 'object') {
        Ctor = vm.$options._base.extend(Ctor)
    }

    const propsData = extractPropsFromVNodeData(data, Ctor)
    const listeners = data.on
    data.on = data.nativeOn
    const ref = data.ref
    delete data.ref
    if (data.model) transformModel(Ctor.options, data)

    data.hook = { // 标识该虚拟DOM是组件节点, 同时保存其挂载方法
        _init(vnode) {
            let instance = vnode.componentInstance = new vnode.componentOptions.Ctor(vnode) // 获取该节点的构造函数Ctor随后实例化, 并将该组件实例挂在vnode.componentInstance上
            if (vnode.directives) instance.directives = vnode.directives
            callHook(vnode.componentInstance, 'beforeMount')
            instance.$mount() // 调用组件实例的$mount()方法 -> 调用mountComponent()方法, instance上会增加$el
            callHook(vnode.componentInstance, 'mounted')
            if (instance.directives) {
                instance.directives.forEach(directive => {
                    if (directive.name === 'show') {
                        console.log(instance)
                        instance.$el.setAttribute('style', `display: ${directive.value ? 'block' : 'none'}`)
                    }
                })
            }
        },

        prepatch(oldVnode, vnode) {
            let options = vnode.componentOptions
            let child = (vnode.componentInstance = oldVnode.componentInstance)
            updateChildComponent(child, options.propsData, // updated props
            options.listeners, // updated listeners
            vnode, // new parent vnode
            options.children // new children
            )
        }
    }

    return vnode(vm, tag, key, data, undefined, null, {Ctor, propsData, listeners, ref, children: children}, true, directives)
}

function vnode(vm, tag, key, data, children, text, componentOptions, _isComponent, directives) {
    return {
        vm,
        tag,
        key,
        data,
        children,
        text,
        componentOptions,
        _isComponent,
        directives
    }
}

function isReservedTag(tag) { // 判断节点是否是组件节点
    return ['a', 'div', 'p', 'span', 'button', 'ul', 'li', 'html', 'body', 'head', 'link', 'meta', 'style', 
    'title', 'footer', 'header', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'nav', 'section', 'dd', 'dl', 'dt', 'img', 'input', 'checkbox'].includes(tag)
}

export function isSameVnode(vnode1, vnode2) { // 比较两个虚拟DOM是否相同：1、标签名是否相同；2、标签的key是否相同
    return vnode1.tag === vnode2.tag && vnode1.key === vnode2.key
}

function extractPropsFromVNodeData(data, Ctor) {
    let propOptions = Ctor.options.props
    if (!propOptions) return

    const res = {}

    for (let key in propOptions) {
        checkProp(res, data, propOptions[key])
    }

    return res;
}

function checkProp(res, data, key) {
    if (!data.props) data.props = {}
    if (data[key] !== undefined) {
        res[key] = data[key]
        data.props[key] = data[key]
        delete data[key]
    } else {
        delete data.props[key]
    }
}

function transformModel(options, data) {
    var prop = (options.model && options.model.prop) || 'value';
    var event = (options.model && options.model.event) || 'input';
    (data.attrs || (data.attrs = {}))[prop] = data.model.value;
    var on = data.on || (data.on = {});
    var existing = on[event];
    var callback = data.model.callback;
    if (isDef(existing)) {
        if (isArray(existing)
            ? existing.indexOf(callback) === -1
            : existing !== callback) {
            on[event] = [callback].concat(existing);
        }
    }
    else {
        on[event] = callback;
    }
}

export function renderSlot(name, fallbackRender, props, bindObject) {
    // var scopedSlotFn = this.$scopedSlots[name];
    var nodes
    /* if (scopedSlotFn) {
        // scoped slot
        props = props || {};
        if (bindObject) {
            if (!isObject(bindObject)) {
                warn$2('slot v-bind without argument expects an Object', this);
            }
            props = extend(extend({}, bindObject), props);
        }
        nodes =
            scopedSlotFn(props) ||
                (isFunction(fallbackRender) ? fallbackRender() : fallbackRender);
    }
    else { */
        nodes =
            this.$slots[name] ||
                (isFunction(fallbackRender) ? fallbackRender() : fallbackRender);
    // }
    console.log(nodes)
    var target = props && props.slot;
    if (target) {
        return this.$createElement('template', { slot: target }, nodes);
    }
    else {
        return nodes;
    }
}
