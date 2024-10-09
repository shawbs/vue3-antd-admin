// antd
import zhCN from "ant-design-vue/es/locale/zh_CN";
import esUS from "ant-design-vue/es/locale/en_US";
import Korea from "ant-design-vue/es/locale/ko_KR";

// dayjs
import "dayjs/locale/zh-cn";
import "dayjs/locale/en";
import "dayjs/locale/ko";

const data:Record<string, any> = {
    "zh": {
        antd: zhCN,
        dayjs: "zh-cn",
    },
    "en": {
        antd: esUS,
        dayjs: "en",
    },
    "korea": {
        antd: Korea,
        dayjs: "ko",
    }
};

export const getLocale = (locale: string): any => {
    return data[locale] || data["en"];
};