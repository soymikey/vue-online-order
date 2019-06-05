<template>
  <div class="manage_page fillcontain">
    <el-row style="height: 100%;">
      <el-col
        :span="4"
        style="min-height: 100%; background-color: #324057;"
      >
        <el-menu
          :default-active="defaultActive"
          style="min-height: 100%"
          background-color="#324057"
          text-color="#bfcbd9"
          router
        >
          <div>{{defaultActive}}</div>
          <el-menu-item index="/manage/home"><i class="el-icon-menu"></i>首页</el-menu-item>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-document"></i>数据管理</template>
            <!-- <el-menu-item index="userList">用户列表</el-menu-item>
            <el-menu-item index="shopList">商家列表</el-menu-item> -->
            <el-menu-item index="/manage/foodList">食品列表</el-menu-item>
            <el-menu-item index="/manage/orderList">订单列表</el-menu-item>
            <el-menu-item index="adminList">管理员列表</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-plus"></i>添加数据</template>

            <el-menu-item index="/manage/addGoods">添加商品</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title"><i class="el-icon-star-on"></i>图表</template>
            <el-menu-item index="/manage/visitor">用户分布</el-menu-item>
            <!-- <el-menu-item index="newMember">用户数据</el-menu-item> -->
          </el-submenu>
          <el-submenu index="5">
            <template slot="title"><i class="el-icon-edit"></i>编辑</template>
            <!-- <el-menu-item index="uploadImg">上传图片</el-menu-item> -->
            <el-menu-item index="/manage/vueEdit">文本编辑</el-menu-item>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title"><i class="el-icon-setting"></i>设置</template>
            <el-menu-item index="/manage/adminSet">管理员设置</el-menu-item>
            <el-menu-item index="/manage/addShop">商铺设置</el-menu-item>
            <!-- <el-menu-item index="sendMessage">发送通知</el-menu-item> -->
          </el-submenu>
          <el-submenu index="7">
            <template slot="title"><i class="el-icon-warning"></i>说明</template>
            <el-menu-item index="/manage/explain">说明</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col
        :span="20"
        style="height: 100%;overflow: auto;"
      >
        <keep-alive>
          <router-view
            :shopDetails='shopDetail'
            :menu='categoryForm.categoryList'
          ></router-view>
        </keep-alive>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { shopDetails } from '@/service/getDataClient'
import { getCategory } from '@/service/getDataAdmin'

export default {
  data() {
    return {
      shopDetailData: null,
      categoryForm: {
        categoryList: [],
        categorySelect: '',
        name: '',
        description: ''
      }
    }
  },
  created() {
    if (this.adminInfo.status == 0) {
      this.getAdminData()
    }
  },
  mounted() {
    this.initData()
  },
  computed: {
    ...mapState(['adminInfo', 'shopDetail']),
    defaultActive: function() {
      // return this.$route.path.replace('/', '')
    }
  },
  watch: {},
  methods: {
    ...mapActions(['getAdminData']),
    ...mapMutations(['RECORD_SHOPDETAIL']),
    async initData() {
      //获取商铺信息
      this.shopDetailData = await shopDetails(this.adminInfo.restaurantId)

      if (this.shopDetailData.status === 1) {
        this.RECORD_SHOPDETAIL(this.shopDetailData.data)
        this.getShopCatagory()
      } else {
        this.$message({
          type: 'error',
          message: '店铺信息还未填写'
        })
      }
    },

    async getShopCatagory() {
      try {
        const result = await getCategory(this.shopDetailData.data.id)
        if (result.status == 1) {
          result.category_list.map((item, index) => {
            item.value = index
            item.label = item.name
          })
          this.categoryForm.categoryList = result.category_list
          console.log(
            'categoryForm.categoryList',
            this.categoryForm.categoryList
          )
        } else {
          console.log(result)
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>


<style lang="scss" scoped>
@import '../style/mixin';
.manage_page {
}
</style>
