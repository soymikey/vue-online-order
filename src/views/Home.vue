<template>
  <div class="home">
    <homeNav></homeNav>
    <div class="main">
      <el-row>
        <el-col
          :span="8"
          class="pos-order"
          id="order-list"
        >
          <home-Left
            :shopId='shopId'
            :menu="menuList"
          ></home-Left>
        </el-col>
        <el-col :span="16">
          <home-Right
            :shopId='shopId'
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
import homeLeft from '@/components/home/left.vue'
import homeRight from '@/components/home/right.vue'
import homeNav from '@/components/home/nav.vue'
import { shopDetails, foodMenu } from '@/service/getData'
export default {
  name: 'home',
  components: { homeNav, homeLeft, homeRight },
  data() {
    return {
      shopId: null, //商店id值
      shopDetailData: null, //商铺详情
      showActivities: false, //是否显示活动详情
      menuList: [] //食品列表
    }
  },
  created() {
    this.shopId = '2'
  },
  mounted() {
    this.initData()
    // this.windowHeight = window.innerHeight
  },
  computed: {},
  methods: {
    async initData() {
      //获取商铺信息
      // this.shopDetailData = await shopDetails(
      //   this.shopId,
      //   this.latitude,
      //   this.longitude
      // );
      //获取商铺食品列表
      this.menuList = await foodMenu(this.shopId)
      console.log('this.menuList', this.menuList)

      //获取商铺信息
      this.shopDetailData = await shopDetails(
        this.shopId,
        this.latitude,
        this.longitude
      )
    }
  }
}
</script>
<style scoped lang="scss">
.home {
  height: 100%;
  font-size: 12px;
  text-align: center;
}
.main {
  float: left;
  width: 95%;
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
