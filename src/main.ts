import { createApp } from 'vue'
import App from './App.vue'

import router from './router/index'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css';

import '@/styles/index.css';
import '@/styles/index.less';
import { createPinia } from 'pinia'


const pinia = createPinia()
const app = createApp(App)

app.use(pinia)

app.use(Antd)
app.use(router)
app.mount('#app')
