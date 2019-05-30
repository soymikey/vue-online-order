<template>
  <div class="left-nav">
    <ul>
      <li>
        <i class="icon iconfont icon-wodezichan"></i>
        <div>收银</div>
      </li>

      <li>
        <i class="icon iconfont icon-dianpu"></i>
        <div>店铺</div>
      </li>

      <li>
        <i class="icon iconfont icon-hanbao"></i>
        <div>商品</div>
      </li>

      <li>
        <i class="icon iconfont icon-huiyuanqia"></i>
        <div>会员</div>
      </li>

      <li>
        <i class="icon iconfont icon-shijian"></i>
        <div>抢购</div>
      </li>

      <li>
        <i class="icon iconfont icon-tongji"></i>
        <div>统计</div>
      </li>
      <li>
        <div @click="exitButton"><i class="icon iconfont icon-guanbi"></i>
          <div>退出</div>
        </div>

      </li>

      ·
    </ul>
  </div>
</template>

<script>
import { signout } from '@/service/getDataAdmin'
export default {
  name: 'Nav',
  data() {
    return {}
  },
  methods: {
    exitButton() {
      this.$confirm('是否退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await signout()
          if (res.status == 1) {
            this.$message({
              type: 'success',
              message: '退出成功'
            })
            window.localStorage.clear()
            this.$router.push('/')
          } else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.left-nav {
  color: #fff;
  font-size: 10px;
  height: 100%;
  background-color: #1d8ce0;
  float: left;
  width: 5%;
}
.iconfont {
  font-size: 24px;
}
.left-nav ul {
  padding: 0px;
  margin: 0px;
}
.left-nav li {
  list-style: none;
  text-align: center;
  border-bottom: 1px solid #20a0ff;
  padding: 10px;
}
</style>
