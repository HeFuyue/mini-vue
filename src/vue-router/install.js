export let Vue

export function install(_Vue) {
    Vue = _Vue  // 将install方法传入的Vue构造函数变为全局变量

    Vue.mixin({
        // 对所有根实例上配置有router的组件添加$router属性
        beforeCreate() {
            if (this.$options.router) { // 如果$options上有router属性, 则是在new Vue()中传入的router配置生成的VueRouter实例, 说明是根组件
                this._routerRoot = this // 在跟组件上添加_routerRoot属性指向根组件自身
                this._router = this.$options.router // 将router配置挂在_routerRoot属性上, 所有组件可通过_routerRoot._router访问到路由配置
                this.$options.router.init(this) // 调用router上的init方法做初始化

                Vue.util.defineReactive(this, '_route', this._router.history.current) // 在vm上添加响应式对象_route指向current, 原因是current不是响应式的, 因此路由的变化无法监听到, 需要监听响应式的_route属性
            } else {
                this._routerRoot = this.$parent && this.$parent._routerRoot // 将_routerRoot传递到所有子组件身上
            }
        }
    })

    // 将vm._routerRoot._route代理到$router上(vm.$router是VueRouter类的实例, 上面包含操作路由的方法, 如: push(), replace())
    Object.defineProperty(Vue.prototype, '$router', {
        get() {
            return this._routerRoot && this._routerRoot._router
        }
    })

    // 将VueRouter.history.current代理到$route上(vm.$route上包含路由的属性, 如: path, name, query)
    Object.defineProperty(Vue.prototype, '$route', {
        get() {
            return this._routerRoot && this._routerRoot._route
        }
    })

    // 注册router-link, router-view组件
    Vue.component('router-link', {
        props: {
            to: {type: String, required: true},
            tag: {type: String, default: 'a'}
        },
    
        methods: {
            handler() {
                this.$router.push(this.to) // 页面跳转的回调
            }
        },
    
        render() {
            let tag = this.tag
            return <tag onclick = {this.handler}>{this.$slots.default}</tag>
        }
    })

    Vue.component('router-view', {
        functional: true, // 函数式组件, 不需要父子关系
        render(h, {data, parent}) {
            let route = parent.$route // 拿到父组件的当前路由组件信息
            let depth = 0 // depth用于控制当前渲染matcher中的哪一个组件
            data.routerView = true // 给当前组件增加一个routerView属性, 以标识此组件已经渲染

            // 遍历当前组件的所有父组件, 如果组件上有routerView属性, 说明组件中含有router-view标签, depth指向的matcher中的组件不是当前层级的router-view, 而是某个父组件的router-view, 当前的depth需要指向matcher中的后一个组件
            while (parent) {
                if (parent.$vnode && parent.$vnode.data.routerView) {
                    depth++
                }
                parent = parent.$parent
            }

            let record = route.matched[depth] // 拿到当前的router-view对应的组件

            if (!record) {
                return h()
            } else {
                return h(record.component, data)
            }
        }
    })
}
