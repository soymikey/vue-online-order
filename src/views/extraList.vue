<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">

      <el-table
        ref="dragTable"
        v-loading="listLoading"
        :data="tableData"
        row-key="extraId"
        fit
        highlight-current-row
        style="width: 100%"
      >

        <el-table-column
          align="center"
          label="额外ID"
          width="150"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.extraId }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="名称"
          width="150"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="介绍"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="分类"
          width="150"
        >
          <template slot-scope="scope">
            <span>{{scope.row.categoryName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
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
        title="修改额外信息"
        :visible.sync="dialogFormVisible"
      >

        <el-form :model="selectTable">
          <el-form-item
            label="名称"
            label-width="100px"
          >
            <el-input
              v-model="selectTable.name"
              auto-complete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="介绍"
            label-width="100px"
          >
            <el-input v-model="selectTable.description"></el-input>
          </el-form-item>
          <el-form-item
            label="价格"
            label-width="100px"
          >
            <el-input-number
              v-model="selectTable.price"
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
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="updateExtra"
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
  getExtras,
  updateExtra,
  updateExtraPosition,
  deleteExtra
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
    ...mapState(['userInfo', 'restaurantInfo'])
  },
  components: {
    headTop
  },

  methods: {
    async initData() {
      try {
        const extraMenu = await getExtras({
          restaurantId: this.userInfo.restaurantId
        })
        let extras = []
        for (const category of extraMenu.data) {
          for (const extra of category.extras) {
            extra.categoryName = category.name
            extras.push(extra)
          }
        }

        this.count = extraMenu.count
        this.tableData = extras

        this.listLoading = false
        this.$nextTick(() => {
          this.setSort()
        })
      } catch (err) {
        console.log('获取数据失败', err)
      }
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

      this.selectMenu = { label: row.categoryName, value: row.extraCategoryId }
      this.initData()
      // this.getMenu()
    },

    handleDelete(row) {
      this.currentRow = row
      this.dialogDeleteVisible = true
    },
    async confirmDeleteButton() {
      try {
        const result = await deleteExtra({ extraId: this.currentRow.extraId })

        this.$message({
          type: 'success',
          message: result.message
        })
        this.dialogDeleteVisible = false
        this.tableData = this.tableData.filter(
          row => row.extraId !== this.currentRow.extraId
        )
      } catch (err) {
        this.$message({
          type: 'error',
          message: err.message
        })
      }
    },

    async updateExtra() {
      this.dialogFormVisible = false
      try {
        const subData = {
          newExtraCategoryId: this.selectMenu.value
        }

        const postData = { ...this.selectTable, ...subData }

        const result = await updateExtra(postData)

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
            let result = await updateExtraPosition({
              ...startRow,
              newExtraCategoryId: endRow.extraCategoryId,
              newExtraId: endRow.extraId
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
