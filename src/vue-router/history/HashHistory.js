import Base from "./base.js"

class HashHistory extends Base {
    constructor(router) {
        super(router)
        // 如果初始页面的路径不是hash模式, 修改初始页面的路径为hash模式
        ensureSlash()
    }

    setupListener() {
        // setupListener方法用于添加路由变化监听, 并根据变化后的当前路由执行一次跳转(借助transitionTo方法)
        window.addEventListener('hashchange', () => {
            this.transitionTo(this.getCurrentLocation())
        })
    }

    push(location) {
        window.location.hash = location
    }

    getCurrentLocation() {
        return getHash()
    }
}

function ensureSlash() {
    if (!window.location.hash) window.location.hash = '/'
}

function getHash() {
    return window.location.hash.slice(1)
}

export default HashHistory
