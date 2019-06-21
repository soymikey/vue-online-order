<template>
  <div class="left-nav">
    <!-- <ul>
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

      <li @click="goToAdminManagement">
        <i class="icon iconfont icon-tongji"></i>
        <div>管理</div>
      </li>
      <li @click="exitButton">
        <div><i class="icon iconfont icon-guanbi"></i>
          <div>退出</div>
        </div>

      </li>
    </ul> -->

    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
    >

      <el-menu-item index="1">
        <i class="icon iconfont icon-wodezichan"></i>
        <span slot='title'>{{$t("sidebar.cashTill")}}</span>
      </el-menu-item>
      <el-menu-item index="2">
        <i class="icon iconfont icon-dianpu"></i>
        <span slot='title'>{{$t("sidebar.shop")}}</span>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="icon iconfont icon-hanbao"></i>
        <span slot='title'>{{$t("sidebar.store")}}</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="icon iconfont icon-huiyuanqia"></i>
        <span slot='title'>{{$t("sidebar.memebership")}}</span>
      </el-menu-item>
      <el-menu-item index="5">
        <i class="icon iconfont icon-shijian"></i>
        <span slot='title'>{{$t("sidebar.promotion")}}</span>
      </el-menu-item>
      <el-menu-item
        index="6"
        @click="goToAdminManagement"
      >
        <i class="icon iconfont icon-tongji"></i>
        <span slot='title'>{{$t("sidebar.management")}}</span>
      </el-menu-item>

      <el-submenu index="7">
        <template slot="title">
          <i class="icon iconfont icon-tongji"></i>
          <span slot="title">{{$t("sidebar.language")}}</span>
        </template>
        <el-menu-item-group>
          <span slot="title">语言</span>
          <el-menu-item
            index="7-1"
            @click="changeLanguageZh"
          >{{$t("sidebar.chinese")}}</el-menu-item>
          <el-menu-item
            index="7-2"
            @click="changeLanguageEn"
          >{{$t("sidebar.english")}}</el-menu-item>
          <el-menu-item
            index="7-3"
            @click="changeLanguageEs"
          >{{$t("sidebar.spanish")}}</el-menu-item>
        </el-menu-item-group>

      </el-submenu>
      <el-menu-item
        index="8"
        @click="exitButton"
      >
        <i class="icon iconfont icon-guanbi"> </i>
        <span slot='title'>{{$t("sidebar.exit")}}</span>
      </el-menu-item>

    </el-menu>
    <!-- <el-radio-group
      v-model="isCollapse"
      style="margin-bottom: 20px;"
    >
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group> -->
  </div>
</template>

<script>
import { removeAllStore } from '@/config/mUtils'
import { mapMutations } from 'vuex'
export default {
  name: 'Nav',
  data() {
    return {}
  },

  data() {
    return {
      isCollapse: true
    }
  },
  created() {},
  methods: {
    ...mapMutations(['RESET_STATE']),
    exitButton() {
      this.$confirm('是否退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.RESET_STATE()
          window.localStorage.clear()
          this.$router.push('/')
        })
        .catch(() => {})
    },
    goToAdminManagement() {
      this.$router.push('/manage/home')
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    changeLanguageZh() {
      this.$i18n.locale = 'zh'
    },
    changeLanguageEn() {
      this.$i18n.locale = 'en'
    },
    changeLanguageEs() {
      this.$i18n.locale = 'es'
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
  width: 100%;
  background-color: #304156;
  text-align: left;
  /* float: left; */
  /* width: 5%; */
}
.iconfont {
  font-size: 24px;
}
/* .left-nav ul {
  padding: 0px;
  margin: 0px;
} */
.left-nav li {
  list-style: none;
  text-align: left;
  /* border-bottom: 1px solid #20a0ff; */
  /* padding: 10px; */
}
.el-menu-vertical-demo {
  width: 100%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.icon {
  color: #ffffff;
  margin-right: 10px;
  margin-left: 10px;
}
</style>
