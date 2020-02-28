import axios from 'axios'
export function request(config){
    // 1.创建axios实例
    const instance = axios.create({
        baseURL:'http://localhost:3000/api', //配置请求的根路径
        timeout:10000, // 配置超时时间
    })
    // 配置拦截器 加入token令牌
    instance.interceptors.request.use(config => {
        config.headers.Authorization = window.sessionStorage.getItem('token')
        return config
    })
    // 2. 发送真正的网络请求
    return instance(config)
}