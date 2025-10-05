<template>
  <div class="min-h-screen bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 font-mono">Support Tickets</h1>
        <p class="text-gray-300 text-lg">Get help with your account, orders, and technical issues</p>
      </div>

      <!-- Stats Overview -->
      <div class="grid gap-4 md:grid-cols-4 mb-8">
        <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-red-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.totalTickets }}</div>
              <div class="text-xs text-gray-300">Total Tickets</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-yellow-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.openTickets }}</div>
              <div class="text-xs text-gray-300">Open Tickets</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-green-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.resolvedTickets }}</div>
              <div class="text-xs text-gray-300">Resolved</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.avgResponseTime }}h</div>
              <div class="text-xs text-gray-300">Avg Response</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Create New Ticket Button -->
      <div class="mb-8">
        <button
          @click="showCreateTicket = true"
          class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
        >
          🎫 Create New Ticket
        </button>
      </div>

      <!-- Filters and Search -->
      <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm mb-8">
        <div class="flex flex-wrap gap-4">
          <div class="relative flex-1 min-w-[200px]">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Search by ticket ID, subject, or description..."
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
            />
          </div>
          <select v-model="statusFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select v-model="priorityFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <select v-model="categoryFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Categories</option>
            <option value="account">Account Issues</option>
            <option value="billing">Billing & Payments</option>
            <option value="technical">Technical Support</option>
            <option value="orders">Order Issues</option>
            <option value="feature">Feature Request</option>
            <option value="other">Other</option>
          </select>
          <button
            @click="loadTickets"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <!-- Tickets List -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p class="text-gray-400">Loading tickets...</p>
      </div>

      <div v-else-if="filteredTickets.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">🎫</div>
        <h3 class="text-xl font-semibold text-white mb-2">No tickets found</h3>
        <p class="text-gray-400 mb-6">Your support tickets will appear here</p>
        <button
          @click="showCreateTicket = true"
          class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Create First Ticket
        </button>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="ticket in filteredTickets"
          :key="ticket.id"
          class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm hover:border-red-500/50 transition-all duration-300"
        >
          <!-- Ticket Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <span class="text-red-400 text-xl">🎫</span>
              </div>
              <div>
                <h3 class="text-white font-semibold">{{ ticket.subject }}</h3>
                <div class="text-sm text-gray-400">Ticket #{{ ticket.ticket_id }}</div>
              </div>
            </div>
            <div class="text-right">
              <div :class="getPriorityColor(ticket.priority)" class="text-xs px-2 py-1 rounded font-medium mb-1">
                {{ ticket.priority }}
              </div>
              <div :class="getStatusColor(ticket.status)" class="text-xs px-2 py-1 rounded font-medium">
                {{ ticket.status }}
              </div>
            </div>
          </div>

          <!-- Ticket Details -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="bg-gray-700/50 p-3 rounded-lg">
              <div class="text-gray-400 text-xs mb-1">Category</div>
              <div class="text-white text-sm">{{ formatCategory(ticket.category) }}</div>
            </div>
            <div class="bg-gray-700/50 p-3 rounded-lg">
              <div class="text-gray-400 text-xs mb-1">Created</div>
              <div class="text-white text-sm">{{ formatDate(ticket.created_at) }}</div>
            </div>
            <div class="bg-gray-700/50 p-3 rounded-lg">
              <div class="text-gray-400 text-xs mb-1">Last Updated</div>
              <div class="text-white text-sm">{{ formatDate(ticket.updated_at) }}</div>
            </div>
          </div>

          <!-- Ticket Description -->
          <div class="mb-4">
            <div class="bg-gray-700/50 p-3 rounded-lg">
              <div class="text-gray-400 text-xs mb-1">Description</div>
              <div class="text-white text-sm line-clamp-3">{{ ticket.description }}</div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4 text-sm text-gray-400">
              <span v-if="ticket.assigned_to">Assigned to: {{ ticket.assigned_to }}</span>
              <span v-if="ticket.response_count">{{ ticket.response_count }} responses</span>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="viewTicket(ticket)"
                class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
              >
                View Details
              </button>
              <button
                v-if="ticket.status === 'open' || ticket.status === 'pending'"
                @click="replyToTicket(ticket)"
                class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Ticket Modal -->
      <div v-if="showCreateTicket" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-red-500/30">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-white">Create New Support Ticket</h3>
            <button
              @click="showCreateTicket = false"
              class="text-gray-400 hover:text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <form @submit.prevent="createTicket" class="space-y-4">
            <div>
              <label class="block text-white text-sm font-medium mb-2">Subject</label>
              <input
                v-model="newTicket.subject"
                type="text"
                required
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
                placeholder="Brief description of your issue"
              />
            </div>

            <div>
              <label class="block text-white text-sm font-medium mb-2">Category</label>
              <select
                v-model="newTicket.category"
                required
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:ring-red-500/20"
              >
                <option value="">Select a category</option>
                <option value="account">Account Issues</option>
                <option value="billing">Billing & Payments</option>
                <option value="technical">Technical Support</option>
                <option value="orders">Order Issues</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label class="block text-white text-sm font-medium mb-2">Priority</label>
              <select
                v-model="newTicket.priority"
                required
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:ring-red-500/20"
              >
                <option value="">Select priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label class="block text-white text-sm font-medium mb-2">Description</label>
              <textarea
                v-model="newTicket.description"
                required
                rows="4"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
                placeholder="Please provide detailed information about your issue..."
              ></textarea>
            </div>

            <div class="flex gap-3">
              <button
                type="button"
                @click="showCreateTicket = false"
                class="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="creatingTicket"
                class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white rounded-lg transition-colors"
              >
                {{ creatingTicket ? 'Creating...' : 'Create Ticket' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

// State
const tickets = ref([])
const loading = ref(true)
const creatingTicket = ref(false)
const showCreateTicket = ref(false)
const searchTerm = ref('')
const statusFilter = ref('all')
const priorityFilter = ref('all')
const categoryFilter = ref('all')

const newTicket = reactive({
  subject: '',
  category: '',
  priority: '',
  description: ''
})

const stats = reactive({
  totalTickets: 0,
  openTickets: 0,
  resolvedTickets: 0,
  avgResponseTime: 0
})

// Computed
const filteredTickets = computed(() => {
  let filtered = tickets.value

  // Search filter
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(ticket => 
      ticket.ticket_id?.toLowerCase().includes(search) ||
      ticket.subject?.toLowerCase().includes(search) ||
      ticket.description?.toLowerCase().includes(search)
    )
  }

  // Status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(ticket => ticket.status === statusFilter.value)
  }

  // Priority filter
  if (priorityFilter.value !== 'all') {
    filtered = filtered.filter(ticket => ticket.priority === priorityFilter.value)
  }

  // Category filter
  if (categoryFilter.value !== 'all') {
    filtered = filtered.filter(ticket => ticket.category === categoryFilter.value)
  }

  // Sort by creation date
  filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  return filtered
})

// Methods
const loadTickets = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading tickets:', error)
      return
    }

    tickets.value = data || []
    updateStats()
  } catch (error) {
    console.error('Failed to load tickets:', error)
  } finally {
    loading.value = false
  }
}

const updateStats = () => {
  stats.totalTickets = tickets.value.length
  stats.openTickets = tickets.value.filter(t => t.status === 'open' || t.status === 'pending').length
  stats.resolvedTickets = tickets.value.filter(t => t.status === 'resolved').length
  
  // Calculate average response time (mock data for now)
  stats.avgResponseTime = 2.5
}

const createTicket = async () => {
  try {
    creatingTicket.value = true
    
    const ticketData = {
      ...newTicket,
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('support_tickets')
      .insert([ticketData])
      .select()

    if (error) {
      console.error('Error creating ticket:', error)
      return
    }

    // Reset form
    Object.assign(newTicket, {
      subject: '',
      category: '',
      priority: '',
      description: ''
    })

    showCreateTicket.value = false
    loadTickets() // Refresh the list
    
    alert('✅ Ticket created successfully!')
  } catch (error) {
    console.error('Failed to create ticket:', error)
    alert('❌ Failed to create ticket')
  } finally {
    creatingTicket.value = false
  }
}

const viewTicket = (ticket) => {
  console.log('Viewing ticket:', ticket)
  // Implement ticket details modal
}

const replyToTicket = (ticket) => {
  console.log('Replying to ticket:', ticket)
  // Implement reply functionality
}

const getStatusColor = (status) => {
  const colors = {
    'open': 'bg-green-500/20 text-green-400 border border-green-500/30',
    'pending': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    'resolved': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    'closed': 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
  }
  return colors[status] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
}

const getPriorityColor = (priority) => {
  const colors = {
    'low': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    'medium': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    'high': 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    'urgent': 'bg-red-500/20 text-red-400 border border-red-500/30'
  }
  return colors[priority] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
}

const formatCategory = (category) => {
  const categories = {
    'account': 'Account Issues',
    'billing': 'Billing & Payments',
    'technical': 'Technical Support',
    'orders': 'Order Issues',
    'feature': 'Feature Request',
    'other': 'Other'
  }
  return categories[category] || category
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

onMounted(() => {
  loadTickets()
})
</script>

<style scoped>
.font-mono {
  font-family: 'Courier New', monospace;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>