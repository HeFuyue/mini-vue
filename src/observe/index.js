import {newArrayProto} from './array.js'
import Dep from './dep.js'

class Observer {
    constructor(data) {
        // data.__ob__ = this, 给无论是数组还是对象的data添加__ob__属性, 可以通过查找data身上是否有__ob__属性, 判断数据是否已经被监视过
        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false // 在对对象进行遍历的时候(this.walk), 会遍历__ob__属性, __ob__属性指向Observer类，类里面又有__ob__属性，会造成无限循环，应设置__ob__属性为不可遍历
        })

        this.dep = new Dep() // 给所有对象/数组属性添加dep, 如果后续数组长度发生变化, 或对象有新增属性, 可以收集依赖并更新

        if (Array.isArray(data)) { // 对数组进行数据监视非常耗费性能(在数组较长的情况下), 而且一般不通过索引值修改数组，因此不对数组进行数据监视
            this.observeArray(data) // 如果数组内有对象，对数组内的对象添加数据监视
            data.__proto__ = newArrayProto // 重写数组的7个方法，使得调用这几个方法修改数组时能被监控到
            // data.__ob__ = this // this指向Observer类(其中包含有observeArray(data)方法)，给data添加__ob__属性并指向Observer类，在data调用数组的修改方法时，能够访问到Observer类上的observeArray(data)方法，从而给新修改的值添加数据监视
        } else {
            this.walk(data) // 调用类身上的walk()方法对data的各属性进行遍历，变成响应式数据
        }
    }

    walk(data) {
        // Object.keys(data)返回data身上所有的属性名组成的数组
        Object.keys(data).forEach(key => {
            return defineReactive(data, key, data[key]) // 使用defineReactive()方法对属性值进行响应式处理，返回的是一个重新定义的data, 性能差
        })
    }

    observeArray(data) {
        data.forEach(item => observe(item)) // 若数组内部具有对象，还需要对该对象进行数据监视
    }
}

function dependArray(array) {
    for (let i = 0; i < array.length; i++) {
        array[i].__ob__ && array[i].__ob__.dep.depend()
        if (Array.isArray(array[i])) {
            dependArray(array[i])
        }
    }
}

export function defineReactive(target, key, value) {
    if (typeof value === 'object') observe(value)
    let childOb = observe(value) // 使用递归对data进行深度的数据劫持, childOb上面有dep属性可用于依赖收集
    let dep = new Dep() // 给所有属性添加dep
    // Object.defineProperty()只能劫持对象现有的属性，对新增以及删除的属性，需要借助$set, $delete等api
    Object.defineProperty(target, key, { // closure
        get() {
            // console.log("属性值调用getter读取了")
            if (Dep.target && !childOb) {
                dep.depend() // watcher与普通属性的dep双向收集
            } else if (Dep.target && childOb) {
                childOb.dep.depend() // 让数组和对象本身也实现依赖收集, 之所以不用dep.depend()而是用了childOb.dep.depend(), 是因为数组更新时, 调用的是__ob__.dep.notify(), 是在new Observer的时候生成的那个dep; dep.depend()是在defineReactive()函数里let dep = new Dep()生成的dep, watcher必须记住前者而不是后者(源码这里没有这个!childOb的判断, 会造成数组和对象的重复依赖收集, 做了优化)
            
                if (Array.isArray(value)) {
                    dependArray(value) // 如果数组里面还嵌套着数组, 需要继续对嵌套数组做依赖收集工作
                }
            }
            return value
        },

        set(newValue) {
            if (newValue === value) return
            observe(value) // 如果用户修改的值是一个对象，需要继续进行数据劫持
            // console.log("属性值调用setter修改了")
            value = newValue
            dep.notify()
        }
    })
}

export function observe(data) {
    if (typeof data !== 'object' || data.__ob__ !== undefined) return // 递归的baseCase

    return new Observer(data) // 如果一个实例被劫持过，就不需要再被劫持了。可借助Observer类定义响应式数据，通过判断是不是该类的实例来判断是否被劫持过
    // const newData = new Observer(data)
    // console.log(newData === data)
}

export function set(target, key, value) {
    // 通过索引修改数组的项, 通过splice方法实现
    if (Array.isArray(target) && typeof key === 'number') {
        target.length = Math.max(target.length, key)
        target.splice(key, 1, value)
        return value
    }
    // 已经有的属性, 直接修改即可
    if (key in target && !(key in Object.prototype)) {
        target[key] = value
        return value
    }

    const observer = target.__ob__
    // 被新增属性的对象没有__ob__, 不是响应式数据, 不需要做响应式处理
    if (!observer) {
        target[key] = value
        return value
    }

    defineReactive(observer.value, key, value) // 对新增属性进行响应式处理
    observer.dep.notify() // 通知视图更新
    return value
}

export function del (target, key) {
    // 通过索引删除数组的项, 通过splice方法实现
    if (Array.isArray(target) && typeof key === 'number') {
      target.splice(key, 1)
      return
    }

    const observer = target.__ob__
    // target没有key属性, 不需要删除
    if (!target[key]) {
      return
    }

    delete target[key]
    // 被删除的不是响应式数据, 直接返回即可
    if (!observer) {
      return
    }
    // 通知页面更新
    observer.dep.notify()
}
