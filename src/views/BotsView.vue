<template>
  <div class="min-h-screen bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 font-mono">Bot Marketplace</h1>
        <p class="text-gray-300 text-lg">Premium stealer logs and compromised systems</p>
      </div>

      <!-- Enhanced Stats Overview -->
      <div class="grid gap-4 md:grid-cols-4 mb-8">
        <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">1,247</div>
              <div class="text-xs text-gray-300">Active Bots</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-green-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">$89.99</div>
              <div class="text-xs text-gray-300">Average Price</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">89</div>
              <div class="text-xs text-gray-300">Countries</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-purple-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">12</div>
              <div class="text-xs text-gray-300">Categories</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Live Bot Monitoring -->
      <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm mb-8">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-white font-semibold font-reaper">Live Bot Monitoring</h3>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-green-400 text-sm">Live</span>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-reaper-medium-gray/30 p-4 rounded-lg text-center">
            <div class="text-2xl mb-2">🤖</div>
            <div class="text-white font-bold text-lg">1,247</div>
            <div class="text-gray-400 text-sm">Active Bots</div>
          </div>
          <div class="bg-reaper-medium-gray/30 p-4 rounded-lg text-center">
            <div class="text-2xl mb-2">⚡</div>
            <div class="text-white font-bold text-lg">89</div>
            <div class="text-gray-400 text-sm">New Today</div>
          </div>
          <div class="bg-reaper-medium-gray/30 p-4 rounded-lg text-center">
            <div class="text-2xl mb-2">💰</div>
            <div class="text-white font-bold text-lg">$2.4M</div>
            <div class="text-gray-400 text-sm">Total Value</div>
          </div>
          <div class="bg-reaper-medium-gray/30 p-4 rounded-lg text-center">
            <div class="text-2xl mb-2">🌍</div>
            <div class="text-white font-bold text-lg">89</div>
            <div class="text-gray-400 text-sm">Countries</div>
          </div>
        </div>
      </div>

      <!-- Advanced Search and Filters -->
      <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm mb-8">
        <div class="flex flex-wrap gap-4">
          <div class="relative flex-1 min-w-[200px]">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Search bots by ID, country, OS..."
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
            />
          </div>
          <select v-model="systemFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Systems</option>
            <option value="windows">Windows</option>
            <option value="macos">macOS</option>
            <option value="linux">Linux</option>
            <option value="android">Android</option>
            <option value="ios">iOS</option>
          </select>
          <select v-model="countryFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Countries</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="AU">Australia</option>
          </select>
          <select v-model="priceSort" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="none">Sort by Price</option>
            <option value="low">Low to High</option>
            <option value="high">High to Low</option>
          </select>
          <button
            @click="showAdvancedFilters = !showAdvancedFilters"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Advanced Filters
          </button>
        </div>

        <!-- Advanced Filters Panel -->
        <div v-if="showAdvancedFilters" class="mt-6 p-4 bg-gray-700/50 rounded-lg">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-white mb-2">Bot Age</label>
              <select class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white">
                <option value="all">Any Age</option>
                <option value="new">New (0-7 days)</option>
                <option value="recent">Recent (1-30 days)</option>
                <option value="old">Older (30+ days)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-white mb-2">Data Quality</label>
              <select class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white">
                <option value="all">Any Quality</option>
                <option value="premium">Premium (90%+)</option>
                <option value="high">High (70-90%)</option>
                <option value="medium">Medium (50-70%)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-white mb-2">Price Range</label>
              <div class="flex gap-2">
                <input type="number" placeholder="Min" class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white" />
                <input type="number" placeholder="Max" class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white" />
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors">
              Clear
            </button>
            <button class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Bot Categories -->
      <div class="mb-8">
        <h3 class="text-xl font-semibold text-white mb-4">Bot Categories</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div
            v-for="category in botCategories"
            :key="category.id"
            class="bg-gray-800/80 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm hover:bg-gray-700/80 transition-colors cursor-pointer text-center"
          >
            <div class="text-2xl mb-2">{{ category.icon }}</div>
            <div class="text-white font-medium text-sm">{{ category.name }}</div>
            <div class="text-gray-400 text-xs">{{ category.count }} bots</div>
          </div>
        </div>
      </div>

      <!-- Bot Management Component -->
      <BotManagement />

      <!-- Enhanced Bot Grid -->
      <div class="space-y-4">
        <div
          v-for="bot in filteredBots"
          :key="bot.id"
          class="bg-gray-800/80 border border-red-500/30 rounded-lg overflow-hidden backdrop-blur-sm hover:bg-gray-700/80 transition-colors"
        >
          <!-- Bot Header -->
          <div class="p-6">
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
              <div class="text-right">
                <div class="text-2xl font-bold text-red-500">${{ bot.price }}</div>
                <div class="text-sm text-gray-400">{{ bot.created_at }}</div>
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
                  @click="viewBotDetails(bot)"
                  class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  View Details
                </button>
                <button
                  @click="addToCart(bot.id)"
                  class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  @click="purchaseBot(bot.id)"
                  class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Buy Now
                </button>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="toggleFavorite(bot.id)"
                  class="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                  :class="favorites.has(bot.id) ? 'text-red-400' : 'text-gray-400'"
                >
                  ❤️
                </button>
                <button
                  @click="shareBot(bot)"
                  class="p-2 hover:bg-gray-600 rounded-lg transition-colors text-gray-400"
                >
                  📤
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-8">
        <div class="flex items-center gap-2">
          <button class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
            Previous
          </button>
          <button class="px-3 py-2 bg-red-500 text-white rounded-lg">1</button>
          <button class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">2</button>
          <button class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">3</button>
          <button class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import BotManagement from '@/components/BotManagement.vue'
import { useCartStore } from '@/stores/cart'

// Cart store
const cartStore = useCartStore()

// State
const searchTerm = ref('')
const systemFilter = ref('all')
const countryFilter = ref('all')
const priceSort = ref('none')
const showAdvancedFilters = ref(false)
const favorites = ref(new Set())

// Bot categories
const botCategories = ref([
  { id: 1, name: 'Windows', icon: '🪟', count: 856 },
  { id: 2, name: 'macOS', icon: '🍎', count: 234 },
  { id: 3, name: 'Linux', icon: '🐧', count: 89 },
  { id: 4, name: 'Android', icon: '📱', count: 45 },
  { id: 5, name: 'iOS', icon: '📱', count: 23 },
  { id: 6, name: 'Gaming', icon: '🎮', count: 156 }
])

// Mock bot data
const bots = ref([
  {
    id: 1,
    bot_id: 'US4P34LPGC2PY0WJPA0OHMCU3ZMP75935',
    country: 'United States',
    country_code: 'US',
    ip: '192.168.1.100',
    os: 'Windows 11',
    price: 89.99,
    logins_count: 47,
    cookies_count: 1234,
    creditCardCount: 3,
    cryptoWalletCount: 2,
    created_at: '2 hours ago',
    status: 'active'
  },
  {
    id: 2,
    bot_id: 'US4RI1BRG3Z2EYRHR43RBXTTKUI0OEOOI',
    country: 'Canada',
    country_code: 'CA',
    ip: '10.0.0.50',
    os: 'Windows 10',
    price: 124.99,
    logins_count: 23,
    cookies_count: 892,
    creditCardCount: 1,
    cryptoWalletCount: 0,
    created_at: '5 hours ago',
    status: 'active'
  },
  {
    id: 3,
    bot_id: 'DE8K9L2MN3OP4QR5ST6UV7WX8YZ9AB0CD',
    country: 'Germany',
    country_code: 'DE',
    ip: '172.16.0.25',
    os: 'macOS Monterey',
    price: 199.99,
    logins_count: 89,
    cookies_count: 2156,
    creditCardCount: 5,
    cryptoWalletCount: 3,
    created_at: '1 day ago',
    status: 'active'
  }
])

// Computed
const filteredBots = computed(() => {
  let filtered = bots.value

  if (searchTerm.value) {
    filtered = filtered.filter(bot => 
      bot.bot_id.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      bot.country.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      bot.os.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  if (systemFilter.value !== 'all') {
    filtered = filtered.filter(bot => 
      bot.os.toLowerCase().includes(systemFilter.value.toLowerCase())
    )
  }

  if (countryFilter.value !== 'all') {
    filtered = filtered.filter(bot => 
      bot.country_code === countryFilter.value
    )
  }

  if (priceSort.value === 'low') {
    filtered = filtered.sort((a, b) => a.price - b.price)
  } else if (priceSort.value === 'high') {
    filtered = filtered.sort((a, b) => b.price - a.price)
  }

  return filtered
})

// Methods
const viewBotDetails = (bot) => {
  console.log('Viewing bot details:', bot)
  // Implement bot details modal
}

const addToCart = (botId) => {
  const bot = bots.value.find(b => b.id === botId)
  if (bot) {
    cartStore.addToCart(bot)
  }
}

const purchaseBot = (botId) => {
  const bot = bots.value.find(b => b.id === botId)
  if (bot) {
    cartStore.addToCart(bot)
    cartStore.proceedToCheckout()
  }
}

const toggleFavorite = (botId) => {
  if (favorites.value.has(botId)) {
    favorites.value.delete(botId)
  } else {
    favorites.value.add(botId)
  }
}

const shareBot = (bot) => {
  console.log('Sharing bot:', bot)
  // Implement share functionality
}
</script>

<style scoped>
.font-reaper {
  font-family: 'Reaper', sans-serif;
}

.bg-reaper-dark-gray {
  background-color: #1a1a1a;
}

.bg-reaper-medium-gray {
  background-color: #2a2a2a;
}

.text-reaper-red {
  color: #e53e3e;
}

.border-reaper-red\/30 {
  border-color: rgba(229, 62, 62, 0.3);
}

.hover\:bg-reaper-red\/10:hover {
  background-color: rgba(229, 62, 62, 0.1);
}
</style>