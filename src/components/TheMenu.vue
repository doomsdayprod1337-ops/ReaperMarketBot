<template>
  <!-- Mobile sidebar backdrop -->
  <div
    v-if="sidebarOpen"
    class="fixed inset-0 bg-black/50 z-40 lg:hidden"
    @click="sidebarOpen = false"
    @touchstart="sidebarOpen = false"
  />

  <!-- Sidebar -->
  <div
    :class="`fixed inset-y-0 left-0 z-50 w-80 sm:w-72 md:w-64 bg-reaper-dark-gray/95 border-r border-reaper-red/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`"
    @mouseenter="handleSidebarMouseEnter"
    @mouseleave="handleSidebarMouseLeave"
    @touchstart.stop
  >
    <div class="flex flex-col h-full">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-reaper-red/20">
        <router-link to="/" class="flex items-center gap-2" @click="sidebarOpen = false">
          <Skull class="w-8 h-8 text-reaper-red animate-pulse" />
          <span class="font-reaper text-xl font-bold text-reaper-red">
            REAPER
          </span>
        </router-link>
        <button
          class="lg:hidden p-3 hover:bg-reaper-red/10 rounded-lg transition-colors touch-manipulation"
          @click="sidebarOpen = false"
          @touchstart="sidebarOpen = false"
        >
          <X class="w-5 h-5 text-gray-300" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-3 sm:p-4 space-y-2 overflow-y-auto overscroll-contain">
        <!-- Main Section -->
        <CollapsibleSection 
          title="Main" 
          :isOpen="!collapsedSections.main"
          @toggle="toggleSection('main')"
          class="mt-0"
        >
          <div v-for="item in mainNavigation" :key="item.name" class="relative">
            <router-link
              :to="item.href"
              :class="`flex items-center justify-between px-3 py-4 sm:py-3 md:py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation ${
                isCurrentPath(item.href)
                  ? 'bg-reaper-red text-white shadow-lg'
                  : 'text-gray-300 hover:bg-reaper-red/10 hover:text-white active:bg-reaper-red/20'
              }`"
              @click="sidebarOpen = false"
              @touchstart="sidebarOpen = false"
            >
              <div class="flex items-center gap-3">
                <component :is="item.icon" class="w-4 h-4" />
                {{ item.name }}
              </div>
              <Badge 
                v-if="item.showCount && getResourceCount(item.category) > 0"
                :variant="isCurrentPath(item.href) ? 'secondary' : 'outline'"
                :class="`text-xs ${
                  isCurrentPath(item.href) 
                    ? 'bg-white/20 text-white border-white/30' 
                    : 'bg-reaper-red/20 text-reaper-red border-reaper-red/30'
                }`"
              >
                {{ getResourceCount(item.category) }}
              </Badge>
            </router-link>
          </div>
        </CollapsibleSection>

        <!-- Shop Section -->
        <CollapsibleSection 
          title="Shop" 
          :isOpen="!collapsedSections.shop"
          @toggle="toggleSection('shop')"
          class="mt-6"
        >
          <router-link
            v-for="item in shopNavigation"
            :key="item.name"
            :to="item.href"
            :class="`flex items-center justify-between px-3 py-4 sm:py-3 md:py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation ${
              isCurrentPath(item.href)
                ? 'bg-reaper-red text-white shadow-lg'
                : 'text-gray-300 hover:bg-reaper-red/10 hover:text-white active:bg-reaper-red/20'
            }`"
            @click="sidebarOpen = false"
            @touchstart="sidebarOpen = false"
          >
            <div class="flex items-center gap-3">
              <component :is="item.icon" class="w-4 h-4" />
              {{ item.name }}
            </div>
            <Badge 
              v-if="item.showCount && getResourceCount(item.category) > 0"
              :variant="isCurrentPath(item.href) ? 'secondary' : 'outline'"
              :class="`text-xs ${
                isCurrentPath(item.href) 
                  ? 'bg-white/20 text-white border-white/30' 
                  : 'bg-reaper-red/20 text-reaper-red border-reaper-red/30'
              }`"
            >
              {{ getResourceCount(item.category) }}
            </Badge>
          </router-link>
        </CollapsibleSection>

        <!-- Resources Section -->
        <CollapsibleSection 
          title="Resources" 
          :isOpen="!collapsedSections.resources"
          @toggle="toggleSection('resources')"
          class="mt-6"
        >
          <router-link
            v-for="item in resourcesNavigation"
            :key="item.name"
            :to="item.href"
            :class="`flex items-center justify-between px-3 py-4 sm:py-3 md:py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation ${
              isCurrentPath(item.href)
                ? 'bg-reaper-red text-white shadow-lg'
                : 'text-gray-300 hover:bg-reaper-red/10 hover:text-white active:bg-reaper-red/20'
            }`"
            @click="sidebarOpen = false"
            @touchstart="sidebarOpen = false"
          >
            <div class="flex items-center gap-3">
              <component :is="item.icon" class="w-4 h-4" />
              {{ item.name }}
            </div>
            <Badge 
              v-if="item.showCount && getResourceCount(item.category) > 0"
              :variant="isCurrentPath(item.href) ? 'secondary' : 'outline'"
              :class="`text-xs ${
                isCurrentPath(item.href) 
                  ? 'bg-white/20 text-white border-white/30' 
                  : 'bg-reaper-red/20 text-reaper-red border-reaper-red/30'
              }`"
            >
              {{ getResourceCount(item.category) }}
            </Badge>
          </router-link>
        </CollapsibleSection>

        <!-- Profile Section -->
        <CollapsibleSection 
          title="Profile" 
          :isOpen="!collapsedSections.profile"
          @toggle="toggleSection('profile')"
          class="mt-6"
        >
          <template v-if="isAuthenticated">
            <router-link
              v-for="item in profileNavigation"
              :key="item.name"
              :to="item.href"
              :class="`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isCurrentPath(item.href)
                  ? 'bg-reaper-red text-white shadow-lg'
                  : 'text-gray-300 hover:bg-reaper-red/10 hover:text-white'
              }`"
              @click="sidebarOpen = false"
            >
              <component :is="item.icon" class="w-4 h-4" />
              {{ item.name }}
            </router-link>
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-reaper-red/10 hover:text-white"
              @click="sidebarOpen = false"
            >
              <User class="w-4 h-4" />
              Login
            </router-link>
            <router-link 
              to="/register"
              class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-reaper-red/10 hover:text-white"
              @click="sidebarOpen = false"
            >
              <User class="w-4 h-4" />
              Register
            </router-link>
          </template>
        </CollapsibleSection>
        </nav>

      <!-- User Section -->
      <div v-if="isAuthenticated" class="p-4 border-t border-reaper-red/20">
        <div class="flex items-center gap-3 mb-3">
          <!-- Profile Image -->
          <div class="relative">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-reaper-red to-red-800 flex items-center justify-center border-2 border-reaper-red/30">
              <div class="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-sm">
                {{ userData?.username?.charAt(0).toUpperCase() || 'U' }}
              </div>
            </div>
            <!-- Online Status Indicator -->
            <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-reaper-dark-gray"></div>
          </div>
          
          <!-- User Info -->
          <div class="flex-1 min-w-0">
            <div class="text-xs text-gray-400 mb-1">Logged in as</div>
            <div class="text-sm text-white truncate font-medium">
              {{ userData?.username || userData?.email }}
            </div>
            <div class="text-xs text-gray-400 truncate">
              {{ userData?.email }}
            </div>
          </div>
        </div>
        
        <div class="flex gap-2">
          <button
            class="flex-1 border border-blue-600/40 text-blue-400 hover:bg-blue-600/10 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            @click="refreshSession"
            :disabled="refreshing"
          >
            <RefreshCw v-if="!refreshing" class="w-4 h-4 mr-2 inline" />
            <div v-else class="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mr-2 inline"></div>
            {{ refreshing ? '...' : 'Refresh' }}
          </button>
          <button
            class="flex-1 border border-reaper-red/30 text-gray-300 hover:bg-reaper-red/10 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            @click="handleLogout"
          >
            <LogOut class="w-4 h-4 mr-2 inline" />
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Top bar -->
  <div class="sticky top-0 z-30 bg-reaper-dark-gray/90 border-b border-reaper-red/20 backdrop-blur-sm">
    <div class="flex items-center justify-between px-4 py-3">
      <button
        class="lg:hidden p-2 hover:bg-reaper-red/10 rounded-lg transition-colors touch-manipulation"
        @click="sidebarOpen = true"
        @touchstart="sidebarOpen = true"
      >
        <Menu class="w-5 h-5 text-gray-300" />
      </button>

      <div class="flex items-center justify-between w-full">
        <div v-if="!isAuthenticated" class="flex gap-2">
          <router-link to="/login">
            <button class="border border-gray-600 text-gray-300 hover:bg-gray-700 px-3 py-1 rounded text-sm transition-colors touch-manipulation">
              Login
            </button>
          </router-link>
          <router-link to="/register">
            <button class="bg-reaper-red hover:bg-reaper-red/80 text-white px-3 py-1 rounded text-sm transition-colors touch-manipulation">
              Register
            </button>
          </router-link>
        </div>
        <div v-else class="flex items-center gap-2">
          <!-- Shopping Cart -->
          <div class="relative">
            <button
              class="border border-orange-600/40 text-orange-400 hover:bg-orange-600/10 px-3 py-1 rounded text-sm transition-colors relative touch-manipulation"
              @click="toggleCart"
              @touchstart="toggleCart"
            >
              <ShoppingCart class="w-4 h-4 inline mr-1" />
              <span class="hidden sm:inline">Cart</span>
              <Badge 
                v-if="cartCount > 0"
                class="absolute -top-2 -right-2 bg-reaper-red text-white text-xs min-w-[1.25rem] h-5 flex items-center justify-center rounded-full"
              >
                {{ cartCount }}
              </Badge>
            </button>
          </div>

          <!-- Notifications -->
          <button
            class="text-gray-300 hover:text-white p-2 rounded-lg transition-colors touch-manipulation"
            @click="toggleNotifications"
            @touchstart="toggleNotifications"
          >
            <Bell class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { 
  Skull, Home, Package, Bot, CreditCard, Users, FileText, Download, 
  Coins, Newspaper, BookOpen, Book, HelpCircle, User, Menu, X, 
  Settings, LogOut, Shield, RefreshCw, ShoppingCart, Bell, Search, 
  MessageSquare, Store
} from 'lucide-vue-next'

const router = useRouter()
const cartStore = useCartStore()

// State
const sidebarOpen = ref(false)
const refreshing = ref(false)
const cartOpen = ref(false)
const notificationOpen = ref(false)
const sidebarHovered = ref(false)
const sidebarTimeout = ref(null)

// Collapsible sections state - all collapsed by default
const collapsedSections = reactive({
  main: true,
  shop: true,
  resources: true,
  profile: true,
})

// Check if user is authenticated
const isAuthenticated = computed(() => {
  return !!localStorage.getItem('marketplace_token')
})

// Get user data
const userData = computed(() => {
  const userDataStr = localStorage.getItem('user_data')
  return userDataStr ? JSON.parse(userDataStr) : null
})

// Cart count from store
const cartCount = computed(() => {
  return cartStore.itemCount
})

// Navigation items
const mainNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home, showCount: false, category: null },
  { name: "Chat", href: "/chat", icon: MessageSquare, showCount: false, category: null },
  { name: "News", href: "/news", icon: Newspaper, showCount: true, category: "news" },
  { name: "Wiki", href: "/wiki", icon: BookOpen, showCount: true, category: "wiki" },
  { name: "Guides", href: "/guides", icon: Book, showCount: true, category: "guides" },
  { name: "Notifications", href: "/notifications", icon: Bell, showCount: false, category: null },
]

const shopNavigation = [
  { name: "Services", href: "/services", icon: Package, showCount: true, category: "services" },
  { name: "Bots", href: "/bots", icon: Bot, showCount: true, category: "bots" },
  { name: "Credit Cards", href: "/credit-cards", icon: CreditCard, showCount: true, category: "credit-cards" },
  { name: "Documents", href: "/documents", icon: FileText, showCount: true, category: "documents" },
  { name: "Finance Docs", href: "/finance-documents", icon: FileText, showCount: true, category: "finance-documents" },
  { name: "Config Files", href: "/checker-files", icon: FileText, showCount: true, category: "checker-files" },
  { name: "Inbox Requests", href: "/inbox-requests", icon: MessageSquare, showCount: true, category: "inbox-requests" },
]

const resourcesNavigation = [
  { name: "Downloads", href: "/downloads", icon: Download, showCount: true, category: "downloads" },
  { name: "Bin Checker", href: "/bin-checker", icon: CreditCard, showCount: false, category: null },
  { name: "Generate FP", href: "/generate-fp", icon: Shield, showCount: false, category: null },
  { name: "Credential Search", href: "/credentials", icon: Search, showCount: false, category: null },
  { name: "Token Dumper", href: "/token-dumper", icon: Bot, showCount: false, category: null },
]

const profileNavigation = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Order History", href: "/purchases", icon: Package },
  { name: "Transactions", href: "/transactions", icon: CreditCard },
  { name: "Referrals", href: "/referrals", icon: Users },
  { name: "Tickets", href: "/tickets", icon: HelpCircle },
]

// Methods
const toggleSection = (section) => {
  collapsedSections[section] = !collapsedSections[section]
}

const isCurrentPath = (path) => {
  return router.currentRoute.value.path === path
}

const getResourceCount = (category) => {
  // Mock resource counts
  const counts = {
    news: 5,
    wiki: 12,
    guides: 8,
    services: 15,
    bots: 1247,
    'credit-cards': 89,
    documents: 23,
    'finance-documents': 7,
    'checker-files': 3,
    'inbox-requests': 2,
    downloads: 45
  }
  return counts[category] || 0
}

const handleSidebarMouseEnter = () => {
  sidebarHovered.value = true
  if (sidebarTimeout.value) {
    clearTimeout(sidebarTimeout.value)
    sidebarTimeout.value = null
  }
}

const handleSidebarMouseLeave = () => {
  sidebarHovered.value = false
  // Auto-collapse after 3 seconds of no interaction
  const timeout = setTimeout(() => {
    if (!sidebarHovered.value) {
      sidebarOpen.value = false
    }
  }, 3000)
  sidebarTimeout.value = timeout
}

const refreshSession = async () => {
  refreshing.value = true
  try {
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Refresh user data logic here
  } catch (error) {
    console.error('Failed to refresh session:', error)
  } finally {
    refreshing.value = false
  }
}

const handleLogout = async () => {
  localStorage.removeItem('marketplace_token')
  localStorage.removeItem('user_data')
  router.push('/')
}

const toggleCart = () => {
  cartStore.toggleCart()
  if (cartStore.isOpen) {
    notificationOpen.value = false
  }
}

const toggleNotifications = () => {
  notificationOpen.value = !notificationOpen.value
  if (notificationOpen.value) {
    cartOpen.value = false
  }
}

// Clear timeout on component unmount
onMounted(() => {
  return () => {
    if (sidebarTimeout.value) {
      clearTimeout(sidebarTimeout.value)
    }
  }
})
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

.border-reaper-red\/20 {
  border-color: rgba(229, 62, 62, 0.2);
}

.hover\:bg-reaper-red\/10:hover {
  background-color: rgba(229, 62, 62, 0.1);
}

.bg-reaper-red {
  background-color: #e53e3e;
}

.hover\:bg-reaper-red\/80:hover {
  background-color: rgba(229, 62, 62, 0.8);
}
</style>
