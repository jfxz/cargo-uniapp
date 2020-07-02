import Vue from 'vue'
import Vuex from 'vuex'
import getters from '@/store/getters'
import user from '@/store/modules/user'
import dic from '@/store/modules/dic'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		user,
		dic
	},
	getters
})

export default store
