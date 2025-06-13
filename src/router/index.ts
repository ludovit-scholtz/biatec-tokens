import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Home from '../views/Home.vue'
import TokenCreator from '../views/TokenCreator.vue'
import TokenDashboard from '../views/TokenDashboard.vue'
import Settings from '../views/Settings.vue'

// Auth views
import Login from '../views/auth/Login.vue'
import Signup from '../views/auth/Signup.vue'
import VerifyEmail from '../views/auth/VerifyEmail.vue'

// Subscription views
import Pricing from '../views/subscription/Pricing.vue'
import Success from '../views/subscription/Success.vue'
import Cancel from '../views/subscription/Cancel.vue'

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
      component: TokenCreator,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard',
      name: 'TokenDashboard',
      component: TokenDashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: { requiresAuth: true }
    },
    // Auth routes
    {
      path: '/auth/login',
      name: 'Login',
      component: Login,
      meta: { requiresGuest: true }
    },
    {
      path: '/auth/signup',
      name: 'Signup',
      component: Signup,
      meta: { requiresGuest: true }
    },
    {
      path: '/auth/verify-email',
      name: 'VerifyEmail',
      component: VerifyEmail
    },
    // Subscription routes
    {
      path: '/subscription/pricing',
      name: 'Pricing',
      component: Pricing
    },
    {
      path: '/subscription/success',
      name: 'SubscriptionSuccess',
      component: Success,
      meta: { requiresAuth: true }
    },
    {
      path: '/subscription/cancel',
      name: 'SubscriptionCancel',
      component: Cancel
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth if not already done
  if (authStore.loading) {
    await authStore.initialize()
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/auth/login')
  } else if (requiresGuest && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router