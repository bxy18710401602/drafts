// 命名视图
const A = { template: '<div>A</div>'}
const B = { template: '<div>B</div>'}
const D = { template: '<div>D</div>'}

const routes = [
  {
    path: '/',
    components: {
      default: D,
      a: A,
      b: B
    },
    // 包含命名视图的路由的解藕
    props: { default: true, a: false, b: true}
  }
]

const router = new VueRouter({
  routes
})

const app = new Vue({
  router
}).$mount('#app')
