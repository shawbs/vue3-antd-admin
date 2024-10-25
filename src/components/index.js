import scrollbar from "./scrollbar/main.vue";
import { CommonList, CommonForm, CommonEditor } from "./commonList/index.ts";
export default {
  install(Vue) {
    Vue.component("CommonEditor", CommonEditor);
    Vue.component("Scrollbar", scrollbar);
    Vue.component("CommonList", CommonList);
    Vue.component("CommonForm", CommonForm);
  },
};
