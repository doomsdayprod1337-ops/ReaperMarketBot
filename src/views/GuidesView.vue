<template>
  <div class="min-h-screen bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 font-mono">Guides & Tutorials</h1>
        <p class="text-gray-300 text-lg">Step-by-step guides to master the underground market</p>
      </div>

      <!-- Featured Guide -->
      <div v-if="featuredGuide" class="mb-8">
        <div class="bg-gray-800/80 border border-red-500/30 rounded-lg overflow-hidden backdrop-blur-sm">
          <div class="relative">
            <img
              :src="featuredGuide.image"
              :alt="featuredGuide.title"
              class="w-full h-64 object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-6">
              <div class="flex items-center gap-2 mb-2">
                <span class="px-2 py-1 bg-red-500 text-white text-xs rounded">Featured</span>
                <span class="text-gray-300 text-sm">{{ featuredGuide.difficulty }}</span>
                <span class="text-gray-300 text-sm">•</span>
                <span class="text-gray-300 text-sm">{{ featuredGuide.duration }} min</span>
              </div>
              <h2 class="text-2xl font-bold text-white mb-2">{{ featuredGuide.title }}</h2>
              <p class="text-gray-300 mb-4">{{ featuredGuide.excerpt }}</p>
              <button
                @click="startGuide(featuredGuide)"
                class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Start Guide
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
              placeholder="Search guides..."
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
            />
          </div>
          <select v-model="categoryFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Categories</option>
            <option value="beginner">Beginner</option>
            <option value="bot-setup">Bot Setup</option>
            <option value="security">Security</option>
            <option value="automation">Automation</option>
            <option value="marketplace">Marketplace</option>
            <option value="advanced">Advanced</option>
          </select>
          <select v-model="difficultyFilter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <!-- Progress Overview -->
      <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm mb-8">
        <h3 class="text-white font-semibold mb-4 font-reaper">Your Learning Progress</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-white">{{ progress.completed }}</div>
            <div class="text-gray-400 text-sm">Completed</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-400">{{ progress.inProgress }}</div>
            <div class="text-gray-400 text-sm">In Progress</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-400">{{ progress.totalTime }}</div>
            <div class="text-gray-400 text-sm">Hours Learned</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-400">{{ progress.streak }}</div>
            <div class="text-gray-400 text-sm">Day Streak</div>
          </div>
        </div>
      </div>

      <!-- Guides Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="guide in filteredGuides"
          :key="guide.id"
          class="bg-gray-800/80 border border-red-500/30 rounded-lg overflow-hidden backdrop-blur-sm hover:bg-gray-700/80 transition-colors cursor-pointer"
          @click="startGuide(guide)"
        >
          <div class="relative">
            <img
              :src="guide.image"
              :alt="guide.title"
              class="w-full h-48 object-cover"
            />
            <div class="absolute top-4 left-4">
              <span
                :class="`px-2 py-1 text-xs rounded ${
                  guide.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                  guide.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`"
              >
                {{ guide.difficulty }}
              </span>
            </div>
            <div class="absolute top-4 right-4">
              <button
                @click.stop="toggleFavorite(guide.id)"
                class="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                :class="guide.isFavorite ? 'text-red-400' : 'text-gray-400'"
              >
                ❤️
              </button>
            </div>
            <div v-if="guide.progress > 0" class="absolute bottom-0 left-0 right-0">
              <div class="bg-black/50 p-2">
                <div class="flex justify-between text-xs text-white mb-1">
                  <span>Progress</span>
                  <span>{{ guide.progress }}%</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-1">
                  <div
                    class="bg-red-500 h-1 rounded-full transition-all duration-300"
                    :style="{ width: guide.progress + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-6">
            <div class="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <span>{{ guide.category }}</span>
              <span>•</span>
              <span>{{ guide.duration }} min</span>
              <span>•</span>
              <span>{{ guide.lessons }} lessons</span>
            </div>
            
            <h3 class="text-white font-semibold mb-2 line-clamp-2">{{ guide.title }}</h3>
            <p class="text-gray-300 text-sm mb-4 line-clamp-3">{{ guide.excerpt }}</p>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                  <span class="text-red-400 text-xs">👤</span>
                </div>
                <span class="text-gray-400 text-sm">{{ guide.author }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-gray-400 text-sm">⭐ {{ guide.rating }}</span>
                <span class="text-gray-400 text-sm">👥 {{ guide.students }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More -->
      <div class="text-center mt-8">
        <button
          @click="loadMoreGuides"
          class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Load More Guides
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
const difficultyFilter = ref('all')

const progress = reactive({
  completed: 12,
  inProgress: 3,
  totalTime: 45,
  streak: 7
})

const featuredGuide = ref({
  id: 1,
  title: 'Complete Bot Management Masterclass',
  excerpt: 'Learn everything you need to know about bot management, from basic setup to advanced automation techniques.',
  image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
  category: 'bot-setup',
  difficulty: 'intermediate',
  duration: 120,
  lessons: 15,
  author: 'Expert Team',
  rating: 4.8,
  students: 1234
})

const guides = ref([
  {
    id: 2,
    title: 'Getting Started with Bot Automation',
    excerpt: 'A beginner-friendly guide to setting up your first bot and understanding the basics of automation.',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
    category: 'beginner',
    difficulty: 'beginner',
    duration: 45,
    lessons: 8,
    author: 'Beginner Team',
    rating: 4.6,
    students: 2345,
    progress: 0,
    isFavorite: false
  },
  {
    id: 3,
    title: 'Advanced Security Techniques',
    excerpt: 'Learn advanced security measures to protect your operations and maintain anonymity.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=400&fit=crop',
    category: 'security',
    difficulty: 'advanced',
    duration: 90,
    lessons: 12,
    author: 'Security Expert',
    rating: 4.9,
    students: 876,
    progress: 65,
    isFavorite: true
  },
  {
    id: 4,
    title: 'Marketplace Integration Guide',
    excerpt: 'Step-by-step guide to integrating your bots with the marketplace and managing transactions.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    category: 'marketplace',
    difficulty: 'intermediate',
    duration: 75,
    lessons: 10,
    author: 'Market Analyst',
    rating: 4.7,
    students: 1567,
    progress: 0,
    isFavorite: false
  },
  {
    id: 5,
    title: 'Automation Workflows',
    excerpt: 'Create complex automation workflows to streamline your operations and increase efficiency.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
    category: 'automation',
    difficulty: 'intermediate',
    duration: 60,
    lessons: 9,
    author: 'Automation Expert',
    rating: 4.5,
    students: 987,
    progress: 30,
    isFavorite: false
  },
  {
    id: 6,
    title: 'Bot Framework Deep Dive',
    excerpt: 'Advanced techniques for customizing and optimizing bot frameworks for specific use cases.',
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop',
    category: 'advanced',
    difficulty: 'advanced',
    duration: 150,
    lessons: 20,
    author: 'Framework Team',
    rating: 4.9,
    students: 543,
    progress: 0,
    isFavorite: true
  },
  {
    id: 7,
    title: 'Data Analysis and Visualization',
    excerpt: 'Learn how to analyze and visualize data collected from your bots for better insights.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    category: 'advanced',
    difficulty: 'intermediate',
    duration: 80,
    lessons: 11,
    author: 'Data Analyst',
    rating: 4.4,
    students: 1234,
    progress: 0,
    isFavorite: false
  }
])

// Computed
const filteredGuides = computed(() => {
  let filtered = guides.value

  if (searchTerm.value) {
    filtered = filtered.filter(guide =>
      guide.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      guide.excerpt.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  if (categoryFilter.value !== 'all') {
    filtered = filtered.filter(guide => guide.category === categoryFilter.value)
  }

  if (difficultyFilter.value !== 'all') {
    filtered = filtered.filter(guide => guide.difficulty === difficultyFilter.value)
  }

  return filtered
})

// Methods
const startGuide = (guide) => {
  console.log('Starting guide:', guide.title)
  // Implement guide starting logic
}

const toggleFavorite = (guideId) => {
  const guide = guides.value.find(g => g.id === guideId)
  if (guide) {
    guide.isFavorite = !guide.isFavorite
  }
}

const loadMoreGuides = () => {
  console.log('Loading more guides...')
  // Implement load more logic
}

onMounted(() => {
  // Initialize guides system
  console.log('Guides system initialized')
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

.font-reaper {
  font-family: 'Reaper', sans-serif;
}

.font-mono {
  font-family: 'Courier New', monospace;
}
</style>