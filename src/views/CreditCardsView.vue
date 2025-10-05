<template>
  <div class="min-h-screen bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 font-mono">Credit Cards</h1>
        <p class="text-gray-300 text-lg">Browse and purchase premium credit card data</p>
      </div>

      <!-- Stats Overview -->
      <div class="grid gap-4 md:grid-cols-4 mb-8">
        <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-red-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.totalCards }}</div>
              <div class="text-xs text-gray-300">Total Cards</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-green-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.availableCards }}</div>
              <div class="text-xs text-gray-300">Available</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.cardTypes }}</div>
              <div class="text-xs text-gray-300">Card Types</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-purple-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">${{ stats.totalValue.toFixed(2) }}</div>
              <div class="text-xs text-gray-300">Total Value</div>
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
              placeholder="Search by BIN, card type, or country..."
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
            />
          </div>
          <select v-model="cardTypeFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Types</option>
            <option value="Visa">Visa</option>
            <option value="Mastercard">Mastercard</option>
            <option value="American Express">American Express</option>
            <option value="Discover">Discover</option>
          </select>
          <select v-model="countryFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Countries</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
          </select>
          <select v-model="sortBy" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="expiry_asc">Expiry: Soonest</option>
            <option value="balance_desc">Balance: Highest</option>
          </select>
          <button
            @click="loadCreditCards"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <!-- Credit Cards Grid -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p class="text-gray-400">Loading credit cards...</p>
      </div>

      <div v-else-if="filteredCards.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">💳</div>
        <h3 class="text-xl font-semibold text-white mb-2">No credit cards found</h3>
        <p class="text-gray-400 mb-6">Try adjusting your search filters</p>
        <button
          @click="loadCreditCards"
          class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Refresh Cards
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="card in filteredCards"
          :key="card.id"
          class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm hover:border-red-500/50 transition-all duration-300"
        >
          <!-- Card Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <span class="text-red-400 text-xl">{{ getCardTypeIcon(card.card_type) }}</span>
              </div>
              <div>
                <h3 class="text-white font-semibold">{{ card.card_type }}</h3>
                <div class="text-sm text-gray-400">BIN: {{ card.bin }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-green-400">${{ card.price.toFixed(2) }}</div>
              <div class="text-xs text-gray-400">{{ card.status }}</div>
            </div>
          </div>

          <!-- Card Details -->
          <div class="space-y-3 mb-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-700/50 p-3 rounded-lg">
                <div class="text-gray-400 text-xs mb-1">Card Number</div>
                <div class="text-white text-sm font-mono">{{ formatCardNumber(card.card_number) }}</div>
              </div>
              <div class="bg-gray-700/50 p-3 rounded-lg">
                <div class="text-gray-400 text-xs mb-1">Expiry</div>
                <div class="text-white text-sm">{{ formatExpiry(card.expiry_month, card.expiry_year) }}</div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-700/50 p-3 rounded-lg">
                <div class="text-gray-400 text-xs mb-1">CVV</div>
                <div class="text-white text-sm font-mono">{{ showCVV ? card.cvv : '***' }}</div>
              </div>
              <div class="bg-gray-700/50 p-3 rounded-lg">
                <div class="text-gray-400 text-xs mb-1">Balance</div>
                <div class="text-white text-sm">${{ card.balance?.toFixed(2) || 'N/A' }}</div>
              </div>
            </div>
            <div v-if="card.cardholder_name" class="bg-gray-700/50 p-3 rounded-lg">
              <div class="text-gray-400 text-xs mb-1">Cardholder</div>
              <div class="text-white text-sm">{{ card.cardholder_name }}</div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between">
            <button
              @click="toggleCVV"
              class="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm transition-colors"
            >
              {{ showCVV ? 'Hide' : 'Show' }} CVV
            </button>
            <div class="flex items-center gap-2">
              <button
                @click="addToCart(card)"
                class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm"
              >
                Add to Cart
              </button>
              <button
                @click="buyNow(card)"
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
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { creditCardsAPI, apiHelpers } from '@/services/apiServices.js'
import webhookService from '@/services/webhookService.js'

// State
const creditCards = ref([])
const loading = ref(true)
const error = ref(null)
const searchTerm = ref('')
const cardTypeFilter = ref('all')
const countryFilter = ref('all')
const sortBy = ref('price_asc')
const currentPage = ref(1)
const itemsPerPage = 12
const showCVV = ref(false)

const stats = reactive({
  totalCards: 0,
  availableCards: 0,
  cardTypes: 0,
  totalValue: 0
})

// Computed
const filteredCards = computed(() => {
  let filtered = creditCards.value

  // Search filter
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(card => 
      card.bin?.toLowerCase().includes(search) ||
      card.card_type?.toLowerCase().includes(search) ||
      card.country?.toLowerCase().includes(search) ||
      card.card_number?.toLowerCase().includes(search)
    )
  }

  // Card type filter
  if (cardTypeFilter.value !== 'all') {
    filtered = filtered.filter(card => card.card_type === cardTypeFilter.value)
  }

  // Country filter
  if (countryFilter.value !== 'all') {
    filtered = filtered.filter(card => card.country === countryFilter.value)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'price_asc':
        return a.price - b.price
      case 'price_desc':
        return b.price - a.price
      case 'expiry_asc':
        return new Date(a.expiry_year, a.expiry_month) - new Date(b.expiry_year, b.expiry_month)
      case 'balance_desc':
        return (b.balance || 0) - (a.balance || 0)
      default:
        return 0
    }
  })

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredCards.value.length / itemsPerPage)
})

// Methods
const loadCreditCards = async () => {
  try {
    loading.value = true
    error.value = null

    const params = {
      page: currentPage.value,
      limit: itemsPerPage,
      search: searchTerm.value || undefined,
      type: cardTypeFilter.value !== 'all' ? cardTypeFilter.value : undefined,
      status: 'available',
      sortBy: sortBy.value
    }

    const response = await creditCardsAPI.getCards(params)
    
    if (response.success !== false) {
      creditCards.value = response.data || response.cards || []
      updateStats()
    } else {
      throw new Error(response.error || 'Failed to fetch credit cards')
    }
  } catch (err) {
    console.error('Error loading credit cards:', err)
    error.value = 'Failed to load credit cards.'
    
    // Fallback to mock data
    creditCards.value = [
      {
        id: 1,
        card_number: '4111****1111',
        bin: '411111',
        card_type: 'Visa',
        expiry_month: 12,
        expiry_year: 2025,
        cvv: '123',
        country: 'US',
        price: 25.00,
        balance: 1500.00,
        status: 'available',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        card_number: '5555****2222',
        bin: '555555',
        card_type: 'Mastercard',
        expiry_month: 11,
        expiry_year: 2024,
        cvv: '456',
        country: 'CA',
        price: 30.00,
        balance: 2000.00,
        status: 'available',
        created_at: new Date().toISOString()
      }
    ]
    updateStats()
  } finally {
    loading.value = false
  }
}

const updateStats = () => {
  stats.totalCards = creditCards.value.length
  stats.availableCards = creditCards.value.filter(card => card.status === 'available').length
  stats.cardTypes = new Set(creditCards.value.map(card => card.card_type)).size
  stats.totalValue = creditCards.value.reduce((sum, card) => sum + (card.price || 0), 0)
}

const getCardTypeIcon = (cardType) => {
  const icons = {
    'Visa': '💳',
    'Mastercard': '💳',
    'American Express': '💳',
    'Discover': '💳'
  }
  return icons[cardType] || '💳'
}

const formatCardNumber = (cardNumber) => {
  if (!cardNumber) return '****'
  const cleaned = cardNumber.replace(/\s+/g, '')
  const bin = cleaned.slice(0, 6)
  const lastFour = cleaned.slice(-4)
  return `${bin}** **** ${lastFour}`
}

const formatExpiry = (month, year) => {
  if (!month || !year) return 'N/A'
  return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`
}

const toggleCVV = () => {
  showCVV.value = !showCVV.value
}

const addToCart = async (card) => {
  try {
    const response = await creditCardsAPI.addToCart(card.id)
    if (response.success !== false) {
      alert('✅ Added to cart!')
    } else {
      alert(`❌ ${response.error || 'Failed to add to cart'}`)
    }
  } catch (err) {
    console.error('Add to cart error:', err)
    alert('❌ Failed to add to cart')
  }
}

const buyNow = async (card) => {
  try {
    const response = await creditCardsAPI.purchase(card.id)
    if (response.success !== false) {
      alert('✅ Card purchased successfully!')
      await loadCreditCards() // Refresh the list
    } else {
      alert(`❌ ${response.error || 'Failed to purchase card'}`)
    }
  } catch (err) {
    console.error('Purchase error:', err)
    alert('❌ Failed to purchase card')
  }
}

const formatCurrency = (amount) => {
  return apiHelpers.formatCurrency(amount)
}

const formatDate = (dateString) => {
  return apiHelpers.formatDate(dateString)
}

// Webhook event handlers
const handleCreditCardUpdate = (event) => {
  console.log('Credit card update received:', event.detail)
  loadCreditCards() // Refresh the list
}

onMounted(async () => {
  await loadCreditCards()
  
  // Listen for webhook updates
  window.addEventListener('credit-card-updated', handleCreditCardUpdate)
})

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener('credit-card-updated', handleCreditCardUpdate)
})
</script>

<style scoped>
.font-mono {
  font-family: 'Courier New', monospace;
}
</style>