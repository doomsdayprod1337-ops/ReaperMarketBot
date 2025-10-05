<template>
  <div class="bot-management">
    <!-- Bot Control Panel -->
    <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-white font-semibold font-reaper">Bot Management</h3>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-green-400 text-sm">System Online</span>
        </div>
      </div>

      <!-- Bot Status Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gray-700/50 p-4 rounded-lg text-center">
          <div class="text-2xl mb-2">🤖</div>
          <div class="text-white font-bold text-lg">{{ botStats.active }}</div>
          <div class="text-gray-400 text-sm">Active Bots</div>
        </div>
        <div class="bg-gray-700/50 p-4 rounded-lg text-center">
          <div class="text-2xl mb-2">⚡</div>
          <div class="text-white font-bold text-lg">{{ botStats.newToday }}</div>
          <div class="text-gray-400 text-sm">New Today</div>
        </div>
        <div class="bg-gray-700/50 p-4 rounded-lg text-center">
          <div class="text-2xl mb-2">💰</div>
          <div class="text-white font-bold text-lg">${{ botStats.totalValue.toLocaleString() }}</div>
          <div class="text-gray-400 text-sm">Total Value</div>
        </div>
        <div class="bg-gray-700/50 p-4 rounded-lg text-center">
          <div class="text-2xl mb-2">🌍</div>
          <div class="text-white font-bold text-lg">{{ botStats.countries }}</div>
          <div class="text-gray-400 text-sm">Countries</div>
        </div>
      </div>

      <!-- Bot Controls -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          @click="startAllBots"
          :disabled="isLoading"
          class="p-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <div class="flex items-center justify-center gap-2">
            <span v-if="!isLoading">▶️</span>
            <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Start All
          </div>
        </button>
        <button
          @click="stopAllBots"
          :disabled="isLoading"
          class="p-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <div class="flex items-center justify-center gap-2">
            <span v-if="!isLoading">⏹️</span>
            <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Stop All
          </div>
        </button>
        <button
          @click="restartAllBots"
          :disabled="isLoading"
          class="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <div class="flex items-center justify-center gap-2">
            <span v-if="!isLoading">🔄</span>
            <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Restart All
          </div>
        </button>
        <button
          @click="updateAllBots"
          :disabled="isLoading"
          class="p-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <div class="flex items-center justify-center gap-2">
            <span v-if="!isLoading">📥</span>
            <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Update All
          </div>
        </button>
      </div>
    </div>

    <!-- Bot List -->
    <div class="space-y-4">
      <div
        v-for="bot in bots"
        :key="bot.id"
        class="bg-gray-800/80 border border-red-500/30 rounded-lg backdrop-blur-sm"
      >
        <div class="p-6">
          <!-- Bot Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <span class="text-red-400 text-xl">🤖</span>
              </div>
              <div>
                <h3 class="text-white font-semibold">{{ bot.bot_id }}</h3>
                <div class="flex items-center gap-2 text-sm text-gray-400">
                  <span>{{ bot.country }}</span>
                  <span>•</span>
                  <span>{{ bot.os }}</span>
                  <span>•</span>
                  <span>{{ bot.ip }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div
                :class="`w-3 h-3 rounded-full ${
                  bot.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`"
              ></div>
              <span class="text-sm text-gray-300">{{ bot.status }}</span>
            </div>
          </div>

          <!-- Bot Data Preview -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div class="bg-gray-700/50 p-3 rounded-lg">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-red-400">🔑</span>
                <span class="text-white font-medium">{{ bot.logins_count }}</span>
              </div>
              <div class="text-gray-400 text-xs">Login Credentials</div>
            </div>
            <div class="bg-gray-700/50 p-3 rounded-lg">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-red-400">🍪</span>
                <span class="text-white font-medium">{{ bot.cookies_count }}</span>
              </div>
              <div class="text-gray-400 text-xs">Cookies</div>
            </div>
            <div class="bg-gray-700/50 p-3 rounded-lg">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-red-400">💳</span>
                <span class="text-white font-medium">{{ bot.creditCardCount || 0 }}</span>
              </div>
              <div class="text-gray-400 text-xs">Credit Cards</div>
            </div>
            <div class="bg-gray-700/50 p-3 rounded-lg">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-red-400">₿</span>
                <span class="text-white font-medium">{{ bot.cryptoWalletCount || 0 }}</span>
              </div>
              <div class="text-gray-400 text-xs">Crypto Wallets</div>
            </div>
          </div>

          <!-- Bot Actions -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <button
                @click="toggleBotStatus(bot)"
                :class="`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  bot.status === 'active'
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`"
              >
                {{ bot.status === 'active' ? 'Stop' : 'Start' }}
              </button>
              <button
                @click="viewBotDetails(bot)"
                class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Details
              </button>
              <button
                @click="editBot(bot)"
                class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Edit
              </button>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="downloadBotData(bot)"
                class="p-2 hover:bg-gray-600 rounded-lg transition-colors text-gray-400"
                title="Download Data"
              >
                📥
              </button>
              <button
                @click="shareBot(bot)"
                class="p-2 hover:bg-gray-600 rounded-lg transition-colors text-gray-400"
                title="Share Bot"
              >
                📤
              </button>
              <button
                @click="deleteBot(bot)"
                class="p-2 hover:bg-gray-600 rounded-lg transition-colors text-red-400"
                title="Delete Bot"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bot Analytics Modal -->
    <div
      v-if="showAnalytics"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="showAnalytics = false"
    >
      <div
        class="bg-gray-800 border border-red-500/30 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        @click.stop
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-white font-semibold font-reaper">Bot Analytics</h3>
          <button
            @click="showAnalytics = false"
            class="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-700/50 p-4 rounded-lg">
            <div class="text-white font-medium mb-2">Performance Metrics</div>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-300">CPU Usage</span>
                <span class="text-white">{{ analytics.cpu }}%</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-300">Memory Usage</span>
                <span class="text-white">{{ analytics.memory }}%</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-300">Disk Usage</span>
                <span class="text-white">{{ analytics.disk }}%</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-300">Network</span>
                <span class="text-white">{{ analytics.network }}%</span>
              </div>
            </div>
          </div>
          <div class="bg-gray-700/50 p-4 rounded-lg">
            <div class="text-white font-medium mb-2">Bot Statistics</div>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-300">Uptime</span>
                <span class="text-white">{{ analytics.uptime }}%</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-300">Success Rate</span>
                <span class="text-white">{{ analytics.successRate }}%</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-300">Response Time</span>
                <span class="text-white">{{ analytics.responseTime }}s</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-300">Data Quality</span>
                <span class="text-white">{{ analytics.dataQuality }}%</span>
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
const isLoading = ref(false)
const showAnalytics = ref(false)
const bots = ref([])
const botStats = reactive({
  active: 1247,
  newToday: 89,
  totalValue: 124500,
  countries: 89
})

const analytics = reactive({
  cpu: 45,
  memory: 67,
  disk: 23,
  network: 89,
  uptime: 99.8,
  successRate: 94.2,
  responseTime: 1.2,
  dataQuality: 87.5
})

// Mock bot data
const mockBots = [
  {
    id: 1,
    bot_id: 'US4P34LPGC2PY0WJPA0OHMCU3ZMP75935',
    country: 'United States',
    os: 'Windows 11',
    ip: '192.168.1.100',
    status: 'active',
    logins_count: 47,
    cookies_count: 1234,
    creditCardCount: 3,
    cryptoWalletCount: 2,
    created_at: '2 hours ago'
  },
  {
    id: 2,
    bot_id: 'CA8K9L2MN3OP4QR5ST6UV7WX8YZ9AB0CD',
    country: 'Canada',
    os: 'Windows 10',
    ip: '10.0.0.50',
    status: 'inactive',
    logins_count: 23,
    cookies_count: 892,
    creditCardCount: 1,
    cryptoWalletCount: 0,
    created_at: '5 hours ago'
  },
  {
    id: 3,
    bot_id: 'DE8K9L2MN3OP4QR5ST6UV7WX8YZ9AB0CD',
    country: 'Germany',
    os: 'macOS Monterey',
    ip: '172.16.0.25',
    status: 'active',
    logins_count: 89,
    cookies_count: 2156,
    creditCardCount: 5,
    cryptoWalletCount: 3,
    created_at: '1 day ago'
  }
]

// Methods
const startAllBots = async () => {
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Starting all bots...')
    // Update bot statuses
    bots.value.forEach(bot => {
      bot.status = 'active'
    })
  } catch (error) {
    console.error('Error starting bots:', error)
  } finally {
    isLoading.value = false
  }
}

const stopAllBots = async () => {
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Stopping all bots...')
    // Update bot statuses
    bots.value.forEach(bot => {
      bot.status = 'inactive'
    })
  } catch (error) {
    console.error('Error stopping bots:', error)
  } finally {
    isLoading.value = false
  }
}

const restartAllBots = async () => {
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000))
    console.log('Restarting all bots...')
    // Update bot statuses
    bots.value.forEach(bot => {
      bot.status = 'active'
    })
  } catch (error) {
    console.error('Error restarting bots:', error)
  } finally {
    isLoading.value = false
  }
}

const updateAllBots = async () => {
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2500))
    console.log('Updating all bots...')
    // Refresh bot data
    await loadBots()
  } catch (error) {
    console.error('Error updating bots:', error)
  } finally {
    isLoading.value = false
  }
}

const toggleBotStatus = (bot) => {
  bot.status = bot.status === 'active' ? 'inactive' : 'active'
  console.log(`Bot ${bot.bot_id} status changed to ${bot.status}`)
}

const viewBotDetails = (bot) => {
  console.log('Viewing bot details:', bot)
  showAnalytics.value = true
}

const editBot = (bot) => {
  console.log('Editing bot:', bot)
  // Implement edit functionality
}

const downloadBotData = (bot) => {
  console.log('Downloading bot data:', bot)
  // Implement download functionality
}

const shareBot = (bot) => {
  console.log('Sharing bot:', bot)
  // Implement share functionality
}

const deleteBot = (bot) => {
  if (confirm(`Are you sure you want to delete bot ${bot.bot_id}?`)) {
    const index = bots.value.findIndex(b => b.id === bot.id)
    if (index > -1) {
      bots.value.splice(index, 1)
      console.log('Bot deleted:', bot.bot_id)
    }
  }
}

const loadBots = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    bots.value = [...mockBots]
  } catch (error) {
    console.error('Error loading bots:', error)
  }
}

onMounted(() => {
  loadBots()
})
</script>

<style scoped>
.font-reaper {
  font-family: 'Reaper', sans-serif;
}

.bg-reaper-dark-gray {
  background-color: #1a1a1a;
}

.text-reaper-red {
  color: #e53e3e;
}

.border-reaper-red\/30 {
  border-color: rgba(229, 62, 62, 0.3);
}
</style>
