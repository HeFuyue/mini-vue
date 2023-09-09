import {createElementVNode, createTextVNode, createEmptyVNode} from './vdom/index.js'
import {patch} from './vdom/patch.js'
import Watcher from './observe/watcher.js'

// initLifeCycle()方法用来给Vue添加_c, _v, _s, _render, _update方法
export function initLifeCycle(Vue) {
    Vue.prototype._c = function () {
        // _c()方法调用createElementVNode()将AST语法树中的普通节点转换为虚拟DOM
        return createElementVNode(this, ...arguments)
    }

    Vue.prototype._v = function () {
        // _v()方法调用createTextVNode()将AST语法树中的文本节点转换为虚拟DOM
        return createTextVNode(this, ...arguments)
    }

    Vue.prototype._s = function (value) {
        // _s()方法将插值语法转换为值
        if (typeof value == 'object') return value
        // return JSON.stringify(value)
        return value
    }

    Vue.prototype._e = function () {
        return createEmptyVNode()
    }

    Vue.prototype._l = function (val, render) {
        let children = []
        if (Array.isArray(val) || typeof val === 'string') {
            for (let i = 0; i < val.length; i++) {
                children.push(render(val[i], i))
                children._isVList = true
            }
        } else if (typeof val === 'number') {
            for (i = 0; i < val; i++) {
                children[i] = render(i + 1, i)
            }
        } else if (typeof val === 'object') {
            keys = Object.keys(val)
            for (i = 0; i < keys.length; i++) {
                key = keys[i]
                children[i] = render(val[key], key, i)
            }
        }
        return children
    }

    Vue.prototype._t = function(name, props) {
        let scopedSlotFn = this.$scopedSlots[name]
        let nodes
        if (scopedSlotFn) {
            // scoped slot
            props = props || {}
            nodes = scopedSlotFn(props)
            if (nodes) {
                const {vm, tag, data, children} = nodes
                return createElementVNode(vm, tag, data, children)
            }
        } else {
            nodes = this.$slots[name]
            if (nodes) {
                const {vm, tag, data, children} = nodes[0]
                return createElementVNode(vm, tag, data, children)
            } else {
                return createEmptyVNode()
            }
        }
    }

    Vue.prototype._u = function(fns, res) {
        res = res || {}
        for (let i = 0; i < fns.length; i++) {
            let slot = fns[i]
            if (slot) {
                res[slot.key] = slot.fn
            }
        }
        return res
    }

    Vue.prototype._render = function () {
        // _render()方法用来调用compileToFunction()生成的render方法（被挂在vm.$options上）, 返回相应的虚拟DOM
        const vm = this
        return vm.$options.render.call(vm)
    }

    Vue.prototype._update = function (vnode) {
        // _update()方法接收虚拟DOM, 调用patch()方法实现初次挂载真实DOM或更新真实DOM
        const vm = this
        const el = vm.$el
        const preNode = vm._vnode // 将更新前的虚拟DOM保存在实例的_vnode中
        vm._vnode = vnode // 将实例上的_vnode更新, 以便下一次更新时拿到当前的虚拟DOM

        if (preNode) { // 更新前有虚拟DOM, 不是初次渲染, 走更新流程
            vm.$el = patch(preNode, vnode)
        } else { // 更新前没有虚拟DOM, 是初次渲染, 走初次渲染流程
            vm.$el = patch(el, vnode)
        }
    }
}

export function mountComponent(vm, el) {
    // mountComponent()方法将el挂载在vm上, 再调用vm上的_render()方法生成el的虚拟DOM, 再对虚拟DOM调用vm身上的_update()方法挂载或更新真实DOM
    vm.$el = el
    
    // 重新渲染页面的方法
    const updateComponent = () => {
        vm._update(vm._render())
    }

    vm._watcher = new Watcher(vm, updateComponent, true) // 渲染页面的逻辑封装在watcher中
    // console.log(watcher)
}

export function callHook(vm, hook) { // 调用生命周期函数的方法
    const handlers = vm.$options[hook]

    if (handlers) handlers.forEach(handler => handler.call(vm))
}
