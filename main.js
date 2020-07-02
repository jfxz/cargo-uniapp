import Vue from 'vue'
import App from './App'
import store from './store'
Vue.config.productionTip = false
Vue.prototype.$store = store
App.mpType = 'app'

Vue.prototype.$message = (message) => {
  uni.showToast({
  	title: message,
  	duration: 2000,
  	icon:'none'
  })
}
Vue.prototype.$loading = (title) => {
  uni.showLoading({
  	title: title || '加载中',
		mask: true
  })
}
const app = new Vue({
    ...App
})
app.$mount()
