// src/stores/counter.ts
import { defineStore } from 'pinia'

interface ISetting {
  locale: string,
  theme: string,
  colorPrimary: string
}



export const useAppStore = defineStore('counter', {
  state: () => ({
    setting: <ISetting>{
      locale:'zh',  //语言文件名 zh, en
      theme: 'light', //theme.css的文件名
      colorPrimary: '#4e54c8'
    },
    locales: [
      {
        label: '中文',
        value: 'zh-cn'
      },
      {
        label: 'English',
        value: 'en'
      },
      {
        label: '한국인',
        value: 'korean'
      }
    ]
  }),
  actions: {
    setColorPrimary(locale: string) {
      this.setting.colorPrimary = locale
    },
    setlocale(value: string){
      this.setting.locale = value || 'zh'
    }
  },
})
