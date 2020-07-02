/*
*  名称: 国内出港航班查询
*  功能: 国内出港航班查询处理API
*/

import https from '@/common/interface.js'
//查询航班动态
export const getFlightInfo = (data) => {
    return https({
        url: `/flight/findByConditionsDod?isOffTime=${data.isOffTime}&isReweighOff=${data.isReweighOff}&isDlsOff=${data.isDlsOff}`,
        method: 'GET',
		data
		// handle:true
    })
}
//航班关闭
export const closeFlight = (data) => {
    return https({
        url: `/flight/closeFlight?flightId=${data.flightId}`,
        method: 'GET',
		data
		// handle:true
    })
}