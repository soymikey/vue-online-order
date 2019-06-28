<template>
  <div>
    <head-top></head-top>
    <el-row style="margin-top: 80px;">
      <el-col
        :span="14"
        :offset="4"
      >
        <header class="form_header">选择食品种类</header>
        <el-form
          :model="categoryForm"
          :rules="categoryRules"
          ref="categoryForm"
          label-width="110px"
          class="form"
        >
          <el-row class="category_select">

            <el-form-item
              label="食品种类"
              prop="name"
            >
              <el-select
                v-model="categoryForm.categorySelect"
                :placeholder="selectValue.label"
                style="width:100%;"
              >
                <el-option
                  v-for="item in categoryForm.categoryList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <span>{{ item.label }}</span>
                  <span
                    style="float: right; color: #8492a6; font-size: 13px"
                    @click="handleDeleteCategory(item)"
                  >X</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row
            class="add_category_row"
            :class="showAddCategory? 'showEdit': ''"
          >
            <div class="add_category">
              <el-form-item
                label="食品种类"
                prop="name"
              >
                <el-input v-model="categoryForm.name"></el-input>
              </el-form-item>
              <el-form-item
                label="种类描述"
                prop="description"
              >
                <el-input v-model="categoryForm.description"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="submitcategoryForm('categoryForm')"
                >提交</el-button>
              </el-form-item>
            </div>
          </el-row>
          <div
            class="add_category_button"
            @click="addCategoryFun"
          >
            <i
              class="el-icon-caret-top edit_icon"
              v-if="showAddCategory"
            ></i>
            <i
              class="el-icon-caret-bottom edit_icon"
              v-else
              slot="icon"
            ></i>
            <span>添加食品种类</span>
          </div>
        </el-form>
        <header class="form_header">添加食品</header>
        <el-form
          :model="foodForm"
          :rules="foodRules"
          ref="foodForm"
          label-width="110px"
          class="form food_form"
        >
          <el-form-item
            label="食品名称"
            prop="name"
          >
            <el-input v-model="foodForm.name"></el-input>
          </el-form-item>
          <el-form-item
            label="食品详情"
            prop="description"
          >
            <el-input v-model="foodForm.description"></el-input>
          </el-form-item>

          <el-form-item label="食品规格">
            <el-radio
              class="radio"
              v-model="foodSpecs"
              label="one"
            >单规格</el-radio>
            <el-radio
              class="radio"
              v-model="foodSpecs"
              label="more"
            >多规格</el-radio>
          </el-form-item>
          <el-row v-if="foodSpecs == 'one'">

            <el-form-item label="价格">

              <el-input-number
                v-model="foodForm.specs[0].price"
                :precision="2"
                :step="0.1"
                :min='0'
                :max="1000"
              ></el-input-number>
            </el-form-item>
          </el-row>
          <el-row
            v-else
            style="overflow: auto; text-align: center;"
          >
            <el-button
              type="primary"
              @click="dialogFormVisible = true"
              style="margin-bottom: 10px;"
            >添加规格</el-button>
            <el-table
              :data="foodForm.specs"
              style="margin-bottom: 20px;"
              :row-class-name="tableRowClassName"
            >
              <el-table-column
                prop="specs"
                label="规格"
              >
              </el-table-column>
              <!-- <el-table-column
                prop="packing_fee"
                label="包装费"
              >
              </el-table-column> -->
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
                    @click="handleDelete(scope.$index)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <el-form-item>
            <el-button
              type="primary"
              @click="addFood('foodForm')"
            >确认添加食品</el-button>
          </el-form-item>
        </el-form>
        <el-dialog
          title="添加规格"
          :visible.sync="dialogFormVisible"
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
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="addspecs"
            >确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog
          title="提示"
          :visible.sync="dialogDeleteCategoryVisible"
          width="30%"
          center
        >
          <span>删除"{{currentCategory.name}}"类目,将删除类目下的所有食品,确定要删除吗?</span>

          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="dialogDeleteCategoryVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="confirmDeleteCategoryButton"
            >确 定</el-button>
          </span>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import headTop from '@/components/adminComponent/headTop'
import { mapState } from 'vuex'

import {
  getCategories,
  addCategory,
  addFood,
  deleteCategory
} from '@/apiService/clientApi'
import { baseUrl, imgBaseUrl } from '@/config/env'

export default {
  props: ['menu'],
  data() {
    return {
      baseUrl,
      imgBaseUrl,
      restaurant_id: null,
      categoryForm: {
        categoryList: [],
        categorySelect: '',
        name: '',
        description: ''
      },
      foodForm: {
        name: '',
        description: '',
        specs: [
          {
            specs: '默认',
            price: 20
          }
        ]
      },
      foodRules: {
        name: [{ required: true, message: '请输入食品名称', trigger: 'blur' }]
      },
      categoryRules: {
        name: [{ required: true, message: '请选择类别', trigger: 'blur' }]
      },

      showAddCategory: false,
      foodSpecs: 'one',
      dialogFormVisible: false,
      specsForm: {
        specs: '',
        price: 20
      },
      specsFormrules: {
        specs: [{ required: true, message: '请输入规格', trigger: 'blur' }]
      },
      dialogDeleteCategoryVisible: false,
      currentCategory: {}
    }
  },
  components: {
    headTop
  },
  created() {},
  mounted() {
    this.initData()
  },
  computed: {
    ...mapState(['userInfo', 'restaurantInfo']),
    selectValue: function() {
      return (
        this.categoryForm.categoryList[this.categoryForm.categorySelect] || {}
      )
    }
  },

  methods: {
    async initData() {
      try {
        const result = await getCategories({
          restaurantId: this.userInfo.restaurantId
        })

        result.data.map((item, index) => {
          item.value = index
          item.label = item.name
        })
        this.categoryForm.categoryList = result.data
      } catch (err) {
        this.$message({
          type: 'error',
          message: '获取食品分类失败'
        })
      }
    },
    addCategoryFun() {
      this.showAddCategory = !this.showAddCategory
    },
    submitcategoryForm(categoryForm) {
      this.$refs[categoryForm].validate(async valid => {
        if (valid) {
          const params = {
            name: this.categoryForm.name,
            description: this.categoryForm.description,
            restaurantId: this.userInfo.restaurantId
          }
          try {
            const result = await addCategory(params)

            await this.initData()
            this.categoryForm.name = ''
            this.categoryForm.description = ''
            this.showAddCategory = false
            this.$message({
              type: 'success',
              message: '添加成功'
            })
          } catch (err) {
            this.$message({
              type: 'error',
              message: err
            })
          }
        } else {
          this.$message({
            type: 'error',
            message: '请检查输入是否正确'
          })

          return false
        }
      })
    },

    addspecs() {
      this.foodForm.specs.push({ ...this.specsForm })
      this.specsForm.specs = ''
      // this.specsForm.packing_fee = 0
      this.specsForm.price = 20
      this.dialogFormVisible = false
    },
    handleDelete(index) {
      this.foodForm.specs.splice(index, 1)
    },
    tableRowClassName(row, index) {
      if (index === 1) {
        return 'info-row'
      } else if (index === 3) {
        return 'positive-row'
      }
      return ''
    },
    addFood(foodForm) {
      if (!this.selectValue.label) {
        this.$message({
          type: 'error',
          message: '请填写商品分类'
        })
        return
      }
      this.$refs[foodForm].validate(async valid => {
        if (valid) {
          const params = {
            ...this.foodForm,
            categoryId: this.selectValue.categoryId,
            restaurantId: this.userInfo.restaurantId
          }

          try {
            const result = await addFood(params)

            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.foodForm = {
              name: '',
              specs: [
                {
                  specs: '默认',
                  price: 20
                }
              ]
            }
          } catch (err) {
            console.log(err)
          }
        } else {
          this.$message({
            type: 'error',
            message: '请检查输入是否正确'
          })
          return false
        }
      })
    },
    handleDeleteCategory(category) {
      this.currentCategory = category
      this.dialogDeleteCategoryVisible = true
    },
    async confirmDeleteCategoryButton() {
      try {
        const result = await deleteCategory({
          categoryId: this.currentCategory.categoryId
        })
        this.$message({
          type: 'success',
          message: result.message
        })
        this.dialogDeleteCategoryVisible = false
        this.categoryForm.categorySelect = ''
        this.categoryForm.name = ''
        this.categoryForm.description = ''
        this.initData()
      } catch (err) {
        this.$message({
          type: 'error',
          message: err.message
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import '../style/mixin';
.form {
  min-width: 400px;
  margin-bottom: 30px;
  &:hover {
    box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6),
      0 2px 4px 0 rgba(232, 237, 250, 0.5);
    border-radius: 6px;
    transition: all 400ms;
  }
}
.food_form {
  border: 1px solid #eaeefb;
  padding: 10px 10px 0;
}
.form_header {
  text-align: center;
  margin-bottom: 10px;
}
.category_select {
  border: 1px solid #eaeefb;
  padding: 10px 30px 10px 10px;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
}
.add_category_row {
  height: 0;
  overflow: hidden;
  transition: all 400ms;
  background: #f9fafc;
}
.showEdit {
  height: 185px;
}
.add_category {
  background: #f9fafc;
  padding: 10px 30px 0px 10px;
  border: 1px solid #eaeefb;
  border-top: none;
}
.add_category_button {
  text-align: center;
  line-height: 40px;
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 6px;
  border: 1px solid #eaeefb;
  border-top: none;
  transition: all 400ms;
  &:hover {
    background: #f9fafc;
    span,
    .edit_icon {
      color: #20a0ff;
    }
  }
  span {
    @include sc(14px, #999);
    transition: all 400ms;
  }
  .edit_icon {
    color: #ccc;
    transition: all 400ms;
  }
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
.cell {
  text-align: center;
}
</style>
