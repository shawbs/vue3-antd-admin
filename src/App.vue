<script setup lang="ts">
import { useAppStore } from '@/store/app.ts'
import dayjs from 'dayjs';
import { getLocale } from '@/i18n/lib'
  
import { computed, watch } from 'vue';
const { setting } = useAppStore()

watch(() => setting.locale, (val) => {
  dayjs.locale(getLocale(setting.locale).dayjs);
  // dayjs.locale('zh-cn')
  // dayjs.locale('en')
})
</script>

<template>
  <a-config-provider
    :locale="getLocale(setting.locale).antd"
    :theme="{
      token: {
        colorPrimary: setting.colorPrimary,
      },
    }"
  >
    <router-view></router-view>
  </a-config-provider>
  
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
