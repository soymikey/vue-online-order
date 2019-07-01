<template>
  <div class="home">

    <div class="nav">
      <homeNav></homeNav>
    </div>

    <div class="main">
      <el-row>
        <el-col
          :span="leftColum"
          class="pos-order"
          id="order-list"
        >
          <home-Left></home-Left>
        </el-col>
        <el-col :span="rightColum">
          <home-Right :menu="menuList"></home-Right>
        </el-col>

      </el-row>
    </div>

  </div>
</template>

<script>
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
      showActivities: false, //是否显示活动详情
      menuList: [], //食品列表
      extraList: [], // 额外选项列表,
      leftColum: 8,
      rightColum: 16
    }
  },
  created() {
    if (window.innerWidth < 1024) {
      this.leftColum = 9
      this.rightColum = 15
    }
  },
  mounted() {
    this.initData()
  },
  computed: {
    ...mapState(['userInfo', 'restaurantInfo'])
  },
  methods: {
    ...mapMutations(['RECORD_SHOPDETAIL']),
    async initData() {
      try {
        //获取商铺信息
        const restaurantInfo = await getRestaurantInfo({
          restaurantId: this.userInfo.restaurantId
        })
        // //获取商铺食品列表
        const menu = await getMenu({ restaurantId: this.userInfo.restaurantId })

        this.menuList = menu.data

        this.RECORD_SHOPDETAIL(restaurantInfo.data)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
<style scoped lang="scss">
@media screen and (max-width: 1023px) {
  .nav {
    display: none;
  }
}
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
