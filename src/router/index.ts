// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

import SideLayout from '../layout/side.vue'

const routes = [
  // { path: '/', component: Home },
  { 
    path: '/login', 
    component: () => import('@/view/login/login.vue'), 
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
        meta: {
          title: '首页'
        }
      },
      { 
        path: 'editor', 
        component: () => import('@/view/admin/editor/index.vue'), 
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

export default router
