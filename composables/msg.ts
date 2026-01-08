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

//我的报告列表
export function reportsMy(data: RequestParams) {
    return request({
        url: `/savelor/reports/my`,
        method: 'get',
        params: data,
    })
}
//我的报告删除
export function reportsDelete(data: RequestParams) {
    return request({
        url: `/savelor/reports/delete`,
        method: 'post',
        data: data,
    })
}