import { post,get } from '@/composables/useRequest'

/**
   * 用户登录
   * @param {object} params
   * @returns
   */
export const login = async (params = {}) => {
    return await post({
      url: 'system/login',
      data: params
    })
}

/**
 * 用户退出
 * @param {object} params
 * @returns
 */
export const logout = (params = {}) => {
    return post({
        url: 'system/logout',
        data: params
    })
}

/**
 * 获取登录用户信息
 * @param {object} params
 * @returns
 */
export const getInfo = (params = {}) => {
    return get({
        url: 'system/getInfo',
        data: params
    })
}