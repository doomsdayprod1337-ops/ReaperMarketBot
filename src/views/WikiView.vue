<template>
  <div class="min-h-screen bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 font-mono">Knowledge Base</h1>
        <p class="text-gray-300 text-lg">Comprehensive documentation and guides for the underground market</p>
      </div>

      <!-- Search and Filters -->
      <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm mb-8">
        <div class="flex flex-wrap gap-4">
          <div class="relative flex-1 min-w-[200px]">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Search knowledge base..."
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
            />
          </div>
          <select v-model="categoryFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Categories</option>
            <option value="getting-started">Getting Started</option>
            <option value="bot-management">Bot Management</option>
            <option value="security">Security</option>
            <option value="tools">Tools & Software</option>
            <option value="marketplace">Marketplace</option>
            <option value="troubleshooting">Troubleshooting</option>
            <option value="api">API Documentation</option>
          </select>
          <select v-model="difficultyFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <!-- Featured Articles -->
      <div v-if="featuredArticles.length > 0" class="mb-8">
        <h2 class="text-2xl font-bold text-white mb-4 font-reaper">Featured Articles</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="article in featuredArticles"
            :key="article.id"
            class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm hover:bg-gray-700/80 transition-colors cursor-pointer"
            @click="viewArticle(article)"
          >
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <span class="text-red-400 text-xl">{{ article.icon }}</span>
              </div>
              <div>
                <h3 class="text-white font-semibold">{{ article.title }}</h3>
                <div class="text-gray-400 text-sm">{{ article.category }}</div>
              </div>
            </div>
            <p class="text-gray-300 text-sm mb-4">{{ article.excerpt }}</p>
            <div class="flex items-center justify-between text-sm text-gray-400">
              <span>{{ article.readTime }} min read</span>
              <span>{{ article.views }} views</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-white mb-4 font-reaper">Browse by Category</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="category in categories"
            :key="category.id"
            class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm hover:bg-gray-700/80 transition-colors cursor-pointer text-center"
            @click="filterByCategory(category.id)"
          >
            <div class="text-3xl mb-3">{{ category.icon }}</div>
            <h3 class="text-white font-semibold mb-2">{{ category.name }}</h3>
            <p class="text-gray-400 text-sm mb-3">{{ category.description }}</p>
            <div class="text-red-400 text-sm font-medium">{{ category.articleCount }} articles</div>
          </div>
        </div>
      </div>

      <!-- Articles List -->
      <div class="space-y-6">
        <h2 class="text-2xl font-bold text-white mb-4 font-reaper">All Articles</h2>
        
        <div v-if="filteredArticles.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">📚</div>
          <h3 class="text-xl font-semibold text-white mb-2">No articles found</h3>
          <p class="text-gray-400 mb-6">Try adjusting your search or filters</p>
        </div>

        <div
          v-for="article in filteredArticles"
          :key="article.id"
          class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm hover:bg-gray-700/80 transition-colors cursor-pointer"
          @click="viewArticle(article)"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span class="text-red-400 text-xl">{{ article.icon }}</span>
              </div>
              <div class="flex-1">
                <h3 class="text-white font-semibold mb-2">{{ article.title }}</h3>
                <p class="text-gray-300 text-sm mb-3">{{ article.excerpt }}</p>
                <div class="flex items-center gap-4 text-sm text-gray-400">
                  <span>{{ article.category }}</span>
                  <span>•</span>
                  <span>{{ article.difficulty }}</span>
                  <span>•</span>
                  <span>{{ article.readTime }} min read</span>
                  <span>•</span>
                  <span>{{ article.views }} views</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click.stop="toggleFavorite(article.id)"
                class="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                :class="article.isFavorite ? 'text-red-400' : 'text-gray-400'"
              >
                ❤️
              </button>
              <button
                @click.stop="shareArticle(article)"
                class="p-2 hover:bg-gray-600 rounded-lg transition-colors text-gray-400"
              >
                📤
              </button>
            </div>
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in article.tags"
              :key="tag"
              class="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded"
            >
              {{ tag }}
            </span>
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
const difficultyFilter = ref('all')

const categories = ref([
  {
    id: 'getting-started',
    name: 'Getting Started',
    icon: '🚀',
    description: 'Begin your journey',
    articleCount: 12
  },
  {
    id: 'bot-management',
    name: 'Bot Management',
    icon: '🤖',
    description: 'Manage your bots',
    articleCount: 25
  },
  {
    id: 'security',
    name: 'Security',
    icon: '🔒',
    description: 'Stay secure',
    articleCount: 18
  },
  {
    id: 'tools',
    name: 'Tools & Software',
    icon: '⚙️',
    description: 'Software guides',
    articleCount: 31
  }
])

const featuredArticles = ref([
  {
    id: 1,
    title: 'Complete Beginner\'s Guide to Bot Management',
    excerpt: 'Everything you need to know to get started with bot management and automation.',
    icon: '🚀',
    category: 'getting-started',
    readTime: 10,
    views: 15420
  },
  {
    id: 2,
    title: 'Advanced Security Best Practices',
    excerpt: 'Learn how to protect your operations and maintain anonymity in the underground market.',
    icon: '🔒',
    category: 'security',
    readTime: 15,
    views: 12340
  },
  {
    id: 3,
    title: 'Bot Framework API Documentation',
    excerpt: 'Complete API reference for the bot framework with examples and use cases.',
    icon: '📚',
    category: 'api',
    readTime: 20,
    views: 8765
  }
])

const articles = ref([
  {
    id: 4,
    title: 'Setting Up Your First Bot',
    excerpt: 'Step-by-step guide to setting up and configuring your first bot for data collection.',
    icon: '🤖',
    category: 'bot-management',
    difficulty: 'beginner',
    readTime: 8,
    views: 5432,
    tags: ['bot', 'setup', 'configuration'],
    isFavorite: false
  },
  {
    id: 5,
    title: 'Understanding Bot Architecture',
    excerpt: 'Deep dive into how bots work internally and their communication protocols.',
    icon: '🏗️',
    category: 'bot-management',
    difficulty: 'intermediate',
    readTime: 12,
    views: 3210,
    tags: ['architecture', 'protocols', 'communication'],
    isFavorite: true
  },
  {
    id: 6,
    title: 'Security Measures and Anonymity',
    excerpt: 'Essential security practices to protect your identity and operations.',
    icon: '🛡️',
    category: 'security',
    difficulty: 'intermediate',
    readTime: 15,
    views: 7890,
    tags: ['security', 'anonymity', 'protection'],
    isFavorite: false
  },
  {
    id: 7,
    title: 'Troubleshooting Common Bot Issues',
    excerpt: 'Solutions to the most common problems encountered when managing bots.',
    icon: '🔧',
    category: 'troubleshooting',
    difficulty: 'beginner',
    readTime: 6,
    views: 4567,
    tags: ['troubleshooting', 'issues', 'solutions'],
    isFavorite: false
  },
  {
    id: 8,
    title: 'Advanced Bot Customization',
    excerpt: 'Learn how to customize bots for specific use cases and optimize their performance.',
    icon: '⚙️',
    category: 'tools',
    difficulty: 'advanced',
    readTime: 18,
    views: 2345,
    tags: ['customization', 'optimization', 'advanced'],
    isFavorite: true
  },
  {
    id: 9,
    title: 'Marketplace Integration Guide',
    excerpt: 'How to integrate your bots with the marketplace and manage transactions.',
    icon: '🏪',
    category: 'marketplace',
    difficulty: 'intermediate',
    readTime: 10,
    views: 6789,
    tags: ['marketplace', 'integration', 'transactions'],
    isFavorite: false
  }
])

// Computed
const filteredArticles = computed(() => {
  let filtered = articles.value

  if (searchTerm.value) {
    filtered = filtered.filter(article =>
      article.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.value.toLowerCase()))
    )
  }

  if (categoryFilter.value !== 'all') {
    filtered = filtered.filter(article => article.category === categoryFilter.value)
  }

  if (difficultyFilter.value !== 'all') {
    filtered = filtered.filter(article => article.difficulty === difficultyFilter.value)
  }

  return filtered
})

// Methods
const viewArticle = (article) => {
  console.log('Viewing article:', article.title)
  // Implement article viewing logic
}

const toggleFavorite = (articleId) => {
  const article = articles.value.find(a => a.id === articleId)
  if (article) {
    article.isFavorite = !article.isFavorite
  }
}

const shareArticle = (article) => {
  console.log('Sharing article:', article.title)
  // Implement article sharing logic
}

const filterByCategory = (categoryId) => {
  categoryFilter.value = categoryId
}

onMounted(() => {
  // Initialize wiki system
  console.log('Wiki system initialized')
})
</script>

<style scoped>
.font-reaper {
  font-family: 'Reaper', sans-serif;
}

.font-mono {
  font-family: 'Courier New', monospace;
}
</style>