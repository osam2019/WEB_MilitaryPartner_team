import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import './plugins/firebase'
import './plugins/cookie'


Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')


Date.prototype.yyyymmdd = function() {
		var mm = this.getMonth() + 1;
		var dd = this.getDate();

		return [this.getFullYear(), (mm>9 ? '' : '0') + mm, (dd>9 ? '' : '0') + dd].join('-');
};