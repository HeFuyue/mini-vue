import {initMixin, initStateMixin} from './init.js'
import {initLifeCycle} from './lifeCycle.js'
import {initGlobalAPI} from './globalAPI.js'

function Vue(options) {
    // console.log('@Vue_init')
    this._init(options) // 调用Vue身上的_init方法(由ininMixin()方法添加到Vue上面)进行初始化
}

initMixin(Vue) // initMixin方法用于给Vue添加_init
initLifeCycle(Vue)
initGlobalAPI(Vue)
initStateMixin(Vue)

export default Vue