import { defineStore } from 'pinia'

interface tagItem {
  title:string,
  affix?:boolean,
  path:string,
  key:string
}

const defaultTag = [
    {
        title: '首页',
        path: '/',
        key: '/',
        affix: true,
    }
]

const caches = localStorage.getItem('tagbar') ? JSON.parse(localStorage.getItem('tagbar') as string) : []

export const useTagbarStore = defineStore('userStore', {
  state: () => ({
    tags: (caches && caches.length > 0 ? caches : defaultTag) as tagItem[],
  }),
  getters: {

  },
  actions: {

    // 获取用户信息
    addTag(data: tagItem){
        if(this.tags.some(item=>item.key === data.key)) return
        console.log('add tag', data)
        this.tags.push(data)
    },

    removeTag(key:string){
        console.log('remove tag', key)
        this.tags = this.tags.filter((item)=>item.key !== key)
    },

    removeTagOther(key:string){
        this.tags = this.tags.filter((item)=>item.key === key || item.affix)
    },

    removeTagAll(){
        this.tags = [
            ...defaultTag
        ]
    },

    saveTag(){
        localStorage.setItem('tagbar', JSON.stringify(this.tags))
    }
    
  },
})


