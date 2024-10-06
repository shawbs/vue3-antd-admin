<template>
    <div class="login-container">
        <canvas ref="canvasRef"></canvas>
        <div class="login-box">
            <div class="login-box-left">
                <img src="" alt="">
            </div>
            <div class="login-box-right">
                <h1>管理平台</h1>
                <a-form
                    :model="formState"
                    name="basic"
                    autocomplete="off"
                    @finish="onFinish"
                    @finishFailed="onFinishFailed"
                >
                    <a-form-item
                    name="username"
                    :rules="[{ required: true, message: 'Please input your username!' }]"
                    >
                        <a-input v-model:value="formState.username" size="large">
                            <template #prefix>
                                <UserOutlined class="site-form-item-icon" />
                            </template>
                        </a-input>
                    </a-form-item>

                    <a-form-item
                    name="password"
                    :rules="[{ required: true, message: 'Please input your password!' }]"
                    >
                        <a-input-password v-model:value="formState.password" size="large">
                            <template #prefix>
                                <LockOutlined  class="site-form-item-icon" />
                            </template>
                        </a-input-password>
                    </a-form-item>

                    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                        <a-button type="primary" html-type="submit" size="large">立即登录</a-button>
                    </a-form-item>
                </a-form>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { initCanvas } from './bg.ts'
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";

const router = useRouter()
const userStore = useUserStore()

interface FormState {
  username: string;
  password: string;
  remember: boolean;
}
const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: true,
});
const onFinish = (values: any) => {
  console.log('Success:', values);
  userStore.login(values).then(() => {
    console.log('登录成功')
    router.push('/')
  })
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

const canvasRef = ref()
const canvasO = ref()

onMounted(() => {
    canvasO.value = initCanvas(canvasRef.value)
    window.addEventListener('resize', () => {
        canvasO.value = initCanvas(canvasRef.value)
    })
})
onBeforeUnmount(() => {
    canvasO.value.stop()
})
</script>
  
<style lang="less" scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(to right, #68697c, #03052e);
    canvas {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
    }
    .login-box {
        position: relative;
        z-index: 1;
        background-color: #03052e;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        width: 760px;
        height: 500px;
        display: flex;
        align-items: stretch;
        padding: 10px;
        opacity: .98;
        &-left{
            flex: 1;
            height: 100%;
            img{
                width: 100%;
                height: 100%; 
            }
        }
        &-right{
            margin-left: 10px;
            padding: 10px;
            flex: 1;
            border-radius: 10px;
            background-color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            h1{
                text-align: center;
                margin-bottom: 20px;
                font-size: 30px;
            }
        }
    }
}
  
  
  
</style>
  