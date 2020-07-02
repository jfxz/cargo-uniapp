/*
*  名称: 库存盘点
*  功能: 库存盘点接口API
*/

import https from '@/common/interface.js'

// 运单相关接口
// 运单详细信息查询
export const getWayBill = (data) => {
    return https({
        url: `/checkWarehouse/getWayBill?wbPrefix=${data.wbPrefix}&wbNo=${data.wbNo}`,
        method: 'GET'
    })
}

// 库存信息查询
export const getWarehouse = (data) => {
    return https({
        url: `/checkWarehouse/getWarehouse?wbPrefix=${data.wbPrefix}&wbNo=${data.wbNo}`,
        method: 'GET'
    })
}

// 标记运单正常
export const signWbNormal = (data) => {
    return https({
        url: `/checkWarehouse/signWbNormal`,
        method: 'POST',
		data
    })
}

// 标记运单异常
export const signWbException = (data) => {
    return https({
        url: `/checkWarehouse/signWbException`,
        method: 'POST',
		data
    })
}
// 异常信息保存
export const saveException = (data) => {
  return https({
      url: `/checkWarehouse/saveException`,
      method: 'POST',
      data
  })
}
// 查看异常运单表
export const getExceptionWayBill = (data) => {
    return https({
        url: `/checkWarehouse/getExceptionWayBill?from=${data.from}&end=${data.end}`,
        method: 'GET'
    })
}



// uld相关接口
// uld查询
export const getUldInfo = (data) => {
    return https({
        url: `/checkWarehouse/getUldInfo?uldType=${data.uldType}&uldNo=${data.uldNo}&uldNoSuffix=${data.uldNoSuffix}`,
        method: 'GET',
		data
    })
}
// 标记uld正常
export const signUldNormal = (data) => {
    return https({
        url: `/checkWarehouse/signUldNormal`,
        method: 'POST',
		data
    })
}

// 标记uld异常
export const signUldException = (data) => {
    return https({
        url: `/checkWarehouse/signUldException`,
        method: 'POST',
		data
    })
}

// uld异常信息保存
export const saveUldException = (data) => {
  return https({
      url: `/checkWarehouse/saveUldException`,
      method: 'POST',
      data
  })
}
// uld备注保存
export const saveRemark = (data) => {
  return https({
      url: `/checkWarehouse/saveRemark`,
      method: 'POST',
      data
  })
}
// 查看uld异常运单表
export const getUldException = (data) => {
    return https({
        url: `/checkWarehouse/getUldException?from=${data.from}&end=${data.end}`,
        method: 'GET'
    })
}

