import {initState, initEvents, initRender} from './state.js'
import {compileToFunction} from './compiler/index.js'
import {set, del} from './observe/index.js'
import {mountComponent, callHook} from './lifeCycle.js'
import Watcher, {nextTick} from './observe/watcher.js'
import {mergeOptions} from './utils.js'

export function initMixin(Vue) {
    // console.log('@initMixin方法用于给Vue添加_init方法')
    Vue.prototype._init = function(options) {
        const vm = this // 原型中this指向实例
        // 是否是组件
        if (options && options._isComponent) {
            initInternalComponent(vm, options)
        } else {
            vm.$options = mergeOptions(this.constructor.options, options) // 给vm添加$options属性, 将用户的选项和定义的全局指令(this.constructor指向Vue/Sub(对子组件来说)构造函数, 上面的静态属性Vue.options中包含全局指令等), 过滤器都放在$options中}
        }

        initEvents(vm)
        initRender(vm)
        callHook(vm, 'beforeCreate')
        initState(vm) // 给vm添加data, methods, computed等等属性
        callHook(vm, 'created')

        if (options.el) {
            callHook(vm, 'beforeMount')
            vm.$mount(options.el)
            callHook(vm, 'mounted')
            if (vm.$options.insertedDirectivesToResolve) {
                Object.keys(vm.$options.insertedDirectivesToResolve).forEach(key => {
                    const directive = vm.$options.insertedDirectivesToResolve[key]
                    const insertedFn = vm.$options.directives[key].inserted
                    insertedFn.call(vm, directive.element, directive.binding)
                })
                delete vm.$options.insertedDirectivesToResolve
            }
        }
    }

    Vue.prototype.$mount = function(el) {
        const vm = this
        const element = document.querySelector(el)
        const ops = vm.$options

        if (!ops.render) { // 没有render函数的情况下
            let template // 选择template
            if (!ops.template && element) { // 没写template, 有element, 模板采用element
                template = element.outerHTML
            } else { // 有template, 模板采用template
                template = ops.template
            }

            if (template) { // 没写render, 有了上面的模板的情况下, 利用自己的render方法, 将模板编译
                const render = compileToFunction(template)
                ops.render = render // 给vm.$options补充render方法
            }
        }

        mountComponent(vm, element) // mountComponent方法将模板编译为虚拟DOM, 转换为真实DOM挂在element上, 或者将旧的真实DOM进行更新
    }

    Vue.prototype.$set = set

    Vue.prototype.$delete = del

    Vue.prototype.$on = function (event, fn) {
        const vm = this
        if (Array.isArray(event)) {
            for (let i = 0; i < event.length; i++) {
                vm.$on(event[i], fn)
            }
        }
        else {
            (vm._events[event] || (vm._events[event] = [])).push(fn)
        }
        return vm
    }

    Vue.prototype.$off = function (event, fn) {
        const vm = this

        if (!arguments.length) {
            vm._events = Object.create(null)
            return vm
        }

        if (isArray(event)) {
            for (let i = 0; i < event.length; i++) {
                vm.$off(event[i], fn)
            }
            return vm
        }
        // specific event
        var cbs = vm._events[event]
        if (!cbs) {
            return vm
        }
        if (!fn) {
            vm._events[event] = null
            return vm
        }
        // specific handler
        var cb
        var i = cbs.length
        while (i--) {
            cb = cbs[i]
            if (cb === fn || cb.fn === fn) {
                cbs.splice(i, 1)
                break
            }
        }
        return vm
    }

    Vue.prototype.$emit  = function(event) {
        const vm = this
        const cbs = vm._events[event]
        const args = [...arguments]
        args.shift()
        if (cbs) {
            cbs.forEach(cb => cb.call(vm, ...args))
        }
        return vm
    }

    Vue.prototype.$refs = {}
}

export function initStateMixin(Vue) {
    Vue.prototype.$nextTick = nextTick

    Vue.prototype.$watch = function (expOrFn, cb) {
        return new Watcher(this, expOrFn, {user: true}, cb)
    }
}

function initInternalComponent(vm, options) {
    vm.$options = Object.create(vm.constructor.options)
    console.log(vm, options.componentOptions)
    /* var opts = (vm.$options = Object.create(vm.constructor.options));
    // doing this because it's faster than dynamic enumeration.
    var parentVnode = options._parentVnode;
    opts.parent = options.parent;
    opts._parentVnode = parentVnode;
    var vnodeComponentOptions = parentVnode.componentOptions; */
    vm.$options.beforeCreate = vm.constructor.options.beforeCreate
    vm.$options.propsData = options.componentOptions.propsData
    vm.$options._parentListeners = options.componentOptions.listeners
    vm.$options._renderChildren = options.componentOptions.children
    if (options.componentOptions.ref) vm.$refs[options.componentOptions.ref] = vm
    /* opts._renderChildren = vnodeComponentOptions.children;
    opts._componentTag = vnodeComponentOptions.tag;
    if (options.render) {
        opts.render = options.render;
        opts.staticRenderFns = options.staticRenderFns;
    } */
}

function callDirectiveInsertedHook(options) {
    console.log(options)
}
