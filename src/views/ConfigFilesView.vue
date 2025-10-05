<template>
  <div class="min-h-screen bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 font-mono">Config Files</h1>
        <p class="text-gray-300 text-lg">Manage configuration files and settings</p>
      </div>

      <!-- Stats Overview -->
      <div class="grid gap-4 md:grid-cols-4 mb-8">
        <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-red-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.totalFiles }}</div>
              <div class="text-xs text-gray-300">Total Files</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-green-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.activeConfigs }}</div>
              <div class="text-xs text-gray-300">Active</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.categories }}</div>
              <div class="text-xs text-gray-300">Categories</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-purple-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.recentUpdates }}</div>
              <div class="text-xs text-gray-300">Recent</div>
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
              placeholder="Search config files..."
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
            />
          </div>
          <select v-model="categoryFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Categories</option>
            <option value="bot-config">Bot Config</option>
            <option value="system-config">System Config</option>
            <option value="security-config">Security Config</option>
            <option value="network-config">Network Config</option>
            <option value="database-config">Database Config</option>
            <option value="other">Other</option>
          </select>
          <select v-model="statusFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="error">Error</option>
            <option value="pending">Pending</option>
          </select>
          <select v-model="sortBy" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
            <option value="category">Sort by Category</option>
          </select>
          <button
            @click="createNewConfig"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            New Config
          </button>
        </div>
      </div>

      <!-- Config Files List -->
      <div class="space-y-4">
        <div v-if="filteredConfigs.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">⚙️</div>
          <h3 class="text-xl font-semibold text-white mb-2">No config files found</h3>
          <p class="text-gray-400 mb-6">Create your first configuration file</p>
          <button
            @click="createNewConfig"
            class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Create Config File
          </button>
        </div>

        <div
          v-for="config in filteredConfigs"
          :key="config.id"
          class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm hover:bg-gray-700/80 transition-colors"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span class="text-red-400 text-xl">{{ getConfigIcon(config.category) }}</span>
              </div>
              <div class="flex-1">
                <h3 class="text-white font-semibold mb-2">{{ config.name }}</h3>
                <p class="text-gray-300 text-sm mb-3">{{ config.description }}</p>
                <div class="flex items-center gap-4 text-sm text-gray-400">
                  <span>{{ config.category }}</span>
                  <span>•</span>
                  <span>{{ config.type }}</span>
                  <span>•</span>
                  <span>{{ formatDate(config.updated_at) }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span
                :class="`px-2 py-1 text-xs rounded ${
                  config.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  config.status === 'inactive' ? 'bg-gray-500/20 text-gray-400' :
                  config.status === 'error' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`"
              >
                {{ config.status }}
              </span>
            </div>
          </div>

          <!-- Config Details -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="bg-gray-700/50 p-3 rounded-lg">
              <div class="text-gray-400 text-xs mb-1">File Size</div>
              <div class="text-white text-sm">{{ formatSize(config.size) }}</div>
            </div>
            <div class="bg-gray-700/50 p-3 rounded-lg">
              <div class="text-gray-400 text-xs mb-1">Last Modified</div>
              <div class="text-white text-sm">{{ formatDate(config.updated_at) }}</div>
            </div>
            <div class="bg-gray-700/50 p-3 rounded-lg">
              <div class="text-gray-400 text-xs mb-1">Version</div>
              <div class="text-white text-sm">{{ config.version }}</div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <button
                @click="editConfig(config.id)"
                class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
              >
                Edit
              </button>
              <button
                @click="viewConfig(config.id)"
                class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm transition-colors"
              >
                View
              </button>
              <button
                @click="toggleConfigStatus(config.id)"
                :class="`px-3 py-1 rounded text-sm transition-colors ${
                  config.status === 'active' ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
                }`"
              >
                {{ config.status === 'active' ? 'Deactivate' : 'Activate' }}
              </button>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="duplicateConfig(config.id)"
                class="p-1 hover:bg-gray-600 rounded transition-colors text-gray-400"
              >
                📋
              </button>
              <button
                @click="exportConfig(config.id)"
                class="p-1 hover:bg-gray-600 rounded transition-colors text-gray-400"
              >
                📤
              </button>
              <button
                @click="deleteConfig(config.id)"
                class="p-1 hover:bg-gray-600 rounded transition-colors text-red-400"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Config Modal -->
      <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-gray-800 border border-red-500/30 rounded-lg p-8 w-11/12 md:w-1/2 lg:w-1/3">
          <h3 class="text-xl font-bold text-white mb-4">Create New Config</h3>
          <form @submit.prevent="submitNewConfig" class="space-y-4">
            <div>
              <label for="configName" class="block text-gray-300 text-sm font-medium mb-1">Config Name</label>
              <input type="text" id="configName" v-model="newConfig.name" required class="w-full bg-gray-700 border border-red-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label for="configDescription" class="block text-gray-300 text-sm font-medium mb-1">Description</label>
              <textarea id="configDescription" v-model="newConfig.description" rows="3" class="w-full bg-gray-700 border border-red-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"></textarea>
            </div>
            <div>
              <label for="configCategory" class="block text-gray-300 text-sm font-medium mb-1">Category</label>
              <select id="configCategory" v-model="newConfig.category" required class="w-full bg-gray-700 border border-red-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500">
                <option value="">Select Category</option>
                <option value="bot-config">Bot Config</option>
                <option value="system-config">System Config</option>
                <option value="security-config">Security Config</option>
                <option value="network-config">Network Config</option>
                <option value="database-config">Database Config</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label for="configType" class="block text-gray-300 text-sm font-medium mb-1">File Type</label>
              <select id="configType" v-model="newConfig.type" required class="w-full bg-gray-700 border border-red-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500">
                <option value="">Select Type</option>
                <option value="json">JSON</option>
                <option value="yaml">YAML</option>
                <option value="ini">INI</option>
                <option value="xml">XML</option>
                <option value="env">ENV</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="flex justify-end gap-3 mt-6">
              <button type="button" @click="showCreateModal = false" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Cancel
              </button>
              <button type="submit" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Create Config
              </button>
            </div>
          </form>
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
const categoryFilter = ref('all')
const statusFilter = ref('all')
const sortBy = ref('date')
const showCreateModal = ref(false)

const stats = reactive({
  totalFiles: 0,
  activeConfigs: 0,
  categories: 0,
  recentUpdates: 0
})

const newConfig = reactive({
  name: '',
  description: '',
  category: '',
  type: ''
})

const configs = ref([
  {
    id: 1,
    name: 'bot_main_config.json',
    description: 'Main configuration file for bot operations and settings',
    category: 'bot-config',
    type: 'json',
    status: 'active',
    size: 2048,
    version: '1.2.3',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'security_settings.yaml',
    description: 'Security configuration and access control settings',
    category: 'security-config',
    type: 'yaml',
    status: 'active',
    size: 1536,
    version: '2.1.0',
    updated_at: '2024-01-14T15:20:00Z'
  },
  {
    id: 3,
    name: 'database_config.ini',
    description: 'Database connection and configuration settings',
    category: 'database-config',
    type: 'ini',
    status: 'inactive',
    size: 1024,
    version: '1.0.5',
    updated_at: '2024-01-13T09:15:00Z'
  },
  {
    id: 4,
    name: 'network_proxy.env',
    description: 'Network proxy and connection configuration',
    category: 'network-config',
    type: 'env',
    status: 'error',
    size: 512,
    version: '1.1.2',
    updated_at: '2024-01-12T14:45:00Z'
  },
  {
    id: 5,
    name: 'system_monitoring.xml',
    description: 'System monitoring and logging configuration',
    category: 'system-config',
    type: 'xml',
    status: 'pending',
    size: 3072,
    version: '3.0.1',
    updated_at: '2024-01-11T11:30:00Z'
  }
])

// Computed
const filteredConfigs = computed(() => {
  let filtered = configs.value

  if (searchTerm.value) {
    filtered = filtered.filter(config =>
      config.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      config.description.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  if (categoryFilter.value !== 'all') {
    filtered = filtered.filter(config => config.category === categoryFilter.value)
  }

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(config => config.status === statusFilter.value)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'status':
        return a.status.localeCompare(b.status)
      case 'category':
        return a.category.localeCompare(b.category)
      case 'date':
      default:
        return new Date(b.updated_at) - new Date(a.updated_at)
    }
  })

  return filtered
})

// Methods
const getConfigIcon = (category) => {
  const icons = {
    'bot-config': '🤖',
    'system-config': '⚙️',
    'security-config': '🔒',
    'network-config': '🌐',
    'database-config': '🗄️',
    'other': '📁'
  }
  return icons[category] || '📁'
}

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const createNewConfig = () => {
  showCreateModal.value = true
}

const submitNewConfig = () => {
  if (newConfig.name && newConfig.category && newConfig.type) {
    const config = {
      id: Date.now(),
      ...newConfig,
      status: 'pending',
      size: Math.floor(Math.random() * 5000) + 500,
      version: '1.0.0',
      updated_at: new Date().toISOString()
    }
    
    configs.value.push(config)
    showCreateModal.value = false
    
    // Reset form
    Object.keys(newConfig).forEach(key => {
      newConfig[key] = ''
    })
    
    updateStats()
  }
}

const editConfig = (configId) => {
  console.log('Editing config:', configId)
  // Implement config editing logic
}

const viewConfig = (configId) => {
  console.log('Viewing config:', configId)
  // Implement config viewing logic
}

const toggleConfigStatus = (configId) => {
  const config = configs.value.find(c => c.id === configId)
  if (config) {
    config.status = config.status === 'active' ? 'inactive' : 'active'
    updateStats()
  }
}

const duplicateConfig = (configId) => {
  console.log('Duplicating config:', configId)
  // Implement config duplication logic
}

const exportConfig = (configId) => {
  console.log('Exporting config:', configId)
  // Implement config export logic
}

const deleteConfig = (configId) => {
  if (confirm('Are you sure you want to delete this config file?')) {
    const index = configs.value.findIndex(c => c.id === configId)
    if (index > -1) {
      configs.value.splice(index, 1)
      updateStats()
    }
  }
}

const updateStats = () => {
  stats.totalFiles = configs.value.length
  stats.activeConfigs = configs.value.filter(c => c.status === 'active').length
  stats.categories = new Set(configs.value.map(c => c.category)).size
  stats.recentUpdates = configs.value.filter(c => {
    const updateDate = new Date(c.updated_at)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    return updateDate > oneDayAgo
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
