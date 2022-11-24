import { RootThunkAction } from "@/types/store";
import {http} from '@/utils/http'
import { setToken } from "@/utils/token";
import type {Token} from '@/types/data'

// login 函数的参数类型
type LoginParams = {mobile:string,code:string}

// login 接口的相应类型

type LoginResponse = {
    message:string,
    data:Token
}

export const login = (value:LoginParams):RootThunkAction => {
    return async (dispatch) => {
        // 发送请求
        const res = await http.post<LoginResponse>('/authorizations',value);
        // 拿到返回数据
        const tokens = res.data.data
        //设置本地token
        setToken(tokens);
        // 分发 action 将token保存到 reudux state 中
        dispatch({type:'login/token',payload:tokens})
    }
} 

export const getCode = (mobile:string) => {
    return async () => {
        await http.get(`/sms/codes/${mobile}`)
    }
}