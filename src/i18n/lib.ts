// antd
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import esUS from 'ant-design-vue/es/locale/en_US'

// dayjs
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';

const data:Record<string, any> = {
    'zh': {
        antd: zhCN,
        dayjs: 'zh-cn',
        // ...zhCN
    },
    'en': {
        antd: esUS,
        dayjs: 'en',
        // ...esUS
    }
}

export const getLocale = (locale: string): any => {
    return data[locale] || data['zh']
}