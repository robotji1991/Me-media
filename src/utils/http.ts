import axios from 'axios'
import store from '@/store'
import {Toast} from 'antd-mobile'
import { customHistory } from './history'

const http = axios.create({
    baseURL:'http://toutiao.itheima.net/v1_0',
    timeout:5000
});

// 将来可以继续进行拦截器处理
//请求拦截器

http.interceptors.request.use((config)=>{
    // 获取token
    const {
        login:{token},
    } = store.getState();

  // 除了登录请求外，其他请求统一添加 token
  if (!config.url?.startsWith('/authorizations')) {
    // 此处，需要使用 非空断言 来去掉 headers 类型中的 undefined 类型
    config.headers!.Authorization = `Bearer ${token}`;
  }

  return config;
});

//响应拦截器
http.interceptors.response.use(undefined,(error) => {
    // 响应失败时，会执行此处的回调函数
    if(!error.response){
        // 网络超时
        Toast.show({
            content:'网络繁忙，请稍后重试',
            duration:1000
        });
        return Promise.reject(error)
    }

    if(error.response.status === 401) {
        // token 过期，登录超时
        Toast.show({
            content:'登录超时，请重新登录',
            duration:1000,
            afterClose: () => {
                customHistory.push('/login',{
                    from: customHistory.location.pathname
                });
            }
        });
    }

    return Promise.reject(error)
})

export {http}