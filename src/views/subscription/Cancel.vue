<template>
  <div class="min-h-screen flex items-center justify-center container-padding">
    <div class="max-w-md w-full">
      <Card variant="elevated" padding="lg">
        <div class="text-center">
          <div class="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <XCircleIcon class="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Cancelled</h1>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Your payment was cancelled. No charges have been made to your account.
          </p>
          
          <div class="space-y-4">
            <Button
              @click="$router.push('/subscription/pricing')"
              variant="primary"
              size="lg"
              full-width
            >
              Try Again
            </Button>
            
            <Button
              @click="$router.push('/')"
              variant="outline"
              size="lg"
              full-width
            >
              Back to Home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '../../components/ui/Card.vue'
import Button from '../../components/ui/Button.vue'
import { XCircleIcon } from '@heroicons/vue/24/outline'
</script>