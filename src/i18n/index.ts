import { createI18n } from 'vue-i18n';
import EN from './locale/en';
import ZH from './locale/zh';
import korea from './locale/korea';

const message = {
  zh: {
    ...ZH,
  },
  en: {
    ...EN,
  },
  korea
};

const i18n = createI18n({
  locale: 'zh', // 设置语言类型
  legacy: false, // 如果要支持compositionAPI，此项必须设置为false;
  globalInjection: true, // 全局注册$t方法
  messages: message,
});

export default i18n;