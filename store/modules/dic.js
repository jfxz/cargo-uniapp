import { getFlightStatus, getUldType } from '../../common/api/dic/api.js' 
const dic = {
	state: {
		controInfo: {},
		flightStatus_dic: {},
		uldType_dic: {}
	},
	mutations: {
		SET_CONTROINFO: (state, data) => {
			state.controInfo = data
		},
		SET_FLIGHTSTATUS: (state, data) => {
			state.flightStatus_dic = data
		},
		SET_ULDTYPE: (state, data) => {
			state.uldType_dic = data
		}
	},
	actions: {
		// 获取uld状态
		GetControInfo ({ commit, state, dispatch }) {
			return new Promise((resolve, reject) => {
				// getUldType().then((res) => {
				// 	console.log('staus', res)
				// 	const data = res.data
				// 	// commit('SET_FLIGHTSTATUS', data)
				// 	resolve(data)
				// }).catch(res => {
				// 	reject(res)
				// })
			}).then(data => {
				commit('SET_CONTROINFO', data)
			})
		},
		// 获取uld状态
		GetUldType ({ commit, state, dispatch }) {
			return new Promise((resolve, reject) => {
				getUldType().then((res) => {
					console.log('staus', res)
					const data = res.data
					// commit('SET_FLIGHTSTATUS', data)
					resolve(data)
				}).catch(res => {
					reject(res)
				})
			}).then(data => {
				commit('SET_ULDTYPE', data)
			})
		},
		// 获取航班状态信息
		GetFlightStatusInfo ({ commit, state, dispatch }) {
			return new Promise((resolve, reject) => {
				getFlightStatus().then((res) => {
					console.log('staus', res)
					const data = res.data
					// commit('SET_FLIGHTSTATUS', data)
					resolve(data)
				}).catch(res => {
					reject(res)
				})
			}).then(data => {
				commit('SET_FLIGHTSTATUS', data)
			})
		}
	}
}
export default dic