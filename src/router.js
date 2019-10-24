import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'search',
      component: () => import('./components/contents/Search.vue')
    },
		{
      path: '/information',
      name: 'information',
      component: () => import('./components/contents/Information.vue')
    },
		{
      path: '/question',
      name: 'question',
      component: () => import('./components/contents/Question.vue')
    },
		{
			path: '/manage/:id',
			name: 'mos',
			props: true,
			component: () => import('./components/contents/informations/Mos.vue'),
		}
		
  ]
})
