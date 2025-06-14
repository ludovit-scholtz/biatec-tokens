import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getProductByPriceId } from '../stripe-config'
import type { StripeProduct } from '../stripe-config'

interface SubscriptionData {
  customer_id: string
  subscription_id: string | null
  subscription_status: string
  price_id: string | null
  current_period_start: number | null
  current_period_end: number | null
  cancel_at_period_end: boolean
  payment_method_brand: string | null
  payment_method_last4: string | null
}

export const useSubscriptionStore = defineStore('subscription', () => {
  const subscription = ref<SubscriptionData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isActive = computed(() => {
    return subscription.value?.subscription_status === 'active'
  })

  const currentProduct = computed((): StripeProduct | null => {
    if (!subscription.value?.price_id) return null
    return getProductByPriceId(subscription.value.price_id) || null
  })

  const currentPeriodEnd = computed(() => {
    if (!subscription.value?.current_period_end) return null
    return new Date(subscription.value.current_period_end * 1000)
  })

  const fetchSubscription = async () => {
    loading.value = true
    error.value = null

    try {
      // Mock subscription data for demo purposes
      // In a real app, this would fetch from your backend
      const mockSubscription: SubscriptionData = {
        customer_id: 'demo_customer',
        subscription_id: null,
        subscription_status: 'not_started',
        price_id: null,
        current_period_start: null,
        current_period_end: null,
        cancel_at_period_end: false,
        payment_method_brand: null,
        payment_method_last4: null
      }

      subscription.value = mockSubscription
    } catch (err) {
      console.error('Error fetching subscription:', err)
      error.value = err instanceof Error ? err.message : 'Failed to fetch subscription'
    } finally {
      loading.value = false
    }
  }

  const createCheckoutSession = async (priceId: string, mode: 'payment' | 'subscription' = 'subscription') => {
    loading.value = true
    error.value = null

    try {
      // Mock checkout session creation
      // In a real app, this would call your backend to create a Stripe checkout session
      console.log('Creating checkout session for:', { priceId, mode })
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, just redirect to a mock success page
      const mockCheckoutUrl = `${window.location.origin}/subscription/success?session_id=mock_session_${Date.now()}`
      window.location.href = mockCheckoutUrl
    } catch (err) {
      console.error('Error creating checkout session:', err)
      error.value = err instanceof Error ? err.message : 'Failed to create checkout session'
    } finally {
      loading.value = false
    }
  }

  return {
    subscription,
    loading,
    error,
    isActive,
    currentProduct,
    currentPeriodEnd,
    fetchSubscription,
    createCheckoutSession
  }
})