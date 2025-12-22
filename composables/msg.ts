//接口
import request from '../plugins/api'

interface RequestParams {
    [key: string]: any
}

/**
 * 导航栏消息列表（HTTP 接口）
 */
export function msgList(data: RequestParams) {
    return request({
        url: `/loonool/notifications`,
        method: 'get',
    })
}

export function userInfo(data: RequestParams) {
    return request({
        url: `/loonool/user/info`,
        method: 'get',
    })
}

export function userUpdate(data: RequestParams) {
    return request({
        url: `/loonool/user/profile`,
        method: 'put',
        data,
    })
}
export function projects(data: RequestParams) {
    return request({
        url: `/savelor/projects/list/page`,
        method: 'get',
        params: data,
    })
}

// 获取我的空间列表（搜索+分页）
export function spaces(data: RequestParams) {
    return request({
        url: `/savelor/spaces`,
        method: 'get',
        params: data,
    })
}