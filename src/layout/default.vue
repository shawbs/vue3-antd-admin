<template>
    <a-layout>
      <!-- <a-layout-header :style="headerStyle"></a-layout-header> -->
      <a-layout-content :style="contentStyle">
        <router-view></router-view>
      </a-layout-content>
      <!-- <a-layout-footer :style="footerStyle"></a-layout-footer> -->
    </a-layout>
</template>

<script setup lang="ts">
const contentStyle = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#108ee9',
};
</script>

<style scoped>

</style>