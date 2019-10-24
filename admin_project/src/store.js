import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
			groups: ['육군','해군','공군','의경','해병대'],
		
			armySort: ['기술행정병', '전문특기병', '카투사', '어학병', '동반 입대병', '연고지 복무형'],
			navySort: ['일반기술', '전문기술', '문화홍보', '군악', '특전', '심해'],
			airforceSort: ['일반기술', '차량운전', '통신전자전기', '시설', '전자계산', '차량정비', '차량운전', '화학', '의장', '전자계산', '의무', '기계'],
			policeSort: ['일반의경', '특기의경', '독도 경비대'],
			marineSort: ['일반기술', '공병', '무기정비', '수송', '정보통신', '조리', '화학', '수색'],
		// Made by 형근
  },
	
  mutations: {

  },
	
  actions: {

  }
})
