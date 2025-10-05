<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Loading state -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading service...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-12">
          <div class="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <router-link to="/services" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Back to Services
          </router-link>
        </div>

        <!-- Service details -->
        <div v-else-if="service" class="bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- Service header -->
          <div class="p-6 border-b">
            <div class="flex items-center justify-between">
              <h1 class="text-3xl font-bold text-gray-900">{{ service.name }}</h1>
              <div class="text-2xl font-bold text-green-600">${{ service.price }}</div>
            </div>
            <p class="text-gray-600 mt-2">{{ service.description }}</p>
          </div>

          <!-- Service content -->
          <div class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Service image -->
              <div class="space-y-4">
                <img 
                  :src="service.image || '/placeholder-service.png'" 
                  :alt="service.name"
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

              <!-- Service details -->
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Service Details</h3>
                  <div class="space-y-2 text-sm text-gray-600">
                    <div><span class="font-medium">Category:</span> {{ service.category }}</div>
                    <div><span class="font-medium">Provider:</span> {{ service.provider }}</div>
                    <div><span class="font-medium">Duration:</span> {{ service.duration }}</div>
                    <div><span class="font-medium">Rating:</span> {{ service.rating }}/5 ⭐</div>
                  </div>
                </div>

                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">What's Included</h3>
                  <ul class="space-y-1 text-gray-600">
                    <li v-for="item in service.includes" :key="item" class="flex items-center">
                      <span class="text-green-500 mr-2">✓</span>
                      {{ item }}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p class="text-gray-600">{{ service.fullDescription || service.description }}</p>
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
const service = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const serviceId = route.params.id
    // TODO: Implement actual service fetching from API
    // For now, using mock data
    service.value = {
      id: serviceId,
      name: 'Web Development Service',
      description: 'Professional web development and design services',
      fullDescription: 'Complete web development service including frontend and backend development, database design, and deployment. Perfect for businesses looking to establish their online presence.',
      price: 1999.99,
      category: 'Development',
      provider: 'DevStudio',
      duration: '2-4 weeks',
      rating: 4.9,
      image: '/placeholder-service.png',
      includes: [
        'Custom website design',
        'Responsive development',
        'Database integration',
        'SEO optimization',
        '3 months support'
      ]
    }
  } catch (err) {
    error.value = 'Failed to load service details'
    console.error('Error loading service:', err)
  } finally {
    loading.value = false
  }
})

const addToCart = () => {
  // TODO: Implement add to cart functionality
  console.log('Adding to cart:', service.value.id)
}

const buyNow = () => {
  // TODO: Implement buy now functionality
  console.log('Buying now:', service.value.id)
}
</script>
