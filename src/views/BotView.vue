<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Loading state -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading bot...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-12">
          <div class="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Bot Not Found</h2>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <router-link to="/bots" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Back to Bots
          </router-link>
        </div>

        <!-- Bot details -->
        <div v-else-if="bot" class="bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- Bot header -->
          <div class="p-6 border-b">
            <div class="flex items-center justify-between">
              <h1 class="text-3xl font-bold text-gray-900">{{ bot.name }}</h1>
              <div class="text-2xl font-bold text-green-600">${{ bot.price }}</div>
            </div>
            <p class="text-gray-600 mt-2">{{ bot.description }}</p>
          </div>

          <!-- Bot content -->
          <div class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Bot image -->
              <div class="space-y-4">
                <img 
                  :src="bot.image || '/placeholder-bot.png'" 
                  :alt="bot.name"
                  class="w-full h-64 object-cover rounded-lg"
                />
                <div class="flex space-x-2">
                  <button 
                    @click="addToCart"
                    class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button 
                    @click="buyNow"
                    class="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              <!-- Bot details -->
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Bot Details</h3>
                  <div class="space-y-2 text-sm text-gray-600">
                    <div><span class="font-medium">Category:</span> {{ bot.category }}</div>
                    <div><span class="font-medium">Creator:</span> {{ bot.creator }}</div>
                    <div><span class="font-medium">Status:</span> {{ bot.status }}</div>
                    <div><span class="font-medium">Rating:</span> {{ bot.rating }}/5 ⭐</div>
                  </div>
                </div>

                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Features</h3>
                  <ul class="space-y-1 text-gray-600">
                    <li v-for="feature in bot.features" :key="feature" class="flex items-center">
                      <span class="text-green-500 mr-2">✓</span>
                      {{ feature }}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p class="text-gray-600">{{ bot.fullDescription || bot.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const bot = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const botId = route.params.id
    // TODO: Implement actual bot fetching from API
    // For now, using mock data
    bot.value = {
      id: botId,
      name: 'Trading Bot Pro',
      description: 'Advanced automated trading bot with AI capabilities',
      fullDescription: 'This advanced trading bot uses machine learning algorithms to analyze market trends and execute trades automatically. It includes risk management features and customizable trading strategies.',
      price: 299.99,
      category: 'Trading',
      creator: 'BotMaster',
      status: 'Active',
      rating: 4.8,
      image: '/placeholder-bot.png',
      features: [
        'AI-powered market analysis',
        'Risk management tools',
        'Custom trading strategies',
        'Real-time monitoring',
        '24/7 operation'
      ]
    }
  } catch (err) {
    error.value = 'Failed to load bot details'
    console.error('Error loading bot:', err)
  } finally {
    loading.value = false
  }
})

const addToCart = () => {
  // TODO: Implement add to cart functionality
  console.log('Adding to cart:', bot.value.id)
}

const buyNow = () => {
  // TODO: Implement buy now functionality
  console.log('Buying now:', bot.value.id)
}
</script>
