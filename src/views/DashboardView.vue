<template>
  <div class="min-h-screen bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 font-mono">Dashboard</h1>
        <p class="text-gray-300 text-lg">Welcome back! Here's your bot management overview</p>
      </div>

      <!-- Quick Stats -->
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

        <div class="bg-gray-800/80 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-green-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">$12,450</div>
              <div class="text-xs text-gray-300">Total Value</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">89</div>
              <div class="text-xs text-gray-300">New Today</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-purple-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">23</div>
              <div class="text-xs text-gray-300">Countries</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Bot Management Panel -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Recent Bot Activity -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-white font-semibold font-reaper">Recent Bot Activity</h3>
              <button class="text-red-400 hover:text-red-300 text-sm">View All</button>
            </div>
            <div class="space-y-3">
              <div
                v-for="activity in recentActivity"
                :key="activity.id"
                class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                    <span class="text-red-400 text-sm">🤖</span>
                  </div>
                  <div>
                    <div class="text-white font-medium text-sm">{{ activity.bot_id }}</div>
                    <div class="text-gray-400 text-xs">{{ activity.action }}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-white text-sm">{{ activity.timestamp }}</div>
                  <div class="text-gray-400 text-xs">{{ activity.country }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bot Performance Analytics -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Bot Performance Analytics</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-gray-700/50 p-4 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-gray-300 text-sm">Success Rate</span>
                  <span class="text-green-400 font-bold">94.2%</span>
                </div>
                <div class="w-full bg-gray-600 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full" style="width: 94.2%"></div>
                </div>
              </div>
              <div class="bg-gray-700/50 p-4 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-gray-300 text-sm">Avg. Response Time</span>
                  <span class="text-blue-400 font-bold">1.2s</span>
                </div>
                <div class="w-full bg-gray-600 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full" style="width: 85%"></div>
                </div>
              </div>
              <div class="bg-gray-700/50 p-4 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-gray-300 text-sm">Uptime</span>
                  <span class="text-purple-400 font-bold">99.8%</span>
                </div>
                <div class="w-full bg-gray-600 rounded-full h-2">
                  <div class="bg-purple-500 h-2 rounded-full" style="width: 99.8%"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bot Commands Control -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Bot Commands Control</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                v-for="command in botCommands"
                :key="command.name"
                @click="executeCommand(command)"
                :class="`p-3 rounded-lg text-sm font-medium transition-colors ${
                  command.active
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`"
              >
                {{ command.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Telegram Bot Status -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-white font-semibold font-reaper">Telegram Bot Status</h3>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-green-400 text-sm">Online</span>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-300">Active Users</span>
                <span class="text-white">1,247</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-300">Messages Today</span>
                <span class="text-white">89</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-300">Response Time</span>
                <span class="text-white">1.2s</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-300">Success Rate</span>
                <span class="text-white">94.2%</span>
              </div>
            </div>
            <button
              @click="openBotChat"
              class="w-full mt-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
            >
              Open Bot Chat
            </button>
          </div>

          <!-- Quick Actions -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Quick Actions</h3>
            <div class="space-y-2">
              <button
                @click="refreshBots"
                class="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
              >
                🔄 Refresh Bot Data
              </button>
              <button
                @click="exportData"
                class="w-full p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
              >
                📊 Export Analytics
              </button>
              <button
                @click="openSettings"
                class="w-full p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm"
              >
                ⚙️ Bot Settings
              </button>
              <button
                @click="openSupport"
                class="w-full p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm"
              >
                🎫 Support Ticket
              </button>
            </div>
          </div>

          <!-- Bot Categories -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Bot Categories</h3>
            <div class="space-y-2">
              <div
                v-for="category in botCategories"
                :key="category.id"
                class="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors cursor-pointer"
                @click="filterByCategory(category)"
              >
                <div class="flex items-center gap-2">
                  <span class="text-lg">{{ category.icon }}</span>
                  <span class="text-white text-sm">{{ category.name }}</span>
                </div>
                <span class="text-gray-400 text-xs">{{ category.count }}</span>
              </div>
            </div>
          </div>

          <!-- Recent Notifications -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Recent Notifications</h3>
            <div class="space-y-2">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="p-3 bg-gray-700/50 rounded-lg"
              >
                <div class="flex items-start gap-2">
                  <div class="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div class="text-white text-sm">{{ notification.message }}</div>
                    <div class="text-gray-400 text-xs">{{ notification.timestamp }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// State
const recentActivity = ref([
  {
    id: 1,
    bot_id: 'US4P34LPGC2PY0WJPA0OHMCU3ZMP75935',
    action: 'New bot added',
    country: 'United States',
    timestamp: '2 min ago'
  },
  {
    id: 2,
    bot_id: 'CA8K9L2MN3OP4QR5ST6UV7WX8YZ9AB0CD',
    action: 'Data updated',
    country: 'Canada',
    timestamp: '15 min ago'
  },
  {
    id: 3,
    bot_id: 'DE8K9L2MN3OP4QR5ST6UV7WX8YZ9AB0CD',
    action: 'Bot sold',
    country: 'Germany',
    timestamp: '1 hour ago'
  }
])

const botCommands = ref([
  { name: 'Start All', active: false },
  { name: 'Stop All', active: false },
  { name: 'Restart', active: false },
  { name: 'Update', active: false },
  { name: 'Backup', active: false },
  { name: 'Monitor', active: true },
  { name: 'Logs', active: false },
  { name: 'Settings', active: false }
])

const botCategories = ref([
  { id: 1, name: 'Windows', icon: '🪟', count: 856 },
  { id: 2, name: 'macOS', icon: '🍎', count: 234 },
  { id: 3, name: 'Linux', icon: '🐧', count: 89 },
  { id: 4, name: 'Android', icon: '📱', count: 45 },
  { id: 5, name: 'iOS', icon: '📱', count: 23 }
])

const notifications = ref([
  {
    id: 1,
    message: 'New bot data available for US region',
    timestamp: '5 min ago'
  },
  {
    id: 2,
    message: 'Bot performance optimization completed',
    timestamp: '1 hour ago'
  },
  {
    id: 3,
    message: 'System backup successful',
    timestamp: '2 hours ago'
  }
])

// Methods
const executeCommand = (command) => {
  command.active = !command.active
  console.log(`Executing command: ${command.name}`)
}

const openBotChat = () => {
  router.push('/chat')
}

const refreshBots = () => {
  console.log('Refreshing bot data...')
  // Implement refresh functionality
}

const exportData = () => {
  console.log('Exporting analytics data...')
  // Implement export functionality
}

const openSettings = () => {
  console.log('Opening bot settings...')
  // Implement settings functionality
}

const openSupport = () => {
  console.log('Opening support ticket...')
  // Implement support functionality
}

const filterByCategory = (category) => {
  console.log(`Filtering by category: ${category.name}`)
  // Implement category filtering
}
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