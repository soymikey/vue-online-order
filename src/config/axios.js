import axios from 'axios'
import { Message } from 'element-ui'
// import NProgress from 'nprogress'

// 'http://119.23.201.183:4000'
const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://pos.migaox.com/api'
      : 'http://pos.migaox.com/api', // api的base_url
  timeout: 20000 // 请求超时时间
})

let timer

//拦截请求
instance.interceptors.request.use(
  config => {
    // config.url = '/api' + config.url
    const token = localStorage.getItem('token')
    const Captcha = localStorage.getItem('captcha')
    if (token) {
      config.headers.common['Authorization'] = 'Bearer ' + token
    }
    if (Captcha) {
      config.headers.common['Captcha'] = 'Bearer ' + Captcha
    }

    return config
  },
  error => {
    Message.error('bed request')
    Promise.reject(error)
  }
)
//拦截响应
instance.interceptors.response.use(
  response => {
    if (response.data.status === 0) {
      response.data.message && Message.error(response.data.message)
      return Promise.reject(response.data)
    }
    return response.data
  },
  err => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (err && err.response) {
        switch (err.response.status) {
          case 400:
            Message.error('错误请求')
            break
          case 401:
            localStorage.clear()
            Message.error('登录信息过期或未授权，请重新登录！')
            break
          case 403:
            Message.error('拒绝访问！')
            break
          case 404:
            Message.error('请求错误,未找到该资源！')
            break
          case 500:
            Message.err('服务器出问题了，请稍后再试！')
            break
          default:
            Message.err(`连接错误 ${err.response.status}！`)
            break
        }
      } else {
        Message.error('服务器出了点小问题，请稍后再试！')
      }
    }, 200) // 200 毫秒内重复报错则只提示一次！

    return Promise.reject(err)
  }
)

export default instance
