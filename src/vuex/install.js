export let Vue

const install = _Vue => {
    Vue = _Vue

    Vue.mixin({
        beforeCreate() {
            // 给所有组件添加$store, 来获取Store实例
            if (this.$options.store) {
                this.$store = this.$options.store
            } else if (this.$parent && this.$parent.$store) {
                this.$store = this.$parent.$store
            }
        }
    })
}

export default install
