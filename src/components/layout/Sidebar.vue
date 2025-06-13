<template>
  <aside class="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-16 lg:bg-white lg:dark:bg-gray-900 lg:border-r lg:border-gray-200 lg:dark:border-gray-800">
    <div class="flex-1 flex flex-col min-h-0 pt-6">
      <div class="flex-1 flex flex-col overflow-y-auto">
        <nav class="px-4 space-y-1">
          <div class="mb-6">
            <h3 class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Quick Actions
            </h3>
            <div class="mt-3 space-y-1">
              <router-link
                to="/create"
                class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <PlusCircleIcon class="mr-3 h-5 w-5" />
                Create Token
              </router-link>
              <router-link
                to="/dashboard"
                class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ChartBarIcon class="mr-3 h-5 w-5" />
                View Dashboard
              </router-link>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Token Standards
            </h3>
            <div class="mt-3 space-y-1">
              <div
                v-for="standard in tokenStandards"
                :key="standard.name"
                class="flex items-center justify-between px-3 py-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <div class="flex items-center">
                  <div class="w-2 h-2 rounded-full mr-3" :class="standard.color"></div>
                  {{ standard.name }}
                </div>
                <Badge :variant="standard.variant" size="sm">{{ standard.count }}</Badge>
              </div>
            </div>
          </div>

          <div>
            <h3 class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Recent Activity
            </h3>
            <div class="mt-3 space-y-2">
              <div
                v-for="activity in recentActivity"
                :key="activity.id"
                class="px-3 py-2 text-xs text-gray-600 dark:text-gray-400"
              >
                <div class="font-medium">{{ activity.action }}</div>
                <div class="text-gray-500 dark:text-gray-500">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTokenStore } from '../../stores/tokens'
import Badge from '../ui/Badge.vue'
import { PlusCircleIcon, ChartBarIcon } from '@heroicons/vue/24/outline'

const tokenStore = useTokenStore()

const tokenStandards = computed(() => [
  {
    name: 'ARC3',
    count: tokenStore.tokens.filter(t => t.standard === 'ARC3').length,
    color: 'bg-blue-500',
    variant: 'info' as const
  },
  {
    name: 'ARC200',
    count: tokenStore.tokens.filter(t => t.standard === 'ARC200').length,
    color: 'bg-green-500',
    variant: 'success' as const
  },
  {
    name: 'ARC72',
    count: tokenStore.tokens.filter(t => t.standard === 'ARC72').length,
    color: 'bg-purple-500',
    variant: 'default' as const
  },
  {
    name: 'ERC20',
    count: tokenStore.tokens.filter(t => t.standard === 'ERC20').length,
    color: 'bg-yellow-500',
    variant: 'warning' as const
  },
  {
    name: 'ERC721',
    count: tokenStore.tokens.filter(t => t.standard === 'ERC721').length,
    color: 'bg-pink-500',
    variant: 'error' as const
  }
])

const recentActivity = [
  { id: 1, action: 'Token created', time: '2 minutes ago' },
  { id: 2, action: 'Deployment successful', time: '5 minutes ago' },
  { id: 3, action: 'Settings updated', time: '1 hour ago' }
]
</script>