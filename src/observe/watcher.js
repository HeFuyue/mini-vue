import {pushTarget, popTarget} from './dep.js'

let id = 0

export default class Watcher {
    constructor(vm, updateFnOrWatchExp, options, cb) {
        this.id = id++
        this.renderWatcher = options // options为true则为渲染watcher

        if (typeof updateFnOrWatchExp === 'function') { // 渲染watcher是更新页面的方法, 计算属性watcher是计算计算属性值的方法, 用户自定义watcher是用户传入vm.$watch()中的返回被观测对象的方法
            this.getter = updateFnOrWatchExp // getter表明调用该函数会发生取值的操作
        } else { // 用户自定义watcher中用户传入的被监测对象名
            this.getter = function() {
                return vm[updateFnOrWatchExp]
            }
        }
        
        this.depId = new Set() // 借助set实现dep去重
        this.deps = [] // watcher也需要收集dep, 用于处理计算属性和清理等的工作
        this.vm = vm
        this.lazy = options.lazy // lazy属性用于控制初次加载是否要立即渲染页面(对于渲染watcher, 需要去渲染; 对于计算属性watcher, 应当是dirty属性为真才去渲染)
        this.dirty = this.lazy // dirty属性用于控制是否去调用getter()更新计算属性(dirty为真说明计算属性应当发生了改变, 即计算属性所依赖的属性发生了变化。如果同一个计算属性在页面上出现多次, 只需要计算一次值即可, 之后就应当将dirty变为false)
        this.user = options.user //是否为用户自定义watcher
        this.cb = cb // 用户自定义watcher中被监测对象发生变化后执行的回调
        this.value = this.lazy? undefined : this.get() // 初次渲染页面调用this.get()方法, 或用户自定义watcher取得被监测对象的当前值
    }

    addDep(dep) { // watcher与dep相互收集的方法
        let id = dep.id
        if (!this.depId.has(id)) { // 如果同一个属性在当前组件中用到了多次, watcher只需要记录一次dep即可, 需要进行去重操作
            this.depId.add(id)
            this.deps.push(dep) // watcher收集dep
            dep.addSub(this) // dep收集watcher
        }
    }

    evaluate() {
        this.value = this.get() // 将计算属性的计算结果value挂在watcher上, 方便去取值
        this.dirty = false // 计算属性值已经得到了, 数据不需要更新, dirty设置为false
    }

    get() {
        // Dep.target = this // this指向Watcher的实例, Dep类的静态属性target指向watcher的实例, 是为了让dep能够记录下对应的watcher
        // this.getter() // 渲染视图的方法, 会去vm上取值, 调用属性的get方法, 可在属性的get方法中添加该watcher
        // Dep.target = null // 在视图渲染完毕, dep记录下当前对应的watcher后, 需要将Dep.target复原(如果在模板范围外读取属性, 不应当记录在dep中, 且此时的watcher应该为null)
        
        /* 针对computed重写get方法： 
        计算属性本身需要有一个watcher, 用于收集计算属性所依赖的那些属性的dep, 才能实现计算属性的更新。
        计算属性的watcher应该被包含在当前组件的渲染watcher之中, 在属性触发get之后能够先被计算属性watcher捕获, 再被渲染watcher捕获从而更新页面。
        计算属性所依赖的属性需要同时记住计算属性watcher以及组件的渲染watcher, 因此需要维护一个栈, 存放watcher
         */

        /* 计算属性中的watcher：
        组件初次渲染时, 调用mountComponent()方法创建了渲染watcher, 渲染watcher在创建时调用了本方法(第一次调用), 将渲染watcher自身添加到stack中, 并将Dep.target指向该watcher, 此时stack = [Watcher: {renderWatcher: true, ...}]。
        执行到pushTarget(this)之后, 接下来执行this.getter(), 对渲染watcher来说就是渲染页面的方法, 渲染过程中发现页面上用到了计算属性, 调用计算属性的createComputedGetter方法, 在里面调用evaluate()方法, evaluate()方法再次调用到本方法(第二次调用), 将计算属性watcher推入stack中, 并将Dep.target指向此渲染watcher, 此时stack = [Watcher: {renderWatcher: true, ...}， Watcher: {renderWatcher: {lazy: true}, ...}]
        同时第二次调用pushTarget(this)之后, 接下来执行this.getter(), 对计算属性watcher来说是计算计算属性值的方法, 需要去读取计算属性所依赖的属性, 于是就调用这些属性的get()方法(Object.defineProperty()), 因为存在Dep.target, 所以这些属性的dep收集到了当前的Dep.target, 也就是计算属性watcher。
        计算属性值得到后, 第二次调用的get()走到了popTarget(), 于是stack中的计算属性watcher被清除, Dep.target重新指向渲染watcher。接下来回到createComputedGetter, 在createComputedGetter中继续调用Dep.target(计算属性watcher)身上的depend方法, 让计算属性所依赖的属性记住渲染watcher, 这样这些属性同时记住了渲染watcher与计算属性watcher, 可以实现计算属性更新与页面更新。
        */

        // debugger
        pushTarget(this) // 将当前watcher推入栈中, 并将Dep.target指向当前的watcher
        const value = this.getter.call(this.vm) // 对于计算属性watcher, getter()就是用户传入的getter
        popTarget() // 当前的watcher出栈, 并将Dep.target指向上一个入栈的watcher
        return value
    }

    depend() { // depend()方法让watcher中记录的那些dep, 再记录watcher(记住计算属性watcher, 也记住渲染watcher)
        let i = this.deps.length

        while(i--) {
            this.deps[i].depend()
        }
    }

    update() {
        if (this.lazy) {
            this.dirty = true // 如果是计算属性, 依赖的属性变化了, dirty应当为true
        } else {
            queueWatcher(this) // 同一个属性有可能更新多次(比如vm.age = 19; vm.age = 20; vm.age = 21), 或者有多个组件都会要更新, 希望能够在多次调用update()后, 最终更新视图的该组件watcher只执行一次(即每个组件run()方法只调用一次)
        }
    }

    run() {
        // this.get() // 渲染watcher更新页面
        let oldValue = this.value
        let newValue = this.get()

        if (this.user) {
            this.cb.call(this.vm, newValue, oldValue)
        }
    }
}

let queue = []
let has = {}
let pending = false

function flushSchedulerQueue() {
    let flushQueue = queue.slice(0) // 复制一份queue
    queue = []
    has = {}
    pending = false // 先将pending调整为false, 如果在更新的过程中又遇到新的watcher, 可以继续执行更新操作
    flushQueue.forEach(watcher => watcher.run()) // 真正执行更新
}

function queueWatcher(watcher) {
    // 同一个属性可能被更新了多次(比如vm.age = 19; vm.age = 20; vm.age = 21), 借助对象进行watcher的去重, 由于更新是异步操作(修改属性的操作完成后才应该更新), 所以只会取最新的更新值
    let id = watcher.id

    if(!has[id]) {
        queue.push(watcher)
        has[id] = true
        // console.log(queue)
    }

    // 防抖操作, 被更新的组件可能有多个, 希望多次调用update()后, 最终更新视图的watcher只执行一次
    if (!pending) {
        pending = true
        nextTick(flushSchedulerQueue)
    }
}

let callbacks = []
let waiting = false

let timerFunc // timerFunc方法实现异步调用函数
if (Promise) { // Promise是微任务, 执行优先级在宏任务之后, 应该优先把timerFunc设置为Promise形式
    timerFunc = () => {
        Promise.resolve().then(flushCallbacks)
    }
} else if (MutationObserver) { // MutationObserver是H5的api
    let Observer = new MutationObserver(flushCallbacks)
    let textNode = document.createTextNode(1)
    Observer.observe(textNode, {
        characterData: true
    })
    timerFunc = () => {
        textNode.textContent = 2
    }
} else if (setImmediate) { // 仅IE支持
    timerFunc = () => {
        setImmediate(flushCallbacks)
    }
} else if (setTimeout) {
    timerFunc = () => {
        setTimeout(flushCallbacks)
    }
}

function flushCallbacks() { // flushCallbacks()方法用于调用callbacks队列中所有的更新回调函数, 实现更新操作
    let flushCb = callbacks.slice(0)
    waiting = false
    callbacks = []
    flushCb.forEach(cb => cb())
}

// 更新是异步操作, 需要借助nextTick方法进行异步调用flushSchedulerQueue()方法, 实现异步更新
export function nextTick(cb) {
    callbacks.push(cb)
    // 防抖操作, 如果nextTick被调用多次, 应该先将所有的回调函数放在一个队列中, 最后统一执行
    if (!waiting) {
        timerFunc(flushCallbacks)
        waiting = true
    }
}
