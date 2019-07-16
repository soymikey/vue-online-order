<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">

      <el-table
        ref="dragTable"
        v-loading="listLoading"
        :data="tableData"
        row-key="foodId"
        fit
        highlight-current-row
        style="width: 100%"
      >

        <el-table-column
          align="center"
          label="食品ID"
          width="150"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.foodId }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="食品名称"
          width="150"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="食品介绍"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="食品分类"
          width="250"
        >
          <template slot-scope="scope">
            <span>{{scope.row.categoryName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="160"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="拖拽"
          width="100"
        >
          <template>
            <i
              class=" iconfont icon-drag"
              style="font-size: 25px;"
            ></i>
          </template>
        </el-table-column>

      </el-table>
      <div class="Pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="20"
          layout="total, prev, pager, next"
          :total="count"
        >
        </el-pagination>
      </div>
      <el-dialog
        title="修改食品信息"
        :visible.sync="dialogFormVisible"
      >

        <el-form :model="selectTable">
          <el-form-item
            label="食品名称"
            label-width="100px"
          >
            <el-input
              v-model="selectTable.name"
              auto-complete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="食品介绍"
            label-width="100px"
          >
            <el-input v-model="selectTable.description"></el-input>
          </el-form-item>

        </el-form>
        <el-row style="overflow: auto; text-align: center;">

          <el-table
            :data="specs"
            style="margin-bottom: 20px;"
            :row-class-name="tableRowClassName"
          >
            <el-table-column
              prop="specs"
              label="规格"
            >
            </el-table-column>

            <el-table-column
              prop="price"
              label="价格"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="danger"
                  @click="deleteSpecs(scope.$index)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button
            type="primary"
            @click="specsFormVisible = true"
            style="margin-bottom: 10px;"
          >添加规格</el-button>
        </el-row>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="updateFood"
          >确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="添加规格"
        :visible.sync="specsFormVisible"
      >
        <el-form
          :rules="specsFormrules"
          :model="specsForm"
        >
          <el-form-item
            label="规格"
            label-width="100px"
            prop="specs"
          >
            <el-input
              v-model="specsForm.specs"
              auto-complete="off"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item
            label="包装费"
            label-width="100px"
          >
            <el-input-number
              v-model="specsForm.packing_fee"
              :min="0"
              :max="100"
            ></el-input-number>
          </el-form-item> -->
          <el-form-item
            label="价格"
            label-width="100px"
          >
            <el-input-number
              v-model="specsForm.price"
              :precision="2"
              :step="0.1"
              :min="0"
              :max="10000"
            ></el-input-number>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="specsFormVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="addspecs"
          >确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="提示"
        :visible.sync="dialogDeleteVisible"
        width="30%"
        center
      >
        <span>确定要删除"{{currentRow.name}}"吗?</span>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogDeleteVisible = false">取 消</el-button>
          <el-button
            type="danger"
            @click="confirmDeleteButton"
          >删 除</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import headTop from '@/components/adminComponent/headTop'
import { mapState } from 'vuex'

import { baseUrl, imgBaseUrl } from '@/config/env'
import Sortable from 'sortablejs'
import {
  getFoods,
  getFoodsCount,
  getMenu,
  updateFood,
  deleteFood,
  // getResturantDetail,
  updateFoodPosition
  // getMenuById
} from '@/apiService/clientApi'
export default {
  data() {
    return {
      baseUrl,
      imgBaseUrl,
      restaurant_id: null,
      city: {},
      offset: 0,
      limit: 20,
      count: 0,
      tableData: [],
      currentPage: 1,
      selectTable: {},
      dialogFormVisible: false,
      menuOptions: [],
      selectMenu: {},
      selectIndex: null,
      specsForm: {
        specs: '',
        price: 0
      },
      specsFormrules: {
        specs: [{ required: true, message: '请输入规格', trigger: 'blur' }]
      },
      specsFormVisible: false,
      expendRow: [],
      listLoading: true,
      sortable: null,
      dialogDeleteVisible: false,
      currentRow: {}
    }
  },
  created() {},
  mounted() {
    this.initData()
  },
  computed: {
    ...mapState(['userInfo', 'restaurantInfo']),

    specs: function() {
      let specs = []
      if (this.selectTable.specfoods) {
        this.selectTable.specfoods.forEach(item => {
          specs.push({
            specs: item.specsName,

            price: item.price
          })
        })
      }
      return specs
    }
  },
  components: {
    headTop
  },

  methods: {
    async initData() {
      try {
        const menu = await getMenu({
          restaurantId: this.userInfo.restaurantId
        })
        let foods = []
        for (const category of menu.data) {
          for (const food of category.foods) {
            let specs = []
            for (const spec of food.specfoods) {
              specs.push({ specs: spec.specsName, price: spec.price })
            }
            food.categoryName = category.name
            food.specs = specs
            foods.push(food)
          }
        }
        // this.$message({
        //   type: 'success',
        //   message: menu.message
        // })

        this.count = menu.count
        this.tableData = foods
        this.listLoading = false
        this.$nextTick(() => {
          this.setSort()
        })
      } catch (err) {
        console.log('获取数据失败', err)
      }
    },
    // async getMenu() {
    //   this.menuOptions = []
    //   try {
    //     const menu = await getMenu({
    //       restaurantId: this.userInfo.restaurantId
    //     })

    //     menu.data.forEach((item, index) => {
    //       this.menuOptions.push({
    //         label: item.name,
    //         value: item.categoryId,
    //         index
    //       })
    //     })
    //   } catch (err) {
    //     console.log('获取食品种类失败', err)
    //   }
    // },
    // async getFoods() {
    //   try {
    //     const menu = await getMenu({
    //       offset: this.offset,
    //       limit: this.limit,
    //       restaurantId: this.restaurantInfo.restaurantId
    //     })
    //     let foods = []
    //     for (const category of menu.data) {
    //       for (const food of category.foods) {
    //         food.categoryName = category.name
    //         foods.push(food)
    //       }
    //     }

    //     this.count = menu.count
    //     this.tableData = foods
    //   } catch (err) {
    //     console.log('获取食品种类失败', err)
    //   }
    // },
    tableRowClassName(row, index) {
      if (index === 1) {
        return 'info-row'
      } else if (index === 3) {
        return 'positive-row'
      }
      return ''
    },
    addspecs() {
      this.specs.push({ ...this.specsForm })
      this.specsForm.specs = ''
      this.specsForm.price = 20
      this.specsFormVisible = false
    },
    deleteSpecs(index) {
      this.specs.splice(index, 1)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.offset = (val - 1) * this.limit
      this.getMenu()
    },

    handleEdit(row) {
      this.getSelectItemData(row, 'edit')
      this.dialogFormVisible = true
    },
    async getSelectItemData(row, type) {
      this.selectTable = {
        ...row,
        ...{
          restaurantName: this.restaurantInfo.name,
          restaurantAddress: this.restaurantInfo.address,
          categoryName: row.categoryName
        }
      }

      this.selectMenu = { label: row.categoryName, value: row.categoryId }
      this.initData()
      // this.getMenu()
    },
    handleSelect(index) {
      this.selectIndex = null
      this.selectMenu = this.menuOptions[index]
    },
    handleDelete(row) {
      this.currentRow = row

      this.dialogDeleteVisible = true
    },
    async confirmDeleteButton() {
      try {
        const result = await deleteFood({ foodId: this.currentRow.foodId })

        this.$message({
          type: 'success',
          message: result.message
        })
        this.dialogDeleteVisible = false
        this.tableData = this.tableData.filter(
          row => row.foodId !== this.currentRow.foodId
        )
      } catch (err) {
        this.$message({
          type: 'error',
          message: err.message
        })
      }
    },

    async updateFood() {
      this.dialogFormVisible = false
      try {
        const subData = {
          newCategoryId: this.selectMenu.value,
          specs: this.specs
        }

        const postData = { ...this.selectTable, ...subData }
        const result = await updateFood(postData)

        this.$message({
          type: 'success',
          message: result.message
        })
        this.initData()
      } catch (err) {
        console.log('更新餐馆信息失败', err)
      }
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll(
        '.el-table__body-wrapper > table > tbody'
      )[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
        },
        onEnd: async evt => {
          const startRow = this.tableData[evt.oldIndex]
          const endRow = this.tableData[evt.newIndex]

          const targetRow = this.tableData.splice(evt.oldIndex, 1)[0]

          this.tableData.splice(evt.newIndex, 0, targetRow)

          if (evt.newIndex !== evt.oldIndex) {
            let result = await updateFoodPosition({
              ...startRow,
              newCategoryId: endRow.categoryId,
              newFoodId: endRow.foodId
            })
            this.$message({
              type: 'success',
              message: result.message
            })
            await this.initData()
          }
        }
      })
    }
  }
}
</script>
<style>
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #20a0ff !important;
}
</style>

<style lang="scss">
@import '../style/mixin';
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.table_container {
  padding: 20px;
}
.Pagination {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
.icon-star {
  margin-right: 2px;
}
.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d {
  margin-top: 15px;
}
</style>
