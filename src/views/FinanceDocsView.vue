<template>
  <div class="min-h-screen bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 font-mono">Finance Documents</h1>
        <p class="text-gray-300 text-lg">KYC/AML and financial verification documents</p>
      </div>

      <!-- Stats Overview -->
      <div class="grid gap-4 md:grid-cols-4 mb-8">
        <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-red-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.totalDocuments }}</div>
              <div class="text-xs text-gray-300">Total Documents</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-green-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.kycDocuments }}</div>
              <div class="text-xs text-gray-300">KYC Documents</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.amlDocuments }}</div>
              <div class="text-xs text-gray-300">AML Documents</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-purple-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.verifiedDocuments }}</div>
              <div class="text-xs text-gray-300">Verified</div>
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
              placeholder="Search by document type, institution, or country..."
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
            />
          </div>
          <select v-model="documentTypeFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Types</option>
            <option value="bank_statement">Bank Statement</option>
            <option value="pay_stub">Pay Stub</option>
            <option value="tax_return">Tax Return</option>
            <option value="investment_statement">Investment Statement</option>
            <option value="crypto_statement">Crypto Statement</option>
            <option value="business_license">Business License</option>
            <option value="incorporation_documents">Incorporation Documents</option>
          </select>
          <select v-model="categoryFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Categories</option>
            <option value="kyc">KYC Documents</option>
            <option value="aml">AML Documents</option>
            <option value="verification">Verification Documents</option>
            <option value="compliance">Compliance Documents</option>
          </select>
          <select v-model="countryFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Countries</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="CH">Switzerland</option>
          </select>
          <button
            @click="loadFinanceDocuments"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <!-- Documents Grid -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p class="text-gray-400">Loading finance documents...</p>
      </div>

      <div v-else-if="filteredDocuments.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">🏦</div>
        <h3 class="text-xl font-semibold text-white mb-2">No finance documents found</h3>
        <p class="text-gray-400 mb-6">Try adjusting your search filters</p>
        <button
          @click="loadFinanceDocuments"
          class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Refresh Documents
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="document in filteredDocuments"
          :key="document.id"
          class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm hover:border-red-500/50 transition-all duration-300"
        >
          <!-- Document Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <span class="text-red-400 text-xl">{{ getDocumentTypeIcon(document.document_type) }}</span>
              </div>
              <div>
                <h3 class="text-white font-semibold">{{ formatDocumentType(document.document_type) }}</h3>
                <div class="text-sm text-gray-400">{{ document.institution || 'N/A' }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-green-400">${{ document.price.toFixed(2) }}</div>
              <div class="text-xs text-gray-400">{{ document.category }}</div>
            </div>
          </div>

          <!-- Document Details -->
          <div class="space-y-3 mb-4">
            <div class="bg-gray-700/50 p-3 rounded-lg">
              <div class="text-gray-400 text-xs mb-1">Period</div>
              <div class="text-white text-sm">{{ formatDateRange(document.period_start, document.period_end) }}</div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-gray-700/50 p-3 rounded-lg">
                <div class="text-gray-400 text-xs mb-1">Country</div>
                <div class="text-white text-sm">{{ document.country }}</div>
              </div>
              <div class="bg-gray-700/50 p-3 rounded-lg">
                <div class="text-gray-400 text-xs mb-1">Currency</div>
                <div class="text-white text-sm">{{ document.currency || 'USD' }}</div>
              </div>
            </div>
            <div v-if="document.account_balance" class="bg-gray-700/50 p-3 rounded-lg">
              <div class="text-gray-400 text-xs mb-1">Account Balance</div>
              <div class="text-white text-sm font-mono">{{ formatBalance(document.account_balance, document.currency) }}</div>
            </div>
            <div v-if="document.transaction_count" class="bg-gray-700/50 p-3 rounded-lg">
              <div class="text-gray-400 text-xs mb-1">Transactions</div>
              <div class="text-white text-sm">{{ document.transaction_count }} transactions</div>
            </div>
          </div>

          <!-- Verification Status -->
          <div class="mb-4">
            <div :class="getVerificationBadgeClass(document.verification_status)" class="px-2 py-1 rounded text-xs font-medium">
              {{ document.verification_status }}
            </div>
          </div>

          <!-- Document Features -->
          <div v-if="document.features && document.features.length > 0" class="mb-4">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="feature in document.features.slice(0, 3)"
                :key="feature"
                class="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded"
              >
                {{ feature }}
              </span>
              <span v-if="document.features.length > 3" class="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded">
                +{{ document.features.length - 3 }} more
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between">
            <button
              @click="viewDocument(document)"
              class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
            >
              Preview
            </button>
            <div class="flex items-center gap-2">
              <button
                @click="addToCart(document)"
                class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm"
              >
                Add to Cart
              </button>
              <button
                @click="buyNow(document)"
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
const financeDocuments = ref([])
const loading = ref(true)
const searchTerm = ref('')
const documentTypeFilter = ref('all')
const categoryFilter = ref('all')
const countryFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = 12

const stats = reactive({
  totalDocuments: 0,
  kycDocuments: 0,
  amlDocuments: 0,
  verifiedDocuments: 0
})

// Computed
const filteredDocuments = computed(() => {
  let filtered = financeDocuments.value

  // Search filter
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(doc => 
      doc.document_type?.toLowerCase().includes(search) ||
      doc.institution?.toLowerCase().includes(search) ||
      doc.country?.toLowerCase().includes(search) ||
      doc.category?.toLowerCase().includes(search)
    )
  }

  // Document type filter
  if (documentTypeFilter.value !== 'all') {
    filtered = filtered.filter(doc => doc.document_type === documentTypeFilter.value)
  }

  // Category filter
  if (categoryFilter.value !== 'all') {
    filtered = filtered.filter(doc => doc.category === categoryFilter.value)
  }

  // Country filter
  if (countryFilter.value !== 'all') {
    filtered = filtered.filter(doc => doc.country === countryFilter.value)
  }

  // Sort by price
  filtered.sort((a, b) => a.price - b.price)

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredDocuments.value.length / itemsPerPage)
})

// Methods
const loadFinanceDocuments = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('finance_documents')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading finance documents:', error)
      return
    }

    financeDocuments.value = data || []
    updateStats()
  } catch (error) {
    console.error('Failed to load finance documents:', error)
  } finally {
    loading.value = false
  }
}

const updateStats = () => {
  stats.totalDocuments = financeDocuments.value.length
  stats.kycDocuments = financeDocuments.value.filter(doc => doc.category === 'kyc').length
  stats.amlDocuments = financeDocuments.value.filter(doc => doc.category === 'aml').length
  stats.verifiedDocuments = financeDocuments.value.filter(doc => doc.verification_status === 'verified').length
}

const getDocumentTypeIcon = (documentType) => {
  const icons = {
    'bank_statement': '🏦',
    'pay_stub': '💰',
    'tax_return': '📊',
    'investment_statement': '📈',
    'crypto_statement': '₿',
    'business_license': '🏢',
    'incorporation_documents': '📋'
  }
  return icons[documentType] || '📄'
}

const formatDocumentType = (documentType) => {
  const types = {
    'bank_statement': 'Bank Statement',
    'pay_stub': 'Pay Stub',
    'tax_return': 'Tax Return',
    'investment_statement': 'Investment Statement',
    'crypto_statement': 'Crypto Statement',
    'business_license': 'Business License',
    'incorporation_documents': 'Incorporation Documents'
  }
  return types[documentType] || documentType
}

const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return 'N/A'
  const start = new Date(startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  const end = new Date(endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  return `${start} - ${end}`
}

const formatBalance = (balance, currency = 'USD') => {
  if (!balance) return 'N/A'
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  })
  return formatter.format(balance)
}

const getVerificationBadgeClass = (status) => {
  const classes = {
    'verified': 'bg-green-500/20 text-green-400 border border-green-500/30',
    'pending': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    'unverified': 'bg-red-500/20 text-red-400 border border-red-500/30'
  }
  return classes[status] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
}

const viewDocument = (document) => {
  console.log('Viewing finance document:', document)
  // Implement document preview functionality
}

const addToCart = (document) => {
  console.log('Adding to cart:', document)
  // Implement cart functionality
}

const buyNow = (document) => {
  console.log('Buying now:', document)
  // Implement direct purchase
}

onMounted(() => {
  loadFinanceDocuments()
})
</script>

<style scoped>
.font-mono {
  font-family: 'Courier New', monospace;
}
</style>