import {createRouter, createWebHashHistory} from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [{
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    }, {
      path: '/controlCenter',
      name: 'controlCenter',
      component: () => import('../views/ControlCenterView.vue')
    }, {
      path: '/prompt',
      name: 'prompt',
      component: () => import('../views/PromptView.vue')
  }]
})

export default router
