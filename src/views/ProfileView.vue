<template>
  <div class="min-h-screen bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 font-mono">Profile</h1>
        <p class="text-gray-300 text-lg">Manage your account settings and preferences</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Personal Information -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Personal Information</h3>
            <form @submit.prevent="updateProfile" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-white mb-2">Username</label>
                  <input
                    v-model="profileForm.username"
                    type="text"
                    class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-white mb-2">Email</label>
                  <input
                    v-model="profileForm.email"
                    type="email"
                    class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
                  />
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-white mb-2">Country</label>
                  <select
                    v-model="profileForm.country"
                    class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:ring-red-500/20"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="AU">Australia</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-white mb-2">Telegram</label>
                  <input
                    v-model="profileForm.telegram"
                    type="text"
                    class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
                    placeholder="@username"
                  />
                </div>
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="isUpdating"
                  class="px-6 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  <span v-if="!isUpdating">Update Profile</span>
                  <span v-else class="flex items-center gap-2">
                    <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Updating...
                  </span>
                </button>
              </div>
            </form>
          </div>

          <!-- Security Settings -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Security Settings</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div>
                  <div class="text-white font-medium">Two-Factor Authentication</div>
                  <div class="text-gray-400 text-sm">Add an extra layer of security to your account</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input v-model="securitySettings.twoFactor" type="checkbox" class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>

              <div class="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div>
                  <div class="text-white font-medium">Email Notifications</div>
                  <div class="text-gray-400 text-sm">Receive important updates via email</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input v-model="securitySettings.emailNotifications" type="checkbox" class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>

              <div class="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div>
                  <div class="text-white font-medium">Telegram Notifications</div>
                  <div class="text-gray-400 text-sm">Get instant updates via Telegram</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input v-model="securitySettings.telegramNotifications" type="checkbox" class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>
            </div>
          </div>

          <!-- Change Password -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Change Password</h3>
            <form @submit.prevent="changePassword" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-white mb-2">Current Password</label>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-white mb-2">New Password</label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-white mb-2">Confirm New Password</label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
                />
              </div>
              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="isChangingPassword"
                  class="px-6 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  <span v-if="!isChangingPassword">Change Password</span>
                  <span v-else class="flex items-center gap-2">
                    <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Changing...
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Profile Card -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <div class="text-center">
              <div class="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-red-400 text-3xl">👤</span>
              </div>
              <h3 class="text-white font-semibold text-lg">{{ userData?.username || 'User' }}</h3>
              <p class="text-gray-400 text-sm">{{ userData?.email }}</p>
              <div class="mt-4">
                <div class="text-xs text-gray-400 mb-1">Member since</div>
                <div class="text-sm text-white">{{ formatDate(userData?.created_at) }}</div>
              </div>
            </div>
          </div>

          <!-- Account Stats -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Account Stats</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">Total Orders</span>
                <span class="text-white font-medium">{{ stats.totalOrders }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">Total Spent</span>
                <span class="text-white font-medium">${{ stats.totalSpent.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">Bots Purchased</span>
                <span class="text-white font-medium">{{ stats.botsPurchased }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">Success Rate</span>
                <span class="text-green-400 font-medium">{{ stats.successRate }}%</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Quick Actions</h3>
            <div class="space-y-2">
              <button
                @click="downloadData"
                class="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
              >
                📥 Download My Data
              </button>
              <button
                @click="exportOrders"
                class="w-full p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
              >
                📊 Export Orders
              </button>
              <button
                @click="deleteAccount"
                class="w-full p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
              >
                🗑️ Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// State
const isUpdating = ref(false)
const isChangingPassword = ref(false)

const userData = ref(null)
const profileForm = reactive({
  username: '',
  email: '',
  country: '',
  telegram: ''
})

const securitySettings = reactive({
  twoFactor: false,
  emailNotifications: true,
  telegramNotifications: true
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const stats = reactive({
  totalOrders: 0,
  totalSpent: 0,
  botsPurchased: 0,
  successRate: 95
})

// Methods
const loadUserData = () => {
  const savedUserData = localStorage.getItem('user_data')
  if (savedUserData) {
    userData.value = JSON.parse(savedUserData)
    profileForm.username = userData.value.username || ''
    profileForm.email = userData.value.email || ''
    profileForm.country = userData.value.country || ''
    profileForm.telegram = userData.value.telegram_username || ''
  }
}

const loadStats = () => {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]')
  stats.totalOrders = orders.length
  stats.totalSpent = orders.reduce((sum, order) => sum + order.total, 0)
  stats.botsPurchased = orders.reduce((sum, order) => sum + order.items.length, 0)
}

const updateProfile = async () => {
  isUpdating.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Update local data
    const updatedUser = {
      ...userData.value,
      username: profileForm.username,
      email: profileForm.email,
      country: profileForm.country,
      telegram_username: profileForm.telegram
    }
    
    localStorage.setItem('user_data', JSON.stringify(updatedUser))
    userData.value = updatedUser
    
    alert('Profile updated successfully!')
  } catch (error) {
    console.error('Profile update error:', error)
    alert('Failed to update profile. Please try again.')
  } finally {
    isUpdating.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    alert('New passwords do not match!')
    return
  }
  
  isChangingPassword.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Clear form
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    
    alert('Password changed successfully!')
  } catch (error) {
    console.error('Password change error:', error)
    alert('Failed to change password. Please try again.')
  } finally {
    isChangingPassword.value = false
  }
}

const downloadData = () => {
  console.log('Downloading user data...')
  // Implement data download
}

const exportOrders = () => {
  console.log('Exporting orders...')
  // Implement order export
}

const deleteAccount = () => {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    console.log('Deleting account...')
    // Implement account deletion
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  loadUserData()
  loadStats()
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