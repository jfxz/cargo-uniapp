import https from '@/common/interface.js'
// 查询
export const getFlight = (data) => {
    return https({
        url: '/flight/findByConditionsDoa',
        method: 'GET',
				data
		// handle:true
    })
}
