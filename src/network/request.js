import axios from 'axios'
export function request(config){
    // 1.创建axios实例
    const instance = axios.create({
        baseURL:'http://127.0.0.1:3000/api', //配置请求的根路径
        timeout:5000, // 配置超时事件
    })
    // 2. 发送真正的网络请求
    return instance(config)
}