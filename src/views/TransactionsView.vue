<template>
  <div class="min-h-screen bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 font-mono">Transactions</h1>
        <p class="text-gray-300 text-lg">View your transaction history and payment records</p>
      </div>

      <!-- Stats Overview -->
      <div class="grid gap-4 md:grid-cols-4 mb-8">
        <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-red-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.totalTransactions }}</div>
              <div class="text-xs text-gray-300">Total Transactions</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-green-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">${{ stats.totalSpent.toFixed(2) }}</div>
              <div class="text-xs text-gray-300">Total Spent</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.successfulTransactions }}</div>
              <div class="text-xs text-gray-300">Successful</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-purple-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">${{ stats.monthlySpent.toFixed(2) }}</div>
              <div class="text-xs text-gray-300">This Month</div>
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
              placeholder="Search by transaction ID, item name, or amount..."
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
            />
          </div>
          <select v-model="statusFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <select v-model="typeFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Types</option>
            <option value="purchase">Purchase</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="refund">Refund</option>
          </select>
          <select v-model="sortBy" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount_high">Amount: High to Low</option>
            <option value="amount_low">Amount: Low to High</option>
          </select>
          <button
            @click="loadTransactions"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <!-- Transactions List -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p class="text-gray-400">Loading transactions...</p>
      </div>

      <div v-else-if="filteredTransactions.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">💳</div>
        <h3 class="text-xl font-semibold text-white mb-2">No transactions found</h3>
        <p class="text-gray-400 mb-6">Your transaction history will appear here</p>
        <button
          @click="loadTransactions"
          class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Refresh Transactions
        </button>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="transaction in filteredTransactions"
          :key="transaction.id"
          class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm hover:border-red-500/50 transition-all duration-300"
        >
          <!-- Transaction Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <span class="text-red-400 text-xl">{{ getTransactionTypeIcon(transaction.type) }}</span>
              </div>
              <div>
                <h3 class="text-white font-semibold">{{ transaction.description || transaction.type }}</h3>
                <div class="text-sm text-gray-400">ID: {{ transaction.transaction_id }}</div>
              </div>
            </div>
            <div class="text-right">
              <div :class="getAmountColor(transaction.type)" class="text-2xl font-bold">
                {{ getAmountPrefix(transaction.type) }}${{ transaction.amount.toFixed(2) }}
              </div>
              <div :class="getStatusColor(transaction.status)" class="text-xs px-2 py-1 rounded font-medium">
                {{ transaction.status }}
              </div>
            </div>
          </div>

          <!-- Transaction Details -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="bg-gray-700/50 p-3 rounded-lg">
              <div class="text-gray-400 text-xs mb-1">Date</div>
              <div class="text-white text-sm">{{ formatDate(transaction.created_at) }}</div>
            </div>
            <div class="bg-gray-700/50 p-3 rounded-lg">
              <div class="text-gray-400 text-xs mb-1">Payment Method</div>
              <div class="text-white text-sm">{{ transaction.payment_method || 'N/A' }}</div>
            </div>
            <div class="bg-gray-700/50 p-3 rounded-lg">
              <div class="text-gray-400 text-xs mb-1">Type</div>
              <div class="text-white text-sm capitalize">{{ transaction.type }}</div>
            </div>
          </div>

          <!-- Additional Details -->
          <div v-if="transaction.item_name || transaction.notes" class="mb-4">
            <div class="bg-gray-700/50 p-3 rounded-lg">
              <div class="text-gray-400 text-xs mb-1">Details</div>
              <div class="text-white text-sm">
                <div v-if="transaction.item_name">Item: {{ transaction.item_name }}</div>
                <div v-if="transaction.notes">{{ transaction.notes }}</div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4 text-sm text-gray-400">
              <span>Updated: {{ formatDate(transaction.updated_at) }}</span>
              <span v-if="transaction.reference_id">Ref: {{ transaction.reference_id }}</span>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="viewTransaction(transaction)"
                class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
              >
                View Details
              </button>
              <button
                v-if="transaction.status === 'completed' && transaction.receipt_url"
                @click="downloadReceipt(transaction)"
                class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm transition-colors"
              >
                📄 Receipt
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
const transactions = ref([])
const loading = ref(true)
const searchTerm = ref('')
const statusFilter = ref('all')
const typeFilter = ref('all')
const sortBy = ref('newest')
const currentPage = ref(1)
const itemsPerPage = 10

const stats = reactive({
  totalTransactions: 0,
  totalSpent: 0,
  successfulTransactions: 0,
  monthlySpent: 0
})

// Computed
const filteredTransactions = computed(() => {
  let filtered = transactions.value

  // Search filter
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(transaction => 
      transaction.transaction_id?.toLowerCase().includes(search) ||
      transaction.description?.toLowerCase().includes(search) ||
      transaction.item_name?.toLowerCase().includes(search) ||
      transaction.amount.toString().includes(search)
    )
  }

  // Status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(transaction => transaction.status === statusFilter.value)
  }

  // Type filter
  if (typeFilter.value !== 'all') {
    filtered = filtered.filter(transaction => transaction.type === typeFilter.value)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at)
      case 'oldest':
        return new Date(a.created_at) - new Date(b.created_at)
      case 'amount_high':
        return b.amount - a.amount
      case 'amount_low':
        return a.amount - b.amount
      default:
        return 0
    }
  })

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredTransactions.value.length / itemsPerPage)
})

// Methods
const loadTransactions = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading transactions:', error)
      return
    }

    transactions.value = data || []
    updateStats()
  } catch (error) {
    console.error('Failed to load transactions:', error)
  } finally {
    loading.value = false
  }
}

const updateStats = () => {
  stats.totalTransactions = transactions.value.length
  stats.totalSpent = transactions.value
    .filter(t => t.type === 'purchase' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)
  stats.successfulTransactions = transactions.value.filter(t => t.status === 'completed').length
  
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  stats.monthlySpent = transactions.value
    .filter(t => {
      const transactionDate = new Date(t.created_at)
      return t.type === 'purchase' && 
             t.status === 'completed' &&
             transactionDate.getMonth() === currentMonth &&
             transactionDate.getFullYear() === currentYear
    })
    .reduce((sum, t) => sum + t.amount, 0)
}

const getTransactionTypeIcon = (type) => {
  const icons = {
    'purchase': '🛒',
    'deposit': '💰',
    'withdrawal': '💸',
    'refund': '↩️'
  }
  return icons[type] || '💳'
}

const getAmountPrefix = (type) => {
  return type === 'deposit' || type === 'refund' ? '+' : '-'
}

const getAmountColor = (type) => {
  return type === 'deposit' || type === 'refund' ? 'text-green-400' : 'text-red-400'
}

const getStatusColor = (status) => {
  const colors = {
    'completed': 'bg-green-500/20 text-green-400 border border-green-500/30',
    'pending': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    'failed': 'bg-red-500/20 text-red-400 border border-red-500/30',
    'refunded': 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
  }
  return colors[status] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
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

const viewTransaction = (transaction) => {
  console.log('Viewing transaction:', transaction)
  // Implement transaction details modal
}

const downloadReceipt = (transaction) => {
  console.log('Downloading receipt for transaction:', transaction.id)
  // Implement receipt download
}

onMounted(() => {
  loadTransactions()
})
</script>

<style scoped>
.font-mono {
  font-family: 'Courier New', monospace;
}
</style>