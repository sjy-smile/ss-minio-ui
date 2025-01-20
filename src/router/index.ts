// 创建一个路由器，并暴露出去
// 引入 createRouter
import { createRouter, createWebHistory } from "vue-router"

// 引入需要路由的组件
import MinioConfig from "@/components/MinioConfig.vue"
import UploadFile from "@/components/UploadFile.vue"

// 创建路由器
const router = createRouter({
    history: createWebHistory(),  // 路由的工作模式
    routes: [ // 路由规则
        {
            name: "config",
            path: "/config",
            component: MinioConfig
        },
        {
            name: "uploadfile",
            path: "/uploadfile",
            component: UploadFile
        }
    ]
})


// 暴露路由
export default router