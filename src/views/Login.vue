<template>
  <div class="login_page fillcontain">
    <div class="logo-container"><img
        :src="logo"
        alt=""
      ></div>
    <div class="form_contianer">
      <el-tabs type="border-card">
        <el-tab-pane label="登陆">
          <el-form
            :model="loginForm"
            :rules="loginRules"
            ref="loginForm"
            v-loading="loading"
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
            <el-form-item prop="captchaCode">
              <el-col :span="14">
                <el-input
                  type="text"
                  placeholder="验证码"
                  v-model="loginForm.captchaCode"
                ></el-input>
              </el-col>
              <el-col :span="6">
                <img
                  :src="captchaImg"
                  alt="captcha"
                >

              </el-col>
              <el-col :span="4">
                <el-link
                  @click="refreshCaptcha"
                  type="primary"
                  :underline="false"
                >刷新</el-link>
              </el-col>

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
            :model="registerForm"
            :rules="registerRules"
            ref="registerForm"
            v-loading="loading"
          >
            <el-form-item prop="username">
              <el-input
                v-model="registerForm.username"
                placeholder="用户名"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                placeholder="密码"
                v-model="registerForm.password"
              ></el-input>
            </el-form-item>
            <el-form-item prop="checkPassword">
              <el-input
                type="password"
                placeholder="确认密码"
                v-model="registerForm.checkPassword"
              ></el-input>
            </el-form-item>
            <el-form-item prop="captchaCode">
              <el-col :span="14">
                <el-input
                  type="text"
                  placeholder="验证码"
                  v-model="registerForm.captchaCode"
                ></el-input>
              </el-col>
              <el-col :span="6">
                <img
                  :src="captchaImg"
                  alt="captcha"
                >

              </el-col>
              <el-col :span="4">
                <el-link
                  @click="refreshCaptcha"
                  type="primary"
                  :underline="false"
                >刷新</el-link>
              </el-col>

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

  </div>
</template>

<script>
import {
  login,
  register,
  getuserInfo,
  getCaptcha
} from '../apiService/clientApi'
import { Loading } from 'element-ui'
import { setStore, removeStore } from '../config/mUtils'
import { mapActions, mapState } from 'vuex'
import store from '../store/index.js'
import logo from '../assets/logo.png'
export default {
  data() {
    const checkPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码不能小于6位数!'))
      } else {
        callback()
      }
    }

    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        captchaCode: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        captchaCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      registerForm: {
        username: '',
        password: '',
        checkPassword: '',
        captchaCode: ''
        // validateCode:''
      },
      registerRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: checkPassword, trigger: 'blur' }
        ],
        captchaCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ]
      },
      showLogin: false,
      loading: false,
      captchaImg: '',
      logo: logo
    }
  },
  created() {
    this.getCaptcha()
  },
  mounted() {
    this.showLogin = true

    if (window.localStorage.token && this.userInfo.auth == 0) {
      this.getUserData()
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(['getUserData']),
    async getCaptcha() {
      const result = await getCaptcha()
      this.captchaImg = result.data
      setStore('captcha', result.code)
    },
    refreshCaptcha() {
      this.getCaptcha()
    },
    async loginButton(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            const result = await login({
              username: this.loginForm.username,
              password: this.loginForm.password,
              captchaCode: this.loginForm.captchaCode
            })
            this.loading = false
            setStore('username', result.username)
            setStore('token', result.token)
            removeStore('captcha')
            store.dispatch('getUserData').then(() => {
              this.$router.push('home')
            })
          } catch (err) {
            this.loading = false
            this.getCaptcha()
            this.loginForm.captchaCode = ''
          }
        } else {
          this.$message({
            type: 'error',
            message: '请输入正确的用户名和密码'
          })
          return false
        }
      })
    },

    async registerButton(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            const result = await register({
              username: this.registerForm.username,
              password: this.registerForm.password,
              captchaCode: this.registerForm.captchaCode
            })
            this.loading = false
            this.$message({
              type: 'success',
              message: result.message
            })
            setStore('username', result.username)
            setStore('token', result.token)

            store.dispatch('getUserData').then(() => {
              this.$router.push('manage/addShop')
            })
          } catch (err) {
            this.loading = false
            this.getCaptcha()
            this.loginForm.captchaCode = ''
          }
        } else {
          this.$message({
            type: 'error',
            message: '请输入正确的用户名和密码'
          })

          return false
        }
      })
    }
  },
  watch: {
    userInfo: function(newValue) {
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
  display: flex;
  // justify-content: center;
  align-items: center;
  flex-direction: column;
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
.logo-container {
  margin-top: 5%;
  margin-bottom: 3%;
}
.form_contianer {
  @include wh(320px, 210px);
  // @include ctp(320px, 210px);
  // padding: 25px;
  border-radius: 5px;
  text-align: center;

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
