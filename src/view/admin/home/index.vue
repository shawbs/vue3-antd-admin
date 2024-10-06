<template>
    <div style="height: 120vh;">
      <h1>Home Page</h1>
      <a-date-picker v-model:value="value1" />
      <router-link to="/login"> login page</router-link>

      <a-space wrap>
          <a-button type="primary">Primary Button</a-button>
          <a-button>Default Button</a-button>
          <a-button type="dashed">Dashed Button</a-button>
          <a-button type="text">Text Button</a-button>
          <a-button type="link">Link Button</a-button>
      </a-space>

    </div>
  </template>
  
  <script lang="ts" setup>
import { ref } from 'vue';

  const value1 = ref()
  </script>
  <style lang="less" scoped>
  h1 {
    color: red;
  }
  </style>