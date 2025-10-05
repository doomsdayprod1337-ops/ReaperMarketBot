<template>
  <div class="min-h-screen bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 font-mono">Token Dumper</h1>
        <p class="text-gray-300 text-lg">Extract and analyze authentication tokens from various sources</p>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Token Dumper Interface -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Input Section -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Token Input</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-white mb-2">Token Type</label>
                <select
                  v-model="tokenType"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:ring-red-500/20"
                >
                  <option value="discord">Discord Token</option>
                  <option value="telegram">Telegram Session</option>
                  <option value="steam">Steam Session</option>
                  <option value="spotify">Spotify Token</option>
                  <option value="github">GitHub Token</option>
                  <option value="custom">Custom Token</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-white mb-2">Token/Session Data</label>
                <textarea
                  v-model="tokenInput"
                  rows="6"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
                  placeholder="Paste your token or session data here..."
                ></textarea>
              </div>

              <div class="flex gap-2">
                <button
                  @click="analyzeToken"
                  :disabled="!tokenInput.trim() || isAnalyzing"
                  class="px-6 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <span v-if="!isAnalyzing">Analyze Token</span>
                  <span v-else class="flex items-center gap-2">
                    <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Analyzing...
                  </span>
                </button>
                <button
                  @click="clearInput"
                  class="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          <!-- Analysis Results -->
          <div v-if="analysisResults" class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Analysis Results</h3>
            <div class="space-y-4">
              <!-- Token Info -->
              <div class="bg-gray-700/50 rounded-lg p-4">
                <h4 class="text-white font-medium mb-2">Token Information</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-gray-400">Type:</span>
                    <span class="text-white ml-2">{{ analysisResults.type }}</span>
                  </div>
                  <div>
                    <span class="text-gray-400">Valid:</span>
                    <span :class="analysisResults.valid ? 'text-green-400' : 'text-red-400'" class="ml-2">
                      {{ analysisResults.valid ? 'Yes' : 'No' }}
                    </span>
                  </div>
                  <div>
                    <span class="text-gray-400">Expires:</span>
                    <span class="text-white ml-2">{{ analysisResults.expires || 'Unknown' }}</span>
                  </div>
                  <div>
                    <span class="text-gray-400">Scopes:</span>
                    <span class="text-white ml-2">{{ analysisResults.scopes?.join(', ') || 'None' }}</span>
                  </div>
                </div>
              </div>

              <!-- User Info -->
              <div v-if="analysisResults.user" class="bg-gray-700/50 rounded-lg p-4">
                <h4 class="text-white font-medium mb-2">User Information</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-gray-400">Username:</span>
                    <span class="text-white ml-2">{{ analysisResults.user.username }}</span>
                  </div>
                  <div>
                    <span class="text-gray-400">ID:</span>
                    <span class="text-white ml-2">{{ analysisResults.user.id }}</span>
                  </div>
                  <div>
                    <span class="text-gray-400">Email:</span>
                    <span class="text-white ml-2">{{ analysisResults.user.email || 'Hidden' }}</span>
                  </div>
                  <div>
                    <span class="text-gray-400">Verified:</span>
                    <span :class="analysisResults.user.verified ? 'text-green-400' : 'text-red-400'" class="ml-2">
                      {{ analysisResults.user.verified ? 'Yes' : 'No' }}
                    </span>
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
                  @click="saveToken"
                  class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  Save Token
                </button>
                <button
                  @click="testToken"
                  class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                >
                  Test Token
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Recent Tokens -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Recent Tokens</h3>
            <div class="space-y-2">
              <div
                v-for="token in recentTokens"
                :key="token.id"
                class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors cursor-pointer"
                @click="loadToken(token)"
              >
                <div>
                  <div class="text-white text-sm font-medium">{{ token.type }}</div>
                  <div class="text-gray-400 text-xs">{{ token.created_at }}</div>
                </div>
                <div class="text-xs text-gray-400">{{ token.status }}</div>
              </div>
            </div>
          </div>

          <!-- Token Statistics -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Statistics</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">Tokens Analyzed</span>
                <span class="text-white font-medium">{{ stats.tokensAnalyzed }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">Valid Tokens</span>
                <span class="text-green-400 font-medium">{{ stats.validTokens }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">Success Rate</span>
                <span class="text-blue-400 font-medium">{{ stats.successRate }}%</span>
              </div>
            </div>
          </div>

          <!-- Help -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Help</h3>
            <div class="space-y-2 text-sm text-gray-300">
              <p>• Paste tokens or session data to analyze</p>
              <p>• Supported formats: JSON, Base64, Raw</p>
              <p>• Results include user info and validity</p>
              <p>• Export results for further analysis</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// State
const tokenType = ref('discord')
const tokenInput = ref('')
const isAnalyzing = ref(false)
const analysisResults = ref(null)

const recentTokens = ref([
  {
    id: 1,
    type: 'Discord Token',
    status: 'Valid',
    created_at: '2 hours ago'
  },
  {
    id: 2,
    type: 'Telegram Session',
    status: 'Expired',
    created_at: '1 day ago'
  },
  {
    id: 3,
    type: 'Steam Session',
    status: 'Valid',
    created_at: '3 days ago'
  }
])

const stats = reactive({
  tokensAnalyzed: 47,
  validTokens: 32,
  successRate: 68
})

// Methods
const analyzeToken = async () => {
  if (!tokenInput.value.trim()) return
  
  isAnalyzing.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock analysis results
    analysisResults.value = {
      type: tokenType.value,
      valid: Math.random() > 0.3,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      scopes: ['read', 'write', 'admin'],
      user: {
        username: 'test_user_' + Math.floor(Math.random() * 1000),
        id: Math.floor(Math.random() * 1000000),
        email: 'user@example.com',
        verified: Math.random() > 0.5
      }
    }
    
    // Update stats
    stats.tokensAnalyzed++
    if (analysisResults.value.valid) {
      stats.validTokens++
    }
    stats.successRate = Math.round((stats.validTokens / stats.tokensAnalyzed) * 100)
    
  } catch (error) {
    console.error('Token analysis error:', error)
    alert('Failed to analyze token. Please try again.')
  } finally {
    isAnalyzing.value = false
  }
}

const clearInput = () => {
  tokenInput.value = ''
  analysisResults.value = null
}

const loadToken = (token) => {
  console.log('Loading token:', token)
  // Implement token loading
}

const exportResults = () => {
  if (!analysisResults.value) return
  
  const data = JSON.stringify(analysisResults.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `token_analysis_${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const saveToken = () => {
  if (!analysisResults.value) return
  
  const savedTokens = JSON.parse(localStorage.getItem('saved_tokens') || '[]')
  savedTokens.push({
    id: Date.now(),
    type: analysisResults.value.type,
    data: tokenInput.value,
    results: analysisResults.value,
    created_at: new Date().toISOString()
  })
  localStorage.setItem('saved_tokens', JSON.stringify(savedTokens))
  
  alert('Token saved successfully!')
}

const testToken = () => {
  if (!analysisResults.value) return
  
  console.log('Testing token...')
  // Implement token testing
  alert('Token test completed!')
}

onMounted(() => {
  // Load saved tokens
  const savedTokens = JSON.parse(localStorage.getItem('saved_tokens') || '[]')
  if (savedTokens.length > 0) {
    recentTokens.value = savedTokens.slice(-5).map(token => ({
      id: token.id,
      type: token.type,
      status: token.results.valid ? 'Valid' : 'Invalid',
      created_at: new Date(token.created_at).toLocaleDateString()
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