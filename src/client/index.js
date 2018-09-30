import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router/index'
import axios from 'axios'

Vue.use(ElementUI);
Vue.config.debug = true
Vue.config.productionTip = false
Vue.prototype.$axios = axios

new Vue({
  el: '#app',
  router: router,
  template: '<App/>',
  components: { App }
})
