// 客户端只需创建应用程序，并将其挂载到DOM中
import { createApp } from './app'
import Vue from '../../01/node_modules/vue';

const { app, router, store } = createApp()

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

/*
// 客户端数据预取--1.在路由导航之前解析数据
router.onReady(() => {
  // 添加路由钩子函数，用于处理asyncData
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)

    let diffed = false
    const activated = matched.filter((caches, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })
    if (!activated) {
      return next()
    }
   
    // 这里如果有加载指示器，就触发
    Promise.all(activated.map(c => {
      if (c.asyncData) {
        return c.asyncData({ store, route: to })
      }
    })).then(() => {
      // 停止加载指示器
      next()
    }).catch(next)
  })
  // App.vue模版中根元素具有`id="app"`
  app.$mount('#app')
})
*/

/*
// 客户端数据预取--2.匹配要渲染的视图后，再获取数据
Vue.mixin({
  beforeMount () {
    const { asyncData } = this.$options
    if (asyncData) {
      this.dataPromise = asyncData({
        store: this.$store,
        route: this.$route
      })
    }
  }
})
*/