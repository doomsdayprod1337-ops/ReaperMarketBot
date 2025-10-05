<template>
  <div class="min-h-screen bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 font-mono">BIN Checker</h1>
        <p class="text-gray-300 text-lg">Validate and analyze Bank Identification Numbers</p>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- BIN Checker Interface -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Input Section -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">BIN Input</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-white mb-2">BIN Number</label>
                <input
                  v-model="binInput"
                  type="text"
                  maxlength="8"
                  class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20 text-center text-2xl font-mono"
                  placeholder="123456"
                />
                <div class="text-xs text-gray-400 mt-1">Enter 6-8 digit BIN number</div>
              </div>

              <div class="flex gap-2">
                <button
                  @click="checkBin"
                  :disabled="!binInput.trim() || isChecking"
                  class="px-6 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <span v-if="!isChecking">Check BIN</span>
                  <span v-else class="flex items-center gap-2">
                    <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Checking...
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

          <!-- BIN Results -->
          <div v-if="binResults" class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">BIN Information</h3>
            <div class="space-y-4">
              <!-- Card Info -->
              <div class="bg-gray-700/50 rounded-lg p-4">
                <h4 class="text-white font-medium mb-3">Card Information</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-gray-400">BIN:</span>
                    <span class="text-white ml-2 font-mono">{{ binResults.bin }}</span>
                  </div>
                  <div>
                    <span class="text-gray-400">Brand:</span>
                    <span class="text-white ml-2">{{ binResults.brand }}</span>
                  </div>
                  <div>
                    <span class="text-gray-400">Type:</span>
                    <span class="text-white ml-2">{{ binResults.type }}</span>
                  </div>
                  <div>
                    <span class="text-gray-400">Level:</span>
                    <span class="text-white ml-2">{{ binResults.level }}</span>
                  </div>
                  <div>
                    <span class="text-gray-400">Country:</span>
                    <span class="text-white ml-2">{{ binResults.country }}</span>
                  </div>
                  <div>
                    <span class="text-gray-400">Bank:</span>
                    <span class="text-white ml-2">{{ binResults.bank }}</span>
                  </div>
                </div>
              </div>

              <!-- Validation Results -->
              <div class="bg-gray-700/50 rounded-lg p-4">
                <h4 class="text-white font-medium mb-3">Validation Results</h4>
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-gray-400 text-sm">BIN Valid:</span>
                    <span :class="binResults.valid ? 'text-green-400' : 'text-red-400'" class="text-sm font-medium">
                      {{ binResults.valid ? 'Yes' : 'No' }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-gray-400 text-sm">Luhn Check:</span>
                    <span :class="binResults.luhnValid ? 'text-green-400' : 'text-red-400'" class="text-sm font-medium">
                      {{ binResults.luhnValid ? 'Pass' : 'Fail' }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-gray-400 text-sm">Prepaid:</span>
                    <span :class="binResults.prepaid ? 'text-yellow-400' : 'text-gray-400'" class="text-sm font-medium">
                      {{ binResults.prepaid ? 'Yes' : 'No' }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-gray-400 text-sm">Commercial:</span>
                    <span :class="binResults.commercial ? 'text-blue-400' : 'text-gray-400'" class="text-sm font-medium">
                      {{ binResults.commercial ? 'Yes' : 'No' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2">
                <button
                  @click="copyResults"
                  class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Copy Results
                </button>
                <button
                  @click="saveBin"
                  class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  Save BIN
                </button>
                <button
                  @click="generateCard"
                  class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                >
                  Generate Card
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Recent BINs -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Recent BINs</h3>
            <div class="space-y-2">
              <div
                v-for="bin in recentBins"
                :key="bin.id"
                class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors cursor-pointer"
                @click="loadBin(bin)"
              >
                <div>
                  <div class="text-white text-sm font-medium font-mono">{{ bin.bin }}</div>
                  <div class="text-gray-400 text-xs">{{ bin.brand }} - {{ bin.country }}</div>
                </div>
                <div class="text-xs text-gray-400">{{ bin.created_at }}</div>
              </div>
            </div>
          </div>

          <!-- Statistics -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Statistics</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">BINs Checked</span>
                <span class="text-white font-medium">{{ stats.checked }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">Valid BINs</span>
                <span class="text-green-400 font-medium">{{ stats.valid }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">Success Rate</span>
                <span class="text-blue-400 font-medium">{{ stats.successRate }}%</span>
              </div>
            </div>
          </div>

          <!-- Popular BINs -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Popular BINs</h3>
            <div class="space-y-2">
              <div
                v-for="bin in popularBins"
                :key="bin.bin"
                class="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-600/50 transition-colors"
                @click="checkPopularBin(bin.bin)"
              >
                <div>
                  <div class="text-white text-sm font-mono">{{ bin.bin }}</div>
                  <div class="text-gray-400 text-xs">{{ bin.brand }}</div>
                </div>
                <div class="text-xs text-gray-400">{{ bin.country }}</div>
              </div>
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
const binInput = ref('')
const isChecking = ref(false)
const binResults = ref(null)

const recentBins = ref([
  {
    id: 1,
    bin: '411111',
    brand: 'Visa',
    country: 'United States',
    created_at: '2 hours ago'
  },
  {
    id: 2,
    bin: '555555',
    brand: 'Mastercard',
    country: 'United States',
    created_at: '1 day ago'
  },
  {
    id: 3,
    bin: '378282',
    brand: 'American Express',
    country: 'United States',
    created_at: '3 days ago'
  }
])

const popularBins = ref([
  { bin: '411111', brand: 'Visa', country: 'US' },
  { bin: '555555', brand: 'Mastercard', country: 'US' },
  { bin: '378282', brand: 'American Express', country: 'US' },
  { bin: '601111', brand: 'Discover', country: 'US' },
  { bin: '400000', brand: 'Visa', country: 'US' }
])

const stats = reactive({
  checked: 47,
  valid: 32,
  successRate: 68
})

// Methods
const checkBin = async () => {
  if (!binInput.value.trim()) return
  
  isChecking.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock BIN results
    const bin = binInput.value.trim()
    binResults.value = {
      bin: bin,
      brand: getRandomBrand(),
      type: getRandomType(),
      level: getRandomLevel(),
      country: getRandomCountry(),
      bank: getRandomBank(),
      valid: Math.random() > 0.2,
      luhnValid: Math.random() > 0.1,
      prepaid: Math.random() > 0.7,
      commercial: Math.random() > 0.8
    }
    
    // Update stats
    stats.checked++
    if (binResults.value.valid) {
      stats.valid++
    }
    stats.successRate = Math.round((stats.valid / stats.checked) * 100)
    
  } catch (error) {
    console.error('BIN check error:', error)
    alert('Failed to check BIN. Please try again.')
  } finally {
    isChecking.value = false
  }
}

const getRandomBrand = () => {
  const brands = ['Visa', 'Mastercard', 'American Express', 'Discover', 'JCB', 'Diners Club']
  return brands[Math.floor(Math.random() * brands.length)]
}

const getRandomType = () => {
  const types = ['Credit', 'Debit', 'Prepaid', 'Gift']
  return types[Math.floor(Math.random() * types.length)]
}

const getRandomLevel = () => {
  const levels = ['Classic', 'Gold', 'Platinum', 'Black', 'Signature']
  return levels[Math.floor(Math.random() * levels.length)]
}

const getRandomCountry = () => {
  const countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Japan']
  return countries[Math.floor(Math.random() * countries.length)]
}

const getRandomBank = () => {
  const banks = ['Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'Capital One', 'HSBC']
  return banks[Math.floor(Math.random() * banks.length)]
}

const clearInput = () => {
  binInput.value = ''
  binResults.value = null
}

const loadBin = (bin) => {
  binInput.value = bin.bin
  checkBin()
}

const checkPopularBin = (bin) => {
  binInput.value = bin
  checkBin()
}

const copyResults = () => {
  if (!binResults.value) return
  
  const resultsText = JSON.stringify(binResults.value, null, 2)
  navigator.clipboard.writeText(resultsText).then(() => {
    alert('Results copied to clipboard!')
  })
}

const saveBin = () => {
  if (!binResults.value) return
  
  const savedBins = JSON.parse(localStorage.getItem('saved_bins') || '[]')
  savedBins.push({
    id: Date.now(),
    ...binResults.value,
    created_at: new Date().toISOString()
  })
  localStorage.setItem('saved_bins', JSON.stringify(savedBins))
  
  alert('BIN saved successfully!')
}

const generateCard = () => {
  if (!binResults.value) return
  
  console.log('Generating card for BIN:', binResults.value.bin)
  // Implement card generation
  alert('Card generation feature coming soon!')
}

onMounted(() => {
  // Load saved BINs
  const savedBins = JSON.parse(localStorage.getItem('saved_bins') || '[]')
  if (savedBins.length > 0) {
    recentBins.value = savedBins.slice(-5).map(bin => ({
      id: bin.id,
      bin: bin.bin,
      brand: bin.brand,
      country: bin.country,
      created_at: new Date(bin.created_at).toLocaleDateString()
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