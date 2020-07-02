const user = {
	state: {
		userInfo: {}
	},
	mutations: {
		SET_USERINFO: (state, userInfo) => {
			console.log(12311, userInfo)
			state.userInfo = userInfo
		}
	},
	actions: {
		// 获取用户信息
		GetUserInfo ({ commit, state, dispatch }) {
			console.log(state.userInfo)
			// return new Promise((resolve, reject) => {
			// 	login().then((res) => {
			// 		if (res.data.password) {
			// 			delete res.data.password
			// 		}
			// 		console.log('userInfo', res.data)
			// 		const data = res.data
			// 		commit('SET_USERINFO', data)
			// 		resolve(data)
			// 	})
			// }).then(userInfo => {
			// 	commit('SET_USERINFO', {name: '456'})
			// 	console.log('123', userInfo)
			// })
		}
	}
}
export default user