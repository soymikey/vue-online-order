<template>
  <div class="app-container">
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table
      ref="dragTable"
      v-loading="listLoading"
      :data="list"
      row-key="foodId"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >

      <el-table-column
        align="center"
        label="食品Id"
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
        width="350"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="食品分类"
        width="150"
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
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="show-d">{{ $t('table.dragTips1') }} : &nbsp; {{ oldList }}</div>
    <div class="show-d">{{ $t('table.dragTips2') }} : {{ newList }}</div>

  </div>
</template>

<script>
import { getMenu, updateFood } from '@/apiService/clientApi'
import Sortable from 'sortablejs'

export default {
  name: 'DragTable',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      sortable: null,
      oldList: [],
      newList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true

      const menu = await getMenu({
        offset: this.listQuery.page,
        limit: this.listQuery.limit,
        restaurantId: '1560738959769'
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
      console.log('foods', foods)

      this.list = foods
      this.total = menu.count
      this.listLoading = false

      this.oldList = this.list.map(v => v.foodId)
      this.newList = this.oldList.slice()
      this.$nextTick(() => {
        this.setSort()
      })
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
          const startRow = this.list[evt.oldIndex]
          const endRow = this.list[evt.newIndex]

          const targetRow = this.list.splice(evt.oldIndex, 1)[0]

          this.list.splice(evt.newIndex, 0, targetRow)

          // for show the changes, you can delete in you code
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]

          this.newList.splice(evt.newIndex, 0, tempIndex)

          // console.log('start', startRow, 'end', endRow)
          console.log('this.list', this.list)

          console.log('categoryid', endRow.categoryId)

          if (evt.newIndex !== evt.oldIndex) {
            let result = await updateFood({
              ...startRow,
              newCategoryId: endRow.categoryId
            })
            this.$message({
              type: 'success',
              message: result.message
            })
            await this.getList()
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
  background: #42b983 !important;
}
</style>

<style scoped>
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
