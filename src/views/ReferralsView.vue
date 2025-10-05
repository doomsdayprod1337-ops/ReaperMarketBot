<template>
  <div class="min-h-screen bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 font-mono">Referrals</h1>
        <p class="text-gray-300 text-lg">Earn rewards by referring friends to the platform</p>
      </div>

      <!-- Stats Overview -->
      <div class="grid gap-4 md:grid-cols-4 mb-8">
        <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-red-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.totalReferrals }}</div>
              <div class="text-xs text-gray-300">Total Referrals</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-green-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stats.activeReferrals }}</div>
              <div class="text-xs text-gray-300">Active Users</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">${{ stats.totalEarnings.toFixed(2) }}</div>
              <div class="text-xs text-gray-300">Total Earnings</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-purple-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">${{ stats.pendingEarnings.toFixed(2) }}</div>
              <div class="text-xs text-gray-300">Pending Earnings</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Referral Link Section -->
      <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm mb-8">
        <h3 class="text-xl font-semibold text-white mb-4">Your Referral Link</h3>
        <div class="flex items-center gap-4">
          <input
            v-model="referralLink"
            readonly
            class="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono"
          />
          <button
            @click="copyReferralLink"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            📋 Copy Link
          </button>
        </div>
        <p class="text-gray-400 text-sm mt-2">
          Share this link with friends to earn {{ referralRate }}% commission on their purchases
        </p>
      </div>

      <!-- Referral Program Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-gray-800/80 border border-green-500/30 rounded-lg p-6 backdrop-blur-sm">
          <h3 class="text-lg font-semibold text-green-400 mb-4">💰 How It Works</h3>
          <ul class="space-y-2 text-gray-300 text-sm">
            <li>• Share your referral link with friends</li>
            <li>• Earn {{ referralRate }}% commission on their purchases</li>
            <li>• Commissions are paid within 24 hours</li>
            <li>• No limit on number of referrals</li>
            <li>• Referrals must make a purchase to qualify</li>
          </ul>
        </div>
        <div class="bg-gray-800/80 border border-blue-500/30 rounded-lg p-6 backdrop-blur-sm">
          <h3 class="text-lg font-semibold text-blue-400 mb-4">🎯 Referral Rewards</h3>
          <ul class="space-y-2 text-gray-300 text-sm">
            <li>• {{ referralRate }}% commission on all purchases</li>
            <li>• Bonus ${{ bonusAmount }} for every {{ bonusThreshold }} referrals</li>
            <li>• Special rewards for top referrers</li>
            <li>• Monthly referral leaderboard prizes</li>
            <li>• Lifetime earnings from referrals</li>
          </ul>
        </div>
      </div>

      <!-- Referrals List -->
      <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
        <h3 class="text-xl font-semibold text-white mb-4">Your Referrals</h3>
        
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p class="text-gray-400">Loading referrals...</p>
        </div>

        <div v-else-if="referrals.length === 0" class="text-center py-8">
          <div class="text-4xl mb-4">👥</div>
          <h4 class="text-lg font-semibold text-white mb-2">No referrals yet</h4>
          <p class="text-gray-400 mb-4">Start sharing your referral link to earn rewards!</p>
          <button
            @click="copyReferralLink"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Copy Referral Link
          </button>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="referral in referrals"
            :key="referral.id"
            class="bg-gray-700/50 border border-gray-600 rounded-lg p-4 hover:border-gray-500 transition-colors"
          >
            <!-- Referral Header -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                  <span class="text-blue-400 text-lg">👤</span>
                </div>
                <div>
                  <h4 class="text-white font-medium">{{ referral.username || referral.email }}</h4>
                  <div class="text-sm text-gray-400">Referred: {{ formatDate(referral.referred_at) }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-lg font-bold text-green-400">${{ referral.total_earnings.toFixed(2) }}</div>
                <div :class="getStatusColor(referral.status)" class="text-xs px-2 py-1 rounded font-medium">
                  {{ referral.status }}
                </div>
              </div>
            </div>

            <!-- Referral Details -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-gray-600/50 p-3 rounded-lg">
                <div class="text-gray-400 text-xs mb-1">Total Purchases</div>
                <div class="text-white text-sm">{{ referral.total_purchases || 0 }}</div>
              </div>
              <div class="bg-gray-600/50 p-3 rounded-lg">
                <div class="text-gray-400 text-xs mb-1">Total Spent</div>
                <div class="text-white text-sm">${{ (referral.total_spent || 0).toFixed(2) }}</div>
              </div>
              <div class="bg-gray-600/50 p-3 rounded-lg">
                <div class="text-gray-400 text-xs mb-1">Commission Rate</div>
                <div class="text-white text-sm">{{ referralRate }}%</div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div v-if="referral.recent_activity && referral.recent_activity.length > 0" class="mt-3">
              <div class="text-gray-400 text-xs mb-2">Recent Activity</div>
              <div class="space-y-1">
                <div
                  v-for="activity in referral.recent_activity.slice(0, 3)"
                  :key="activity.id"
                  class="text-white text-sm flex justify-between"
                >
                  <span>{{ activity.description }}</span>
                  <span class="text-green-400">+${{ activity.earnings.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Leaderboard -->
      <div v-if="leaderboard.length > 0" class="bg-gray-800/80 border border-purple-500/30 rounded-lg p-6 backdrop-blur-sm mt-8">
        <h3 class="text-xl font-semibold text-white mb-4">🏆 Referral Leaderboard</h3>
        <div class="space-y-3">
          <div
            v-for="(user, index) in leaderboard"
            :key="user.id"
            class="flex items-center justify-between bg-gray-700/50 rounded-lg p-3"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                   :class="getRankColor(index)">
                {{ index + 1 }}
              </div>
              <div>
                <div class="text-white font-medium">{{ user.username }}</div>
                <div class="text-gray-400 text-sm">{{ user.referral_count }} referrals</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-green-400 font-bold">${{ user.total_earnings.toFixed(2) }}</div>
              <div class="text-gray-400 text-sm">earned</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

// State
const referrals = ref([])
const leaderboard = ref([])
const loading = ref(true)
const referralLink = ref('')
const referralRate = 15 // 15% commission rate
const bonusAmount = 50
const bonusThreshold = 10

const stats = reactive({
  totalReferrals: 0,
  activeReferrals: 0,
  totalEarnings: 0,
  pendingEarnings: 0
})

// Methods
const loadReferrals = async () => {
  try {
    loading.value = true
    
    // Load user's referrals
    const { data: referralsData, error: referralsError } = await supabase
      .from('referrals')
      .select('*')
      .order('referred_at', { ascending: false })

    if (referralsError) {
      console.error('Error loading referrals:', referralsError)
      return
    }

    referrals.value = referralsData || []

    // Load leaderboard
    const { data: leaderboardData, error: leaderboardError } = await supabase
      .from('referral_leaderboard')
      .select('*')
      .order('total_earnings', { ascending: false })
      .limit(10)

    if (!leaderboardError) {
      leaderboard.value = leaderboardData || []
    }

    updateStats()
  } catch (error) {
    console.error('Failed to load referrals:', error)
  } finally {
    loading.value = false
  }
}

const updateStats = () => {
  stats.totalReferrals = referrals.value.length
  stats.activeReferrals = referrals.value.filter(r => r.status === 'active').length
  stats.totalEarnings = referrals.value.reduce((sum, r) => sum + (r.total_earnings || 0), 0)
  stats.pendingEarnings = referrals.value.reduce((sum, r) => sum + (r.pending_earnings || 0), 0)
}

const generateReferralLink = () => {
  const baseUrl = window.location.origin
  const userId = localStorage.getItem('user_id') || 'demo-user'
  referralLink.value = `${baseUrl}/register?ref=${userId}`
}

const copyReferralLink = async () => {
  try {
    await navigator.clipboard.writeText(referralLink.value)
    alert('✅ Referral link copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy referral link:', err)
    alert('❌ Failed to copy referral link')
  }
}

const getStatusColor = (status) => {
  const colors = {
    'active': 'bg-green-500/20 text-green-400 border border-green-500/30',
    'inactive': 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
    'pending': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
  }
  return colors[status] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
}

const getRankColor = (index) => {
  if (index === 0) return 'bg-yellow-500 text-black'
  if (index === 1) return 'bg-gray-400 text-black'
  if (index === 2) return 'bg-orange-500 text-black'
  return 'bg-gray-600 text-white'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  generateReferralLink()
  loadReferrals()
})
</script>

<style scoped>
.font-mono {
  font-family: 'Courier New', monospace;
}
</style>