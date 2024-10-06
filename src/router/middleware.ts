
import { useUserStore } from '@/store/user'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Router } from 'vue-router'


const title = import.meta.env.VITE_APP_TITLE
const defaultRoutePath = '/'
const whiteRoute = ['login']

export default (router: Router) => {
    router.beforeEach(async (to, from, next) => {
        console.log(to, from)
        NProgress.start()
        const userStore = useUserStore()
        let toTitle = to.meta.title ? to.meta.title : to.name
        document.title = `${toTitle} - ${title}`
        const token = userStore.token
      
        // debugger
        // 登录状态下
        if (token) {
          // 已登录直接跳转首页
          if (to.name === 'login') {
            next({ path: defaultRoutePath })
            return
          }
          
      
        } else {
          // 未登录的情况下允许访问的路由
          if (!whiteRoute.includes(to.name)) {
            next({ name: 'login', query: { redirect: to.fullPath } })
          } else {
            next()
          }
        }
      })
      
      router.afterEach((to, from) => {
        NProgress.done()
      })
      
      router.onError(error => {
        console.log(error)
        NProgress.done();
      });
}
