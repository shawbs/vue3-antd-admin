<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      :collapsed-width="80"
      :width="300"
    >
      <div class="logo">
        {{ title }}
      </div>
      <a-menu
        v-model:selected-keys="selectedKeys"
        theme="dark"
        mode="inline"
        :items="items"
        @click="handleClick"
      ></a-menu>
    </a-layout-sider>
    <a-layout style="overflow: hidden; height: 100vh">
      <commonHeader />

      <a-layout-content style="overflow: auto">
        <div
          :style="{
            background: 'var(--u-body-bg-color)',
            minHeight: '360px',
          }"
        >
          <router-view v-slot="{ Component }">
            <keep-alive :max="5">
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </div>
      </a-layout-content>
      <!-- <a-layout-footer style="text-align: center">
          Ant Design ©2018 Created by Ant UED
        </a-layout-footer> -->
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import commonHeader from "./component/commonHeader.vue";
import { ref, VueElement, h, computed } from "vue";
import type { MenuProps, ItemType } from "ant-design-vue";
import { MailOutlined, AppstoreOutlined } from "@ant-design/icons-vue";
import { useRouter, useRoute } from "vue-router";
import { useTagbarStore } from "@/store/tagbar.ts";
import menuTree from "./menu.json";

const router = useRouter();
const route = useRoute();

const collapsed = ref<boolean>(false);
const selectedKeys = computed(() => [route.name as string]);

const { addTag } = useTagbarStore();

const title = import.meta.env.VITE_APP_TITLE;

function getItem(
  label: VueElement | string,
  key: string,
  icon?: any,
  children?: ItemType[],
  type?: "group",
  path?: string
): ItemType {
  return {
    key,
    icon,
    children,
    label,
    type,
    path,
  } as ItemType;
}

const items = ref<ItemType[]>([]);

function initMenu(tree: any[]): ItemType[] {
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

  const result: ItemType[] = [];

  tree.forEach((item) => {
    const { meta } = item;
    if (meta.type === "M") {
      // const type = (item.children && item.children.length > 0) ? 'group' : undefined
      // console.log(meta.title, type,item.children)
      const children = item.children.filter(
        (child: any) => child.meta.type === "M"
      );
      result.push(
        getItem(
          meta.title,
          item.id,
          () => h(MailOutlined),
          children && children.length ? initMenu(children) : undefined,
          undefined,
          item.path
        )
      );
    }
  });

  return result;
}

items.value = [
  getItem("首页", "home", () => h(MailOutlined), undefined, undefined, "/"),
  getItem(
    "编辑器",
    "editor",
    () => h(AppstoreOutlined),
    undefined,
    undefined,
    "/editor"
  ),
  getItem(
    "DEMO",
    "demo",
    () => h(AppstoreOutlined),
    undefined,
    undefined,
    "/demo"
  ),
  ...initMenu(menuTree),
];

console.log(initMenu(menuTree));

const handleClick: MenuProps["onClick"] = ({ item }) => {
  console.log("click", item);
  const data = item.originItemValue as ItemType & {
    path: string;
    label: string;
  };

  if (data && data.path) {
    router.push(data.path);
    addTag({
      title: data.label,
      key: data.path,
      path: data.path,
    });
  }
};
</script>
<style lang="less">
.ant-layout-sider {
  .logo {
    height: 60px;
    padding: 16px;
    background: #ddd;
    text-align: center;
    font-size: 24px;
    line-height: 26px;
    color: #000;
  }
  .ant-menu-dark {
    background-color: var(--u-side-bg-color);
    color: var(--u-side-text-color);
  }
}

.ant-layout .ant-layout-sider {
  background: var(--u-side-bg-color);
}

.ant-menu-light {
  background: transparent;
}
</style>
