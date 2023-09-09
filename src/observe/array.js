const oldArrayProto = Array.prototype 

export let newArrayProto = Object.create(oldArrayProto) // 复制数组原始的方法, newArrayProto.__proto__ === Array.prototype

const methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'] // 重写7个能修改原数组的方法

methods.forEach(method => {
    newArrayProto[method] = function(...args) {
        console.log("修改数组的方法被调用")

        const observeArray = this.__ob__.observeArray // this.__ob__ = class Observer {}

        // todos...

        const result = oldArrayProto[method].call(this, ...args) // 调用数组原始的方法, this指向调用该方法的数组

         // 借助Observer类身上的observeArray方法对数组修改的新值进行数据监视
        switch (method) {
            case 'push':
            case 'unshift':
                observeArray(args)
                break;
            case 'splice': 
                observeArray(args.splice(2))
            default:
                break;
        }

        this.__ob__.dep.notify() // 通知页面进行更新
        return result
    }
})
