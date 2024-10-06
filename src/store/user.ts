import { defineStore } from 'pinia'
import { login, logout, getUserInfo } from '@/api/user'
import { useCookie } from '@/utils/cookie'
import Wsocket from '@/composables/useWs'
import { useTagbarStore } from './tagbar';
export interface userStoreState {
  userInfo: UserInfo | undefined
  token?: string
  ws: any
}

const defaultUserInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo') as string) : null

export const useUserStore = defineStore('userStore', {
  state: (): userStoreState => ({
    token: useCookie.get('token') || undefined,

    ws: null,

    // 用户信息
    userInfo: defaultUserInfo,

  }),
  getters: {

    getToken: () => {
      const cookieToken = useCookie.get('token')
      return cookieToken
    },

    // 获取用户信息
    getUserInfo: (state) => state.userInfo,
  },
  actions: {
    setUserInfo(data: UserInfo) {
      this.userInfo = data
      localStorage.setItem('userInfo', JSON.stringify(data))
    },

    async login(data:any) {
      const res = await login(data)
      this.setUserInfo(res?.data as UserInfo)
      console.log('userInfo===>',res)
    },

    async updateUserInfo() {
      const res = await getUserInfo()
      this.setUserInfo(res?.data as UserInfo)
      console.log('userInfo===>',res)
    },

    setToken(token?: string) {
      useCookie.set('token',token as string)
      this.ws = new Wsocket(
        import.meta.env.VITE_APP_WS_URL +
          "?token=" +
          token,
        {
          onOpen: () => {
            console.log("已成功连接到消息服务器...", _);
          },
          onError: () => {
            console.log("未成功连接到消息服务器...");
          },
          onClose: () => {
            console.log("与消息服务器断开...");
          },
        })
    },

    removeToken() {
      this.token = undefined
      useCookie.remove('token')
      this.ws && this.ws.close()
      useTagbarStore().removeTagAll()
    },

    async logout(data:any) {
      const res = await logout(data)
      this.userInfo = undefined
      this.removeToken()
      console.log('userInfo===>',res)
    },
  },
})


