import Vue from 'vue'
import VueI18n from 'vue-i18n'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN' // element-ui lang
import elementEsLocale from 'element-ui/lib/locale/lang/es' // element-ui lang
import enLocale from './en'
import zhLocale from './zh'
import esLocale from './es'

console.log('zhLocale', zhLocale)

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  },
  es: {
    ...esLocale,
    ...elementEsLocale
  }
}

const i18n = new VueI18n({
  locale: 'zh', // 设置地区
  messages
})

export default i18n
