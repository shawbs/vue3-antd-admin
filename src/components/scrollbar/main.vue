<template>
    <div class="custom-scrollbar">
      <div ref="scrollContent" class="scrollbar-content" @scroll="onScroll">
        <slot></slot>
      </div>
      <div class="scrollbar-thumb" :style="{ height: thumbHeight, transform: `translateY(${thumbTop}px)` }"></div>
    </div>
  </template>
  
  <script setup>
  import {ref, onMounted, watch} from "vue";
  
  const props = defineProps({
    height: {
      type: String,
      default: "400px"
    }
  });
  
  const scrollContent = ref(null);
  const thumbHeight = ref("0");
  const thumbTop = ref(0);
  
  const calculateThumbSize = () => {
    const contentHeight = scrollContent.value.scrollHeight;
    const containerHeight = scrollContent.value.clientHeight;
    thumbHeight.value = `${(containerHeight / contentHeight) * 100}%`;
  };
  
  const onScroll = () => {
    const contentHeight = scrollContent.value.scrollHeight;
    const scrollTop = scrollContent.value.scrollTop;
    const containerHeight = scrollContent.value.clientHeight;
  
    thumbTop.value = (scrollTop / contentHeight) * containerHeight;
  };
  
  onMounted(() => {
    calculateThumbSize();
    watch(() => scrollContent.value.scrollHeight, calculateThumbSize);
  });
  </script>
  
  <style scoped>
  .custom-scrollbar {
    position: relative;
    height: var(--scrollbar-height, 400px);
    overflow: hidden;
  }
  
  .scrollbar-content {
    height: 100%;
    overflow-y: auto;
  }
  
  .scrollbar-thumb {
    position: absolute;
    right: 2px;
    width: 8px;
    background: #1890ff;
    border-radius: 4px;
  }
  </style>
  