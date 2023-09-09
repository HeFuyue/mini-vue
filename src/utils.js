const strats = {}
const LIFECYCLE = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed']

LIFECYCLE.forEach(hook => {
    strats[hook] = function(p, c) { // 此方法用来把vm.$options中的生命周期函数与mixin中的生命周期函数合并
        // 第一次调用：p: {}, c: hook: function() {}, 结果处理为：{hook: [f]}
        // 第二次调用：p: {hook: [f]},  c: hook: function() {}, 结果处理为：{hook: [f, f]}
        if (c) {
            if (p) {
                return p.concat(c) // 父子对象中都有该生命周期函数, 那么将二者合并
            } else {
                return [c] // 只有子对象有该生命周期函数, 将该生命周期函数套一层数组返回, 以便以后追加
            }
        } else { // 能够调用到mergeField()方法, 则p或c至少有一个有该生命周期函数, 这里只能是父对象中有。那么父对象中的该生命周期函数已被维护成数组, 直接返回即可
            return p
        }
    }
})

strats.components = function(parentVal, childVal) { // strats.components方法将全局组件(Vue.components)与组件内部定义的局部组件(vm.components)进行合并
    let res = Object.create(parentVal)

    for (let key in childVal) {
        res[key] = childVal[key]
    }

    return res
}

export function mergeOptions(parent, child) { // mergeOptions()方法用于合并对象属性
    const options = {}

    for (let key in parent) { // 遍历父对象中的属性添加到options中
        mergeField(key)
    }

    for (let key in child) { // 遍历子对象中的属性, 如果父对象中没有, 就添加到options中(父对象中有的情况下的处理逻辑在遍历父对象时的mergeField()方法里)
        if (!parent.hasOwnProperty(key)) {
            mergeField(key)
        }
    }

    function mergeField(key) {
        // 策略模式, 简化多轮的if else判断, 将判断条件写在strats中
        if (strats[key]) { // 如果是生命周期函数等情况, 需要维护成一个队列, 需要时一并调用
            options[key] = strats[key](parent[key], child[key]) // 此为strats中函数的调用, strats中的函数是用来合并参数的函数
        } else { // 如果不是策略中的情况, 优先采用子对象
            options[key] = child[key] || parent[key]
        }
    }

    return options
}
