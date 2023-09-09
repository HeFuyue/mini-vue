export let Vue

class Store {
    constructor(options) {
        let state = options.state
        let actions = options.actions
        let mutations = options.mutations
        let getters = options.getters

        this.actions = actions
        this.mutations = mutations
        this.getters = {} // getters可借助计算属性实现
        const computed = {}

        Object.keys(getters).forEach(getterKey => {
            computed[getterKey] = () => {
                // 如果依赖的值不发生变化且被访问多次, 由于computed具有缓存功能, 这个函数可不被重复执行
                return getters[getterKey](state)
            }
            // 用户访问getters时, 被代理到计算属性
            Object.defineProperty(this.getters, getterKey, {
                get: () => {
                    return this._vm[getterKey]
                }
            })
        })

        // 给state做响应式处理以及依赖收集, 可以通过放在一个vm的data上, 这样数据就是响应式的, 同时能收集依赖
        this._vm = new Vue({
            data: {
                $$state: state // 定义数据时, Vue会对以$, _开头的变量作退让, 不进行代理
            },
            computed
        })
    }

    get state() {
        return this._vm._data.$$state
    }

    // dispatch, commit应写为箭头函数形式, 以保证用户在actions中解构commit时其this指向Store实例
    dispatch = (type, payload) => {
        this.actions[type](this, payload)
    }

    commit = (type, payload) => {
        this.mutations[type](this.state, payload)
    }
}

const install = _Vue => {
    Vue = _Vue

    Vue.mixin({
        beforeCreate() {
            // 给所有组件添加$store, 来获取Store实例
            if (this.$options.store) {
                this.$store = this.$options.store
            } else if (this.$parent && this.$parent.$store) {
                this.$store = this.$parent.$store
            }
        }
    })
}

export default {
    Store,
    install
}