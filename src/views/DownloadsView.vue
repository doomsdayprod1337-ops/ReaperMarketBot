<template>
  <div class="min-h-screen bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 font-mono">Downloads</h1>
        <p class="text-gray-300 text-lg">Manage your downloaded files and resources</p>
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
              <div class="text-2xl font-bold text-white font-mono">{{ formatSize(stats.totalSize) }}</div>
              <div class="text-xs text-gray-300">Total Size</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.recentDownloads }}</div>
              <div class="text-xs text-gray-300">Recent</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-purple-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.categories }}</div>
              <div class="text-xs text-gray-300">Categories</div>
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
              placeholder="Search files..."
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
            />
          </div>
          <select v-model="categoryFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Categories</option>
            <option value="bots">Bot Data</option>
            <option value="tools">Tools</option>
            <option value="documents">Documents</option>
            <option value="media">Media</option>
            <option value="other">Other</option>
          </select>
          <select v-model="sortBy" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
            <option value="type">Sort by Type</option>
          </select>
          <button
            @click="refreshDownloads"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <!-- Downloads List -->
      <div class="space-y-4">
        <div v-if="filteredDownloads.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">📁</div>
          <h3 class="text-xl font-semibold text-white mb-2">No downloads found</h3>
          <p class="text-gray-400 mb-6">Your downloaded files will appear here</p>
          <button
            @click="refreshDownloads"
            class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Refresh Downloads
          </button>
        </div>

        <div
          v-for="download in filteredDownloads"
          :key="download.id"
          class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <span class="text-red-400 text-xl">{{ getFileIcon(download.type) }}</span>
              </div>
              <div>
                <h3 class="text-white font-semibold">{{ download.name }}</h3>
                <div class="flex items-center gap-4 text-sm text-gray-400">
                  <span>{{ formatSize(download.size) }}</span>
                  <span>•</span>
                  <span>{{ download.type.toUpperCase() }}</span>
                  <span>•</span>
                  <span>{{ formatDate(download.downloaded_at) }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div
                :class="`px-2 py-1 rounded text-xs ${
                  download.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  download.status === 'downloading' ? 'bg-blue-500/20 text-blue-400' :
                  download.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                }`"
              >
                {{ download.status }}
              </div>
            </div>
          </div>

          <!-- File Details -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="bg-gray-700/50 p-3 rounded-lg">
              <div class="text-gray-400 text-xs mb-1">Source</div>
              <div class="text-white text-sm">{{ download.source }}</div>
            </div>
            <div class="bg-gray-700/50 p-3 rounded-lg">
              <div class="text-gray-400 text-xs mb-1">Category</div>
              <div class="text-white text-sm">{{ download.category }}</div>
            </div>
            <div class="bg-gray-700/50 p-3 rounded-lg">
              <div class="text-gray-400 text-xs mb-1">Downloads</div>
              <div class="text-white text-sm">{{ download.downloadCount }}</div>
            </div>
          </div>

          <!-- Progress Bar (for downloading files) -->
          <div v-if="download.status === 'downloading'" class="mb-4">
            <div class="flex justify-between text-sm text-gray-400 mb-1">
              <span>Downloading...</span>
              <span>{{ download.progress }}%</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div
                class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: download.progress + '%' }"
              ></div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <button
                @click="downloadFile(download)"
                :disabled="download.status === 'downloading'"
                class="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
              >
                <span v-if="download.status === 'downloading'">Downloading...</span>
                <span v-else>Download</span>
              </button>
              <button
                @click="viewFile(download)"
                class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
              >
                View
              </button>
              <button
                @click="shareFile(download)"
                class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm"
              >
                Share
              </button>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="toggleFavorite(download.id)"
                class="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                :class="download.isFavorite ? 'text-red-400' : 'text-gray-400'"
              >
                ❤️
              </button>
              <button
                @click="deleteFile(download.id)"
                class="p-2 hover:bg-gray-600 rounded-lg transition-colors text-red-400"
              >
                🗑️
              </button>
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
const categoryFilter = ref('all')
const sortBy = ref('date')

const stats = reactive({
  totalFiles: 0,
  totalSize: 0,
  recentDownloads: 0,
  categories: 0
})

const downloads = ref([
  {
    id: 1,
    name: 'bot_data_export_2024.json',
    type: 'json',
    size: 2048576,
    source: 'Bot Management',
    category: 'bots',
    status: 'completed',
    progress: 100,
    downloaded_at: '2024-01-15T10:30:00Z',
    downloadCount: 1,
    isFavorite: false
  },
  {
    id: 2,
    name: 'stealer_logs_compressed.zip',
    type: 'zip',
    size: 15728640,
    source: 'Bot Purchase',
    category: 'bots',
    status: 'downloading',
    progress: 65,
    downloaded_at: '2024-01-15T11:15:00Z',
    downloadCount: 1,
    isFavorite: true
  },
  {
    id: 3,
    name: 'fingerprint_generator.exe',
    type: 'exe',
    size: 5242880,
    source: 'Tools',
    category: 'tools',
    status: 'completed',
    progress: 100,
    downloaded_at: '2024-01-14T16:45:00Z',
    downloadCount: 3,
    isFavorite: false
  },
  {
    id: 4,
    name: 'bin_checker_results.csv',
    type: 'csv',
    size: 1024000,
    source: 'BIN Checker',
    category: 'documents',
    status: 'completed',
    progress: 100,
    downloaded_at: '2024-01-14T14:20:00Z',
    downloadCount: 1,
    isFavorite: false
  },
  {
    id: 5,
    name: 'token_analysis_report.pdf',
    type: 'pdf',
    size: 3145728,
    source: 'Token Dumper',
    category: 'documents',
    status: 'failed',
    progress: 0,
    downloaded_at: '2024-01-13T09:10:00Z',
    downloadCount: 0,
    isFavorite: false
  }
])

// Computed
const filteredDownloads = computed(() => {
  let filtered = downloads.value

  if (searchTerm.value) {
    filtered = filtered.filter(download =>
      download.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  if (categoryFilter.value !== 'all') {
    filtered = filtered.filter(download => download.category === categoryFilter.value)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'size':
        return b.size - a.size
      case 'type':
        return a.type.localeCompare(b.type)
      case 'date':
      default:
        return new Date(b.downloaded_at) - new Date(a.downloaded_at)
    }
  })

  return filtered
})

// Methods
const getFileIcon = (type) => {
  const icons = {
    json: '📄',
    zip: '📦',
    exe: '⚙️',
    csv: '📊',
    pdf: '📋',
    txt: '📝',
    png: '🖼️',
    jpg: '🖼️',
    mp4: '🎥',
    mp3: '🎵'
  }
  return icons[type] || '📄'
}

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
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

const refreshDownloads = () => {
  console.log('Refreshing downloads...')
  // Implement refresh logic
}

const downloadFile = (download) => {
  console.log('Downloading file:', download.name)
  // Implement download logic
}

const viewFile = (download) => {
  console.log('Viewing file:', download.name)
  // Implement file viewing logic
}

const shareFile = (download) => {
  console.log('Sharing file:', download.name)
  // Implement file sharing logic
}

const toggleFavorite = (downloadId) => {
  const download = downloads.value.find(d => d.id === downloadId)
  if (download) {
    download.isFavorite = !download.isFavorite
  }
}

const deleteFile = (downloadId) => {
  if (confirm('Are you sure you want to delete this file?')) {
    const index = downloads.value.findIndex(d => d.id === downloadId)
    if (index > -1) {
      downloads.value.splice(index, 1)
    }
  }
}

const updateStats = () => {
  stats.totalFiles = downloads.value.length
  stats.totalSize = downloads.value.reduce((sum, download) => sum + download.size, 0)
  stats.recentDownloads = downloads.value.filter(d => {
    const downloadDate = new Date(d.downloaded_at)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    return downloadDate > oneDayAgo
  }).length
  stats.categories = new Set(downloads.value.map(d => d.category)).size
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