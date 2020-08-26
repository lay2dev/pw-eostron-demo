import Vue from 'vue'
import Router from 'vue-router'
import EOS from './views/EOS.vue'
import Tron from './views/Tron.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/', 
      name: 'eos',
      component: EOS 
    },
    {
      path: '/eos', 
      name: 'eos',
      component: EOS 
    },
    {
      path: '/tron',
      name: 'tron',
      component: Tron 
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
