import Base from './base.js'

class BrowserHistory extends Base {
    constructor(router) {
        super(router)
    }

    setupListener() {
        // setupListener方法用于添加路由变化监听, 并根据变化后的当前路由执行一次跳转(借助transitionTo方法)
        window.addEventListener('popstate', () => {
            this.transitionTo(this.getCurrentLocation())
        })
    }

    push(location) {
        history.pushState({}, '', location)
    }

    getCurrentLocation() {
        return getPath()
    }
}

function getPath() {
    return window.location.pathname
}

export default BrowserHistory
