import https from '@/common/interface.js'
// 删除
export const deleteAjax = (data) => {
    return https({
        url: '/doaTransit/delete',
        method: 'POST',
				data
		// handle:true
    })
}
// 原单交接
export const yuanCommit = (data) => {
    return https({
        url: '/doaTransit/transitCommit',
        method: 'POST',
				data
		// handle:true
    })
}
// 换单交接
export const huanCommit = (data) => {
    return https({
        url: '/doaTransit/tranChangeCommit',
        method: 'POST',
				data
		// handle:true
    })
}
// 查询运单信息
export const getWayBill = (data) => {
    return https({
        url: '/doaTransit/getWayBill',
        method: 'GET',
				data
		// handle:true
    })
}
// 查询
export const getAbnormal = (data) => {
    return https({
        url: '/dodTransit/getWayBill',
        method: 'GET',
				data
		// handle:true
    })
}
// 中转交接
export const transitCommit = (data) => {
    return https({
        url: '/dodTransit/transitCommit',
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
