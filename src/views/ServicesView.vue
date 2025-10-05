<template>
  <div class="min-h-screen bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 font-mono">Services</h1>
        <p class="text-gray-300 text-lg">Curated offerings for the market</p>
      </div>

      <!-- Service Categories -->
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
          <div class="text-red-500 text-3xl mb-4">💻</div>
          <h3 class="text-xl font-semibold text-white mb-2">Development</h3>
          <p class="text-gray-300 text-sm mb-4">Custom software, bots, and applications</p>
          <div class="text-red-500 font-mono">12 services</div>
        </div>

        <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
          <div class="text-red-500 text-3xl mb-4">🔒</div>
          <h3 class="text-xl font-semibold text-white mb-2">Security</h3>
          <p class="text-gray-300 text-sm mb-4">Penetration testing and security audits</p>
          <div class="text-red-500 font-mono">8 services</div>
        </div>

        <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
          <div class="text-red-500 text-3xl mb-4">📈</div>
          <h3 class="text-xl font-semibold text-white mb-2">Marketing</h3>
          <p class="text-gray-300 text-sm mb-4">SEO, social media, and content creation</p>
          <div class="text-red-500 font-mono">15 services</div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 mb-8 backdrop-blur-sm">
        <div class="flex flex-wrap gap-4">
          <div class="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search services..."
              class="w-full pl-9 pr-4 py-2 bg-gray-700/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
            />
            <div class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500">
              🔍
            </div>
          </div>

          <select class="w-[180px] bg-gray-700/50 border border-red-500/30 rounded-lg text-white focus:border-red-500 focus:ring-red-500/20">
            <option value="all">All Categories</option>
            <option value="development">Development</option>
            <option value="security">Security</option>
            <option value="marketing">Marketing</option>
            <option value="automation">Automation</option>
            <option value="spamming">Spamming</option>
            <option value="other">Other</option>
          </select>

          <select class="w-[120px] bg-gray-700/50 border border-red-500/30 rounded-lg text-white focus:border-red-500 focus:ring-red-500/20">
            <option value="none">Default</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>

          <button class="px-4 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 hover:border-red-500 transition-colors">
            🔍 Advanced Search
          </button>

          <button class="px-4 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 hover:border-red-500 transition-colors">
            🛒 Cart
          </button>
        </div>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="service in mockServices" :key="service.id" class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm hover:bg-gray-700/50 transition-colors">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-white mb-2">{{ service.name }}</h3>
              <div class="flex items-center gap-2 mb-3">
                <span class="px-2 py-1 text-xs bg-red-500/20 text-red-500 border border-red-500/30 rounded">
                  {{ service.category }}
                </span>
                <span class="px-2 py-1 text-xs bg-green-500/20 text-green-500 border border-green-500/30 rounded">
                  {{ service.status }}
                </span>
              </div>
            </div>
            <div class="w-16 h-16 rounded-lg overflow-hidden bg-gray-700/50 flex-shrink-0">
              <img
                :src="service.image_url || '/favicon.svg'"
                :alt="service.name"
                class="w-full h-full object-cover"
                onerror="this.src='/favicon.svg'"
              />
            </div>
          </div>

          <p class="text-gray-300 text-sm mb-4 line-clamp-3">
            {{ service.description }}
          </p>

          <div class="flex items-center justify-between mb-4">
            <div class="text-2xl font-bold text-red-500 font-mono">
              ${{ service.price.toFixed(2) }}
            </div>
            <div class="flex items-center text-sm text-gray-400">
              <span class="text-yellow-500">⭐</span>
              <span class="ml-1">{{ service.rating }}/5</span>
              <span class="ml-2">({{ service.reviews }} reviews)</span>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="text-xs text-gray-400">
              Added {{ new Date(service.created_at).toLocaleDateString() }}
            </div>
            <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <!-- No Services State -->
      <div v-if="mockServices.length === 0" class="text-center py-12">
        <div class="text-gray-400">
          <div class="text-6xl mb-4">⏰</div>
          <h3 class="text-lg font-semibold mb-2 text-white">No Services Available</h3>
          <p class="text-sm text-gray-300">Check back later for new services</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Mock data matching the original Reaper Market services structure
const mockServices = ref([
  {
    id: '1',
    name: 'Custom Telegram Bot Development',
    category: 'Development',
    status: 'Active',
    price: 299.99,
    description: 'Professional Telegram bot development with advanced features including payment integration, database management, and custom commands.',
    image_url: '/favicon.svg',
    rating: 4.9,
    reviews: 47,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Penetration Testing Service',
    category: 'Security',
    status: 'Active',
    price: 499.99,
    description: 'Comprehensive security assessment including vulnerability scanning, penetration testing, and detailed security report.',
    image_url: '/favicon.svg',
    rating: 4.8,
    reviews: 23,
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    name: 'SEO Optimization Package',
    category: 'Marketing',
    status: 'Active',
    price: 199.99,
    description: 'Complete SEO optimization including keyword research, on-page optimization, and technical SEO audit.',
    image_url: '/favicon.svg',
    rating: 4.7,
    reviews: 31,
    created_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: '4',
    name: 'Chrome Extension Development',
    category: 'Development',
    status: 'Active',
    price: 399.99,
    description: 'Custom Chrome extension development with modern web technologies and seamless browser integration.',
    image_url: '/favicon.svg',
    rating: 4.9,
    reviews: 18,
    created_at: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: '5',
    name: 'Social Media Marketing',
    category: 'Marketing',
    status: 'Active',
    price: 149.99,
    description: 'Professional social media management including content creation, posting schedule, and engagement optimization.',
    image_url: '/favicon.svg',
    rating: 4.6,
    reviews: 42,
    created_at: new Date(Date.now() - 345600000).toISOString()
  },
  {
    id: '6',
    name: 'Workflow Automation',
    category: 'Automation',
    status: 'Active',
    price: 249.99,
    description: 'Custom workflow automation solutions to streamline your business processes and increase efficiency.',
    image_url: '/favicon.svg',
    rating: 4.8,
    reviews: 27,
    created_at: new Date(Date.now() - 432000000).toISOString()
  }
])
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>