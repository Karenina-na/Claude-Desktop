import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css' //element-plus css
import 'element-plus/theme-chalk/dark/css-vars.css' //element-plus dark theme
// import './assets/css/global-light.css'
// import './assets/css/global-dark.css'
import router from './router'
import axios from "axios";
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.config.globalProperties.$axios = axios

app.mount('#app')

