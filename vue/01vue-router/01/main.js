// 1. 定义（路由）组件
const Foo = { template: '<div>Foo</div>' }
const Bar = { template: '<div>Bar</div>' }
const User = { 
  template: `
    <div class="user">
      <h2>User {{ $route.params.id }}</h2>
      <router-view></router-view>
    </div>
  `,
  // 当从‘/user/1’导航到‘/user/2’时，因为复用了同一个组件，
  // 所以组件的生命周期钩子不会再被调用，可以用watch监测变化
  /*
  watch: { 
    '$route' (to, from) {
      console.log(`从${from.path}路径跳转到${to.path}路径`)
    }
  }*/
  // 或者是用2.2引入的beforeRouteUpdate
  beforeRouteUpdate (to, from, next) {
    console.log(`从${from.path}路径跳转到${to.path}路径`)
    next()
  }
}
const UserHome = { template: '<div>user home</div>' }
const UserProfile = { template: '<div>profile</div>' }
const UserPosts = { template: '<div>😊</div>' }

// 2. 定义路由
const routes = [
  { path: '/re', redirect: '/foo'}, // 重定向，redirect中可以是一个对象或方法
  { path: '/foo', component: Foo, alias: '/anfoo'}, // alias是别名
  // 使用props将组件和路由解藕,props可以是布尔值，对象和函数
  { path: '/bar', component: Bar, props: true }, 
  // 动态路由参数，以冒号开头的参数会被设置到this.$route.params中
  { name: 'user', // 命名路由
    path: '/user/:userId', component: User,
    children: [ // children中的组件都会渲染在User的<router-view>中
      {
        path: '',
        component: UserHome
      },
      {
        path: 'profile',
        component: UserProfile
      },
      {
        path: 'posts',
        component: UserPosts
      }
    ]
  }
]

// 3. 创建router实例，然后传`routes`配置
const router = new VueRouter({
  mode: 'history', // 当使用history模式时，url就像正常的url
  routes
})

// 编程式导航
let userId = 222
function *testRoute () {
  yield router.push('/foo')
  yield router.push({ path: '/bar'})
  yield router.push({ name: 'user', params: { userId }})
  yield router.push({ path: 'foo', query: { plan: 'private' } })
  yield router.push({ path: '/user', params: { userId } }) // 如果提供了path，params将被忽略
  yield router.replace({ path: '/' })
  yield router.go(-2)
}

let testrouter = testRoute()

// 4. 创建和挂载根实例
const app = new Vue({
  data: {
    id: null
  },
  router
}).$mount('#app')

console.log(testrouter.next(), app.$route.path)
console.log(testrouter.next(), app.$route.path)
console.log(testrouter.next(), app.$route.path)
console.log(testrouter.next(), app.$route.path, app.$route.query)
console.log(testrouter.next(), app.$route.path, app.$route.params)
console.log(testrouter.next(), app.$route.path)
console.log(testrouter.next(), app.$route.path)