import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let routes = [
  // 异步路由组件配置
  { path: '/', component: () => import('./components/Home.vue') },
  { path: '/item/:id', component: () => import('./components/Item.vue') }
]

export function createRouter () {
  return new Router( {
    mode: 'history',
    routes
  })
}