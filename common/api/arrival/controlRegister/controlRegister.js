/*
*  名称: 国内进港航控登记
*  功能: 国内进港航控登记处理API
*/

import https from '@/common/interface.js'
//航班运单查询功能
export const getWayBill = (data) => {
    return https({
        url: `/flightCtrlReg/getWayBill?carrier=${data.carrier}&flight=${data.flight}&flightDate=${data.flightDate}`,
        method: 'GET',
		data
		// handle:true
    })
}
// 一件预警功能
export const sendMsg = (data) => {
    return https({
        url: `/flightCtrlReg/sendMessage`,
        method: 'POST',
		data
		// handle:true
    })
}
// 运单理货截关
export const wbClose = (data) => {
    return https({
        url: `/flightCtrlReg/wbClose`,
        method: 'POST',
		data
		// handle:true
    })
}
// 航班理货截关
export const flightWbClose = (data) => {
    return https({
        url: `/flightCtrlReg/flightWbClose`,
        method: 'POST',
		data
		// handle:true
    })
}
// 取消运单理货截关
export const cancelWbClose = (data) => {
    return https({
        url: `/flightCtrlReg/cancelWbClose`,
        method: 'POST',
		data
		// handle:true
    })
}
//运单号检索功能
export const matchWayBillNo = (data) => {
    return https({
        url: `/flightCtrlReg/matchWayBillNo?wbPrefix=${data.wbPrefix}&wbNo=${data.wbNo}&carrier=${data.carrier}&flight=${data.flight}&flightDate=${data.flightDate}`,
        method: 'GET',
		data
		// handle:true
    })
}
//MC CLOSE功能
export const mcClose = (data) => {
    return https({
        url: `/flightCtrlReg/mcClose?carrier=${data.carrier}&flight=${data.flight}&flightDate={data.flightDate}`,
        method: 'GET',
		data
		// handle:true
    })
}
//板架号检查
export const checkFrame = (data) => {
    return https({
        url: `/flightCtrlReg/checkFrame?uldNo=${data.frameCode}`,
        method: 'GET',
		data
		// handle:true
    })
}
//板架号检查
export const checkWayBill = (data) => {
    return https({
        url: `/flightCtrlReg/getWbPreByCarrier?carrier=${data.carrier}`,
        method: 'GET',
		data
		// handle:true
    })
}

//板架号检查
export const checkFlight = (data) => {
    return https({
        url: `/flight/checkFlight?carrier=${data.carrier}&flight=${data.flight}&flightDate={data.flightDate}`,
        method: 'GET',
		data
		// handle:true
    })
}

//库位查询
export const getWarehouse = (data) => {
    return https({
        url: `/flightCtrlReg/getWarehouse`,
        method: 'GET',
		data
		// handle:true
    })
}
//航班运单批次查询
export const getBatch = (data) => {
    return https({
        url: `/flightCtrlReg/getBatch?carrier=${data.carrier}&flight=${data.flight}&flightDate={data.flightDate}&wbPrefix={data.wbPrefix}&wbNo={data.wbNo}`,
        method: 'GET',
		data
		// handle:true
    })
}
//入库功能
export const putIn = (data) => {
    return https({
        url: `/flightCtrlReg/putIn`,
        method: 'POST',
		data
		// handle:true
    })
}