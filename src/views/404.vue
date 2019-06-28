<template>
  <div class="container">
    <img
      class="image"
      :src="error404"
      alt=""
    >
    <div class="button-container">
      <el-button
        class="button"
        round
        @click="backToHomePage"
      >返回首页</el-button>
    </div>
  </div>
</template>

<script>
import error404 from '../assets/404.png'
export default {
  data() {
    return {
      error404: error404
    }
  },
  methods: {
    backToHomePage: function() {
      this.$router.push('/home')
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}

.image {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 5%;
  // width: 50%;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 5%;
}
</style>
