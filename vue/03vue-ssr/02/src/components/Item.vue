<template>
  <div>
    <div>{{ item.title }}</div>
    <h1>测试测试Item</h1>
  </div>
</template>

<script>
export default {
  asyncData ({ store, route }) {
    return store.dispatch('fetchItem', route.params.id)
  },
  data () {
    return {

    }
  },
  computed: {
    item () {
      return this.$store.state.items[this.$route.params.id]
    }
  }
}
</script>
