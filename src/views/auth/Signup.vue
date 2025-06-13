<template>
  <div class="min-h-screen flex items-center justify-center container-padding">
    <div class="max-w-md w-full">
      <Card variant="elevated" padding="lg">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
            <span class="text-white font-bold text-2xl">B</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create account</h1>
          <p class="text-gray-600 dark:text-gray-400">Get started with Biatec Tokens</p>
        </div>

        <form @submit.prevent="handleSignUp" class="space-y-6">
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
            placeholder="Create a password"
            hint="Must be at least 8 characters long"
          />

          <Input
            id="confirmPassword"
            type="password"
            label="Confirm password"
            v-model="confirmPassword"
            :error="confirmPasswordError"
            required
            placeholder="Confirm your password"
          />

          <div class="flex items-start">
            <input
              type="checkbox"
              v-model="acceptTerms"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
            />
            <label class="ml-2 text-sm text-gray-600 dark:text-gray-400">
              I agree to the
              <a href="#" class="text-blue-600 hover:text-blue-500 dark:text-blue-400">Terms of Service</a>
              and
              <a href="#" class="text-blue-600 hover:text-blue-500 dark:text-blue-400">Privacy Policy</a>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            :loading="loading"
            :disabled="!isFormValid"
            full-width
          >
            Create account
          </Button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?
            <router-link
              to="/auth/login"
              class="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
            >
              Sign in
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
const confirmPassword = ref('')
const acceptTerms = ref(false)
const loading = ref(false)
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

const isFormValid = computed(() => {
  return (
    email.value.length > 0 &&
    password.value.length >= 8 &&
    confirmPassword.value === password.value &&
    acceptTerms.value
  )
})

const validateForm = () => {
  emailError.value = ''
  passwordError.value = ''
  confirmPasswordError.value = ''

  if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters long'
    return false
  }

  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match'
    return false
  }

  return true
}

const handleSignUp = async () => {
  if (!validateForm() || !isFormValid.value) return

  loading.value = true

  try {
    await authStore.signUp(email.value, password.value)
    router.push('/auth/verify-email')
  } catch (error: any) {
    console.error('Sign up error:', error)
    
    if (error.message.includes('already registered')) {
      emailError.value = 'An account with this email already exists'
    } else {
      emailError.value = error.message || 'Failed to create account'
    }
  } finally {
    loading.value = false
  }
}
</script>