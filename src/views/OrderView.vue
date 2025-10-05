<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Loading state -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading order...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-12">
          <div class="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <router-link to="/purchases" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Back to Purchases
          </router-link>
        </div>

        <!-- Order details -->
        <div v-else-if="order" class="space-y-6">
          <!-- Order header -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <h1 class="text-3xl font-bold text-gray-900">Order #{{ order.id }}</h1>
              <div class="flex items-center space-x-2">
                <span class="px-3 py-1 rounded-full text-sm font-medium" :class="statusClass">
                  {{ order.status }}
                </span>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span class="font-medium">Order Date:</span> {{ formatDate(order.orderDate) }}
              </div>
              <div>
                <span class="font-medium">Total:</span> ${{ order.total }}
              </div>
              <div>
                <span class="font-medium">Payment Method:</span> {{ order.paymentMethod }}
              </div>
            </div>
          </div>

          <!-- Order items -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
            <div class="space-y-4">
              <div v-for="item in order.items" :key="item.id" class="flex items-center space-x-4 p-4 border rounded-lg">
                <img 
                  :src="item.image || '/placeholder.png'" 
                  :alt="item.name"
                  class="w-16 h-16 object-cover rounded-lg"
                />
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900">{{ item.name }}</h3>
                  <p class="text-sm text-gray-600">{{ item.category }}</p>
                  <p class="text-sm font-medium text-gray-900">${{ item.price }}</p>
                </div>
                <div class="text-right">
                  <div class="text-sm text-gray-600">Quantity: {{ item.quantity }}</div>
                  <div class="font-medium">${{ (item.price * item.quantity).toFixed(2) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Shipping information -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="font-medium text-gray-900 mb-2">Shipping Address</h3>
                <div class="text-sm text-gray-600">
                  <div>{{ order.shippingAddress.name }}</div>
                  <div>{{ order.shippingAddress.address }}</div>
                  <div>{{ order.shippingAddress.city }}, {{ order.shippingAddress.zip }}</div>
                </div>
              </div>
              <div>
                <h3 class="font-medium text-gray-900 mb-2">Tracking Information</h3>
                <div class="text-sm text-gray-600">
                  <div v-if="order.trackingNumber">
                    <div>Tracking Number: {{ order.trackingNumber }}</div>
                    <div>Carrier: {{ order.carrier }}</div>
                    <div>Estimated Delivery: {{ formatDate(order.estimatedDelivery) }}</div>
                  </div>
                  <div v-else class="text-gray-500">
                    Tracking information will be available once your order ships.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order actions -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Order Actions</h2>
            <div class="flex flex-wrap gap-4">
              <button 
                @click="downloadInvoice"
                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download Invoice
              </button>
              <button 
                @click="trackOrder"
                v-if="order.trackingNumber"
                class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Track Order
              </button>
              <button 
                @click="contactSupport"
                class="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Contact Support
              </button>
              <button 
                @click="returnOrder"
                v-if="order.status === 'delivered'"
                class="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Return Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const order = ref(null)
const loading = ref(true)
const error = ref(null)

const statusClass = computed(() => {
  if (!order.value) return ''
  
  const status = order.value.status.toLowerCase()
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'processing':
      return 'bg-blue-100 text-blue-800'
    case 'shipped':
      return 'bg-purple-100 text-purple-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})

onMounted(async () => {
  try {
    const orderId = route.params.id
    // TODO: Implement actual order fetching from API
    // For now, using mock data
    order.value = {
      id: orderId,
      status: 'processing',
      orderDate: new Date(),
      total: 2299.98,
      paymentMethod: 'Crypto (ETH)',
      items: [
        {
          id: 1,
          name: 'Trading Bot Pro',
          category: 'Bot',
          price: 299.99,
          quantity: 1,
          image: '/placeholder-bot.png'
        },
        {
          id: 2,
          name: 'Web Development Service',
          category: 'Service',
          price: 1999.99,
          quantity: 1,
          image: '/placeholder-service.png'
        }
      ],
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main St',
        city: 'New York',
        zip: '10001'
      },
      trackingNumber: null,
      carrier: null,
      estimatedDelivery: null
    }
  } catch (err) {
    error.value = 'Failed to load order details'
    console.error('Error loading order:', err)
  } finally {
    loading.value = false
  }
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const downloadInvoice = () => {
  // TODO: Implement invoice download
  console.log('Downloading invoice for order:', order.value.id)
}

const trackOrder = () => {
  // TODO: Implement order tracking
  console.log('Tracking order:', order.value.trackingNumber)
}

const contactSupport = () => {
  // TODO: Implement support contact
  console.log('Contacting support for order:', order.value.id)
}

const returnOrder = () => {
  // TODO: Implement order return
  console.log('Returning order:', order.value.id)
}
</script>
