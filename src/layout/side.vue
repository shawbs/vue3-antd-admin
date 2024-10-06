<template>
    <a-layout style="min-height: 100vh">
      <a-layout-sider v-model:collapsed="collapsed" collapsible>
        <div class="logo" />
        <a-menu 
        v-model:selectedKeys="selectedKeys" 
        :items="items" 
        @click="handleClick"
        theme="dark" 
        mode="inline"></a-menu>
      </a-layout-sider>
      <a-layout style="overflow: hidden;height: 100vh;">
        <commonHeader />
        
        <a-layout-content style="overflow: auto;">
          <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
            <keep-alive :max="5" >
                <router-view></router-view>
            </keep-alive>
          </div>
        </a-layout-content>
        <!-- <a-layout-footer style="text-align: center">
          Ant Design ©2018 Created by Ant UED
        </a-layout-footer> -->
      </a-layout>
    </a-layout>
  </template>
  <script lang="ts" setup>
import commonHeader from './component/commonHeader.vue';
import { reactive, ref, watch, VueElement, h } from 'vue';
import type { MenuProps, ItemType } from 'ant-design-vue';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { useTagbarStore } from '@/store/tagbar.ts';
import menuTree from './menu.json'
  const collapsed = ref<boolean>(false);
  const selectedKeys = ref<string[]>(['1']);

  const router = useRouter()
  const { addTag } = useTagbarStore()

  function getItem(
        label: VueElement | string,
        key: string,
        icon?: any,
        children?: ItemType[],
        type?: 'group',
        path?: string,
    ): ItemType {
        return {
            key,
            icon,
            children,
            label,
            type,
            path
        } as ItemType;
    }
    
    const items = ref<ItemType[]>([])

    function initMenu(tree:any[]):ItemType[] {
      // data.forEach((item: any) => {
      //   const { meta } = item
      //   const obj:ItemType = {
      //     key: item.id,
      //     path: item.path,
      //     name: item.name,
      //     title: item.title,
      //     type: meta.type,
      //     children: item.children
      //   } as ItemType
        
      //   if(meta.type == 'M'){
      //     items.value.push(obj)
      //   }
      //   if( item.children && item.children.length > 0){
      //     initMenu(item.children, children)
      //   }
      // })

      const result:ItemType[] = [];

      tree.forEach(item => {
        const { meta } = item
        if (meta.type === 'M') {
          // const type = (item.children && item.children.length > 0) ? 'group' : undefined
          // console.log(meta.title, type,item.children)
          const children = item.children.filter((child: any) => child.meta.type === 'M');
          // console.log(111111,children)
          result.push(
            getItem(
              meta.title, 
              item.id, 
              () => h(MailOutlined), 
              (children && children.length ? initMenu(children) : undefined), 
              undefined, 
              item.path)
            );
        }
      });

      return result;
    }

    items.value = [

      getItem('首页', '1', () => h(MailOutlined), undefined, undefined, '/'),
      getItem('编辑器', '2', () => h(AppstoreOutlined), undefined, undefined, '/editor'),
      ...initMenu(menuTree)
    ]

    console.log(initMenu(menuTree))

    const handleClick: MenuProps['onClick'] = ({ item }) => {
        console.log('click', item);
        const data = item.originItemValue as ItemType & { path: string, label: string }
        // setTimeout(() => {
        //     e.item.path && router.push(e.item.path) 
        // }, 0);
        if(data && data.path){
            router.push(data.path)
            addTag({
                title: data.label,
                key: data.path,
                path: data.path
            })
        }
        
    };


  </script>
  <style>
  .ant-layout-sider .logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 255, 255, 0.3);
  }
  
  .site-layout .site-layout-background {
    background: #fff;
  }
  [data-theme='dark'] .site-layout .site-layout-background {
    background: #141414;
  }
  </style>
  