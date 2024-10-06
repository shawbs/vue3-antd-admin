<template>
    <div class="common-header">
        <navbar />
        
        <tagbar />
    </div>
</template>

<script setup lang="ts">

import navbar from './navbar.vue';
import tagbar from './tagbar.vue';

</script>

<style lang="less" scoped>
.common-header{
    flex: none;
    background-color: #fff;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%)
}
</style>