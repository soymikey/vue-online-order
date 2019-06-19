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
      <!-- <el-submenu index="1">
        <template slot="title">
          <i class="icon iconfont icon-wodezichan"></i>
          <span slot="title">收银</span>
        </template>
        <el-menu-item-group>
          <span slot="title">分组一</span>
          <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="分组2">
          <el-menu-item index="1-3">选项3</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-4">
          <span slot="title">选项4</span>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu> -->

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
      <el-menu-item index="6">
        <i class="icon iconfont icon-tongji"></i>
        <span slot='title'>{{$t("sidebar.management")}}</span>
      </el-menu-item>
      <!-- <el-menu-item index="7">
        <i class="icon iconfont icon-guanbi"></i>
        <span
          slot='title'

        >{{$t("sidebar.language")}}</span>
      </el-menu-item> -->
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
          >{{$t("sidebar.languageZh")}}</el-menu-item>
          <el-menu-item
            index="7-2"
            @click="changeLanguageEn"
          >{{$t("sidebar.languageEn")}}</el-menu-item>
          <el-menu-item
            index="7-3"
            @click="changeLanguageEs"
          >{{$t("sidebar.languageEs")}}</el-menu-item>
        </el-menu-item-group>

      </el-submenu>
      <el-menu-item index="8">
        <i class="icon iconfont icon-guanbi"></i>
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
import { signout } from '@/apiService/clientApi'
import { removeAllStore } from '@/config/mUtils'
import { mapMutations } from 'vuex'
export default {
  // name: 'Nav',
  // data() {
  //   return {}
  // },
  // methods: {
  //   ...mapMutations(['RESET_STATE']),
  //   exitButton() {
  //     this.$confirm('是否退出?', '提示', {
  //       confirmButtonText: '确定',
  //       cancelButtonText: '取消',
  //       type: 'warning'
  //     })
  //       .then(async () => {
  //         removeAllStore()
  //         this.RESET_STATE()
  //         this.$router.push('/')
  //         this.RESET_STATE()
  //       })
  //       .catch(() => {})
  //   },
  //   goToAdminManagement() {
  //     this.$router.push('/manage/home')
  //   }
  // }
  data() {
    return {
      isCollapse: true
    }
  },
  created() {},
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    changeLanguageZh() {
      console.log('hello')

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
