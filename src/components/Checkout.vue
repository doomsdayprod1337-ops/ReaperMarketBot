<template>
  <div class="checkout">
    <!-- Checkout Steps -->
    <div class="mb-8">
      <div class="flex items-center justify-center space-x-4">
        <div
          :class="`flex items-center gap-2 px-4 py-2 rounded-lg ${
            cartStore.checkoutStep === 'cart' ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'
          }`"
        >
          <span class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">1</span>
          <span class="font-medium">Cart</span>
        </div>
        <div class="w-8 h-0.5 bg-gray-600"></div>
        <div
          :class="`flex items-center gap-2 px-4 py-2 rounded-lg ${
            cartStore.checkoutStep === 'shipping' ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'
          }`"
        >
          <span class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">2</span>
          <span class="font-medium">Details</span>
        </div>
        <div class="w-8 h-0.5 bg-gray-600"></div>
        <div
          :class="`flex items-center gap-2 px-4 py-2 rounded-lg ${
            cartStore.checkoutStep === 'payment' ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'
          }`"
        >
          <span class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">3</span>
          <span class="font-medium">Payment</span>
        </div>
        <div class="w-8 h-0.5 bg-gray-600"></div>
        <div
          :class="`flex items-center gap-2 px-4 py-2 rounded-lg ${
            cartStore.checkoutStep === 'confirmation' ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'
          }`"
        >
          <span class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">4</span>
          <span class="font-medium">Confirm</span>
        </div>
      </div>
    </div>

    <!-- Shipping Details Step -->
    <div v-if="cartStore.checkoutStep === 'shipping'" class="max-w-2xl mx-auto">
      <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
        <h2 class="text-2xl font-bold text-white mb-6 font-reaper">Shipping Details</h2>
        
        <form @submit.prevent="proceedToPayment" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-white mb-2">First Name</label>
              <input
                v-model="shippingForm.firstName"
                type="text"
                required
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-white mb-2">Last Name</label>
              <input
                v-model="shippingForm.lastName"
                type="text"
                required
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-white mb-2">Email</label>
            <input
              v-model="shippingForm.email"
              type="email"
              required
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-white mb-2">Country</label>
            <select
              v-model="shippingForm.country"
              required
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:ring-red-500/20"
            >
              <option value="">Select your country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="AU">Australia</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-white mb-2">Telegram Username</label>
            <input
              v-model="shippingForm.telegram"
              type="text"
              required
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
              placeholder="@your_username"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-white mb-2">Special Instructions (Optional)</label>
            <textarea
              v-model="shippingForm.instructions"
              rows="3"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
              placeholder="Any special delivery instructions..."
            ></textarea>
          </div>

          <div class="flex justify-between">
            <button
              type="button"
              @click="cartStore.resetCheckout"
              class="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              Back to Cart
            </button>
            <button
              type="submit"
              class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Payment Step -->
    <div v-if="cartStore.checkoutStep === 'payment'" class="max-w-2xl mx-auto">
      <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
        <h2 class="text-2xl font-bold text-white mb-6 font-reaper">Payment Method</h2>
        
        <form @submit.prevent="processPayment" class="space-y-6">
          <!-- Payment Method Selection -->
          <div>
            <label class="block text-sm font-medium text-white mb-4">Choose Payment Method</label>
            <div class="space-y-3">
              <label
                v-for="method in paymentMethods"
                :key="method.id"
                class="flex items-center p-4 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-600/50 transition-colors"
                :class="{ 'ring-2 ring-red-500': selectedPaymentMethod === method.id }"
              >
                <input
                  v-model="selectedPaymentMethod"
                  :value="method.id"
                  type="radio"
                  class="sr-only"
                />
                <div class="flex items-center gap-3">
                  <div class="text-2xl">{{ method.icon }}</div>
                  <div>
                    <div class="text-white font-medium">{{ method.name }}</div>
                    <div class="text-gray-400 text-sm">{{ method.description }}</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- Crypto Payment Details -->
          <div v-if="selectedPaymentMethod === 'crypto'" class="space-y-4">
            <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-yellow-400">⚠️</span>
                <span class="text-yellow-400 font-medium">Important Instructions</span>
              </div>
              <ul class="text-yellow-300 text-sm space-y-1">
                <li>• Send exact amount to the wallet address below</li>
                <li>• Include your order ID in the transaction memo</li>
                <li>• Wait for 3 confirmations before order is processed</li>
                <li>• Contact support if payment is not confirmed within 30 minutes</li>
              </ul>
            </div>

            <div class="bg-gray-700/50 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-white font-medium">Bitcoin Address</span>
                <button
                  @click="copyToClipboard('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')"
                  class="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Copy
                </button>
              </div>
              <div class="bg-gray-800 p-3 rounded font-mono text-sm text-gray-300 break-all">
                1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
              </div>
              <div class="mt-2 text-center">
                <span class="text-white font-bold text-lg">${{ (cartStore.totalPrice * 1.08).toFixed(2) }}</span>
                <span class="text-gray-400 text-sm ml-2">USD</span>
              </div>
            </div>
          </div>

          <!-- PayPal Payment -->
          <div v-if="selectedPaymentMethod === 'paypal'" class="space-y-4">
            <div class="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-blue-400">ℹ️</span>
                <span class="text-blue-400 font-medium">PayPal Payment</span>
              </div>
              <p class="text-blue-300 text-sm">
                You will be redirected to PayPal to complete your payment securely.
              </p>
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-start gap-3">
            <input
              v-model="agreeToTerms"
              type="checkbox"
              required
              class="mt-1 w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
            />
            <label class="text-gray-300 text-sm">
              I agree to the <a href="#" class="text-red-400 hover:text-red-300 underline">Terms of Service</a> 
              and <a href="#" class="text-red-400 hover:text-red-300 underline">Privacy Policy</a>
            </label>
          </div>

          <div class="flex justify-between">
            <button
              type="button"
              @click="cartStore.checkoutStep = 'shipping'"
              class="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              :disabled="!selectedPaymentMethod || !agreeToTerms || cartStore.isLoading"
              class="px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <span v-if="!cartStore.isLoading">Complete Order</span>
              <span v-else class="flex items-center gap-2">
                <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirmation Step -->
    <div v-if="cartStore.checkoutStep === 'confirmation'" class="max-w-2xl mx-auto">
      <div class="bg-gray-800/80 border border-green-500/30 rounded-lg p-6 backdrop-blur-sm text-center">
        <div class="text-6xl mb-4">✅</div>
        <h2 class="text-2xl font-bold text-white mb-4 font-reaper">Order Confirmed!</h2>
        <p class="text-gray-300 mb-6">
          Your order has been successfully placed. You will receive a confirmation email shortly.
        </p>
        
        <div class="bg-gray-700/50 rounded-lg p-4 mb-6 text-left">
          <h3 class="text-white font-medium mb-3">Order Summary</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-400">Order ID</span>
              <span class="text-white font-mono">#{{ lastOrder?.id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Items</span>
              <span class="text-white">{{ lastOrder?.items.length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Total</span>
              <span class="text-white font-bold">${{ lastOrder?.total.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Status</span>
              <span class="text-green-400">{{ lastOrder?.status }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <button
            @click="viewOrderDetails"
            class="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            View Order Details
          </button>
          <button
            @click="continueShopping"
            class="w-full px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()

// State
const shippingForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  country: '',
  telegram: '',
  instructions: ''
})

const selectedPaymentMethod = ref('')
const agreeToTerms = ref(false)

const paymentMethods = ref([
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    icon: '₿',
    description: 'Bitcoin, Ethereum, and other cryptocurrencies'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: '💳',
    description: 'Pay securely with PayPal'
  }
])

const lastOrder = computed(() => {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]')
  return orders[orders.length - 1]
})

// Methods
const proceedToPayment = () => {
  cartStore.checkoutStep = 'payment'
}

const processPayment = async () => {
  try {
    const checkoutData = {
      shipping: { ...shippingForm },
      payment: {
        method: selectedPaymentMethod.value,
        amount: cartStore.totalPrice * 1.08
      }
    }

    await cartStore.processCheckout(checkoutData)
  } catch (error) {
    console.error('Payment processing error:', error)
  }
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    // Show success notification
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 z-50 p-4 bg-green-500 text-white rounded-lg shadow-lg'
    notification.textContent = 'Address copied to clipboard!'
    document.body.appendChild(notification)
    setTimeout(() => notification.remove(), 3000)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

const viewOrderDetails = () => {
  router.push('/purchases')
}

const continueShopping = () => {
  cartStore.resetCheckout()
  router.push('/bots')
}
</script>

<style scoped>
.font-reaper {
  font-family: 'Reaper', sans-serif;
}
</style>
