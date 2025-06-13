import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from './auth'
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
      const { data, error: fetchError } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle()

      if (fetchError) {
        throw fetchError
      }

      subscription.value = data
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
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        throw new Error('No authentication token available')
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          price_id: priceId,
          mode,
          success_url: `${window.location.origin}/subscription/success`,
          cancel_url: `${window.location.origin}/subscription/cancel`
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const { url } = await response.json()
      
      if (url) {
        window.location.href = url
      } else {
        throw new Error('No checkout URL received')
      }
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