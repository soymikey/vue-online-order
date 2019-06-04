<template>
  <div id="app">
    <div>{{adminInfo}}</div>
    <div>{{shopDetail}}</div>
    <!-- <div id="nav">
      <router-link to="/"></router-link> |
      <router-link to="/about">About</router-link>
    </div> -->

    <router-view />

  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      mapStateData: null
    }
  },
  mounted() {},
  computed: {
    defaultActive: function() {
      // return this.$route.path.replace('/', '')
    },

    ...mapState(['adminInfo', 'shopDetail'])
  },
  watch: {}
}
</script>

<style lang="scss">
#app {
  height: 100vh;
}
</style>
