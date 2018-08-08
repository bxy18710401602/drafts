import Vue from 'vue'
import VueResource from 'vue-resource'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'

import './utils/mock'
import '../static/icons/iconfont.css'

//开启debug模式
Vue.config.debug = true

Vue.use( VueResource )
Vue.use( Vuex )

const store = new Vuex.Store({
  state: {
    count: 0,
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: (state, getters) => {
      return state.todos.filter( todo => todo.done )
    },
    // 通过返回一个函数来给getters传参
    getTodoById: (state) => (id) => {
      return state.todos.find( todo => todo.id === id )
    }
  },
  mutations: {
    // mutation必须是同步函数
    // n是mutaion的载荷，可以在commit中额外传入参数
    // 载荷大多数情况下是一个对象
    increment (state, n) {
      state.count += n.amount
    },
    incrementA (state) {
      state.count++
    }
  },
  // action 可以包含任意异步操作
  actions: {
    increment (context) {
      context.commit('increment')
    },
    // 参数解构
    incrementA ({ commit }) {
      commit('incrementA')
    }
  }
})
// 通过store.dispatch的方法触发action
store.dispatch('incrementA')

// store.commit('increment', 10)

// 对象风格的提交方式
// store.commit({
//   type: 'increment',
//   amount: 10
// })

console.log(store.state.count, 'aaa')

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
