<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center">
    <div class="max-w-md w-full mx-4">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center mb-4">
          <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <span class="text-red-400 text-3xl">💀</span>
          </div>
        </div>
        <h1 class="text-3xl font-bold text-white font-mono">REAPER MARKET</h1>
        <p class="text-gray-300 mt-2">Create your account</p>
      </div>

      <!-- Register Form -->
      <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-8 backdrop-blur-sm">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Username -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">Username</label>
            <input
              v-model="registerForm.username"
              type="text"
              required
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20 transition-colors"
              placeholder="Choose a username"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">Email</label>
            <input
              v-model="registerForm.email"
              type="email"
              required
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20 transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">Password</label>
            <div class="relative">
              <input
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20 transition-colors pr-12"
                placeholder="Create a password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <div class="mt-1 text-xs text-gray-400">
              Password must be at least 8 characters long
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">Confirm Password</label>
            <div class="relative">
              <input
                v-model="registerForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20 transition-colors pr-12"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>

          <!-- Country -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">Country</label>
            <select
              v-model="registerForm.country"
              required
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:ring-red-500/20 transition-colors"
            >
              <option value="">Select your country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="AU">Australia</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Telegram Username (Optional) -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">
              Telegram Username (Optional)
            </label>
            <input
              v-model="registerForm.telegram"
              type="text"
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20 transition-colors"
              placeholder="@your_username"
            />
            <div class="mt-1 text-xs text-gray-400">
              Link your Telegram account for notifications
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-start gap-3">
            <input
              v-model="registerForm.agreeToTerms"
              type="checkbox"
              required
              class="mt-1 w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
            />
            <label class="text-gray-300 text-sm">
              I agree to the <a href="#" class="text-red-400 hover:text-red-300 underline">Terms of Service</a> 
              and <a href="#" class="text-red-400 hover:text-red-300 underline">Privacy Policy</a>
            </label>
          </div>

          <!-- Register Button -->
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="w-full py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
          >
            <span v-if="!isLoading">Create Account</span>
            <span v-else class="flex items-center justify-center gap-2">
              <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Creating account...
            </span>
          </button>

          <!-- Divider -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-gray-800 text-gray-400">Or continue with</span>
            </div>
          </div>

          <!-- Social Register -->
          <div class="grid grid-cols-2 gap-3">
            <button
              @click="registerWithTelegram"
              type="button"
              class="flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <span class="text-lg">📱</span>
              Telegram
            </button>
            <button
              @click="registerWithWeb3"
              type="button"
              class="flex items-center justify-center gap-2 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              <span class="text-lg">₿</span>
              Web3
            </button>
          </div>

          <!-- Login Link -->
          <div class="text-center">
            <span class="text-gray-400">Already have an account? </span>
            <router-link to="/login" class="text-red-400 hover:text-red-300 font-medium">
              Sign in
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegram } from '@/services/telegram'

const router = useRouter()
const { tg, user } = useTelegram()

// State
const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  country: '',
  telegram: '',
  agreeToTerms: false
})

// Computed
const isFormValid = computed(() => {
  return registerForm.username &&
         registerForm.email &&
         registerForm.password &&
         registerForm.confirmPassword &&
         registerForm.country &&
         registerForm.agreeToTerms &&
         registerForm.password === registerForm.confirmPassword &&
         registerForm.password.length >= 8
})

// Methods
const handleRegister = async () => {
  if (!isFormValid.value) return
  
  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock successful registration
    const mockUser = {
      id: Date.now(),
      username: registerForm.username,
      email: registerForm.email,
      country: registerForm.country,
      telegram_username: registerForm.telegram || null,
      avatar: null,
      created_at: new Date().toISOString()
    }
    
    // Save user data
    localStorage.setItem('marketplace_token', 'mock_jwt_token_' + Date.now())
    localStorage.setItem('user_data', JSON.stringify(mockUser))
    
    // Redirect to dashboard
    router.push('/dashboard')
  } catch (error) {
    console.error('Registration error:', error)
    alert('Registration failed. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const registerWithTelegram = async () => {
  try {
    if (tg && tg.initDataUnsafe?.user) {
      // User is already authenticated via Telegram
      const telegramUser = tg.initDataUnsafe.user
      const mockUser = {
        id: telegramUser.id,
        username: telegramUser.username,
        email: `${telegramUser.username}@telegram.local`,
        country: 'Unknown',
        telegram_username: telegramUser.username,
        avatar: null,
        created_at: new Date().toISOString()
      }
      
      localStorage.setItem('marketplace_token', 'telegram_token_' + telegramUser.id)
      localStorage.setItem('user_data', JSON.stringify(mockUser))
      
      router.push('/dashboard')
    } else {
      // Open Telegram registration
      tg?.openTelegramLink('https://t.me/your_bot_username?start=register')
    }
  } catch (error) {
    console.error('Telegram registration error:', error)
    alert('Telegram registration failed. Please try again.')
  }
}

const registerWithWeb3 = async () => {
  try {
    // Simulate Web3 registration
    const mockUser = {
      id: Date.now(),
      username: 'Web3User',
      email: 'web3@wallet.local',
      country: 'Unknown',
      telegram_username: null,
      wallet_address: '0x1234567890abcdef',
      avatar: null,
      created_at: new Date().toISOString()
    }
    
    localStorage.setItem('marketplace_token', 'web3_token_' + Date.now())
    localStorage.setItem('user_data', JSON.stringify(mockUser))
    
    router.push('/dashboard')
  } catch (error) {
    console.error('Web3 registration error:', error)
    alert('Web3 registration failed. Please try again.')
  }
}
</script>

<style scoped>
.font-mono {
  font-family: 'Courier New', monospace;
}
</style>