import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { Vueginate } from 'vueginate'
import 'vueginate/css/vueginate.css'

// toast notification
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
const options = {}

import App from './App.vue'
import router from './router'

const app = createApp(App)

// Create Pinia and use plugin
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Register Pinia **before using any store**
app.use(pinia)

app.use(router)
app.use(Toast, options)
app.component('Pagination', Vueginate)
app.mount('#app')
