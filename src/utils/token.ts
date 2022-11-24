import { Token } from "@/types/data";

// 使用常量来存储key

const MEDIA_TOKEN_KEY = "me-media";

// 创建获取 token
export const getToken = (): Token =>
  JSON.parse(
    localStorage.getItem(MEDIA_TOKEN_KEY) ?? '{"token":"","refresh_token":""}'
  ) as Token;

//创建设置token
export const setToken = (token: Token) =>
  localStorage.setItem(MEDIA_TOKEN_KEY, JSON.stringify(token));

//创建清除token
export const clearToken = () => localStorage.removeItem(MEDIA_TOKEN_KEY);

// 创建 根据token判断是否登录

export const isAuth = () => !!getToken();
