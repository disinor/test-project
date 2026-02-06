import './assets/main.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Popper from "vue3-popper";
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/js/bootstrap.bundle'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.component('Popper', Popper)
app.use(pinia)
app.use(router)

app.mount('#app')
