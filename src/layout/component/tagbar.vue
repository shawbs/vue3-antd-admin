<template>
    <div class="tagbar">
        <div class="tagbar-container" @wheel="scrollHandle" ref="containerRef">
            <div class="tagbar-item" 
            v-for="item in tags" 
            :key="item.key" 
            
            :class="{ active: item.key === $route.path}"
            >
                <span @click="clickHandle(item)">{{ item.title }}</span>
                <CloseOutlined v-if="!item.affix"class="ml-2 tag-close" @click="removeTag(item.key)"/>
            </div>
        </div>
        <div class="tagbar-setting">
            

            <a-dropdown>
                <a-button type="text">
                    <template #icon><SettingOutlined /></template>
                </a-button>
                <template #overlay>
                <a-menu>
                    <a-menu-item>
                    <a href="javascript:;" @click="removeTagOther(route.path)">关闭其它</a>
                    </a-menu-item>
                    <a-menu-item>
                    <a href="javascript:;" @click="removeTagAll">关闭所有</a>
                    </a-menu-item>
                </a-menu>
                </template>
            </a-dropdown>
        </div>

        <!-- <div style="position: absolute; top: 200px;">{{ tags }}</div> -->
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { SettingOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { useRoute, useRouter } from 'vue-router';
import { useTagbarStore } from '@/store/tagbar';
import { storeToRefs } from 'pinia';
interface TagbarItem {
    title: string,
    path: string,
    key: string,
    affix?: boolean
}


const { saveTag, removeTag,removeTagOther,removeTagAll } = useTagbarStore()

const { tags } = storeToRefs(useTagbarStore())


const router = useRouter();
const route = useRoute();


const containerRef = ref()

const scrollHandle = (event:any) => {
    event.preventDefault();
    containerRef.value.scrollLeft += event.deltaY; // 这里可以调整滚动速度
}

const clickHandle = (item: TagbarItem) => {
    console.log(item)

    router.replace(item.path)
    
}

window.addEventListener('unload', () => {
    saveTag()
})
</script>

<style lang="less" scoped>
.tagbar{
    display: flex;
    align-items: center;
    // background-color: #fff;
    border-bottom: 1px solid #eee;
    padding: 5px 0;
    &-item{
        min-width: 80px;
        text-align: center;
        padding: 8px 10px;
        // height: 40px;
        line-height: 14px;
        cursor: pointer;
        margin: 0 5px;
        background-color: #eee;
        border-radius: 4px;
        &.active,&:hover{
            background-color: var(--u-primary-text-color);
            color: #fff;
        }
        .tag-close{
            width: 16px;
            height: 16px;
            
            &:hover{
                border-radius: 4px;
                background-color: #eee;
                color: #333;
            }
        }
    }
    &-container{
        display: flex;
        flex: 1;
        overflow-x: auto;
    }
    &-setting{
        flex: none;
        padding: 0 10px;
        cursor: pointer;
    }
}
</style>