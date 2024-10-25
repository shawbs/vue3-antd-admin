import { createApp } from "vue";
import App from "./App.vue";

import router from "./router/index";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";

import "@/styles/index.css";
import "@/styles/index.less";
import i18n from "@/i18n";
import { createPinia } from "pinia";

import components from "@/components/index";

const pinia = createPinia();
const app = createApp(App);

app.use(Antd);
app.use(i18n);
app.use(pinia);
app.use(router);
app.use(components);
app.mount("#app");
