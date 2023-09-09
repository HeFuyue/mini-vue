class Base {
    constructor(router) {
        this.router = router // router是VueRouter实例
        // current记录当前路由的信息
        this.current = createRoute(null, {
            path: '/'
        })
    }

    // transitionTo方法用于处理路由的跳转逻辑
    transitionTo(location, listener) {
        let record = this.router.match(location) // 获取跳转路径对应的组件信息
        let route = createRoute(record, {path: location}) // 根据跳转的组件信息生成所有需要被渲染的组件

        // 在初始页面进行初始化的过程中, 需要根据当前路径渲染对应的组件, 因此进行一次跳转; 此时还添加了监听路由变化的方法, 由于进行了一次跳转, 路由发生变化后回调又会进行一次跳转, 会造成重复跳转。 、这里需要进行拦截
        if (location === this.current.path && route.matched.length === this.current.matched.length) {
            console.log('double--skiped')
            return
        }

        let enterGuard = [].concat(this.router.enterGuardHooks) // 前置路由守卫钩子信息

        // 执行路由守卫钩子, 所有路由守卫钩子都执行以后执行路由跳转的逻辑
        runQueue(enterGuard, this.current, route, () => {
            // 路由跳转的逻辑
            this.current = route // 更新current为当前路由对应的信息
            if (listener) listener() // listener是传入的回调
            if (this.cb) this.cb(route) // this.cb是更新_route的方法
        })

        // console.log(this.current)
    }

    // listen方法用于添加更新_route的方法
    listen(cb) {
        this.cb = cb
    }
}

// 根据路由的组件信息生成所有需要渲染的组件(如果路径中包含子路由, 需要先将父组件渲染, 然后再渲染子组件, 需要记录下按顺序排列的所需组件信息)
function createRoute(record, location) {
    let matched = [] // 将所需的组件存放在matched中
    // 如果映射表中含有当前路由对应的record, 说明能够匹配
    if (record) {
        while(record) {
            matched.unshift(record) // 组件按照由父 -> 子的顺序进行渲染, 所以父组件应该插到前面
            record = record.parent // 将record变为父组件的record, 循环添加到matched中, 直到没有父组件, 说明此时所有需要渲染的组件已经按顺序存放在了matched身上
        }
    }
    return {
        ...location,
        matched
    }
}

// runQueue方法用于执行路由守卫钩子
function runQueue(queue, from, to, cb) {
    // console.log(queue)
    // next方法根据索引来执行钩子, (() => next(index)是beforeEach传入的next方法, 调用时执行后移一位的索引作为参数的next方法)
    function next(index) {
        if (index >= queue.length) return cb() // 指针越界, 说明所有的钩子都执行了, 无需守卫直接放行(放行的逻辑在cb()中)
        // 获取当前钩子并执行
        let hook = queue[index]
        hook(from, to, () => next(index+1))
    }
    next(0)
}

export default Base
