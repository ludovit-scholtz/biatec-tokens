import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import TokenCreator from '../views/TokenCreator.vue'
import TokenDashboard from '../views/TokenDashboard.vue'
import Settings from '../views/Settings.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/create',
      name: 'TokenCreator',
      component: TokenCreator
    },
    {
      path: '/dashboard',
      name: 'TokenDashboard',
      component: TokenDashboard
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    }
  ]
})

export default router