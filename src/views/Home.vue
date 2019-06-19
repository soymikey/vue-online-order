<template>
  <div class="home">
    <div class="nav">
      <homeNav></homeNav>
    </div>

    <div class="main">
      <el-row>
        <el-col
          :span="8"
          class="pos-order"
          id="order-list"
        >
          <home-Left
            :shopDetail='shopDetail'
            :menu="menuList"
          ></home-Left>
        </el-col>
        <el-col :span="16">
          <home-Right
            :shopDetail='shopDetail'
            :menu="menuList"
          ></home-Right>
        </el-col>

      </el-row>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import { mapState, mapMutations } from 'vuex'
import homeLeft from '@/components/clientComponent/left.vue'
import homeRight from '@/components/clientComponent/right.vue'
import homeNav from '@/components/clientComponent/nav.vue'
import { getRestaurantInfo, getMenu } from '@/apiService/clientApi'
export default {
  name: 'home',
  components: { homeNav, homeLeft, homeRight },
  data() {
    return {
      restaurantInfo: null, //商铺详情
      showActivities: false, //是否显示活动详情
      menuList: [] //食品列表
    }
  },
  created() {},
  mounted() {
    this.initData()
  },
  computed: {
    ...mapState(['userInfo', 'shopDetail'])
  },
  methods: {
    ...mapMutations(['RECORD_SHOPDETAIL']),
    async initData() {
      //获取商铺信息

      this.restaurantInfo = await getRestaurantInfo({
        restaurantId: this.userInfo.restaurantId
      })
      // //获取商铺食品列表
      const menu = await getMenu({ restaurantId: this.userInfo.restaurantId })
      if (menu.status === 1) {
        this.menuList = menu.data
      } else {
        this.$message({
          type: 'error',
          message: '获取菜单失败'
        })
      }
      if (this.restaurantInfo.status === 1) {
        this.RECORD_SHOPDETAIL(this.restaurantInfo.data)
      } else {
        this.$message({
          type: 'error',
          message: this.restaurantInfo.message
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
.home {
  height: 100%;
  font-size: 12px;
  text-align: center;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
}
.nav {
  flex: 0;
}
.main {
  flex: 20;
  // width: 95%;
  background-color: #eff2f7;
  height: 100%;
  overflow: auto;
}
.pos-order {
  background-color: #f9fafc;
  border-right: 1px solid #c0ccda;
  height: 100vh;
}
</style>
