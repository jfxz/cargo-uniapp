import https from '@/common/interface.js'
// 查询
export const getFlightStatus = (data) => {
    return https({
        url: '/type/flightStatusType',
        method: 'GET',
				data
		// handle:true
    })
}
export const getUldType = (data) => {
    return https({
        url: '/type/uldType',
        method: 'GET',
				data
		// handle:true
    })
}
