import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Data from './components/Data.vue'

import Add from './components/contents/Add.vue'
import Manage from './components/contents/Manage.vue'
import Home from './components/contents/Home.vue'

import Mos from './components/contents/manage/Mos.vue'


Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Login,
    },
    {
      path: '/data',
			redirect: '/data/home',
      component: Data,
			children: [
				{
					path: 'add',
					component: Add
					
				},
				{
					path: 'home',
					component: Home,
					redirect: '/data/add', // **제출용
				},
				{
					path: 'manage',
					component: Manage,
				},
				
				{
					path: 'manage/:id',
					component: Mos,
					props: true
				}
			]
    }
  ]
})

router.beforeEach((to, from, next) => {
	Vue.prototype.$Progress.start()
	if(Vue.prototype.$isFirebaseAuth) next()
})

router.afterEach((to, from) => {
  Vue.prototype.$Progress.finish()
})


export default router 
