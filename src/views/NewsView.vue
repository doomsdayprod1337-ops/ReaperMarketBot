<template>
  <div class="min-h-screen bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 font-mono">News & Updates</h1>
        <p class="text-gray-300 text-lg">Stay updated with the latest developments in the underground market</p>
      </div>

      <!-- Featured Article -->
      <div v-if="featuredArticle" class="mb-8">
        <div class="bg-gray-800/80 border border-red-500/30 rounded-lg overflow-hidden backdrop-blur-sm">
          <div class="relative">
            <img
              :src="featuredArticle.image"
              :alt="featuredArticle.title"
              class="w-full h-64 object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-6">
              <div class="flex items-center gap-2 mb-2">
                <span class="px-2 py-1 bg-red-500 text-white text-xs rounded">Featured</span>
                <span class="text-gray-300 text-sm">{{ formatDate(featuredArticle.published_at) }}</span>
              </div>
              <h2 class="text-2xl font-bold text-white mb-2">{{ featuredArticle.title }}</h2>
              <p class="text-gray-300 mb-4">{{ featuredArticle.excerpt }}</p>
              <button
                @click="viewArticle(featuredArticle)"
                class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Read More
              </button>
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
              placeholder="Search articles..."
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
            />
          </div>
          <select v-model="categoryFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Categories</option>
            <option value="security">Security</option>
            <option value="market">Market Updates</option>
            <option value="tools">Tools & Software</option>
            <option value="breaches">Data Breaches</option>
            <option value="crypto">Cryptocurrency</option>
            <option value="announcements">Announcements</option>
          </select>
          <select v-model="sortBy" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="latest">Latest</option>
            <option value="popular">Most Popular</option>
            <option value="trending">Trending</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      <!-- Articles Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="article in filteredArticles"
          :key="article.id"
          class="bg-gray-800/80 border border-red-500/30 rounded-lg overflow-hidden backdrop-blur-sm hover:bg-gray-700/80 transition-colors cursor-pointer"
          @click="viewArticle(article)"
        >
          <div class="relative">
            <img
              :src="article.image"
              :alt="article.title"
              class="w-full h-48 object-cover"
            />
            <div class="absolute top-4 left-4">
              <span
                :class="`px-2 py-1 text-xs rounded ${
                  article.category === 'security' ? 'bg-red-500/20 text-red-400' :
                  article.category === 'market' ? 'bg-blue-500/20 text-blue-400' :
                  article.category === 'tools' ? 'bg-green-500/20 text-green-400' :
                  article.category === 'breaches' ? 'bg-orange-500/20 text-orange-400' :
                  article.category === 'crypto' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-purple-500/20 text-purple-400'
                }`"
              >
                {{ article.category }}
              </span>
            </div>
            <div class="absolute top-4 right-4">
              <button
                @click.stop="toggleFavorite(article.id)"
                class="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                :class="article.isFavorite ? 'text-red-400' : 'text-gray-400'"
              >
                ❤️
              </button>
            </div>
          </div>
          
          <div class="p-6">
            <div class="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <span>{{ formatDate(article.published_at) }}</span>
              <span>•</span>
              <span>{{ article.readTime }} min read</span>
              <span>•</span>
              <span>{{ article.views }} views</span>
            </div>
            
            <h3 class="text-white font-semibold mb-2 line-clamp-2">{{ article.title }}</h3>
            <p class="text-gray-300 text-sm mb-4 line-clamp-3">{{ article.excerpt }}</p>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                  <span class="text-red-400 text-xs">👤</span>
                </div>
                <span class="text-gray-400 text-sm">{{ article.author }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-gray-400 text-sm">👍 {{ article.likes }}</span>
                <span class="text-gray-400 text-sm">💬 {{ article.comments }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More -->
      <div class="text-center mt-8">
        <button
          @click="loadMoreArticles"
          class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Load More Articles
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// State
const searchTerm = ref('')
const categoryFilter = ref('all')
const sortBy = ref('latest')

const featuredArticle = ref({
  id: 1,
  title: 'Major Security Breach Exposes 50M User Credentials',
  excerpt: 'A massive data breach has exposed over 50 million user credentials from various platforms. Security experts are warning users to change their passwords immediately.',
  image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
  category: 'security',
  published_at: '2024-01-15T10:00:00Z',
  author: 'Security Team',
  readTime: 5,
  views: 15420,
  likes: 892,
  comments: 156,
  isFavorite: false
})

const articles = ref([
  {
    id: 2,
    title: 'New Bot Framework Released with Enhanced Features',
    excerpt: 'The latest version of our bot framework includes improved stealth capabilities and better data extraction methods.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
    category: 'tools',
    published_at: '2024-01-14T15:30:00Z',
    author: 'Dev Team',
    readTime: 3,
    views: 8234,
    likes: 456,
    comments: 89,
    isFavorite: false
  },
  {
    id: 3,
    title: 'Cryptocurrency Market Analysis: January 2024',
    excerpt: 'An in-depth analysis of the current cryptocurrency market trends and their impact on the underground economy.',
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop',
    category: 'crypto',
    published_at: '2024-01-14T12:00:00Z',
    author: 'Crypto Analyst',
    readTime: 7,
    views: 12345,
    likes: 678,
    comments: 134,
    isFavorite: true
  },
  {
    id: 4,
    title: 'Data Breach at Major Social Media Platform',
    excerpt: 'Another major social media platform has suffered a data breach, exposing millions of user accounts.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop',
    category: 'breaches',
    published_at: '2024-01-13T18:45:00Z',
    author: 'News Team',
    readTime: 4,
    views: 9876,
    likes: 234,
    comments: 67,
    isFavorite: false
  },
  {
    id: 5,
    title: 'Market Update: Bot Prices and Availability',
    excerpt: 'Current market conditions and pricing for various bot types and their availability across different regions.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    category: 'market',
    published_at: '2024-01-13T14:20:00Z',
    author: 'Market Analyst',
    readTime: 6,
    views: 6543,
    likes: 345,
    comments: 78,
    isFavorite: false
  },
  {
    id: 6,
    title: 'New Security Measures Implemented',
    excerpt: 'We have implemented new security measures to protect user data and ensure platform integrity.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=400&fit=crop',
    category: 'announcements',
    published_at: '2024-01-12T09:15:00Z',
    author: 'Admin Team',
    readTime: 2,
    views: 4321,
    likes: 123,
    comments: 45,
    isFavorite: false
  }
])

// Computed
const filteredArticles = computed(() => {
  let filtered = articles.value

  if (searchTerm.value) {
    filtered = filtered.filter(article =>
      article.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  if (categoryFilter.value !== 'all') {
    filtered = filtered.filter(article => article.category === categoryFilter.value)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'popular':
        return b.views - a.views
      case 'trending':
        return (b.likes + b.comments) - (a.likes + a.comments)
      case 'oldest':
        return new Date(a.published_at) - new Date(b.published_at)
      case 'latest':
      default:
        return new Date(b.published_at) - new Date(a.published_at)
    }
  })

  return filtered
})

// Methods
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

const loadMoreArticles = () => {
  console.log('Loading more articles...')
  // Implement load more logic
}

onMounted(() => {
  // Initialize news system
  console.log('News system initialized')
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.font-mono {
  font-family: 'Courier New', monospace;
}
</style>