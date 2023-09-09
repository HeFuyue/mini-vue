/*  观察者模式：
    给模板中的属性增加一个收集器：dep
    将页面渲染逻辑封装在watcher中(vm._update(vm._render()))
    让dep记住这个watcher, 当属性变化时找到该属性的dep中存放的对应watcher, 调用渲染方法即可
*/

let id = 0

export default class Dep {
    constructor() {
        this.id = id++
        this.subs = [] // subs用于存放该属性对应的watcher(一个属性可能在n个视图中使用, 每个视图有自己的watcher)
    }

    addSub(watcher) {
        this.subs.push(watcher) // 将该属性对应的watcher存放在dep里面的subs中
    }

    depend() {
        Dep.target.addDep(this) // this指向当前的属性的dep, 将该dep与watcher双向记录
    }

    notify() { // 通知watcher更新的方法
        this.subs.forEach(watcher => watcher.update())
    }
}

Dep.target = null
let stack = []

export function pushTarget(watcher) {
    Dep.target = watcher
    stack.push(watcher)
}

export function popTarget() {
    stack.pop()
    Dep.target = stack[stack.length - 1]
}