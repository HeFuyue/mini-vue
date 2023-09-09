import {observe} from './observe/index.js'
import Watcher from './observe/watcher.js'
import Dep from './observe/dep.js'
import {defineReactive} from './observe/index.js'

export function initState(vm) {
    const options = vm.$options // 重新从vm身上获取用户传入的options

    if (options.data) {
        initData(vm) // 如果用户传入的配置项有data，则调用initData方法进行数据的响应式处理
    }

    if (options.computed) {
        initComputed(vm) // 如果用户传入的配置项有computed, 则调用initComputed方法实现计算属性
    }

    if (options.watch) {
        initWatch(vm)
    }

    if (options.props) {
        initProps(vm)
    }

    if (options.methods) {
        initMethods(vm, options.methods)
    }
}

function proxy(target, key, name) {
    Object.defineProperty(target, key, {
        get() {
            return target[name][key]
        },
        set(newValue) {
            target[name][key] = newValue
        }
    })
}

function initData(vm) {
    let data = vm.$options.data // 重新从vm身上获取到data属性
    data = typeof data === "function" ? data.call(vm) : data // data可能是对象或函数
    // console.log(data)
    observe(data) // 调用observe方法对data进行响应式处理
    vm._data = data // 将vm.$options上面的data赋给vm._data

    for (let key in data) {
        proxy(vm, key, '_data') // 将vm._data中的数据代理到vm中，可以不用通过vm._data.xxx来访问数据
    }
}

function initComputed(vm) {
    let computed = vm.$options.computed
    let watchers = vm._computedWatchers = {} // vm._computedWatchers存放着所有计算属性的计算属性watcher({lazy: true})

    for (let key in computed) {
        let userDef = computed[key]
        const getter = typeof userDef === 'function' ? userDef : userDef.get

        watchers[key] = new Watcher(vm, getter, {lazy: true}) // lazy属性表明该watcher经过new之后不会调用更新页面的方法, 并将该watcher存放在vm的_computedWatchers中

        defineComputed(vm, key, userDef) // defineComputed()方法用于实现计算属性
    }
}

function initWatch(vm) {
    let watch = vm.$options.watch

    for (let key in watch) { // 循环用户传入的被监测属性
        const handler = watch[key]

        if (typeof handler === 'string') { // 如果watch中写的是一个字符串, 会去methods中找同名的方法, 该属性变化后执行methods中对应的方法
            createWatcher(vm, key, vm[handler])
        } else if (Array.isArray(handler)) { // 如果被监测属性后面写的是一个数组, 则属性变化后执行数组中的所有回调
            for (let i = 0; i < handler.length; i++) {
                createWatcher(vm, key, handler[i])
            }
        } else { // watch中写的是函数, 在属性变化后直接调用
            createWatcher(vm, key, handler)
        }
    }
}

function initProps(vm) {
    const propsData = vm.$options.propsData || {}
    const props = vm._props = {}

    Object.keys(propsData).forEach(key => {
        defineReactive(props, key, propsData[key])
        if (!(key in vm)) {
            proxy(vm, key, '_props')
        }
    })
}

function initMethods(vm, methods) {
    for (let key in methods) {
        vm[key] = typeof methods[key] !== 'function' ? function() {} : methods[key].bind(vm)
    }
}

let target
function add(event, fn) {
    target.$on(event, fn)
}
function remove(event, fn) {
    target.$off(event, fn)
}

export function initRender(vm) {
    vm._vnode = null // the root of the child tree
    vm._staticTrees = null // v-once cached trees
    var options = vm.$options
    var parentVnode = (vm.$vnode = options._parentVnode) // the placeholder node in parent tree
    var renderContext = parentVnode && parentVnode.context
    vm.$slots = resolveSlots(options._renderChildren, renderContext)
    vm.$scopedSlots = resolveScopedSlots(options._renderChildren, renderContext)
    /* vm.$scopedSlots = parentVnode
        ? normalizeScopedSlots(vm.$parent, parentVnode.data.scopedSlots, vm.$slots)
        : emptyObject;
    // bind the createElement fn to this instance
    // so that we get proper render context inside it.
    // args order: tag, data, children, normalizationType, alwaysNormalize
    // internal version is used by render functions compiled from templates
    // @ts-expect-error
    vm._c = function (a, b, c, d) { return createElement$1(vm, a, b, c, d, false); };
    // normalization is always applied for the public version, used in
    // user-written render functions.
    // @ts-expect-error
    vm.$createElement = function (a, b, c, d) { return createElement$1(vm, a, b, c, d, true); };
    // $attrs & $listeners are exposed for easier HOC creation.
    // they need to be reactive so that HOCs using them are always updated
    var parentData = parentVnode && parentVnode.data; */
    /* istanbul ignore else */
    /* {
        defineReactive(vm, '$attrs', (parentData && parentData.attrs) || emptyObject, function () {
            !isUpdatingChildComponent && warn$2("$attrs is readonly.", vm);
        }, true);
        defineReactive(vm, '$listeners', options._parentListeners || emptyObject, function () {
            !isUpdatingChildComponent && warn$2("$listeners is readonly.", vm);
        }, true);
    } */
}

export function resolveSlots(children, context) {
    if (!children || !children.length) {
        return {};
    }
    var slots = {};
    for (var i = 0, l = children.length; i < l; i++) {
        var child = children[i];
        var data = child.data;
        // remove slot attribute if the node is resolved as a Vue slot node
        if (data && data.attrs && data.attrs.slot) {
            delete data.attrs.slot;
        }
        // named slots should only be respected if the vnode was rendered in the
        // same context.
        if ((child.context === context || child.fnContext === context) &&
            data &&
            data.slot != null) {
            var name_1 = data.slot;
            var slot = slots[name_1] || (slots[name_1] = []);
            if (child.tag === 'template') {
                slot.push.apply(slot, child.children || []);
            }
            else {
                slot.push(child);
            }
        }
        else {
            (slots.default || (slots.default = [])).push(child);
        }
    }
    // ignore slots that contains only whitespace
    /* for (var name_2 in slots) {
        if (slots[name_2].every(isWhitespace)) {
            delete slots[name_2];
        }
    } */
    return slots;
}

export function resolveScopedSlots(children) {
    if (!children || !children.length) {
        return {}
    }
    let scopedSlots = {}
    for (let i = 0; i < children.length; i++) {
        let child = children[i]
        let data = child.data
        if (data && data.scopedSlots != null) {
            let slot = data.scopedSlots
            scopedSlots = {...scopedSlots, ...slot}
        }
    }
    return scopedSlots
}

export function initEvents(vm) {
    let target
    vm._events = Object.create(null)
    let listeners = vm.$options._parentListeners
    if (listeners) {
        updateComponentListeners(vm, listeners)
    }
}

function updateComponentListeners(vm, listeners, oldListeners) {
    target = vm
    updateListeners(listeners, oldListeners || {}, add, remove, vm)
    target = undefined
}

function updateListeners(on, oldOn, add, remove) {
    let name, cur, old
    for (name in on) {
        cur = on[name]
        old = oldOn[name]
        if (old === undefined) {
            if (cur.fns === undefined) {
                cur = on[name]
            }
            add(name, cur)
        }
        else if (cur !== old) {
            old.fns = cur
            on[name] = old
        }
    }
    for (name in oldOn) {
        if (on[name] === undefined) {
            remove(name, oldOn[name])
        }
    }
}

function createWatcher(vm, target, cb) { // 无论watch有几种形式, 最终都转化为vm.$watch, 去构建用户自定义watcher
    vm.$watch(target, cb)
}

function defineComputed(target, key, userDef) {
    // const getter = typeof userDef === 'function' ? userDef : userDef.get
    const setter = typeof userDef === 'function' ? (() => {}) : userDef.set

    // 计算属性本质是一个响应式的属性, 利用Object.defineProperty()实现
    Object.defineProperty(target, key, {
        get: createComputedGetter(key),
        set: setter
    })
}

function createComputedGetter(key) {
    return function() {
        const watcher = this._computedWatchers[key] // 获取对应计算属性的计算属性watcher({lazy: true})
        // debugger
        if (watcher.dirty) { // 如果watcher的dirty属性为真, 则计算属性所依赖的属性发生了变化, 计算属性需要去更新(如果同一个计算属性在组件中使用多次, 则第一次计算时dirty为真, 计算完成后dirty改为假, 只要依赖的属性不更新, 那么后面的相同计算属性就不用再求值)
            watcher.evaluate() // 调用evaluate()方法进行计算属性的求值, 并将该计算属性的dirty改为假
        }

        if (Dep.target) {
            watcher.depend() // 此时计算属性watcher已经出栈, 再让计算属性所依赖的属性的dep记录下渲染watcher
        }
        // console.log(watcher)

        return watcher.value
    }
}
