<template>
  <div class="min-h-screen bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 font-mono">Credential Search</h1>
        <p class="text-gray-300 text-lg">Search and analyze compromised credentials</p>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Search Interface -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Search Form -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Search Credentials</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-white mb-2">Search Type</label>
                <select
                  v-model="searchType"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:ring-red-500/20"
                >
                  <option value="email">Email Address</option>
                  <option value="username">Username</option>
                  <option value="domain">Domain</option>
                  <option value="password">Password Hash</option>
                  <option value="phone">Phone Number</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-white mb-2">Search Query</label>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
                  :placeholder="getPlaceholder()"
                />
              </div>

              <div class="flex gap-2">
                <button
                  @click="searchCredentials"
                  :disabled="!searchQuery.trim() || isSearching"
                  class="px-6 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <span v-if="!isSearching">Search</span>
                  <span v-else class="flex items-center gap-2">
                    <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Searching...
                  </span>
                </button>
                <button
                  @click="clearSearch"
                  class="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          <!-- Search Results -->
          <div v-if="searchResults" class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Search Results</h3>
            <div class="space-y-4">
              <!-- Summary -->
              <div class="bg-gray-700/50 rounded-lg p-4">
                <h4 class="text-white font-medium mb-2">Search Summary</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span class="text-gray-400">Total Results:</span>
                    <span class="text-white ml-2 font-medium">{{ searchResults.total }}</span>
                  </div>
                  <div>
                    <span class="text-gray-400">Breaches Found:</span>
                    <span class="text-red-400 ml-2 font-medium">{{ searchResults.breaches }}</span>
                  </div>
                  <div>
                    <span class="text-gray-400">Risk Level:</span>
                    <span :class="getRiskColor(searchResults.riskLevel)" class="ml-2 font-medium">
                      {{ searchResults.riskLevel }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Credential List -->
              <div class="space-y-3">
                <div
                  v-for="credential in searchResults.credentials"
                  :key="credential.id"
                  class="bg-gray-700/50 rounded-lg p-4"
                >
                  <div class="flex items-center justify-between mb-2">
                    <div class="text-white font-medium">{{ credential.email || credential.username }}</div>
                    <div :class="getBreachColor(credential.breachType)" class="text-xs px-2 py-1 rounded">
                      {{ credential.breachType }}
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="text-gray-400">Source:</span>
                      <span class="text-white ml-2">{{ credential.source }}</span>
                    </div>
                    <div>
                      <span class="text-gray-400">Date:</span>
                      <span class="text-white ml-2">{{ credential.date }}</span>
                    </div>
                    <div>
                      <span class="text-gray-400">Password Hash:</span>
                      <span class="text-gray-300 ml-2 font-mono text-xs">{{ credential.passwordHash }}</span>
                    </div>
                    <div>
                      <span class="text-gray-400">Status:</span>
                      <span :class="getStatusColor(credential.status)" class="ml-2">
                        {{ credential.status }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2">
                <button
                  @click="exportResults"
                  class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Export Results
                </button>
                <button
                  @click="saveSearch"
                  class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  Save Search
                </button>
                <button
                  @click="generateReport"
                  class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Recent Searches -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Recent Searches</h3>
            <div class="space-y-2">
              <div
                v-for="search in recentSearches"
                :key="search.id"
                class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors cursor-pointer"
                @click="loadSearch(search)"
              >
                <div>
                  <div class="text-white text-sm font-medium">{{ search.query }}</div>
                  <div class="text-gray-400 text-xs">{{ search.type }} - {{ search.results }} results</div>
                </div>
                <div class="text-xs text-gray-400">{{ search.created_at }}</div>
              </div>
            </div>
          </div>

          <!-- Statistics -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Statistics</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">Searches Performed</span>
                <span class="text-white font-medium">{{ stats.searches }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">Credentials Found</span>
                <span class="text-red-400 font-medium">{{ stats.credentials }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">Breaches Detected</span>
                <span class="text-orange-400 font-medium">{{ stats.breaches }}</span>
              </div>
            </div>
          </div>

          <!-- Popular Breaches -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Popular Breaches</h3>
            <div class="space-y-2">
              <div
                v-for="breach in popularBreaches"
                :key="breach.name"
                class="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-600/50 transition-colors"
                @click="searchBreach(breach.name)"
              >
                <div>
                  <div class="text-white text-sm font-medium">{{ breach.name }}</div>
                  <div class="text-gray-400 text-xs">{{ breach.records }} records</div>
                </div>
                <div class="text-xs text-gray-400">{{ breach.year }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// State
const searchType = ref('email')
const searchQuery = ref('')
const isSearching = ref(false)
const searchResults = ref(null)

const recentSearches = ref([
  {
    id: 1,
    query: 'user@example.com',
    type: 'Email',
    results: 3,
    created_at: '2 hours ago'
  },
  {
    id: 2,
    query: 'johndoe',
    type: 'Username',
    results: 1,
    created_at: '1 day ago'
  },
  {
    id: 3,
    query: 'company.com',
    type: 'Domain',
    results: 15,
    created_at: '3 days ago'
  }
])

const popularBreaches = ref([
  { name: 'LinkedIn', records: '164M', year: '2021' },
  { name: 'Facebook', records: '533M', year: '2021' },
  { name: 'Twitter', records: '5.4M', year: '2022' },
  { name: 'Adobe', records: '153M', year: '2019' },
  { name: 'Yahoo', records: '3B', year: '2017' }
])

const stats = reactive({
  searches: 23,
  credentials: 47,
  breaches: 12
})

// Computed
const getPlaceholder = () => {
  const placeholders = {
    email: 'user@example.com',
    username: 'username',
    domain: 'example.com',
    password: 'password_hash',
    phone: '+1234567890'
  }
  return placeholders[searchType.value]
}

// Methods
const searchCredentials = async () => {
  if (!searchQuery.value.trim()) return
  
  isSearching.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock search results
    const mockCredentials = generateMockCredentials()
    searchResults.value = {
      total: mockCredentials.length,
      breaches: Math.floor(Math.random() * 5) + 1,
      riskLevel: getRandomRiskLevel(),
      credentials: mockCredentials
    }
    
    // Update stats
    stats.searches++
    stats.credentials += mockCredentials.length
    stats.breaches += searchResults.value.breaches
    
  } catch (error) {
    console.error('Search error:', error)
    alert('Search failed. Please try again.')
  } finally {
    isSearching.value = false
  }
}

const generateMockCredentials = () => {
  const count = Math.floor(Math.random() * 5) + 1
  const credentials = []
  
  for (let i = 0; i < count; i++) {
    credentials.push({
      id: Date.now() + i,
      email: searchType.value === 'email' ? searchQuery.value : `user${i}@example.com`,
      username: searchType.value === 'username' ? searchQuery.value : `user${i}`,
      source: getRandomSource(),
      date: getRandomDate(),
      passwordHash: generatePasswordHash(),
      breachType: getRandomBreachType(),
      status: getRandomStatus()
    })
  }
  
  return credentials
}

const getRandomSource = () => {
  const sources = ['LinkedIn', 'Facebook', 'Twitter', 'Adobe', 'Yahoo', 'Dropbox']
  return sources[Math.floor(Math.random() * sources.length)]
}

const getRandomDate = () => {
  const dates = ['2021-06-15', '2020-03-22', '2019-11-08', '2022-01-14', '2021-09-30']
  return dates[Math.floor(Math.random() * dates.length)]
}

const generatePasswordHash = () => {
  const chars = 'abcdef0123456789'
  let hash = ''
  for (let i = 0; i < 32; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return hash
}

const getRandomBreachType = () => {
  const types = ['Data Breach', 'Password Leak', 'Credential Stuffing', 'Phishing']
  return types[Math.floor(Math.random() * types.length)]
}

const getRandomStatus = () => {
  const statuses = ['Active', 'Compromised', 'Expired', 'Unknown']
  return statuses[Math.floor(Math.random() * statuses.length)]
}

const getRandomRiskLevel = () => {
  const levels = ['Low', 'Medium', 'High', 'Critical']
  return levels[Math.floor(Math.random() * levels.length)]
}

const getRiskColor = (level) => {
  const colors = {
    'Low': 'text-green-400',
    'Medium': 'text-yellow-400',
    'High': 'text-orange-400',
    'Critical': 'text-red-400'
  }
  return colors[level] || 'text-gray-400'
}

const getBreachColor = (type) => {
  const colors = {
    'Data Breach': 'bg-red-500/20 text-red-400',
    'Password Leak': 'bg-orange-500/20 text-orange-400',
    'Credential Stuffing': 'bg-yellow-500/20 text-yellow-400',
    'Phishing': 'bg-purple-500/20 text-purple-400'
  }
  return colors[type] || 'bg-gray-500/20 text-gray-400'
}

const getStatusColor = (status) => {
  const colors = {
    'Active': 'text-green-400',
    'Compromised': 'text-red-400',
    'Expired': 'text-gray-400',
    'Unknown': 'text-yellow-400'
  }
  return colors[status] || 'text-gray-400'
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = null
}

const loadSearch = (search) => {
  searchQuery.value = search.query
  searchType.value = search.type.toLowerCase()
  searchCredentials()
}

const searchBreach = (breachName) => {
  searchQuery.value = breachName
  searchType.value = 'domain'
  searchCredentials()
}

const exportResults = () => {
  if (!searchResults.value) return
  
  const data = JSON.stringify(searchResults.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `credential_search_${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const saveSearch = () => {
  if (!searchResults.value) return
  
  const savedSearches = JSON.parse(localStorage.getItem('saved_searches') || '[]')
  savedSearches.push({
    id: Date.now(),
    query: searchQuery.value,
    type: searchType.value,
    results: searchResults.value,
    created_at: new Date().toISOString()
  })
  localStorage.setItem('saved_searches', JSON.stringify(savedSearches))
  
  alert('Search saved successfully!')
}

const generateReport = () => {
  if (!searchResults.value) return
  
  console.log('Generating report...')
  // Implement report generation
  alert('Report generation feature coming soon!')
}

onMounted(() => {
  // Load saved searches
  const savedSearches = JSON.parse(localStorage.getItem('saved_searches') || '[]')
  if (savedSearches.length > 0) {
    recentSearches.value = savedSearches.slice(-5).map(search => ({
      id: search.id,
      query: search.query,
      type: search.type,
      results: search.results.total,
      created_at: new Date(search.created_at).toLocaleDateString()
    }))
  }
})
</script>

<style scoped>
.font-reaper {
  font-family: 'Reaper', sans-serif;
}

.font-mono {
  font-family: 'Courier New', monospace;
}
</style>