<template>
  <div class="min-h-screen bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 font-mono">Inbox Requests</h1>
        <p class="text-gray-300 text-lg">Email domain search results and credentials</p>
      </div>

      <!-- Stats Overview -->
      <div class="grid gap-4 md:grid-cols-4 mb-8">
        <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-red-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.totalRequests }}</div>
              <div class="text-xs text-gray-300">Total Requests</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-green-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.totalDomains }}</div>
              <div class="text-xs text-gray-300">Domains</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.totalResults }}</div>
              <div class="text-xs text-gray-300">Total Results</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-purple-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.recentUploads }}</div>
              <div class="text-xs text-gray-300">Recent Uploads</div>
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
              placeholder="Search by domain, email, or keyword..."
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
            />
          </div>
          <select v-model="domainFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Domains</option>
            <option v-for="domain in uniqueDomains" :key="domain" :value="domain">{{ domain }}</option>
          </select>
          <select v-model="searchTypeFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Types</option>
            <option value="sender_email">Sender Email</option>
            <option value="email_title">Email Title</option>
            <option value="email_body">Email Body</option>
          </select>
          <select v-model="statusFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="purchased">Purchased</option>
            <option value="processing">Processing</option>
          </select>
          <button
            @click="loadInboxRequests"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <!-- Inbox Requests List -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p class="text-gray-400">Loading inbox requests...</p>
      </div>

      <div v-else-if="filteredRequests.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">📧</div>
        <h3 class="text-xl font-semibold text-white mb-2">No inbox requests found</h3>
        <p class="text-gray-400 mb-6">Try adjusting your search filters</p>
        <button
          @click="loadInboxRequests"
          class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Refresh Requests
        </button>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="request in filteredRequests"
          :key="request.id"
          class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm hover:border-red-500/50 transition-all duration-300"
        >
          <!-- Request Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                <span class="text-blue-400 text-xl">📧</span>
              </div>
              <div>
                <h3 class="text-white font-semibold text-lg">{{ request.domain }}</h3>
                <div class="flex items-center gap-2">
                  <span :class="getSearchTypeColor(request.search_type)" class="px-2 py-1 rounded text-xs font-medium border">
                    {{ getSearchTypeLabel(request.search_type) }}
                  </span>
                  <span :class="getStatusColor(request.status)" class="px-2 py-1 rounded text-xs font-medium border">
                    {{ request.status }}
                  </span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-green-400">${{ request.price.toFixed(2) }}</div>
              <div class="text-sm text-gray-400">{{ request.results_count }} results</div>
            </div>
          </div>

          <!-- Request Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="bg-gray-700/50 p-4 rounded-lg">
              <div class="text-gray-400 text-sm mb-2">Credentials</div>
              <div class="flex items-center gap-2">
                <span class="text-white font-mono text-sm bg-gray-800/50 px-2 py-1 rounded border flex-1">
                  {{ formatCredentials(request) }}
                </span>
                <button
                  v-if="request.status === 'purchased'"
                  @click="copyCredentials(request)"
                  class="px-2 py-1 bg-green-600/20 border border-green-500/50 text-green-400 hover:bg-green-600/30 rounded text-sm transition-colors"
                >
                  📋
                </button>
              </div>
            </div>
            <div class="bg-gray-700/50 p-4 rounded-lg">
              <div class="text-gray-400 text-sm mb-2">Search Details</div>
              <div class="text-white text-sm">
                <div>Keyword: <span class="text-gray-300">{{ request.keyword }}</span></div>
                <div>Search Type: <span class="text-gray-300">{{ getSearchTypeLabel(request.search_type) }}</span></div>
              </div>
            </div>
          </div>

          <!-- Email Subjects Preview -->
          <div v-if="request.subjects && request.subjects.length > 0" class="mb-4">
            <div class="text-gray-400 text-sm mb-2">Sample Email Subjects:</div>
            <div class="bg-gray-700/50 p-4 rounded-lg">
              <div class="space-y-1">
                <div
                  v-for="(subject, index) in request.subjects.slice(0, 3)"
                  :key="index"
                  class="text-white text-sm truncate"
                >
                  {{ subject }}
                </div>
                <div v-if="request.subjects.length > 3" class="text-gray-400 text-sm">
                  +{{ request.subjects.length - 3 }} more subjects
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4 text-sm text-gray-400">
              <span>Created: {{ formatDate(request.created_at) }}</span>
              <span v-if="request.updated_at !== request.created_at">Updated: {{ formatDate(request.updated_at) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="downloadResults(request)"
                class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors text-sm"
              >
                📥 Download
              </button>
              <button
                v-if="request.status === 'available'"
                @click="purchaseRequest(request)"
                class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
              >
                💳 Purchase ${{ request.price.toFixed(2) }}
              </button>
              <button
                v-else-if="request.status === 'processing'"
                disabled
                class="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm cursor-not-allowed"
              >
                ⏳ Processing...
              </button>
              <button
                v-else-if="request.status === 'purchased'"
                disabled
                class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm cursor-not-allowed"
              >
                ✅ Purchased
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
const inboxRequests = ref([])
const loading = ref(true)
const searchTerm = ref('')
const domainFilter = ref('all')
const searchTypeFilter = ref('all')
const statusFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = 10
const showPasswords = ref(false)

const stats = reactive({
  totalRequests: 0,
  totalDomains: 0,
  totalResults: 0,
  recentUploads: 0
})

// Computed
const uniqueDomains = computed(() => {
  return [...new Set(inboxRequests.value.map(request => request.domain))].sort()
})

const filteredRequests = computed(() => {
  let filtered = inboxRequests.value

  // Search filter
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(request => 
      request.domain?.toLowerCase().includes(search) ||
      request.email?.toLowerCase().includes(search) ||
      request.keyword?.toLowerCase().includes(search)
    )
  }

  // Domain filter
  if (domainFilter.value !== 'all') {
    filtered = filtered.filter(request => request.domain === domainFilter.value)
  }

  // Search type filter
  if (searchTypeFilter.value !== 'all') {
    filtered = filtered.filter(request => request.search_type === searchTypeFilter.value)
  }

  // Status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(request => request.status === statusFilter.value)
  }

  // Sort by creation date
  filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredRequests.value.length / itemsPerPage)
})

// Methods
const loadInboxRequests = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('inbox_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading inbox requests:', error)
      return
    }

    inboxRequests.value = data || []
    updateStats()
  } catch (error) {
    console.error('Failed to load inbox requests:', error)
  } finally {
    loading.value = false
  }
}

const updateStats = () => {
  stats.totalRequests = inboxRequests.value.length
  stats.totalDomains = uniqueDomains.value.length
  stats.totalResults = inboxRequests.value.reduce((sum, request) => sum + (request.results_count || 0), 0)
  stats.recentUploads = inboxRequests.value.filter(request => {
    const requestDate = new Date(request.created_at)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    return requestDate > oneDayAgo
  }).length
}

const getSearchTypeLabel = (type) => {
  const types = {
    'sender_email': 'Sender Email',
    'email_title': 'Email Title',
    'email_body': 'Email Body'
  }
  return types[type] || type
}

const getSearchTypeColor = (type) => {
  const colors = {
    'sender_email': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'email_title': 'bg-green-500/10 text-green-400 border-green-500/20',
    'email_body': 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  }
  return colors[type] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'
}

const getStatusColor = (status) => {
  const colors = {
    'available': 'bg-green-500/10 text-green-400 border-green-500/20',
    'purchased': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'processing': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
  }
  return colors[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'
}

const formatCredentials = (request) => {
  if (request.status === 'purchased') {
    return `${request.email}:${request.password}`
  }
  return `${request.email}:${formatPassword(request.password)}`
}

const formatPassword = (password) => {
  if (showPasswords.value) {
    return password
  }
  return '•'.repeat(Math.min(password.length, 12))
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const copyCredentials = async (request) => {
  if (request.status === 'purchased') {
    const credentials = `${request.email}:${request.password}`
    try {
      await navigator.clipboard.writeText(credentials)
      alert('✅ Credentials copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy credentials:', err)
      alert('❌ Failed to copy credentials')
    }
  }
}

const downloadResults = async (request) => {
  try {
    console.log('Downloading results for request:', request.id)
    // Implement download functionality
  } catch (error) {
    console.error('Failed to download results:', error)
  }
}

const purchaseRequest = async (request) => {
  try {
    console.log('Purchasing request:', request.id)
    // Implement purchase functionality
  } catch (error) {
    console.error('Failed to purchase request:', error)
  }
}

onMounted(() => {
  loadInboxRequests()
})
</script>

<style scoped>
.font-mono {
  font-family: 'Courier New', monospace;
}
</style>