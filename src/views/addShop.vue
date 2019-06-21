<template>
  <div>
    <head-top></head-top>
    <el-row style="margin-top: 20px;">
      <el-col
        :span="12"
        :offset="4"
      >
        <el-form
          :model="formData"
          :rules="rules"
          ref="formData"
          label-width="110px"
          class="demo-formData"
        >
          <el-form-item
            label="店铺名称"
            prop="name"
          >
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item
            label="详细地址"
            prop="address"
          >
            <el-input
              v-model.number="formData.address"
              maxLength="60"
            ></el-input>
            <!-- <el-autocomplete
              v-model="formData.address"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入地址"
              style="width: 100%;"
              @select="addressSelect"
            ></el-autocomplete> -->
            <!-- <span>当前城市：{{city.name}}</span> -->
          </el-form-item>
          <el-form-item
            label="联系电话"
            prop="phone"
          >
            <el-input
              v-model.number="formData.phone"
              maxLength="11"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="店铺简介"
            prop="description"
          >
            <el-input v-model="formData.description"></el-input>
          </el-form-item>
          <el-form-item
            label="店铺标语"
            prop="promotion_info"
          >
            <el-input v-model="formData.promotion_info"></el-input>
          </el-form-item>
          <!-- <el-form-item label="店铺分类">
            <el-cascader
              :options="categoryOptions"
              v-model="selectedCategory"
              change-on-select
            ></el-cascader>
          </el-form-item> -->

          <el-form-item
            label="营业时间"
            style="white-space: nowrap;"
          >
            <el-time-select
              placeholder="起始时间"
              v-model="formData.startTime"
              :picker-options="{
							start: '05:30',
							step: '00:15',
							end: '23:30'
							}"
            >
            </el-time-select>
            <el-time-select
              placeholder="结束时间"
              v-model="formData.endTime"
              :picker-options="{
							start: '05:30',
							step: '00:15',
							end: '23:30',
							minTime: formData.startTime
							}"
            >
            </el-time-select>
          </el-form-item>

          <el-form-item class="button_submit">

            <div v-if="!this.restaurantInfo">
              <el-button
                type="primary"
                @click="createButton('formData')"
              >立即创建</el-button>
            </div>
            <div v-else>
              <el-button
                type="primary"
                @click="updateButton('formData')"
              >更新</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div>{{this.restaurantInfo}}</div>
  </div>
</template>

<script>
import headTop from '@/components/adminComponent/headTop'
import {
  addRestaurant,
  updateRestaurant // foodCategory
} from '@/apiService/clientApi'
import { baseUrl, imgBaseUrl } from '@/config/env'
import { mapState, mapMutations } from 'vuex'

export default {
  data() {
    return {
      city: {},
      formData: {
        name: '', //店铺名称
        address: '', //地址
        description: '', //介绍
        phone: '',
        startTime: '',
        endTime: ''
      },
      rules: {
        name: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话' },
          { type: 'number', message: '电话号码必须是数字' }
        ]
      },
      baseUrl,
      imgBaseUrl
    }
  },
  components: {
    headTop
  },
  mounted() {},

  computed: {
    ...mapState(['userInfo', 'restaurantInfo'])
  },
  watch: {
    restaurantInfo: function(newValue) {
      let startTime = newValue.opening_hours[0].split('/')[0]
      let endTime = newValue.opening_hours[0].split('/')[1]

      this.formData.name = newValue.name //店铺名称
      this.formData.address = newValue.address //地址
      this.formData.description = newValue.description //介绍
      this.formData.phone = parseInt(newValue.phone)
      this.formData.startTime = startTime
      this.formData.endTime = endTime
    }
  },
  methods: {
    ...mapMutations(['RECORD_SHOPDETAIL']),
    async initData() {
      try {
        const categories = await foodCategory()
        categories.forEach(item => {
          if (item.sub_categories.length) {
            const addnew = {
              value: item.name,
              label: item.name,
              children: []
            }
            item.sub_categories.forEach((subitem, index) => {
              if (index == 0) {
                return
              }
              addnew.children.push({
                value: subitem.name,
                label: subitem.name
              })
            })
            this.categoryOptions.push(addnew)
          }
        })
      } catch (err) {
        console.log(err)
      }
    },
    async querySearchAsync(queryString, cb) {
      if (queryString) {
        try {
          const cityList = await searchplace(this.city.id, queryString)
          if (cityList instanceof Array) {
            cityList.map(item => {
              item.value = item.address
              return item
            })
            cb(cityList)
          }
        } catch (err) {
          console.log(err)
        }
      }
    },

    handleShopAvatarScucess(res, file) {
      if (res.status == 1) {
        this.formData.image_path = res.image_path
      } else {
        this.$message.error('上传图片失败！')
      }
    },
    handleBusinessAvatarScucess(res, file) {
      if (res.status == 1) {
        this.formData.business_license_image = res.image_path
      } else {
        this.$message.error('上传图片失败！')
      }
    },
    handleServiceAvatarScucess(res, file) {
      if (res.status == 1) {
        this.formData.catering_service_license_image = res.image_path
      } else {
        this.$message.error('上传图片失败！')
      }
    },
    beforeAvatarUpload(file) {
      const isRightType =
        file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isRightType) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isRightType && isLt2M
    },

    handleDelete(index) {
      this.activities.splice(index, 1)
    },
    createButton(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          Object.assign(
            this.formData,

            { managerId: this.userInfo.userId },
            { restaurantId: this.userInfo.restaurantId }
          )

          try {
            let result = await addRestaurant(this.formData)
            if (result.status == 1) {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.RECORD_SHOPDETAIL(result.data)
            } else {
              this.$message({
                type: 'error',
                message: result.message
              })
            }
            console.log(result)
          } catch (err) {
            console.log(err)
          }
        } else {
          this.$notify.error({
            title: '错误',
            message: '请检查输入是否正确',
            offset: 100
          })
          return false
        }
      })
    },
    updateButton(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          Object.assign(
            this.formData,

            { managerId: this.userInfo.userId },
            { restaurantId: this.userInfo.restaurantId }
          )
          try {
            let result = await updateRestaurant(this.formData)
            if (result.status == 1) {
              this.$message({
                type: 'success',
                message: '更新成功'
              })
              this.RECORD_SHOPDETAIL(result.data)
            } else {
              this.$message({
                type: 'error',
                message: result.message
              })
            }
            console.log(result)
          } catch (err) {
            console.log(err)
          }
        } else {
          this.$notify.error({
            title: '错误',
            message: '请检查输入是否正确',
            offset: 100
          })
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '../style/mixin';
.button_submit {
  text-align: center;
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
.el-table .info-row {
  background: #c9e5f5;
}

.el-table .positive-row {
  background: #e2f0e4;
}
</style>
