import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import Home from "../views/Home.vue";
import TokenCreator from "../views/TokenCreator.vue";
import TokenDashboard from "../views/TokenDashboard.vue";
import Settings from "../views/Settings.vue";

// Subscription views
import Pricing from "../views/subscription/Pricing.vue";
import Success from "../views/subscription/Success.vue";
import Cancel from "../views/subscription/Cancel.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/create",
      name: "TokenCreator",
      component: TokenCreator,
      meta: { requiresAuth: true },
    },
    {
      path: "/dashboard",
      name: "TokenDashboard",
      component: TokenDashboard,
      meta: { requiresAuth: true },
    },
    {
      path: "/settings",
      name: "Settings",
      component: Settings,
      meta: { requiresAuth: true },
    },
    // Subscription routes
    {
      path: "/subscription/pricing",
      name: "Pricing",
      component: Pricing,
    },
    {
      path: "/subscription/success",
      name: "SubscriptionSuccess",
      component: Success,
      meta: { requiresAuth: true },
    },
    {
      path: "/subscription/cancel",
      name: "SubscriptionCancel",
      component: Cancel,
    },
  ],
});

// Navigation guard for protected routes
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  
  // Wait for auth store to initialize if loading
  if (authStore.loading) {
    // Check if loading state changes, but timeout after 10 seconds
    const timeout = new Promise(resolve => setTimeout(() => resolve(false), 10000));
    const waitForInit = new Promise(resolve => {
      const unwatch = authStore.$subscribe(() => {
        if (!authStore.loading) {
          unwatch();
          resolve(true);
        }
      });
      // Also check immediately in case it's no longer loading
      if (!authStore.loading) {
        unwatch();
        resolve(true);
      }
    });
    
    await Promise.race([waitForInit, timeout]);
  }
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to home if not authenticated
    next({ name: "Home" });
  } else {
    next();
  }
});

export default router;
