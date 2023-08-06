import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from "axios";
import 'element-plus/dist/index.css' //element-plus css
import 'element-plus/theme-chalk/dark/css-vars.css' //element-plus dark theme
import './assets/css/global-light.css'
import './assets/css/global-dark.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.config.globalProperties.$axios = axios

app.mount('#app')