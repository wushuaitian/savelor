//接口
import request from '../plugins/api'


interface RequestParams {
    [key: string]: any
}



/**
 * 获取用户信息
 */
export function loonoolUserInfo(data: RequestParams) {
    return request({
        url: '/loonool/user/info',
        method: 'get',
        params: data,
    })
}

/**
 * 创建空间
 */


export function loonoolWorkspaces(data: RequestParams) {
    return request({
        url: '/loonool/workspaces',
        method: 'post',
        data,
    })
}

/**
 * 创建任务
 */
export function loonoolUploadImage(data: RequestParams) {
    return request({
        url: `/loonool/workspaces/tasks/upload-image`,
        method: 'post',
        data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

//获取工作空间任务列表

export function loonoolWorkspacesTasks(data: RequestParams) {
    return request({
        url: `/loonool/workspaces/tasks/${data.workspaceId}`,
        method: 'get',
        params: data,
    })
}

// 修改任务状态
export function loonoolTasksStatus(data: RequestParams) {
    return request({
        url: `/loonool/workspaces/tasks/${data.workspaceId}/${data.taskId}/status`,
        method: 'post',
        data,
    })
}


// 获取任务详情
export function tasksgetTaskDetail(data: RequestParams) {
    return request({
        url: `/api/workspaces/${data.workspaceId}/tasks/${data.taskId}`,
        method: 'get',
        params: data,
    })
}


// 分页获取任务评论列表
export function tasksgetTaskComments(data: RequestParams) {
    return request({
        url: `/loonool/workspaces/${data.workspaceId}/tasks/${data.taskId}/comments`,
        method: 'get',
        params: data,
    })
}

// 创建任务评论
export function taskscreateTaskComment(data: RequestParams) {
    return request({
        url: `/loonool/workspaces/${data.workspaceId}/tasks/${data.taskId}/comments`,
        method: 'post',
        data,
    })
}






// 获取用户的所有工作空间
export function loonoolWorkspacesMyAll(data: RequestParams) {
    return request({
        url: `/loonool/workspaces/my/all`,
        method: 'get',
        params: data,
    })
}

// 获取工作空间成员列表
export function loonoolWorkspacesMembers(data: RequestParams) {
    return request({
        url: `/loonool/workspaces/${data.workspaceId}/members`,
        method: 'get',
        params: data,
    })
}
// 邀请成员进入工作空间
export function tasksMembersinvite(data: RequestParams) {
    return request({
        url: `/loonool/workspaces/${data.workspaceId}/invite`,
        method: 'post',
        data,
    })
}
// 删除工作空间成员
export function tasksMembersinviteDelete(data: RequestParams) {
    return request({
        url: `/loonool/workspaces/${data.workspaceId}/${data.userId}/delete`,
        method: 'delete',
    })
}

// 旧修改空间成员权限
export function tasksMembersChangerRole2(data: RequestParams) {
    return request({
        url: `/loonool/workspaces/${data.workspaceId}/${data.memberId}/change-role`,
        method: 'post',
        data,
    })
}
// 新修改空间成员权限
export function tasksMembersChangerRole(data: RequestParams) {
    return request({
        url: `/loonool/workspaces/workspaces/change-role`,
        method: 'post',
        data,
    })
}




// 新

/**
 * 注册
 */
export function savelorUserRegister(data: RequestParams) {
    return request({
        url: '/savelor/users/register',
        method: 'post',
        data,
    })
}

/**
 * 验证码
 */
export function captcha(data: RequestParams) {
    return request({
        url: '/savelor/auth/captcha',
        method: 'get',
    })
}

/**
 * 登录
 */

export function savelorUserLogin(data: RequestParams) {
    return request({
        url: '/savelor/users/login',
        method: 'post',
        data,
    })
}
/**
 * 获取用户信息
 */
export function usersMe(data: RequestParams) {
    return request({
        url: '/savelor/users/me',
        method: 'get',
    })
}
/**
 * 更新用户信息
 */
export function usersProfile(data: RequestParams) {
    return request({
        url: '/savelor/users/profile',
        method: 'put',
        data
    })
}
/**
 * 修改密码
 */
export function changePassword(data: RequestParams) {
    return request({
        url: '/savelor/users/change-password',
        method: 'put',
        data
    })
}
/**
 * 获取美国州列表（50州 + DC）
 */
export function savelorMetaUsStates(data: RequestParams) {
    return request({
        url: `/savelor/meta/us-states`,
        method: 'get',
        params: data,
    })
}

/**
 * 
 * Step1：创建报告草稿
 * @param data 
 * @returns 
 */
export function savelorReportsDraft(data: RequestParams) {
    return request({
        url: '/savelor/reports/draft',
        method: 'post',
        data,
    })
}
/**
 * 
 * Step2：选择报告类型并发起生成（第二页）
 * @param data 
 * @returns 
 */
export function savelorReportsGenerate(data: RequestParams) {
    return request({
        url: '/savelor/reports/generate',
        method: 'post',
        data,
    })
}
/**
 * Step3： 获取详细报告
 * @param data 
 * @returns 
 */
export function savelorReportsDetailed(data: RequestParams) {
    return request({
        url: `/savelor/reports/detailed/${data.reportId}`,
        method: 'get',
        params: data,
    })
}

/**
 * 
 * 下载报告文件（txt-pdf-docx）
 * @param data 
 * @returns 
 */
export function savelorReportsDownload(data: RequestParams) {
    return request({
        url: `/savelor/reports/${data.reportId}/download`,
        method: 'get',
        params: data,
        responseType: "blob",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
}


/**
 * 
 * 白皮书下载
 * @param data 
 * @returns 
 */
export function savelorWhitepapersDownload(data: RequestParams) {
    return request({
        url: `/api/whitepapers/${data.filename}`,
        method: 'get',
        params: data,
        responseType: "blob",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
}


// 创建空间
export function savelorSpaces(data: RequestParams) {
    return request({
        url: `/savelor/spaces`,
        method: 'post',
        data,
    })
}