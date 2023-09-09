import {mergeOptions} from './utils.js'
import {set, del} from './observe/index.js'

export function initGlobalAPI(Vue) {
    // Vue.prototype里面的是原型方法(vm能访问到的), Vue里面的是静态属性/方法, 可以全局访问(保存在Vue构造函数里, 通过Vue.xxx访问)
    Vue.options = {
        _base: Vue // 将当前Vue构造函数保存在Vue.options._base中, 通过继承Vue的Sub构造函数new出来的实例子组件可以通过此来拿到Vue构造函数上的静态方法(Sub未继承Vue的静态方法)
    }
    
    Vue.mixin = function(mixin) {
        // mixin方法用于将用户的选项(vm.$options)和全局的options(Vue.options)进行合并
        this.options = mergeOptions(this.options, mixin)
        return this // this指向Vue构造函数, 返回this可以实现链式调用
    }

    Vue.extend = function(options) {
        // extend()方法返回一个构造函数, 用于创建子组件。创建一个组件, 就是new一个Sub实例
        function Sub(options = {}) {
            this._init(options) // 默认对子组件采用初始化操作, 此处的options是new Sub(options)中的options
        }
        Sub.prototype = Object.create(Vue.prototype) // Sub.prototype.__proto__ = Vue.prototype
        Sub.prototype.constructor = Sub  // Sub的构造函数指向自身, 上面两条语句实现了继承
        // console.log(Sub.prototype, Vue.prototype)
        Sub.options = mergeOptions(Vue.options, options) // 将自身的options(Vue.extend(options)中传入的options)和全局的options(Vue.options)进行合并(Vue.options中包含_base, 全局components, directives等)
        
        /* 注：为什么组件中data必须是一个函数？
            因为每一次创建新组件时, 都要去new Sub(), 所有的Sub实例都是Sub构造函数实例化产生的, 共用静态属性Sub.options。
            在这个过程中调用_init()方法, 会对从Vue.extend(options)传入的options(其中包含data)进行mergeOptions(), 合并到Sub.options上。如果data是一个对象, 就是共享的。
            如果用Sub.options.data()取得数据, 那么得到的数据就是非共享的, 在一个组件内修改, 不会影响到其它的组件。
        */

        /* 组件的挂载流程:
            注册全局组件需要调用Vue.components()方法, Vue.components()方法内部调用Vue.extend()方法得到组件的Sub构造函数, 并将其保存在全局的Vue.options.components上。
            在解析模板(vm.$mount(el) -> mountComponent(vm, element) -> vm._render() -> _c() -> createElementVNode())时, 如果遇到了组件标签, 会从vm.$options.components上面找到该组件的Sub构造函数(从Vue.options上面合并而来), 并调用createComponentVnode()方法去生成虚拟DOM。
            在createComponentVnode()方法中, 会将其虚拟DOM上的data属性增加一个hook, 用于保存其挂载方法_init()。
            随后在虚拟DOM转化为真实DOM(vm._update(vm._render()) -> patch()), 即调用patch()方法时, 内部会调用createElement()方法, 内部再调用cerateComponent()方法。
            开始组件的初始化。cerateComponent()内部拿到_init()方法并调用, 此时会将Sub构造函数实例化, 并将实例挂在虚拟DOM的componentInstance上, 随后调用该实例的$mount()方法。
            调用$mount()方法时不传参数, 就拿到vm.$options上的模板进行编译(vm是Sub实例, 即vnode.componentInstance), 再内部调用mountComponent()方法, 进行渲染, 添加watcher, 并将真实DOM挂在vm.$el(即Sub实例的$el, vnode.componentInstance.$el)上
            此时vnode.componentInstance.$el上就有了真实DOM, createElement()方法就返回这个真实DOM, patch()方法同样返回这个真实DOM, 回到了vm._update()。随后创建父元素, 在父元素中插入子组件的真实DOM。
        */
        return Sub
    }

    Vue.options.components = {} // 全局指令, 用于保存全局组件的Sub构造函数

    Vue.components = function(id, defination) {
        // Vue.components方法用于定义全局组件
        defination = typeof defination === 'function' ? defination : Vue.extend(defination) // defination有可能是函数或对象, 如果是函数, 说明用户已经调用了Vue.extend()方法
        Vue.options.components[id] = defination
    }

    Vue.use = function(plugin) {
        let installedPlugins = this._installedPlugins || (this._installedPlugins = [])
        if (installedPlugins.indexOf(plugin) > -1) {
            return this
        }
        // additional parameters
        let args = [...arguments]
        args.splice(0, 1, this)
        if (typeof plugin.install === 'function') {
            plugin.install.apply(plugin, args)
        }
        else if (typeof plugin === 'function') {
            plugin.apply(null, args)
        }
        installedPlugins.push(plugin)
        return this;
    }

    Vue.directive = function(id, definition) {
        Vue.options.directives = Vue.options.directives || {}
        if (!definition) {
            return this.options['directives'][id]
        } else {
            if (typeof definition === 'function') {
                definition = {bind: definition, update: definition}
            }
            this.options['directives'][id] = definition
            return definition
        }
    }

    Vue.set = set
    Vue.delete = del
}
