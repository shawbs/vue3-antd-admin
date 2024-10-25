// src/api/api.ts
import { message } from "ant-design-vue";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import * as tool from "@/utils/tool";
import { useUserStore } from "@/store/user";
import qs from "qs";

const linkLogin = () => {
  location.href = "/login";
};

const AES_KEY = import.meta.env.VITE_APP_AES_KEY;
const BASE_URL = import.meta.env.VITE_APP_API_PREFIX;

// 创建 Axios 实例
const api = axios.create({
  baseURL: BASE_URL, // 替换为你的 API 基础 URL
  timeout: 10000, // 设置请求超时
  headers: {
    "Content-Type": "application/json",
  },
});

const errorShow = (text: string) => {
  message.error(text);
};
let timer: any = null;
const handleErrorStatus = tool.debounce(function (
  status: number,
  msg: string | undefined
) {
  switch (status) {
    case 404:
      errorShow(msg || "服务器资源不存在");
      break;
    case 500:
      errorShow(msg || "服务器内部错误");
      break;
    case 401:
    case 424:
      errorShow(msg || "登录状态已过期，需要重新登录");
      clearTimeout(timer);
      timer = setTimeout(() => {
        useUserStore().frontLogout();
        linkLogin();
      }, 2000);

      break;
    case 403:
      errorShow(msg || "没有权限访问该资源");
      break;
    default:
      errorShow(msg || "未知错误！");
  }
}, 500);

api.interceptors.request.use(async (config: any) => {
  const fb_token = await tool.createFPToken();
  const token = useUserStore().token ? useUserStore().token : "";
  const headers = {
    Fingerprint: fb_token,
    Authorization: token,
  } as any;
  config.headers = Object.assign(headers, config.headers);

  // 加密params和body参数
  const params = config.url.split("?")[1];
  const hasIv = import.meta.env.VITE_APP_HASIV == "true";
  if (hasIv && params) {
    // console.log('params ',params)
    config.url = config.url.split("?")[0];
    const iv = tool.aes.encode(params, AES_KEY);
    config.params = {
      iv: iv,
    };

    // console.log('iv ',iv)
  }
  if (
    hasIv &&
    config.data &&
    Object.keys(config.data).length > 0 &&
    config.headers["Content-Type"].includes("application/json")
  ) {
    // console.log('data ',typeof config.data == 'string' ? config.data : JSON.stringify(config.data))
    const iv = tool.aes.encode(
      typeof config.data == "string"
        ? config.data
        : JSON.stringify(config.data),
      AES_KEY
    );
    config.data = {
      iv: iv,
    };

    // console.log('iv ',iv)
  }

  if (
    config.headers["Content-Type"].includes("application/x-www-form-urlencoded")
  ) {
    config.data = qs.stringify(config.data);
  }

  console.log(config);
  return config;
});

// HTTP response 拦截器
api.interceptors.response.use(
  (response) => {
    let resdata = response.data;

    if (typeof response.data.code === "undefined") {
      resdata = {
        data: response.data,
        code: 200,
        message: "",
      };
    }

    console.log(resdata);

    // 如果结果是加密的，则进行解密
    if (resdata.data && resdata.data.iv) {
      const iv = resdata.data.iv;
      let jsondata = tool.aes.decode(iv, AES_KEY);
      jsondata = jsondata ? JSON.parse(jsondata) : {};

      // console.log('jsondata ',jsondata)
      resdata.data = jsondata;

      // console.log(resdata)
    }

    if (
      (response.headers["content-disposition"] ||
        !/^application\/json/.test(response.headers["content-type"])) &&
      response.status === 200
    ) {
      return resdata;
    } else if (resdata.size) {
      resdata.code = 500;
      resdata.message = "服务器内部错误";
      resdata.success = false;
    } else if (resdata.code && resdata.code !== 200) {
      handleErrorStatus(resdata.code, resdata.message);
    }
    return resdata;
  },
  (res) => {
    // message.error("网络错误")
    console.error(res);
    const { code, message } = res.response?.data || {};
    handleErrorStatus(res.response.status || code, message);
  }
);

// 统一请求参数格式
interface RequestParams {
  url: string;
  method: "get" | "post" | "put" | "delete";
  data?: any;
  params?: Record<string, string>;
  config?: AxiosRequestConfig;
}

export interface RequestResponse<T> {
  data: T;
  code: number;
  message: string;
}

const useRequest = async <T>(params: RequestParams): Promise<T> => {
  const { url, method, data, params: queryParams, config } = params;
  try {
    // debugger
    const response: RequestResponse<T> = (await api({
      url,
      method,
      ...config,
      params: queryParams, // 添加查询参数
      data, // 只在 POST/PUT 请求中使用
    })) as any;
    return response.data as T;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const useUploadRequest = async <T>(
  data: { url: string; isFormData?: boolean; data?: any },
  headers?: any
) => {
  let formData = new FormData();
  if (data.isFormData) {
    formData = data.data;
  } else {
    if (data.data) {
      Object.keys(data.data).forEach((key) => {
        formData.append(key, data.data[key]);
      });
    }
  }
  try {
    // debugger
    const response: RequestResponse<T> = (await api({
      url: data.url,
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        ...headers,
      },
    })) as any;
    return response.data as T;
  } catch (error) {
    return Promise.reject(error);
  }
};

export default useRequest;
