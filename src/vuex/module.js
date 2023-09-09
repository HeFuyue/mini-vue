class Module {
    constructor(module) {
        this._raw = module // _raw指向用户定义的模块
        this._children = {} // _children指向子模块对应的Module实例
        this.state = module.state // state指向用户定义的状态
    }

    addChild(key, module) {
        this._children[key] = module
    }

    getChild(key) {
        return this._children[key]
    }

    forEachValue(type, cb) {
        if (this._raw[type]) {
            Object.keys(this._raw[type]).forEach(key => {
                cb(key, this._raw[type][key])
            })
        }
    }

    get nameSpaced() {
        return !!this._raw.nameSpaced
    }
}

export default Module
