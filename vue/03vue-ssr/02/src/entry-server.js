// 服务器entry使用default export导出函数，并在每次渲染中重复调用此函数
import { createApp } from './app'

export default context => {
  // const { app } = createApp()
  // return app
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp()
    router.push(context.url)
    // 等到router将可能的异步组件和钩子函数解析完
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }
      // 对所有匹配的路由组件调用`asyncData()`
      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({
            store,
            route: router.currentRoute
          })
        }
      })).then(() => {
        // 当我们将状态附加到上下文，并且`template`选项用于renderer时，
        // 状态将自动序列化为`window.__INITIAL_STATE__`，并注入HTML
        context.state = store.state
        resolve(app)
      }).catch(reject)
    }, reject)
  })
}
