<template>
  <div id="app">
    <div>{{userInfo}}</div>
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

    ...mapState(['userInfo', 'shopDetail'])
  },
  watch: {}
}
</script>

<style lang="scss">
#app {
  height: 100vh;
}
</style>
