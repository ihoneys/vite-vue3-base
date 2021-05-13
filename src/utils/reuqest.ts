import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { debounce } from './utils'
import { Toast, Dialog } from 'vant'
import router from '../router'
import { nextTick } from 'vue'
// 请求状态码定义
const httpCode = {
    "400": '请求参数错误',
    "401": '权限不足, 请重新登录',
    "403": '服务器拒绝本次访问',
    "404": '请求资源未找到',
    "500": '内部服务器错误',
    "501": '服务器不支持该请求中使用的方法',
    "502": '网关错误',
    "504": '网关超时',
    /** ... */
}
// 请求地址
const baseURL: string = 'https://api.github.com'
// 运行环境
const getEnv = import.meta.env.MODE

// loading 实例
let loadingInstance: any
// 当前正在请求的数量
let needLoadingRequestCount = 0

// 显示loading
const showLoading = () => {
    if (needLoadingRequestCount === 0 && !loadingInstance) {
        loadingInstance = Toast.loading({
            message: '加载中...',
            duration: 30000,
            forbidClick: true,
        })
    }
    needLoadingRequestCount++
}
// 关闭loading
const closeLoading = () => {
    nextTick(() => {
        needLoadingRequestCount--
        needLoadingRequestCount = Math.max(needLoadingRequestCount, 0) //保证大于等于0
        if (needLoadingRequestCount === 0) {
            if (loadingInstance) {
                hideLoading()
            }
        }
    })
}

const hideLoading = debounce(() => {
    loadingInstance.clear()
    loadingInstance = null
}, 300)

const axios = Axios.create({
    timeout: 30000,
    baseURL,
})

// 前置拦截器（发起请求之前的拦截）
axios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        showLoading()
        // config.headers['LQT-TOKEN'] = LocalStorage.get('token') || '' 请求头添加token
        config.headers['Access-Control-Allow-Origin'] = `*`
        if (config.method === 'get') {
            config.params = {
                ...config.params,
                // t: new Date().getTime(),
            }
        }
        /**
           在这里：可以根据业务需求可以在发送请求之前做些什么:例如我这个是导出文件的接口，因为返回的是二进制流，所以需要设置请求响应类型为blob，就可以在此处设置。
           if (config.url.includes('pur/contract/export')) {
             config.headers['responseType'] = 'blob'
            }
          我这里是文件上传，发送的是二进制流，所以需要设置请求头的'Content-Type'
          if (config.url.includes('pur/contract/upload')) {
            config.headers['Content-Type'] = 'multipart/form-data'
          }
         */
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 后置拦截器（获取到响应时的拦截）
axios.interceptors.response.use(
    (response) => {
        closeLoading()
        /**
         *  返回结果处理
         */
        return response
    },
    (error) => {
        closeLoading()
        if (error.response && error.response.data) {
            const code: any = error.response.status
            const msg = error.response.data.message
            Dialog({
                title: '提示',
                message: `Code: ${code}, Message: ${msg}`,
            })
            console.error(`[Axios Error]`, error.response)
        } else {
            Dialog({
                title: '提示',
                message: error,
            })
        }
        return Promise.reject(error)
    }
)


export default axios