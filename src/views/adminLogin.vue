<template>
  <div class="login_page fillcontain">
    <transition
      name="form-fade"
      mode="in-out"
    >
      <section
        class="form_contianer"
        v-show="showLogin"
      >
        <div class="manage_tip">
          <p>米高后台管理系统</p>
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
              @click="submitForm('loginForm')"
              class="submit_btn"
            >登陆</el-button>
          </el-form-item>
        </el-form>

      </section>
    </transition>
  </div>
</template>

<script>
import { login, getAdminInfo } from '@/apiService/clientApi'
import { mapActions, mapState } from 'vuex'
import store from '../store/index.js'

export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      showLogin: false
    }
  },
  mounted() {
    this.showLogin = true

    if (!this.adminInfo.status) {
      this.getUserData()
    } else if (this.adminInfo.status === 1) {
      this.$message.error('普通管理员的权限不够')
    } else if (this.adminInfo.status === 2) {
      this.$router.push('/manage/home')
    }
  },
  computed: {
    ...mapState(['adminInfo'])
  },
  methods: {
    ...mapActions(['getUserData']),
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const res = await login({
            user_name: this.loginForm.username,
            password: this.loginForm.password
          })

          if (res.status === 2) {
            this.$message({
              type: 'success',
              message: '登录成功'
            })
            console.log('res', res)

            store.dispatch('getUserData').then(() => {
              this.$router.push('/manage/home')
            })
          } else if (res.status === 1) {
            this.$message({
              type: 'error',
              message: '普通管理员的权限不够'
            })
          } else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
        } else {
          this.$message({
            type: 'error',
            message: '请输入正确的用户名密码'
          })

          return false
        }
      })
    }
  },
  watch: {
    adminInfo: function(newValue) {
      if (newValue.status === 2) {
        this.$message({
          type: 'success',
          message: '登入成功'
        })
        this.$router.push('/manage/home')
      } else if (newValue.status === 1) {
        this.$message({
          type: 'error',
          message: '普通管理员的权限不够'
        })
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
  background-color: #fff;
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
