<template>
  <div class="min-h-screen flex items-center justify-center container-padding">
    <div class="max-w-md w-full">
      <Card variant="elevated" padding="lg">
        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h1>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            We've sent a verification link to your email address. Please click the link to verify your account.
          </p>
          
          <div class="space-y-4">
            <Button
              @click="$router.push('/auth/login')"
              variant="primary"
              size="lg"
              full-width
            >
              Back to Sign In
            </Button>
            
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Didn't receive the email? Check your spam folder or
              <button class="text-blue-600 hover:text-blue-500 dark:text-blue-400 underline">
                resend verification email
              </button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '../../components/ui/Card.vue'
import Button from '../../components/ui/Button.vue'
</script>