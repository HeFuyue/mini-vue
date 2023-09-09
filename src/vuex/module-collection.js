import Module from './module.js'

class ModuleCollection {
    constructor(options) {
        this.root = null
        this.register([], options) // 递归在根上添加模块
    }

    register(path, rootModule) {
        // path参数是一个栈, 从尾至头存有当前模块和当前模块的所有的父模块; rootModule是用户配置的模块 
        let newModule = new Module(rootModule) // 通过Module类对用户传入的模块做处理(拆分为包含_raw, _children, state的形式)

        if (this.root === null) {
            // 没有根模块, 则当前模块就是根模块
            this.root = newModule
        } else {
            // 把当前模块定义在根上
            let parent = path.slice(0, -1).reduce((start, current) => {
                // return start._children[current]
                return start.getChild(current)
            }, this.root) // 借助reduce找到该模块的上一级父模块(遍历path除自身的每一项直到某一项没有_children属性)

            // parent._children[path[path.length - 1]] = newModule
            parent.addChild(path[path.length - 1], newModule)
        }

        if (rootModule.modules) {
            // 如果用户传入的该模块有modules属性, 则该模块有子模块, 再调用register方法添加子模块
            Object.keys(rootModule.modules).forEach(moduleName => {
                this.register(path.concat(moduleName), rootModule.modules[moduleName]) // 在path的尾部添加上当前模块, 以示为该模块是子模块的父模块
            })
        }
    }

    getNameSpaced(path) {
        let module = this.root
        return path.reduce((str, key) => {
            module = module.getChild(key)
            return str + (module.nameSpaced ? `${key}/` : '')
        }, '')
    }
}

export default ModuleCollection
