import { defineStore } from 'pinia'
import { getUserInfo } from '@/api/user'
import { useCookie } from '@/utils/cookie'
import useWS from '@/composables/useWs'

export interface userStoreState {
  userInfo: UserInfo
  token?: string
}

export const useUserStore = defineStore('userStore', {
  state: (): userStoreState => ({
    token: undefined,

    // 用户信息
    userInfo: {
      box_pwd: null,
      box_status: null,
      email: null,
      google_auth_status: null,
      id: null,
      level: null,
      mobile: null,
      money: '',
      portrait: '',
      qq: '',
      skype: null,
      strong_box_amount: '',
      strong_box_status: null,
      telegram: '',
      user_group_id: null,
      user_nick: '',
      username: '',
      uuid: null,
      weixin: null,
      whatsapp: '',
      withdraw_pwd_status: null,
      password_status: null
    },

    
  }),
  getters: {

    getToken: () => {
      const cookieToken = useCookie('token')
      return cookieToken.value
    },

    // 获取用户信息
    getUserInfo: (state) => state.userInfo,
  },
  actions: {

    async updateUserInfo() {
      const res = await getUserInfo()
      this.userInfo = res
      console.log('userInfo===>',res)
    },

    
    setToken(token?: string) {
      this.token = token
      const cookieToken = useCookie('token',{ maxAge: 60 * 60 * 24 * 7 })
      cookieToken.value = token
      const { init } = useWS()
      init(token)
    },
    
  },
})


