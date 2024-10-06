import request from '@/composables/useRequest'

/**
   * 用户登录
   * @param {object} params
   * @returns
   */
export const login = (params = {}) => {
    return request.post('system/login', params)
}

/**
 * 用户退出
 * @param {object} params
 * @returns
 */
export const logout = (params = {}) => {
    return request.post('system/logout', params)
}

/**
 * 获取登录用户信息
 * @param {object} params
 * @returns
 */
export const getUserInfo = (params = {}) => {
    return request.get('system/getInfo', params)
}