<template>
  <div>
    <head-top></head-top>
    <el-row style="margin-top: 80px;">
      <el-col
        :span="14"
        :offset="4"
      >
        <header class="form_header">选择额外种类</header>
        <el-form
          :model="categoryForm"
          :rules="categoryRules"
          ref="categoryForm"
          label-width="110px"
          class="form"
        >
          <el-row class="category_select">

            <el-form-item
              label="种类"
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
                    @click="handleDelete(item)"
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
                label="种类"
                prop="name"
              >
                <el-input v-model="categoryForm.name"></el-input>
              </el-form-item>
              <el-form-item
                label="描述"
                prop="description"
              >
                <el-input v-model="categoryForm.description"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="submitExtraCategoryForm('categoryForm')"
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
            <span>添加额外种类</span>
          </div>
        </el-form>
        <header class="form_header">添加额外</header>
        <el-form
          :model="extraForm"
          :rules="foodRules"
          ref="extraForm"
          label-width="110px"
          class="form food_form"
        >
          <el-form-item
            label="额外名称"
            prop="name"
          >
            <el-input v-model="extraForm.name"></el-input>
          </el-form-item>
          <el-form-item
            label="额外详情"
            prop="description"
          >
            <el-input v-model="extraForm.description"></el-input>
          </el-form-item>
          <el-form-item label="价格">

            <el-input-number
              v-model="extraForm.price"
              :precision="2"
              :step="0.1"
              :max="1000"
            ></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="addExtra('extraForm')"
            >确认添加</el-button>
          </el-form-item>
        </el-form>

      </el-col>
    </el-row>
    <el-dialog
      title="提示"
      :visible.sync="dialogDeleteVisible"
      width="30%"
      center
    >
      <span>删除"{{currentCategory.name}}"类目,将删除类目下的所有选项,确定要删除吗?</span>
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
</template>

<script>
import headTop from '@/components/adminComponent/headTop'
import { mapState } from 'vuex'

import {
  getExtraCategories,
  addExtraCategory,
  addExtra,
  deleteExtraCategory
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
      extraForm: {
        name: '',
        description: '',
        price: 0
      },
      foodRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      categoryRules: {
        name: [{ required: true, message: '请选择类别', trigger: 'blur' }]
      },

      showAddCategory: false,
      currentCategory: {},
      dialogDeleteVisible: false
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
        const result = await getExtraCategories({
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
          message: err
        })
      }
    },
    addCategoryFun() {
      this.showAddCategory = !this.showAddCategory
    },
    submitExtraCategoryForm(categoryForm) {
      this.$refs[categoryForm].validate(async valid => {
        if (valid) {
          const params = {
            name: this.categoryForm.name,
            description: this.categoryForm.description,
            restaurantId: this.userInfo.restaurantId
          }
          try {
            const result = await addExtraCategory(params)

            await this.initData()
            this.categoryForm.name = ''
            this.categoryForm.description = ''
            this.showAddCategory = false
            this.$message({
              type: 'success',
              message: result.message
            })
          } catch (err) {}
        } else {
          this.$message({
            type: 'error',
            message: '请检查输入是否正确'
          })

          return false
        }
      })
    },

    addExtra(extraForm) {
      if (!this.selectValue.label) {
        this.$message({
          type: 'error',
          message: '请填写分类'
        })
        return
      }
      this.$refs[extraForm].validate(async valid => {
        if (valid) {
          const params = {
            ...this.extraForm,
            extraCategoryId: this.selectValue.extraCategoryId,
            restaurantId: this.userInfo.restaurantId
          }

          try {
            const result = await addExtra(params)

            this.$message({
              type: 'success',
              message: result.message
            })
            this.extraForm = {
              name: '',
              description: '',
              price: 0
            }
          } catch (err) {}
        } else {
          this.$message({
            type: 'error',
            message: '请检查输入是否正确'
          })
          return false
        }
      })
    },
    handleDelete(category) {
      this.currentCategory = category
      this.dialogDeleteVisible = true
    },
    async confirmDeleteButton() {
      try {
        const result = await deleteExtraCategory({
          extraCategoryId: this.currentCategory.extraCategoryId
        })
        this.$message({
          type: 'success',
          message: result.message
        })
        this.dialogDeleteVisible = false
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
