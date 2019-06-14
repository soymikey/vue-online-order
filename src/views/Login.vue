<template>
  <div class="login_page fillcontain">
    <transition
      name="form-fade"
      mode="in-out"
    >
      <div class="form_contianer">
        <el-tabs type="border-card">

          <el-tab-pane label="登陆">
            <el-form
              :model="loginForm"
              :rules="loginRules"
              ref="loginForm"
            >
              <el-form-item prop="username">
                <el-input
                  v-model="loginForm.username"
                  placeholder="用户名"
                ><span>dsfsf</span></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  type="password"
                  placeholder="密码"
                  v-model="loginForm.password"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="loginButton('loginForm')"
                  class="submit_btn"
                >登陆</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
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
                >注册</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

        </el-tabs>
      </div>

      <!-- <section class="form_contianer">
        <div class="manage_tip">
          <p>米高接单系统</p>
        </div>
        <el-form
          :model="loginForm"
          :rules="rules"
          ref="loginForm"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="用户名"
            ><span>dsfsf</span></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              placeholder="密码"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="loginButton('loginForm')"
              class="submit_btn"
            >登陆</el-button>
          </el-form-item>
        </el-form>

      </section> -->
    </transition>
  </div>
</template>

<script>
import { login, register, getAdminInfo } from '../apiService/clientApi'
import { Loading } from 'element-ui'
import { setStore } from '../config/mUtils'
import { mapActions, mapState } from 'vuex'
import store from '../store/index.js'

export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
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
  mounted() {
    this.showLogin = true
    if (this.adminInfo.auth == 0) {
      this.getUserData()
    }
  },
  computed: {
    ...mapState(['adminInfo'])
  },
  methods: {
    ...mapActions(['getUserData']),
    async loginButton(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const res = await login({
            username: this.loginForm.username,
            password: this.loginForm.password
          })

          if (res.status === 2 || res.status === 1) {
            this.$message({
              type: 'success',
              message: '登入成功'
            })
            store.dispatch('getUserData').then(() => {
              this.$router.push('home')
            })
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
    },
    async registerButton(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          register({
            username: this.registerForm.username,
            password: this.registerForm.password
          }).then(res => {
            if (res.status === 1) {
              console.log('ok', res)
              this.$message({
                type: 'success',
                message: res.message
              })
              setStore('username', res.username)
              setStore('token', res.token)
              this.loading = true

              store.dispatch('getUserData').then(() => {
                this.$router.push('home')
              })
            } else {
              this.$message({
                type: 'error',
                message: res.message
              })
            }
          })
          // console.log('res=====================', res)
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
  },
  watch: {
    adminInfo: function(newValue) {
      if (newValue.auth === 2 || newValue.auth === 1) {
        this.$message({
          type: 'success',
          message: '登入成功'
        })
        this.$router.push('home')
      }
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
