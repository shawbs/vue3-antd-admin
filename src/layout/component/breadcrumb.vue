<template>
    <div class="p-2">
        <!-- {{ list }} -->
        <a-breadcrumb>
            
            <a-breadcrumb-item v-for="(item,index) in list" :key="index">
                <router-link :to="item.path" v-if="item.path">{{item.breadcrumbName}}</router-link>
                <span v-else>{{item.breadcrumbName}}</span>
            </a-breadcrumb-item>
            <!-- <a-breadcrumb-item><a href="">Application Center</a></a-breadcrumb-item>
            <a-breadcrumb-item><a href="">Application List</a></a-breadcrumb-item>
            <a-breadcrumb-item>An Application</a-breadcrumb-item> -->
        </a-breadcrumb>
    </div>
  </template>
  
  <script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import menuTree from '../menu.json'

const route = useRoute()
const list = ref<any[]>([])

function findParentsById(tree:any[], target: string) {
  const parents:any[] = []; // 存储所有找到的父级

  function traverse(node:any[], target: string) {
    for (const item of node) {
      // 检查当前节点是否有子节点
      if (item.children) {
        // 如果目标 ID 在子节点中，记录当前节点
        if (item.children.some((child:any) => child.path === target)) {
            console.log(item)
            parents.push({ 
                id: item.id,
                breadcrumbName: item.meta.title,
                path: item.path
            }); // 将父级 ID 添加到集合中
        }

        // 递归查找
        traverse(item.children, target);
      }
    }
  }

  traverse(tree, target);
  return parents; // 返回所有找到的父级集合
}

const initList = () => {
    const parentCollection = findParentsById(menuTree, route?.meta?.title as string);
    console.log(parentCollection, route.meta)
    list.value = [
        {
            path: '/',
            breadcrumbName: '首页'
        }, 
        ...parentCollection,
    ]
}

initList()
watch(route, (newRoute) => {
    initList()
})
  </script>
  