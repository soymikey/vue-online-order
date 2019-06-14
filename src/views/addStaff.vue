<template>
  <div>
    <head-top></head-top>
    <div class="login_page fillcontain">
      <transition
        name="form-fade"
        mode="in-out"
      >
        <div class="form_contianer">
          <el-tabs type="border-card">
            <el-tab-pane label="注册">
              <el-form
                v-loading="loading"
                :model="registerForm"
                :rules="registerRules"
                ref="registerForm"
              >
                <el-form-item prop="username">
                  <el-input
                    v-model="registerForm.username"
                    placeholder="用户名"
                  ><span>dsfsf</span></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    type="password"
                    placeholder="密码"
                    v-model="registerForm.password"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="registerButton('registerForm')"
                    class="submit_btn"
                  >注册新员工</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>

          </el-tabs>
        </div>

      </transition>
    </div>

  </div>
</template>

<script>
import headTop from '@/components/adminComponent/headTop'
import { register } from '../service/getDataClient'
import { getUserCity } from '@/service/getDataAdmin'

export default {
  props: ['adminInfo'],
  data() {
    return {
      registerForm: {
        username: '',
        password: ''
      },
      registerRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      showLogin: false,
      loading: false
    }
  },
  components: {
    headTop
  },
  mounted() {
    console.log('adminInfo', this.adminInfo)
  },
  methods: {
    async registerButton(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const res = await register({
            username: this.registerForm.username,
            password: this.registerForm.password,
            restaurantId: this.adminInfo.restaurantId,
            managerId: this.adminInfo.id
          })

          if (res.status === 1) {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.registerForm.username = ''
            this.registerForm.password = ''
          } else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
        } else {
          this.$notify.error({
            title: '错误',
            message: '请输入正确的用户名密码',
            offset: 100
          })
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style/mixin';
.login_page {
  background-color: #324057;
  height: 100%;
}
.manage_tip {
  position: absolute;
  width: 100%;
  top: -100px;
  left: 0;
  p {
    font-size: 34px;
    color: #fff;
  }
}
.form_contianer {
  @include wh(320px, 210px);
  @include ctp(320px, 210px);
  padding: 25px;
  border-radius: 5px;
  text-align: center;
  // background-color: #fff;
  .submit_btn {
    width: 100%;
    font-size: 16px;
  }
}
.tip {
  font-size: 12px;
  color: red;
}
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}
</style>
<style lang="scss" scoped>
@import '../style/mixin';
.login_page {
  background-color: #324057;
  height: 100%;
}
.manage_tip {
  position: absolute;
  width: 100%;
  top: -100px;
  left: 0;
  p {
    font-size: 34px;
    color: #fff;
  }
}
.form_contianer {
  @include wh(320px, 210px);
  @include ctp(320px, 210px);
  padding: 25px;
  border-radius: 5px;
  text-align: center;
  // background-color: #fff;
  .submit_btn {
    width: 100%;
    font-size: 16px;
  }
}
.tip {
  font-size: 12px;
  color: red;
}
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}
</style>
