<template>
  <div class="navbar">
    <div class="navbar-left">
      <breadcrumb />
    </div>
    <div class="navbar-right">
      <a-space :size="20">
        <a-button type="text" shape="circle">
          <template #icon><FullscreenOutlined /></template>
        </a-button>

        <a-dropdown>
          <a-button type="primary">{{ themeText }}</a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item v-for="item in appStore.themes" :key="item.value">
                <a href="javascript:;" @click="appStore.setTheme(item)">
                  {{ item.label }}
                </a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <a-dropdown>
          <a-button type="primary">{{ languageText }}</a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item v-for="item in appStore.locales" :key="item.value">
                <a href="javascript:;" @click="appStore.setlocale(item.value)">
                  {{ item.label }}
                </a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-button shape="circle">
          <template #icon><NotificationOutlined /></template>
        </a-button>
        <a-dropdown>
          <a-space class="user-info">
            Admin
            <a-avatar :size="30">
              <template #icon><UserOutlined /></template>
            </a-avatar>
            <DownOutlined />
          </a-space>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a href="javascript:;">个人中心</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;">清除缓存</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;">退出系统</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app";
import {
  UserOutlined,
  DownOutlined,
  FullscreenOutlined,
  NotificationOutlined,
} from "@ant-design/icons-vue";
import breadcrumb from "./breadcrumb.vue";
import { computed } from "vue";

const appStore = useAppStore();

const languageText = computed(() => {
  const o = appStore.locales.find(
    (item) => item.value === appStore.setting.locale
  );
  return o?.label;
});

const themeText = computed(() => {
  const o = appStore.themes.find(
    (item) => item.value === appStore.setting.theme
  );
  return o?.label;
});
</script>

<style lang="less" scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid var(--u-border-color);
  background-color: var(--u-header-bg-color);
  color: var(--u-header-text-color);
  // box-shadow: 0 0 10px rgba(0,0,0,0.1);
  &-right {
    .user-info {
      background-color: rgba(255, 255, 255, 0.3);
      padding: 5px 10px;
      border-radius: 20px;
      cursor: pointer;
      &:hover {
        background-color: rgba(255, 255, 255, 0.5);
      }
    }
  }
}
</style>
