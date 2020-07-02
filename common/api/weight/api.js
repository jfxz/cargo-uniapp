import https from '@/common/interface.js'
// 删除
export const delUldPreFlight = (data) => {
    return https({
        url: '/weigh/delUldPreFlight',
        method: 'POST',
				data
    })
}
//获取备注信息
export const getUldRemark = (data) => {
    return https({
        url: '/weigh/getUldRemark',
        method: 'GET',
				data
    })
}
// 删除
export const delData = (data) => {
    return https({
        url: '/weigh/delWeighInfo',
        method: 'POST',
				data
    })
}
// 修改件数
export const putNum = (data) => {
    return https({
        url: '/weigh/updateWeigh',
        method: 'POST',
				data
    })
}
// 修改体积
export const putVol = (data) => {
    return https({
        url: '/weigh/updateVol',
        method: 'POST',
				data
    })
}
// 获取过磅记录信息
export const getWbWeigh = (data) => {
    return https({
        url: '/weigh/getWbWeighInfo',
        method: 'GET',
				data
    })
}
// 货物截关
export const postReWgt = (data) => {
    return https({
        url: '/weigh/weighClose',
        method: 'POST',
				data
    })
}
// 获取货物列表
export const getReWgt = (data) => {
    return https({
        url: '/weigh/getReWgtWbInfo',
        method: 'GET',
				data
    })
}
// 获取终点
export const getEnd = (data) => {
    return https({
        url: '/dodUldLoadController/getFlightStations',
        method: 'GET',
				data
    })
}
// 获取uld信息
export const getUld = (data) => {
    return https({
        url: '/dodUldLoadController/mysave',
        method: 'POST',
				data
    })
}

// 获取磅秤号
export const getBang = (data) => {
    return https({
        url: '/reWgt/getScale',
        method: 'GET',
				data
    })
}

// 保存备注
export const saveRemark = (data) => {
    return https({
        url: '/weigh/saveUldRemark',
        method: 'GET',
				data
    })
}
// 是否允许过磅
export const judgeAllow = (data) => {
    return https({
        url: '/weigh/isAllowToWeigh',
        method: 'GET',
				data
    })
}
// 提交过磅
export const postWeight = (data) => {
    return https({
        url: '/weigh/weightEntry',
        method: 'POST',
				data
    })
}
// 板架查询
export const getFrameInfo = (data) => {
    return https({
        url: '/reWgt/checkFrame',
        method: 'GET',
				data
		// handle:true
    })
}
// 查询uld信息
export const getUldInfo = (data) => {
    return https({
        url: '/weigh/getUldInfo',
        method: 'GET',
				data
		// handle:true
    })
}
// 查询运单信息
export const getWbInfo = (data) => {
    return https({
        url: '/weigh/getWbInfo',
        method: 'GET',
				data
		// handle:true
    })
}
// 中转交接
export const transitCommit = (data) => {
    return https({
        url: `/dodTransit/transitCommit?oriWbPrefix=${data.wbPrefix}&subPcs=${data.num}&weightFee=${data.wgt}
				&isChange=${data.isChange}&oriWbNo=${data.wbNo}&subWgt=${data.wgt}&transitId=${data.transitId}`,
        method: 'POST',
				data
		// handle:true
    })
}
// 交接取消
export const transitCancel = (data) => {
    return https({
        url: '/dodTransit/transitCancel',
        method: 'POST',
				data
		// handle:true
    })
}
