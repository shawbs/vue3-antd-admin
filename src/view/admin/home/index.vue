<template>
  <div class="p-2" style="height: 120vh">
    <a-card>
      <h1>HI! 欢迎使用{{ title }}!</h1>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
const title = import.meta.env.VITE_APP_TITLE;
</script>
<style lang="less" scoped>
h1 {
  font-size: 24px;
}
</style>
