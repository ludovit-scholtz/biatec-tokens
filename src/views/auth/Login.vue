<template>
  <div class="min-h-screen flex items-center justify-center container-padding">
    <div class="max-w-md w-full">
      <Card variant="elevated" padding="lg">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
            <span class="text-white font-bold text-2xl">B</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h1>
          <p class="text-gray-600 dark:text-gray-400">Sign in to your account</p>
        </div>

        <form @submit.prevent="handleSignIn" class="space-y-6">
          <Input
            id="email"
            type="email"
            label="Email address"
            v-model="email"
            :error="emailError"
            required
            placeholder="Enter your email"
          />

          <Input
            id="password"
            type="password"
            label="Password"
            v-model="password"
            :error="passwordError"
            required
            placeholder="Enter your password"
          />

          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="rememberMe"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
            </label>
            <router-link
              to="/auth/forgot-password"
              class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Forgot password?
            </router-link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            :loading="loading"
            :disabled="!isFormValid"
            full-width
          >
            Sign in
          </Button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?
            <router-link
              to="/auth/signup"
              class="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
            >
              Sign up
            </router-link>
          </p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import Card from '../../components/ui/Card.vue'
import Input from '../../components/ui/Input.vue'
import Button from '../../components/ui/Button.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const emailError = ref('')
const passwordError = ref('')

const isFormValid = computed(() => {
  return email.value.length > 0 && password.value.length > 0
})

const handleSignIn = async () => {
  if (!isFormValid.value) return

  loading.value = true
  emailError.value = ''
  passwordError.value = ''

  try {
    await authStore.signIn(email.value, password.value)
    router.push('/')
  } catch (error: any) {
    console.error('Sign in error:', error)
    
    if (error.message.includes('Invalid login credentials')) {
      emailError.value = 'Invalid email or password'
    } else if (error.message.includes('Email not confirmed')) {
      emailError.value = 'Please check your email and confirm your account'
    } else {
      emailError.value = error.message || 'Failed to sign in'
    }
  } finally {
    loading.value = false
  }
}
</script>