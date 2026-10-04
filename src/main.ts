import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createI18n } from 'vue-i18n'
import { createHead } from '@vueuse/head'
import './style.css'
import App from './App.vue'
import { translations } from './utils/translations'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const i18n = createI18n({
  legacy: false,
  locale: 'es',
  fallbackLocale: 'en',
  messages: translations
})

const head = createHead()

const app = createApp(App)
app.use(pinia)
app.use(i18n)
app.use(head)
app.mount('#app')