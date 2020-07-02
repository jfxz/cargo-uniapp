import https from '../../interface'

/**
 * 将所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 * handle [boolean] 如果需要自己处理 catch 请求 ，传入 true ，交给接口统一处理 ，请传如 false或不传
 */
// 检查版本号
export const checkVersion = (data) => {
    return https({
        url: `/menu/getVersion`,
        method: 'GET',
        data
		// handle:true
    })
}
// 确定修改
export const editPwd = (data) => {
    return https({
        url: `/sms/resetPasswordByPhone`,
        method: 'POST',
				extra: 'auth',
        data
		// handle:true
    })
}
// 发送验证码
export const sendSms = (data) => {
    return https({
        url: `/sms/sendSms`,
        method: 'POST',
				extra: 'auth',
        data
		// handle:true
    })
}
// 获取用户信息
export const getUserInfo = (data) => {
    return https({
        url: `/user/me`,
        method: 'GET',
        data
		// handle:true
    })
}
// 单点登录
export const login = (data) => {
    return https({
        url: `/oauth/token?username=${data.username}&password=${data.password}&grant_type=${data.grant_type}`,
        method: 'POST',
        data
		// handle:true
    })
}