// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

import SideLayout from '../layout/side.vue'

import useMiddleware from './middleware'

const routes = [
  // { path: '/', component: Home },
  { 
    path: '/login', 
    component: () => import('@/view/login/login.vue'),
    name: 'login',
    meta: {
      title: '登录'
    }
  },
  { 
    path: '/', 
    component: SideLayout, 
    children: [
      { 
        path: '', 
        component: () => import('@/view/admin/home/index.vue'),
        name: 'home',
        meta: {
          title: '首页'
        }
      },
      { 
        path: 'editor', 
        component: () => import('@/view/admin/editor/index.vue'),
        name: 'editor',
        meta: {
          title: '编辑器'
        }
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

useMiddleware(router)
export default router
