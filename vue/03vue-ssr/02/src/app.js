import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'

// 导出一个工厂函数，用于创建新的应用程序、router和store实例
export function createApp () {
  // 创建router实例和store实例
  const router = createRouter()
  const store = createStore()
  
  // 同步路由状态到store
  sync(store, router)

  const app = new Vue ({
    router,
    store,
    // 根实例简单地渲染应用程序组件
    render: h => h(App)
  })
  return { app, router, store }
}