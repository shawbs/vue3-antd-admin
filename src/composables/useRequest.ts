// src/api/api.ts

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// 创建 Axios 实例
const api = axios.create({
    baseURL: 'https://api.example.com', // 替换为你的 API 基础 URL
    timeout: 10000, // 设置请求超时
});

// 错误处理函数
const handleError = (error: any) => {
    // 这里可以根据实际情况自定义错误处理
    if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error.response?.data || error.message);
    } else {
        console.error('Unknown Error:', error);
    }
    return Promise.reject(error);
};

// 统一请求参数格式
interface RequestParams<T> {
    url: string;
    data?: T;
    params?: Record<string, any>;
    config?: AxiosRequestConfig;
}

const request = async <T>(method: 'get' | 'post' | 'put' | 'delete', params: RequestParams<T>) => {
    const { url, data, params: queryParams, config } = params;

    try {
        const response: AxiosResponse<T> = await api[method](url, {
            ...config,
            params: queryParams, // 添加查询参数
            data // 只在 POST/PUT 请求中使用
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

const get = <T>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig) => {
    return request<T>('get', { url, params, config });
};

const post = <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return request<T>('post', { url, data, config });
};

const put = <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return request<T>('put', { url, data, config });
};

const del = <T>(url: string, config?: AxiosRequestConfig) => {
    return request<T>('delete', { url, config });
};

// 导出封装的请求方法
export default {
    get,
    post,
    put,
    del,
};
