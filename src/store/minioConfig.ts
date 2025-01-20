// 引入defineStore用于创建store
import { defineStore } from 'pinia'
import axios from 'axios'
import {nanoid} from 'nanoid'

// 定义并暴露一个 store
export const useTalkStore = defineStore("talk", {
    // 动作
    actions: {
       async getTalk(){
            // 发送请求，下面这行的写法是，连续解构复制+重命名
            let {data:{content:title}} = await axios.get('https://api.uomg.com/api/rand.qinghua?format=json');
            // 把请求回来的字符串，包装成一个对象
            const obj = {id:nanoid(),title}
            // 放到数组中
            this.talkList.unshift(obj)
        }
    },
    // 状态
    state() {
        return {
            talkList: JSON.parse(localStorage.getItem("talkList")  as string) || []
        }
    },
    // 计算
    getters: {

    }
})