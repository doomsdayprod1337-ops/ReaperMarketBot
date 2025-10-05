<template>
  <div class="min-h-screen bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 font-mono">Notifications</h1>
        <p class="text-gray-300 text-lg">Stay updated with important alerts and system messages</p>
      </div>

      <!-- Notification Stats -->
      <div class="grid gap-4 md:grid-cols-4 mb-8">
        <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-red-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.total }}</div>
              <div class="text-xs text-gray-300">Total</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.unread }}</div>
              <div class="text-xs text-gray-300">Unread</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-green-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.today }}</div>
              <div class="text-xs text-gray-300">Today</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-purple-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.important }}</div>
              <div class="text-xs text-gray-300">Important</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Actions -->
      <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm mb-8">
        <div class="flex flex-wrap gap-4">
          <div class="relative flex-1 min-w-[200px]">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Search notifications..."
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
            />
          </div>
          <select v-model="typeFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Types</option>
            <option value="system">System</option>
            <option value="security">Security</option>
            <option value="bot">Bot Updates</option>
            <option value="market">Market</option>
            <option value="payment">Payment</option>
            <option value="support">Support</option>
          </select>
          <select v-model="statusFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="important">Important</option>
          </select>
          <button
            @click="markAllAsRead"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Mark All Read
          </button>
          <button
            @click="clearAll"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <!-- Notifications List -->
      <div class="space-y-4">
        <div v-if="filteredNotifications.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">🔔</div>
          <h3 class="text-xl font-semibold text-white mb-2">No notifications found</h3>
          <p class="text-gray-400 mb-6">You're all caught up!</p>
        </div>

        <div
          v-for="notification in filteredNotifications"
          :key="notification.id"
          class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm hover:bg-gray-700/80 transition-colors"
          :class="{ 'border-blue-500/50': notification.important }"
        >
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span class="text-red-400 text-xl">{{ getNotificationIcon(notification.type) }}</span>
            </div>
            
            <div class="flex-1">
              <div class="flex items-start justify-between mb-2">
                <div>
                  <h3 class="text-white font-semibold mb-1">{{ notification.title }}</h3>
                  <p class="text-gray-300 text-sm">{{ notification.message }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <span
                    :class="`px-2 py-1 text-xs rounded ${
                      notification.type === 'system' ? 'bg-blue-500/20 text-blue-400' :
                      notification.type === 'security' ? 'bg-red-500/20 text-red-400' :
                      notification.type === 'bot' ? 'bg-green-500/20 text-green-400' :
                      notification.type === 'market' ? 'bg-yellow-500/20 text-yellow-400' :
                      notification.type === 'payment' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`"
                  >
                    {{ notification.type }}
                  </span>
                  <div v-if="!notification.read" class="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4 text-sm text-gray-400">
                  <span>{{ formatDate(notification.created_at) }}</span>
                  <span v-if="notification.important" class="text-red-400 font-medium">Important</span>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    v-if="!notification.read"
                    @click="markAsRead(notification.id)"
                    class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
                  >
                    Mark Read
                  </button>
                  <button
                    @click="viewNotification(notification)"
                    class="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm transition-colors"
                  >
                    View
                  </button>
                  <button
                    @click="deleteNotification(notification.id)"
                    class="p-1 hover:bg-gray-600 rounded transition-colors text-gray-400"
                  >
                    🗑️
                  </button>
                </div>
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
import { ref, reactive, computed, onMounted } from 'vue'

// State
const searchTerm = ref('')
const typeFilter = ref('all')
const statusFilter = ref('all')

const stats = reactive({
  total: 0,
  unread: 0,
  today: 0,
  important: 0
})

const notifications = ref([
  {
    id: 1,
    title: 'New Bot Available',
    message: 'A new bot with premium data has been added to the marketplace. Check it out now!',
    type: 'bot',
    important: false,
    read: false,
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    title: 'Security Alert',
    message: 'Unusual activity detected on your account. Please verify your identity.',
    type: 'security',
    important: true,
    read: false,
    created_at: '2024-01-15T09:15:00Z'
  },
  {
    id: 3,
    title: 'Payment Received',
    message: 'Payment of $89.99 has been successfully processed for your recent purchase.',
    type: 'payment',
    important: false,
    read: true,
    created_at: '2024-01-15T08:45:00Z'
  },
  {
    id: 4,
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM UTC.',
    type: 'system',
    important: false,
    read: true,
    created_at: '2024-01-14T16:20:00Z'
  },
  {
    id: 5,
    title: 'Market Update',
    message: 'New pricing structure has been implemented. Check the updated rates.',
    type: 'market',
    important: false,
    read: false,
    created_at: '2024-01-14T14:10:00Z'
  },
  {
    id: 6,
    title: 'Support Ticket Response',
    message: 'Your support ticket #1234 has been resolved. Please rate your experience.',
    type: 'support',
    important: false,
    read: true,
    created_at: '2024-01-14T11:30:00Z'
  }
])

// Computed
const filteredNotifications = computed(() => {
  let filtered = notifications.value

  if (searchTerm.value) {
    filtered = filtered.filter(notification =>
      notification.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  if (typeFilter.value !== 'all') {
    filtered = filtered.filter(notification => notification.type === typeFilter.value)
  }

  if (statusFilter.value !== 'all') {
    if (statusFilter.value === 'unread') {
      filtered = filtered.filter(notification => !notification.read)
    } else if (statusFilter.value === 'read') {
      filtered = filtered.filter(notification => notification.read)
    } else if (statusFilter.value === 'important') {
      filtered = filtered.filter(notification => notification.important)
    }
  }

  return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

// Methods
const getNotificationIcon = (type) => {
  const icons = {
    system: '⚙️',
    security: '🔒',
    bot: '🤖',
    market: '📈',
    payment: '💳',
    support: '🎫'
  }
  return icons[type] || '🔔'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInHours < 48) return 'Yesterday'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

const markAsRead = (notificationId) => {
  const notification = notifications.value.find(n => n.id === notificationId)
  if (notification) {
    notification.read = true
    updateStats()
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true
  })
  updateStats()
}

const clearAll = () => {
  if (confirm('Are you sure you want to clear all notifications?')) {
    notifications.value = []
    updateStats()
  }
}

const viewNotification = (notification) => {
  console.log('Viewing notification:', notification.title)
  // Implement notification viewing logic
}

const deleteNotification = (notificationId) => {
  if (confirm('Are you sure you want to delete this notification?')) {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index > -1) {
      notifications.value.splice(index, 1)
      updateStats()
    }
  }
}

const updateStats = () => {
  stats.total = notifications.value.length
  stats.unread = notifications.value.filter(n => !n.read).length
  stats.important = notifications.value.filter(n => n.important).length
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  stats.today = notifications.value.filter(n => {
    const notificationDate = new Date(n.created_at)
    notificationDate.setHours(0, 0, 0, 0)
    return notificationDate.getTime() === today.getTime()
  }).length
}

onMounted(() => {
  updateStats()
})
</script>

<style scoped>
.font-mono {
  font-family: 'Courier New', monospace;
}
</style>