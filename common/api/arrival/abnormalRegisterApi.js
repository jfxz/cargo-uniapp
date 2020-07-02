/*
 *  名称: 异常登记处理
 *  功能: 异常登记处理API
 */
import _config from '@/common/apiConfig'; // 导入私有配置
import https from '@/common/interface.js'
// 根据运单号查询运单信息
export const getFlightByWb = (data) => {
  return https({
    url: `/doaAbnReg/getFlightByWb?wbPrefix=${data.wbPrefix}&wbNo=${data.wbNo}`,
    method: 'GET',
    // handle:true
  })
}

// 获取不正常业务类型
export const getAbnType = () => {
  return https({
    url: `/doaAbnReg/getAbnType`,
    method: 'GET',
    // handle:true
  })
}

// 保存账单
export const saveWayBill = (data) => {
  return https({
    url: `/doaAbnReg/saveWayBill`,
    method: 'POST',
    data
    // handle:true
  })
}

//航班检查
export const checkFlight = (data) => {
  return https({
    url: `/flight/checkFlight?carrier=${data.carrier}&flight=${data.flight}&flightDate={data.flightDate}`,
    method: 'GET',
    data
    // handle:true
  })
}

// 上传照片
// 由于上传照片采用的是uni.uploadFile接口而非uni.request接口
// 且高耦合，所以此处仅用于记录文件的上传路径
export const uploadImgUrl = _config.url + '/doaAbnReg/uploadImage'
