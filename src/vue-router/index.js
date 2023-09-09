import {install} from './install.js'
import { createMatcher } from './matcher/create-matcher.js'
import HashHistory from './history/HashHistory.js'
import BrowserHistory from './history/BrowserHistory.js'

class VueRouter {
    constructor(options) {
        let routes = options.routes // 用户new Vue(router), router = new VueRouter()中传入的路由routes配置项, 也就是路由表
        this.matcher = createMatcher(routes) // 将用户传入的路由表转换为映射表挂在VueRouter实例的matcher属性上(映射表通过this.matcher.addRoute/this.matcher.addRoutes添加, 通过this.matcher.match获取当前路径对应的组件信息(record))

        const mode = options.mode || 'hash' // 用户new Vue(router), router = new VueRouter()中传入的路由mode配置项

        // 生成路由的跳转逻辑, 挂在VueRouter的history属性上
        if (mode === 'hash') {
            this.history = new HashHistory(this)
        } else if (mode === 'history') {
            this.history = new BrowserHistory(this)
        }

        this.enterGuardHooks = [] // 前置路由守卫项配置
    }

    // init方法在Vue.use()调用install方法时调用, 此时vm上面已经有_router属性(即VueRouter实例)
    init(app) {
        let history = this.history
        // HashHistory和BrowserHistory继承自Base, transitionTo()定义在Base构造函数中, 包含有跳转逻辑
        // 首先需要调用transitionTo()方法, 根据初始路径匹配到需要初始渲染的组件并渲染, 再添加监听路由变化的方法
        history.transitionTo(history.getCurrentLocation(), () => {
            history.setupListener()
        })

        // vm._route是响应式的路由属性, transitionTo()方法如只修改history上的current, 无法监听到路由的变化(current指向了新的route, _route仍指向老的route)。在history上添加修改响应式属性_route的方法, 稍后再transitionTo中调用, 路由的变化会被监听到, 可以渲染对应的视图
        history.listen(newRoute => app._route = newRoute)
    }

    // push方法使用push模式进行页面跳转
    push(location) {
        // console.log(location)
        let history = this.history
        history.transitionTo(location, () => {
            // 将页面的路径修改为新的
            history.push(location)
        })
    }

    // match方法用于将路径转化为映射表matcher中对应要渲染的组件的信息
    match(location) {
        return this.matcher.match(location)
    }

    // beforeEach方法用于添加前置路由守卫的钩子
    beforeEach(cb) {
        this.enterGuardHooks.push(cb)
    }
}

VueRouter.install = install

export default VueRouter
