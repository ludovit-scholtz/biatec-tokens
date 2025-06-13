export interface StripeProduct {
  id: string
  priceId: string
  name: string
  description: string
  mode: 'payment' | 'subscription'
  price: number
  currency: string
  interval?: 'month' | 'year'
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_SUcy60xNbxYd2P',
    priceId: 'price_1RZditFQlr5akrTCrlVCJ6Gd',
    name: 'Monthly subscription',
    description: 'Access to premium features and unlimited token creation',
    mode: 'subscription',
    price: 50.00,
    currency: 'usd',
    interval: 'month'
  }
]

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id)
}

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId)
}