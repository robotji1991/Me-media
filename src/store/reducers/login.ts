// 注意：该项目中，在 redux 中存储的 token 是个对象，包含两个 token：1 token（登录成功的令牌）  2 refresh_token（刷新token，token过期时换取新的token）
import { Token } from '@/types/data';
import type {LoginAction} from '@/types/store'
const initialState: Token = {
    token: '',
    refresh_token: '',
  };
export const login = (state = initialState, action: LoginAction):Token => {
  switch (action.type) {
    case 'login/token':
      return action.payload
    default:
    return state;
  }
};