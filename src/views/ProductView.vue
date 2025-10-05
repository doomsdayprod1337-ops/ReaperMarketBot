<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Loading state -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading product...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-12">
          <div class="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <router-link to="/marketplace" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Back to Marketplace
          </router-link>
        </div>

        <!-- Product details -->
        <div v-else-if="product" class="bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- Product header -->
          <div class="p-6 border-b">
            <div class="flex items-center justify-between">
              <h1 class="text-3xl font-bold text-gray-900">{{ product.name }}</h1>
              <div class="text-2xl font-bold text-green-600">${{ product.price }}</div>
            </div>
            <p class="text-gray-600 mt-2">{{ product.description }}</p>
          </div>

          <!-- Product content -->
          <div class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Product image -->
              <div class="space-y-4">
                <img 
                  :src="product.image || '/placeholder-product.png'" 
                  :alt="product.name"
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

              <!-- Product details -->
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Product Details</h3>
                  <div class="space-y-2 text-sm text-gray-600">
                    <div><span class="font-medium">Category:</span> {{ product.category }}</div>
                    <div><span class="font-medium">Seller:</span> {{ product.seller }}</div>
                    <div><span class="font-medium">Stock:</span> {{ product.stock }} available</div>
                    <div><span class="font-medium">Rating:</span> {{ product.rating }}/5 ⭐</div>
                  </div>
                </div>

                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p class="text-gray-600">{{ product.fullDescription || product.description }}</p>
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
const product = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const productId = route.params.id
    // TODO: Implement actual product fetching from API
    // For now, using mock data
    product.value = {
      id: productId,
      name: 'Sample Product',
      description: 'This is a sample product description',
      fullDescription: 'This is a more detailed description of the product with all the features and benefits.',
      price: 99.99,
      category: 'Electronics',
      seller: 'TechStore',
      stock: 10,
      rating: 4.5,
      image: '/placeholder-product.png'
    }
  } catch (err) {
    error.value = 'Failed to load product details'
    console.error('Error loading product:', err)
  } finally {
    loading.value = false
  }
})

const addToCart = () => {
  // TODO: Implement add to cart functionality
  console.log('Adding to cart:', product.value.id)
}

const buyNow = () => {
  // TODO: Implement buy now functionality
  console.log('Buying now:', product.value.id)
}
</script>
