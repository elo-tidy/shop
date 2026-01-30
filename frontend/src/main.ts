import './assets/styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createHead } from '@unhead/vue/client'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const head = createHead()

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(head)
app.use(router)

app.mount('#app')
