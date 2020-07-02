/*
*  名称: 复称管理
*  功能: 复称接口API
*/

import https from '@/common/interface.js'

// 复称录入相关接口
// 查询磅秤号
export const getScale = () => {
    return https({
        url: `/reWgt/getScale`,
        method: 'GET'
    })
}

// 查询区位列表信息
export const getLocationCode = () => {
    return https({
        url: `/uld/locationCodeType`,
        method: 'GET'
    })
}

// 查询ULD负载信息
export const getUldLoadInfo = (data) => {
    return https({
        url: `/reWgt/getUldLoadInfo?uldType=${data.uldType}&uldNo=${data.uldNo}&uldNoSuffix=${data.uldNoSuffix}`,
        method: 'GET',
		data
    })
}

// 检验板架号并返回重量
export const checkFrame = (data) => {
    return https({
        url: `/reWgt/checkFrame?frameNo=${data.frameNo}`,
        method: 'GET',
		data
    })
}

// 保存区位
export const saveLocation = (data) => {
  return https({
      url: `/reWgt/saveLocation`,
      method: 'POST',
      data
  })
}

// 复称录入
export const reWgtPutin = (data) => {
  return https({
      url: `/reWgt/reWgtPutin`,
      method: 'POST',
      data
  })
}

// 复称删除
export const deleteReWeight = (data) => {
  return https({
      url: `/reWgt/delete`,
      method: 'POST',
      data
  })
}




// 复称截关相关接口
// 通过航班信息获取uld记录，交关截关时间
export const getReWeighInfo = (data) => {
    return https({
        url: `/reWgt/getReWeighInfo?carrier=${data.carrier}&flight=${data.flight}&flightDate=${data.flightDate}`,
        method: 'GET',
		data
    })
}

// 复称交接
export const cancelReWgtClose  = (data) => {
  return https({
      url: `/reWgt/cancelReWgtClose`,
      method: 'POST',
      data
  })
}

// 复称解锁
export const reWgtHandover = (data) => {
  return https({
      url: `/reWgt/reWgtHandover`,
      method: 'POST',
      data
  })
}

// 复称截关
export const reWgtClose = (data) => {
  return https({
      url: `/reWgt/reWgtClose`,
      method: 'POST',
      data
  })
}