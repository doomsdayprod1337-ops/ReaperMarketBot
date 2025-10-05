<template>
  <div class="min-h-screen bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 font-mono">Order History</h1>
        <p class="text-gray-300 text-lg">Track your bot purchases and orders</p>
      </div>

      <!-- Orders List -->
      <div v-if="orders.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">📦</div>
        <h3 class="text-xl font-semibold text-white mb-2">No orders yet</h3>
        <p class="text-gray-400 mb-6">Start shopping to see your orders here!</p>
        <router-link to="/bots">
          <button class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
            Browse Bots
          </button>
        </router-link>
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm"
        >
          <!-- Order Header -->
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-white font-semibold">Order #{{ order.id }}</h3>
              <div class="text-gray-400 text-sm">{{ formatDate(order.created_at) }}</div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-red-400">${{ order.total.toFixed(2) }}</div>
              <div
                :class="`text-sm px-2 py-1 rounded ${
                  order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`"
              >
                {{ order.status }}
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="space-y-3 mb-4">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <span class="text-red-400 text-lg">🤖</span>
                </div>
                <div>
                  <div class="text-white font-medium">{{ item.bot_id }}</div>
                  <div class="text-gray-400 text-sm">{{ item.country }} • {{ item.os }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-white font-medium">${{ (item.price * item.quantity).toFixed(2) }}</div>
                <div class="text-gray-400 text-sm">Qty: {{ item.quantity }}</div>
              </div>
            </div>
          </div>

          <!-- Order Actions -->
          <div class="flex items-center justify-between pt-4 border-t border-gray-700">
            <div class="flex items-center gap-4 text-sm text-gray-400">
              <span>Items: {{ order.items.length }}</span>
              <span>•</span>
              <span>Payment: {{ order.payment?.method || 'N/A' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="viewOrderDetails(order)"
                class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
              >
                View Details
              </button>
              <button
                v-if="order.status === 'completed'"
                @click="downloadOrder(order)"
                class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// State
const orders = ref([])

// Methods
const loadOrders = () => {
  const savedOrders = localStorage.getItem('orders')
  if (savedOrders) {
    orders.value = JSON.parse(savedOrders).reverse() // Show newest first
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const viewOrderDetails = (order) => {
  console.log('Viewing order details:', order)
  // Implement order details modal
}

const downloadOrder = (order) => {
  console.log('Downloading order:', order)
  // Implement order download functionality
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.font-reaper {
  font-family: 'Reaper', sans-serif;
}
</style>