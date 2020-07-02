/*
*  名称: 出港ULD配载
*  功能: 出港ULD配载处理API
*/

import https from '@/common/interface.js'
//下拉操作
export const downAssembly = (data) => {
    return https({
        url: `/dodUldLoadController/downAssembly?num=${data.num}&wgt=${data.wgt}&vol=${data.vol}&uldId=${data.uldId}&wbPrefix=${data.wbPrefix}&wbNo=${data.wbNo}&wbId=${data.wbId}&uldCode=${data.uldCode}`,
        method: 'POST',
		data
		// handle:true
    })
}
//获取配车信息
export const getUldAssembly = (data) => {
    return https({
        url: `/dodUldLoadController/getUldAssembly?uldId=${data.uldId}&wbPrefix=${data.wbPrefix}&wbNo=${data.wbNo}`,
        method: 'GET',
		data
		// handle:true
    })
}
//保存uld信息到uld_load表
export const mysave = (data) => {
    return https({
		// headers: {
		//       'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 
		//     },
        url: `/dodUldLoadController/mysave`,
        method: 'POST',
		data
		// handle:true
    })
}
//保存体积
export const saveVol = (data) => {
    return https({
        url: `/dodUldLoadController/saveVol?uldid=${data.uldid}&uldvol=${data.uldvol}`,
        method: 'POST',
		data
		// handle:true
    })
}
//打印挂签
export const printweight = (data) => {
    return https({
        url: `/dodUldLoadController/printweight?uldloadid=${data.uldloadid}`,
        method: 'POST',
		data
		// handle:true
    })
}
//获取运单总重量、总体积、总件数
export const selectairwaybillmsg = (data) => {
    return https({
        url: `/dodUldLoadController/selectairwaybillmsg?airwaybill=${data.airwaybill}`,
        method: 'POST',
		data
		// handle:true
    })
}
//保存uld上的运单信息（保存到assembly）
export const saveuldassembly = (data) => {
    return https({
        url: `/dodUldLoadController/saveuldassembly?num=${data.num}&wgt=${data.wgt}&vol=${data.vol}&uldid=${data.uldid}&prefix=${data.prefix}&airwaybill=${data.airwaybill}&wbId=${data.wbId}&uldcode=${data.uldcode}&isSupperAdd=${data.isSupperAdd}`,
        method: 'POST',
		data
		// handle:true
    })
}

//查询uld信息
export const selectuldmgt = (data) => {
    return https({
        url: `/dodUldLoadController/selectuldmgt`,
        method: 'POST',
		data
		// handle:true
    })
}
//查询目的站
export const getFlightStations = (data) => {
    return https({
        url: `/dodUldLoadController/getFlightStations?carrier=${data.carrier}&flight=${data.flight}&flightData=${data.flightData}`,
        method: 'GET',
		data
		// handle:true
    })
}
//是否复称截关
export const getReWeighOff = (data) => {
    return https({
        url: `/dodUldLoadController/getReWeighOff?uldCode=${data.uldCode}`,
        method: 'GET',
		data
		// handle:true
    })
}

//目的站是否相符
export const isFstWb = (data) => {
    return https({
        url: `/dodUldLoadController/isFstWb?uldId=${data.uldid}&wbPrefix=${data.wbprefix}&wbNo=${data.wbno}`,
        method: 'GET',
		data
		// handle:true
    })
}