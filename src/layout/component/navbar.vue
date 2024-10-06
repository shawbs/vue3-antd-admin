<template>
    <div class="navbar">
        <div class="navbar-left">
            <breadcrumb />
        </div>
        <div class="navbar-right">
            <a-space :size="20">
                
                <a-button type="primary" shape="circle">
                    <template #icon><FullscreenOutlined /></template>
                </a-button>
                
                <a-dropdown>
                    <a-button type="text">{{ language }}</a-button>
                    <template #overlay>
                    <a-menu>
                        <a-menu-item v-for="item in appStore.locales" :key="item.value">
                            <a href="javascript:;" @click="appStore.setlocale(item.value)">{{item.label}}</a>
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
import { useAppStore } from '@/store/app';
import { 
    UserOutlined,
    DownOutlined,
    FullscreenOutlined,
    NotificationOutlined } from '@ant-design/icons-vue';
import breadcrumb from './breadcrumb.vue';
import { computed } from 'vue';

const appStore = useAppStore()

const language = computed(() => {
    const o = appStore.locales.find(item => item.value === appStore.setting.locale)
    return o ? o.label : '中文'
})

</script>

<style lang="less" scoped>
.navbar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    // background-color: #ddd;
    // box-shadow: 0 0 10px rgba(0,0,0,0.1);
    &-right{
        .user-info{
            background-color: #ddd;
            padding: 5px 10px;
            border-radius: 20px;
            cursor: pointer;
            &:hover{
                background-color: #ccc;
            }
        }
    }
}
</style>