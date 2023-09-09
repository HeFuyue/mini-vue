import {isSameVnode} from './index.js'
import {resolveSlots} from '../state.js'

export function patch(oldValue, newValue) {
    // patch方法接收两个参数, oldValue为虚拟DOM（初次挂载情况）或者更新前的真实DOM（更新DOM情况）, 对真实DOM做初次挂载或更新
    if (!oldValue) { // 组件的挂载
        return createElement(newValue) // 返回vm.$el, 此时vm.$el就是组件渲染的结果
    }
    
    const isRealElement = oldValue.nodeType // 判断是否为真实DOM

    if (isRealElement) { // oldValue为真实DOM, 进行更新
        let newElement = createElement(newValue)
        let parentElement = oldValue.parentNode
        parentElement.insertBefore(newElement, oldValue.nextSibling)
        parentElement.removeChild(oldValue)
        return newElement
    } else {
        // oldValue为虚拟DOM, 利用diff算法进行比较
        return patchVnode(oldValue, newValue)
    }
}

function patchVnode(oldVnode, newVnode) { // 虚拟DOM的Diff算法
    if (!isSameVnode(oldVnode, newVnode)) { // 两个虚拟DOM标签名或者key不同, 即不是相同节点, 直接替换
        let el = createElement(newVnode)
        oldVnode.el.parentNode.replaceChild(el, oldVnode.el)
        return el
    }

    let el = newVnode.el = oldVnode.el // 是相同节点, 则复用老节点元素 

    if (oldVnode._isComponent) updateComponent(oldVnode, newVnode)

    if (!oldVnode.tag) {  // 是文本节点, 比较文本的内容
        if (newVnode.text != oldVnode.text) {
            el.textContent = newVnode.text
        }
    }

    // 接下来需要对比标签属性
    patchProps(el, oldVnode, newVnode)

    // 接下来需要对比子节点
    patchChildren(el, oldVnode.children || [], newVnode.children || [])

    return el
}

function patchProps(el, oldVnode, newVnode) {
    let oldProps = oldVnode.data || {}
    let newProps = newVnode.data || {}
    let oldStyle = oldProps.style || {}
    let newStyle = newProps.style || {}

    for (let key in oldStyle) { // 老节点中有新节点没有的样式, 将老节点中的该样式删除
        if (!newStyle[key]) {
            el.style[key] = ''
        }
    }

    for (let key in oldProps) { // 老节点中有新节点没有的标签属性, 将老节点中的该标签属性删除
        if (!newProps[key] && key !== 'on') {
            el.removeAttribute(key)
        }
    }

    for (let key in newProps) { // 新老节点都有的属性, 循环更新节点属性
        if (key === 'attrs') {
            Object.keys(newProps.attrs).forEach(attrName => el.setAttribute(attrName, newProps.attrs[attrName]))
        } else if (key === 'style') {
            for (let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName]
            }
        } else if (key === 'on') {
            /* Object.keys(newProps.on).forEach(handlerName => {
                el.addEventListener(handlerName, newProps.on[handlerName])
            }) */
        } else if (key === 'ref') {
            // vm.$refs[newProps.ref] = el
        } else if (key === 'props') {
            oldProps.props = newProps.props
        } else if (key === 'hook') {

        } else {
            el.setAttribute(key, newProps[key])
        }
    }

    if (newVnode.directives) {
        newVnode.directives.forEach(directive => {
            if (directive.name === 'show') {
                el.removeAttribute('style')
                // console.log(typeof directive.value, `display: ${directive.value ? 'block' : 'none'}`)
                el.setAttribute('style', `display: ${directive.value ? 'block' : 'none'}`)
            } else if (directive.name === 'model') {
                if (el.nodeName === 'INPUT') {
                    if (newVnode.data.attrs.type === 'text') {
                        newVnode.el.value = directive.value
                    } else if (newVnode.data.attrs.type === 'checkbox') {
                        newVnode.el.checked = directive.value
                    }
                }
            } else {
                console.log(newVnode)
                Object.keys(newVnode.vm.$options.directives).forEach(key => {
                    if (key === directive.name) {
                        let directiveMatch = newVnode.vm.$options.directives[key]

                        if (directiveMatch) directiveMatch.update(newVnode.el, directive)
                    }
                })
            }
        })
    }

    return el
}

function patchChildren(el, oldChildren, newChildren) {
    if (oldChildren.length && newChildren.length) { // 新老节点中都有子元素, 进行完整的对比
        updateChildren(el, oldChildren, newChildren)
    } else if (!oldChildren.length) { // 老节点没有子元素, 则将新节点所有子元素挂在el上
        newChildren.forEach(child => {
            el.appendChild(createElement(child))
            /* const childElement = createElement(child)
            el.appendChild(childElement)
            console.log(child) */
        })
    } else if (!newChildren.length) { // 新节点没有子元素, 则将el中所有子元素删除
        el.innerHTML = ''
    }

    return el
}

function updateChildren(el, oldChildren, newChildren) {
    // 采用双指针, 同级比对子节点
    let oldChildrenStartIndex = 0
    let newChildrenStartIndex = 0
    let oldChildrenEndIndex = oldChildren.length - 1
    let newChildrenEndIndex = newChildren.length - 1

    let oldStartVnode = oldChildren[oldChildrenStartIndex]
    let newStartVnode = newChildren[newChildrenStartIndex]
    let oldEndVnode = oldChildren[oldChildrenEndIndex]
    let newEndVnode = newChildren[newChildrenEndIndex]

    function makeIndexByKey(children) {
        let map = {}
        children.forEach((child, index) => map[child.key] = index)
        return map
    }

    let map = makeIndexByKey(oldChildren)

    // if (oldChildrenEndIndex === 0 && newChildrenEndIndex === 0) patchVnode(oldStartVnode, newStartVnode)

    while (oldChildrenStartIndex !== oldChildrenEndIndex || newChildrenStartIndex !== newChildrenEndIndex) {
        // 如果新旧子节点有一方的头指针与尾指针重合, 说明对比已经结束
        if (!oldStartVnode) {
            oldStartVnode = oldChildren[++oldChildrenStartIndex]
        } else if (!oldEndVnode) {
            oldEndVnode = oldChildren[__oldChildrenEndIndex]
        } else if (isSameVnode(oldStartVnode, newStartVnode)) { // 如果新旧节点中的头节点相同, 从头开始对比(这样比较对数组尾部操作(push, pop等)效率较高)
            patchVnode(oldStartVnode, newStartVnode)
            oldStartVnode = oldChildren[++oldChildrenStartIndex] // 每次比对后, 新旧节点的头指针向后移动到下一个节点
            newStartVnode = newChildren[++newChildrenStartIndex]
        } else if (isSameVnode(oldEndVnode, newEndVnode)) { // 如果新旧节点中的尾节点相同, 从后面开始对比(这样比较对数组头部操作(shift, unshift等)效率较高)
            patchVnode(oldEndVnode, newEndVnode)
            oldEndVnode = oldChildren[--oldChildrenEndIndex]
            newEndVnode = newChildren[--newChildrenEndIndex]
        } else if (isSameVnode(oldEndVnode, newStartVnode)) { // 新的头节点与旧的尾节点相同, 进行交叉对比(这样比较对数组的排序操作(reverse, sort等)效率较高)
            patchVnode(oldEndVnode, newStartVnode)
            el.insertBefore(oldEndVnode.el, oldStartVnode.el)
            oldEndVnode = oldChildren[--oldChildrenEndIndex]
            newStartVnode = newChildren[++newChildrenStartIndex]
        } else if (isSameVnode(oldStartVnode, newEndVnode)) { // 旧的头节点与新的尾节点相同, 进行交叉对比(这样比较对数组的排序操作(reverse, sort等)效率较高)
            patchVnode(oldStartVnode, newEndVnode)
            el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
            oldStartVnode = oldChildren[++oldChildrenStartIndex]
            newEndVnode = newChildren[--newChildrenEndIndex]
        } else { // 新旧节点的头尾都不相同, 想要尽量复用节点, 进行乱序对比
            let moveIndex = map[newStartVnode.key]
            
            if (moveIndex != undefined) {
                let moveVnode = oldChildren[moveIndex]
                el.insertBefore(moveVnode.el, oldStartVnode.el)
                oldChildren[moveIndex] = undefined
                patch(moveVnode, newStartVnode)
            } else {
                el.insertBefore(createElement(newStartVnode).el, oldStartVnode.el)
            }

            newStartVnode = newChildren[++newChildrenStartIndex]
        }
    }

    patchVnode(oldStartVnode, newStartVnode) // 如果children只有一项的情况/双指针重合但双指针所指的节点还没有比对

    if (oldChildrenStartIndex < oldChildrenEndIndex) {
        // 对比结束后旧节点中还有子节点的情况, 说明删除了部分旧节点, 应当把这些剩余的子节点删除
        for (let index = oldChildrenStartIndex; index <= oldChildrenEndIndex; index++) {
            let childEl = oldChildren[index].el
            el.removeChild(childEl)
        }
    }

    if (newChildrenStartIndex < newChildrenEndIndex) {
        // 对比结束后新节点中还有子节点的情况, 说明增加了新节点, 应当把这些子节点挂在el上
        for (let index = newChildrenStartIndex; index <= newChildrenEndIndex; index++) {
            // el.appendChild(createElement(newChildren[index]))
            let anchor = newChildren[newChildrenEndIndex + 1] ? newChildren[newChildrenEndIndex + 1].el : null // 新节点有可能向前或者向后插入, 经过比对后如果新节点的尾指针后面没有元素, 说明是向后插入；如果后面有元素, 说明是向前插入
            el.insertBefore(childEl, anchor) // 如果anchor是null, 默认是appendChild
        }
    }
}

export function updateChildComponent(vm, propsData, listeners, parentVnode, renderChildren) {
    /* var prevVNode = vm.$vnode
    vm.$options._parentVnode = parentVnode
    vm.$vnode = parentVnode // update vm's placeholder node without re-render
    if (vm._vnode) {
        // update child tree's parent
        vm._vnode.parent = parentVnode
    }
    vm.$options._renderChildren = renderChildren
    // update $attrs and $listeners hash
    // these are also reactive so they may trigger child update if the child
    // used them during render
    var attrs = parentVnode.data.attrs || emptyObject;
    if (vm._attrsProxy) {
        // force update if attrs are accessed and has changed since it may be
        // passed to a child component.
        if (syncSetupProxy(vm._attrsProxy, attrs, (prevVNode.data && prevVNode.data.attrs) || emptyObject, vm, '$attrs')) {
            needsForceUpdate = true;
        }
    } */
    var attrs = parentVnode.data.attrs || {}
    vm.$attrs = attrs
    vm.$options._renderChildren = renderChildren
    var needsForceUpdate = !!(renderChildren || // has new static slots
    vm.$options._renderChildren || // has old static slots
    hasDynamicScopedSlot)
    /* // update listeners
    listeners = listeners || emptyObject;
    var prevListeners = vm.$options._parentListeners;
    if (vm._listenersProxy) {
        syncSetupProxy(vm._listenersProxy, listeners, prevListeners || emptyObject, vm, '$listeners');
    }
    vm.$listeners = vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, prevListeners); */
    // update props
    if (propsData && vm.$options.props) {
        var props = vm._props
        Object.keys(propsData).forEach(key => {
            props[key] = propsData[key]
        })
        vm.$options.propsData = propsData
    }
    if (needsForceUpdate) {
        vm.$slots = resolveSlots(renderChildren, parentVnode.context)
        vm._watcher.update()
    }
}

function createComponent(vnode) { // createComponent()方法判断虚拟DOM是否为组件节点, 如果是组件节点, 再调用其_init()方法
    let i = vnode.data

    if ((i = i.hook) && (i = i._init)) { // 组件节点的vnode中的data具有hook属性, 先将i赋值为vnode.data.hook, 再将i赋值为vnode.data.hook._init
        i(vnode)
    }

    if (vnode.componentInstance) {
        return true
    }
}

function updateComponent(oldVnode, newVnode) {
    let i = newVnode.data
    if (i && (i = i.hook) && (i = i.prepatch)) {
        i(oldVnode, newVnode)
    }

}

export function createElement(vnode) {
    // createElement()方法将虚拟DOM转换为真实DOM
    const {vm, tag, data, children, text, directives} = vnode

    if (typeof tag === 'string') { // 普通节点
        // debugger
        if(createComponent(vnode)) { // 组件节点
            return vnode.componentInstance.$el
        }

        vnode.el = document.createElement(tag)
        for (let key in data) {
            if (key === 'attrs') {
                Object.keys(data.attrs).forEach(attrName => vnode.el.setAttribute(attrName, data.attrs[attrName]))
            } else if (key === 'style') {
                let styleString = ''
                for (let styleKey in data.style) {
                    styleString += `${styleKey}: ${data.style[styleKey]}; `
                }
                vnode.el.setAttribute('style', styleString.slice(0, -2))
            } else if (key === 'on') {
                Object.keys(data.on).forEach(handlerName => {
                    vnode.el.addEventListener(handlerName, data.on[handlerName])
                })
            } else if (key === 'ref') {
                vm.$refs[data.ref] = vnode.el
            }  else {
                vnode.el.setAttribute(key, data[key])
            }
        }
        if (children.length) {
            children.forEach(item => {
                if (item._isVList) {
                    item.forEach(vlistItem => {
                        const childElement = createElement(vlistItem)
                        vnode.el.appendChild(childElement)
                        if (item.directives) {
                            item.directives.forEach(directive => {
                                Object.keys(vm.$options.directives).forEach(key => {
                                    if (key === directive.name) {
                                        let directiveMatch = vm.$options.directives[key]
                
                                        if (directiveMatch) {
                                            vm.$options.insertedDirectivesToResolve = vm.$options.insertedDirectivesToResolve || {}
                                            vm.$options.insertedDirectivesToResolve[key] = {element: childElement, binding: directive}
                                        }
                                    }
                                })
                            })
                        }
                    })
                } else {
                    const childElement = createElement(item)
                    vnode.el.appendChild(childElement)
                    if (item.directives) {
                        item.directives.forEach(directive => {
                            Object.keys(vm.$options.directives).forEach(key => {
                                if (key === directive.name) {
                                    let directiveMatch = vm.$options.directives[key]
            
                                    if (directiveMatch) {
                                        vm.$options.insertedDirectivesToResolve = vm.$options.insertedDirectivesToResolve || {}
                                        vm.$options.insertedDirectivesToResolve[key] = {element: childElement, binding: directive}
                                    }
                                }
                            })
                        })
                    }
                }
            })
        }
    } else { // 真实节点
        vnode.el = document.createTextNode(text)
    }

    if (directives) {
        directives.forEach(directive => {
            if (directive.name === 'show') {
                vnode.el.setAttribute('style', `display: ${directive.value ? 'block' : 'none'}`)
            } else if (directive.name === 'model') {
                if (vnode.el.nodeName === 'INPUT') {
                    if (vnode.data.attrs.type === 'text') {
                        vnode.el.value = directive.value
                    } else if (vnode.data.attrs.type === 'checkbox') {
                        vnode.el.checked = directive.value
                    }
                }
            } else {
                Object.keys(vm.$options.directives).forEach(key => {
                    if (key === directive.name) {
                        let directiveMatch = vm.$options.directives[key]

                        if (directiveMatch) directiveMatch.bind(vnode.el, directive)
                    }
                })
            }
        })
    }
    return vnode.el
}

function addHandler(el, name, value, modifiers, important, range, dynamic) {
    let events
    if (modifiers.native) {
        delete modifiers.native
        events = el.nativeEvents || (el.nativeEvents = {})
    }
    else {
        events = el.events || (el.events = {})
    }
    let newHandler = rangeSetItem({ value: value.trim(), dynamic: dynamic }, range)
    if (modifiers !== emptyObject) {
        newHandler.modifiers = modifiers
    }
    let handlers = events[name]

    if (Array.isArray(handlers)) {
        important ? handlers.unshift(newHandler) : handlers.push(newHandler)
    }
    else if (handlers) {
        events[name] = important ? [newHandler, handlers] : [handlers, newHandler]
    }
    else {
        events[name] = newHandler
    }
}
