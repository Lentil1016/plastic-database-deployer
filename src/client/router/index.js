import Vue from 'vue'
import Router from 'vue-router'

// 导入相应的子组件
import Plastic from './../components/Plastic'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    { name: 'root', path: '/', redirect: 'plastic' },
    { name: 'plastic', path: '/plastic', component: Plastic }
  ]
})

export default router