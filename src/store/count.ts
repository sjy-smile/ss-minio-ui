// 引入defineStore用于创建store
import { defineStore } from 'pinia'

// 定义并暴露一个 store
export const useCountStore = defineStore("count", {
    // 动作 action 里面放置的一个一个的方法，用于响应组件中的动作
    actions: {
        increment(value: number) {
            console.log("调用increment ", value)
            // 修改数据(this是当前的store)
            this.sum += value
        }
    },
    // 状态 真正存储数据的地方
    state() {
        return {
            sum: 6,
            city: "上海",
            address: "浦东"
        }
    },
    // 计算
    getters: {
        // 第一种写法
        // bigSum(state){
        //     return state.sum*10
        // }
        // 第二种写法
        bigSum: state => state.sum * 10,
        updateCity(): number {
            return this.address.length;
        }
    }
})