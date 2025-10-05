<template>
  <div class="min-h-screen bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 font-mono">Checker Files</h1>
        <p class="text-gray-300 text-lg">Browse and download checker configurations</p>
      </div>

      <!-- Stats Overview -->
      <div class="grid gap-4 md:grid-cols-4 mb-8">
        <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-red-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.totalConfigs }}</div>
              <div class="text-xs text-gray-300">Total Configs</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-green-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.activeConfigs }}</div>
              <div class="text-xs text-gray-300">Active</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.configTypes }}</div>
              <div class="text-xs text-gray-300">Config Types</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-purple-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.totalDownloads }}</div>
              <div class="text-xs text-gray-300">Downloads</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm mb-8">
        <div class="flex flex-wrap gap-4">
          <div class="relative flex-1 min-w-[200px]">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Search by website, config type, or description..."
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
            />
          </div>
          <select v-model="configTypeFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Types</option>
            <option value="openbullet">OpenBullet</option>
            <option value="openbullet2">OpenBullet 2</option>
            <option value="silverbullet">SilverBullet</option>
            <option value="bas">BAS</option>
            <option value="cookiebullet">CookieBullet</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>
          <select v-model="statusFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="testing">Testing</option>
            <option value="deprecated">Deprecated</option>
          </select>
          <select v-model="sortBy" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="downloads">Most Downloaded</option>
            <option value="rating">Highest Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
          <button
            @click="loadCheckerFiles"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <!-- Checker Files Grid -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p class="text-gray-400">Loading checker files...</p>
      </div>

      <div v-else-if="filteredConfigs.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">⚙️</div>
        <h3 class="text-xl font-semibold text-white mb-2">No checker files found</h3>
        <p class="text-gray-400 mb-6">Try adjusting your search filters</p>
        <button
          @click="loadCheckerFiles"
          class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Refresh Configs
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="config in filteredConfigs"
          :key="config.id"
          class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm hover:border-red-500/50 transition-all duration-300"
        >
          <!-- Config Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <span class="text-red-400 text-xl">{{ getConfigTypeIcon(config.config_type) }}</span>
              </div>
              <div>
                <h3 class="text-white font-semibold">{{ config.title }}</h3>
                <div class="text-sm text-gray-400">{{ config.target_site }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-green-400">${{ config.price.toFixed(2) }}</div>
              <div class="text-xs text-gray-400">{{ config.status }}</div>
            </div>
          </div>

          <!-- Config Details -->
          <div class="space-y-3 mb-4">
            <div class="bg-gray-700/50 p-3 rounded-lg">
              <div class="text-gray-400 text-xs mb-1">Description</div>
              <div class="text-white text-sm line-clamp-2">{{ config.description }}</div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-gray-700/50 p-3 rounded-lg">
                <div class="text-gray-400 text-xs mb-1">CPM Range</div>
                <div class="text-white text-sm">{{ config.cpm }}</div>
              </div>
              <div class="bg-gray-700/50 p-3 rounded-lg">
                <div class="text-gray-400 text-xs mb-1">Config Type</div>
                <div class="text-white text-sm">{{ formatConfigType(config.config_type) }}</div>
              </div>
            </div>
            <div v-if="config.capture_format && config.capture_format.length > 0" class="bg-gray-700/50 p-3 rounded-lg">
              <div class="text-gray-400 text-xs mb-1">Capture Format</div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="format in config.capture_format.slice(0, 3)"
                  :key="format"
                  class="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded"
                >
                  {{ format }}
                </span>
                <span v-if="config.capture_format.length > 3" class="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded">
                  +{{ config.capture_format.length - 3 }}
                </span>
              </div>
            </div>
          </div>

          <!-- Rating and Downloads -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4 text-sm text-gray-400">
              <div class="flex items-center gap-1">
                <span>⭐</span>
                <span>{{ config.rating || 0 }}</span>
              </div>
              <div class="flex items-center gap-1">
                <span>📥</span>
                <span>{{ config.downloads_count || 0 }}</span>
              </div>
              <div class="text-xs">{{ formatDate(config.created_at) }}</div>
            </div>
            <div :class="getStatusBadgeClass(config.status)" class="px-2 py-1 rounded text-xs font-medium">
              {{ config.status }}
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between">
            <button
              @click="viewConfig(config)"
              class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
            >
              Preview
            </button>
            <div class="flex items-center gap-2">
              <button
                @click="addToCart(config)"
                class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm"
              >
                Add to Cart
              </button>
              <button
                @click="buyNow(config)"
                class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <div class="flex items-center gap-2">
          <button 
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Previous
          </button>
          <span class="px-3 py-2 bg-red-500 text-white rounded-lg">{{ currentPage }} / {{ totalPages }}</span>
          <button 
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

// State
const checkerConfigs = ref([])
const loading = ref(true)
const searchTerm = ref('')
const configTypeFilter = ref('all')
const statusFilter = ref('all')
const sortBy = ref('newest')
const currentPage = ref(1)
const itemsPerPage = 12

const stats = reactive({
  totalConfigs: 0,
  activeConfigs: 0,
  configTypes: 0,
  totalDownloads: 0
})

// Computed
const filteredConfigs = computed(() => {
  let filtered = checkerConfigs.value

  // Search filter
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(config => 
      config.title?.toLowerCase().includes(search) ||
      config.target_site?.toLowerCase().includes(search) ||
      config.description?.toLowerCase().includes(search) ||
      config.config_type?.toLowerCase().includes(search)
    )
  }

  // Config type filter
  if (configTypeFilter.value !== 'all') {
    filtered = filtered.filter(config => config.config_type === configTypeFilter.value)
  }

  // Status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(config => config.status === statusFilter.value)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at)
      case 'oldest':
        return new Date(a.created_at) - new Date(b.created_at)
      case 'downloads':
        return (b.downloads_count || 0) - (a.downloads_count || 0)
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      case 'price_asc':
        return a.price - b.price
      case 'price_desc':
        return b.price - a.price
      default:
        return 0
    }
  })

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredConfigs.value.length / itemsPerPage)
})

// Methods
const loadCheckerFiles = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('checker_configs')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading checker files:', error)
      return
    }

    checkerConfigs.value = data || []
    updateStats()
  } catch (error) {
    console.error('Failed to load checker files:', error)
  } finally {
    loading.value = false
  }
}

const updateStats = () => {
  stats.totalConfigs = checkerConfigs.value.length
  stats.activeConfigs = checkerConfigs.value.filter(config => config.status === 'active').length
  stats.configTypes = new Set(checkerConfigs.value.map(config => config.config_type)).size
  stats.totalDownloads = checkerConfigs.value.reduce((sum, config) => sum + (config.downloads_count || 0), 0)
}

const getConfigTypeIcon = (configType) => {
  const icons = {
    'openbullet': '🚀',
    'openbullet2': '🚀',
    'silverbullet': '🔫',
    'bas': '🤖',
    'cookiebullet': '🍪',
    'python': '🐍',
    'javascript': '🟨'
  }
  return icons[configType] || '⚙️'
}

const formatConfigType = (configType) => {
  const types = {
    'openbullet': 'OpenBullet',
    'openbullet2': 'OpenBullet 2',
    'silverbullet': 'SilverBullet',
    'bas': 'BAS',
    'cookiebullet': 'CookieBullet',
    'python': 'Python',
    'javascript': 'JavaScript'
  }
  return types[configType] || configType
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'active': 'bg-green-500/20 text-green-400 border border-green-500/30',
    'inactive': 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
    'testing': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    'deprecated': 'bg-red-500/20 text-red-400 border border-red-500/30'
  }
  return classes[status] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
}

const viewConfig = (config) => {
  console.log('Viewing config:', config)
  // Implement config preview functionality
}

const addToCart = (config) => {
  console.log('Adding to cart:', config)
  // Implement cart functionality
}

const buyNow = (config) => {
  console.log('Buying now:', config)
  // Implement direct purchase
}

onMounted(() => {
  loadCheckerFiles()
})
</script>

<style scoped>
.font-mono {
  font-family: 'Courier New', monospace;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
