<template>
  <div>
    <h1>测试 {{count}}</h1>
    <h1>测试 {{countPlus}}</h1>
    <h1>测试 {{doneTodos}}</h1>
    <h1>测试 {{$store.getters.doneTodos}}</h1>
    <h1>测试 {{$store.getters.getTodoById(2)}}</h1>
  </div>
</template>

<script>
// 当组件需要获取多个状态的时候，用mapSate辅助函数
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import { mapMutations } from 'vuex'

export default {
  data () {
    return {

    }
  },
  /* 通过计算属性来获取状态
  computed: {
    count () {
      return this.$store.state.count
    }
  }
  */
  // 当映射的计算属性名称与state子节点名称相同时，我们也可以给mapState传一个字符串数组
  // ['count']，count映射this.count 为 store.state.count
  computed: {
    ...mapState({ // 使用对象展开符将mapState函数返回的对象展开
      count: state => state.count,
      countAlias: 'count', // 传字符串参数'count'等同于`state => state.count`
      countPlus (state) { // 为了获取局部状态必须使用常规函数
        return state.count + this.count
      }
    }),
    // 使用对象展开运算符将getter混入computed对象中
    ...mapGetters(['doneTodos'])
  },
  created: function () {
    this.$store.commit('increment', { amount: 232 })
    console.log(this.count, 'bbb')
  },
  methods: {
    ...mapMutations(['increment'])
  }
}
</script>

