/*
*  名称: 出港待运区管理
*  功能: 出港待运区管理处理API
*/

import https from '@/common/interface.js'
// 查询待运区位置数据字典
export const getLocation = (data) => {
    return https({
        url: `/uld/locationCodeType`,
        method: 'GET',
		data
		// handle:true
    })
}
// 根据ULD号查询预配航班以及实配航班
export const getFlight = (data) => {
    return https({
        url: `/uld/getFlightByUld?uldType=${data.uldType}&uldNo=${data.uldNo}&uldNoSuffix=${data.uldNoSuffix}`,
        method: 'GET',
		data
		// handle:true
    })
}
// 根据条件查询ULD LOAD表中未释放的信息
export const getUldLoad = (data) => {
    return https({
        url: `/uld/getFlightByCondition?uldType=${data.uldType}&uldNo=${data.uldNo}&uldNoSuffix=${data.uldNoSuffix}
		 &waitLocation=${data.waitLocation}&reFrom=${data.reFrom}&reEnd=${data.reEnd}`,
        method: 'GET',
		data
		// handle:true
    })
}
// 根据ULD查重
export const checkUld = (data) => {
    return https({
        url: `/uld/checkUld?uldType=${data.uldType}&uldNo=${data.uldNo}&uldNoSuffix=${data.uldNoSuffix}`,
        method: 'GET',
		data
		// handle:true
    })
}
// 根据ULD查重
export const existUld = (data) => {
    return https({
        url: `/uld/existUld?uldType=${data.uldType}&uldNo=${data.uldNo}&uldNoSuffix=${data.uldNoSuffix}`,
        method: 'GET',
		data
		// handle:true
    })
}
// ULD新增
export const addUld = (data) => {
    return https({
        url: `/uld/addUld`,
        method: 'POST',
		data
		// handle:true
    })
}
// ULD编辑
export const updateUld = (data) => {
    return https({
        url: `/uld/updateUld`,
        method: 'POST',
		data
		// handle:true
    })
}

// ULD批量删除
export const deleteUld = (data) => {
    return https({
        url: `/uld/deleteUld`,
        method: 'POST',
		data
		// handle:true
    })
}