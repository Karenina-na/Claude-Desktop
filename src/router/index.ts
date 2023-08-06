import {createRouter, createWebHashHistory} from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [{
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    }, {
      path: '/controlCenter',
      name: 'controlCenter',
      component: () => import('@/views/ControlCenterView.vue'),
        children: [{
            path: '/controlCenter',
            name: 'controlCenterHome',
            component: () => import('@/components/ControlCenter/HomeView.vue')
        },{
            path: '/controlCenter/settings',
            name: 'settings',
            component: () => import('@/components/ControlCenter/SettingsView.vue')
        },{
            path: '/controlCenter/prompts',
            name: 'prompts',
            component: () => import('@/components/ControlCenter/PromptsView.vue')
        },{
            path: '/controlCenter/notes',
            name: 'notes',
            component: () => import('@/components/ControlCenter/NotesView.vue')
        },{
            path: '/controlCenter/about',
            name: 'about',
            component: () => import('@/components/ControlCenter/AboutView.vue')
        }]
    }, {
      path: '/prompt',
      name: 'prompt',
      component: () => import('@/views/PromptView.vue')
  }]
})

export default router
