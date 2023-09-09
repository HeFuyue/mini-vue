import install, {Vue} from "./install"
import ModuleCollection from "./module-collection"

class Store {
    constructor(options) {
        // 将用户传入的options进行格式化(模块收集)
        this._modules = new ModuleCollection(options) // 借助ModuleCollection类进行模块收集
        this._mutations = Object.create(null)
        this._actions = Object.create(null)
        this._wrappedGetters = Object.create(null)

        const state = this._modules.root.state // 获取根模块的状态, 需要把子模块的状态添加到根模块上
        // 给根模块添加所有子模块的state, mutations, actions, getters
        installModule(this, state, [], this._modules.root)
        
        // 创建实例, 将状态和计算属性定义到实例上
        resetStoreVM(this, state)
        console.log(this)
    }

    get state() {
        return this._vm._data.$$state
    }

    // dispatch, commit应写为箭头函数形式, 以保证用户在actions中解构commit时其this指向Store实例
    commit = (type, payload) => {
        this._mutations[type].forEach(fn => fn.call(this, payload))
    }

    dispatch =(type, payload) => {
        this._actions[type].forEach(fn => fn.call(this, payload))
    }

    /* 
    没有命名空间: 
    1) 父子模块的状态会被定义到根模块上
    2) 父子计算属性会被直接添加到根模块上
    3) 同名的action, mutation都会被收集
    4） 子模块的名字若与根状态中的属性重合, 根状态中的属性会被覆盖
    
    有命名空间：
    1) 父子模块的状态会被定义到根模块上
    2) 计算属性, action和mutation都需要通过命名空间来访问
    */
}

function installModule(store, rootState, path, rootModule) {
    if (path.length > 0) {
        // 将子模块中的状态定义到根模块状态中
        const parent = path.slice(0, -1).reduce((start, current) => {
            return start[current]
        }, rootState)

        parent[path[path.length - 1]] = rootModule.state
    }

    let nameSpaced = store._modules.getNameSpaced(path)

    // 给rootModule添加父子模块中所有的_mutations, _actions, _wrappedGetters
    rootModule.forEachValue('mutations', (mutationKey, mutationValue) => {
        store._mutations[nameSpaced + mutationKey] = (store._mutations[nameSpaced + mutationKey] || []) // mutations中每一个函数名称应维护为一个数组, 存放不同模块的同一个名称的函数
        store._mutations[nameSpaced + mutationKey].push((payload => {
            mutationValue(rootModule.state, payload)
        }))
    })

    rootModule.forEachValue('actions', (actionKey, actionValue) => {
        store._actions[nameSpaced + actionKey] = (store._actions[nameSpaced + actionKey] || []) // actions中每一个函数名称应维护为一个数组, 存放不同模块的同一个名称的函数
        store._actions[nameSpaced + actionKey].push((payload => {
            actionValue(store, payload)
        }))
    })

    rootModule.forEachValue('getters', (getterKey, getterValue) => {
        store._wrappedGetters[nameSpaced + getterKey] = () => {
            return getterValue(rootState)
        }
    })

    // 递归添加子模块的_mutations, _actions, _wrappedGetters
    if (rootModule._children) {
        Object.keys(rootModule._children).forEach(moduleKey => {
            installModule(store, rootState, path.concat(moduleKey), rootModule._children[moduleKey])
        })
    }
}

function resetStoreVM(store, state) {
    store.getters = {}
    const computed = {}
    const wrappedGetters = store._wrappedGetters

    Object.keys(wrappedGetters).forEach(getterKey => {
        computed[getterKey] =wrappedGetters[getterKey] // 将包裹后的计算属性定义在_vm的计算属性中

        // 用户访问getters时, 被代理到计算属性
        Object.defineProperty(store.getters, getterKey, {
            get: () => {
                return store._vm[getterKey]
            }
        })
    })

    // 给state做响应式处理以及依赖收集, 可以通过放在一个vm的data上, 这样数据就是响应式的, 同时能收集依赖
    store._vm = new Vue({
        data: {
            $$state: state // 定义数据时, Vue会对以$, _开头的变量作退让, 不进行代理
        },
        computed
    })
}

export default {
    Store,
    install
}