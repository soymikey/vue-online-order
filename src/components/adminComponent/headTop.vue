<template>
  <div class="header_container">

    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/manage/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item
        v-for="(item, index) in $route.meta"
        :key="index"
      >{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-dropdown
      @command="handleCommand"
      menu-align='start'
    >
      <img
        :src="imgBaseUrl + userInfo.avatar"
        class="avator"
      >
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="home">首页</el-dropdown-item>
        <el-dropdown-item command="signout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { imgBaseUrl } from '@/config/env'
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      imgBaseUrl
    }
  },
  created() {},
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapMutations(['RESET_STATE']),
    handleCommand(command) {
      if (command == 'home') {
        this.$router.push('/home')
      } else if (command == 'signout') {
        this.$confirm('是否退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: '退出成功'
            })
            window.localStorage.clear()
            this.RESET_STATE()
            this.$router.push('/')
          })
          .catch(error => {})
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../style/mixin';
.header_container {
  background-color: #eff2f7;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
}
.avator {
  @include wh(36px, 36px);
  border-radius: 50%;
  margin-right: 37px;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
