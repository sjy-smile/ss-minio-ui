// 引入createApp用于创建应用
import {createApp} from 'vue'

// 引入App根组件
import App from './App.vue'
// 引入路由
import router from './router'
// 引入 createPinia 用于创建 pinia
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'

// 创建一个应用
const app = createApp(App)

// 创建 pinia
const pinia = createPinia()

// 安装 pinia
app.use(pinia)
app.use(ElementPlus)
// 使用路由
app.use(router)
// 挂在整个应用
app.mount('#app')