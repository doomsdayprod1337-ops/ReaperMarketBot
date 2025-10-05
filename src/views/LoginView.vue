<template>
  <div class="login-screen">
    <!-- Animated Background -->
    <div class="login-background">
      <div class="gradient-mesh">
        <div class="mesh-orb orb-1"></div>
        <div class="mesh-orb orb-2"></div>
        <div class="mesh-orb orb-3"></div>
      </div>
      <div class="floating-shapes">
        <div v-for="i in 20" :key="i" class="shape" :style="getShapeStyle(i)"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="login-content">
      <!-- Header Section -->
      <div class="login-header">
        <div class="logo-container">
          <div class="logo-wrapper">
            <div class="logo-icon">
              <div class="skull-logo">
                <div class="skull-head">
                  <div class="skull-eye left"></div>
                  <div class="skull-eye right"></div>
                  <div class="skull-nose"></div>
                  <div class="skull-mouth"></div>
                </div>
                <div class="logo-glow"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="brand-section">
          <h1 class="brand-title">
            <span class="title-text">REAPER</span>
            <span class="title-text">MARKET</span>
          </h1>
          <div class="brand-subtitle">
            <span class="subtitle-text">Elite Digital Marketplace</span>
            <div class="subtitle-accent"></div>
          </div>
        </div>
      </div>

      <!-- Login Form -->
      <div class="login-form-container">
        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Email Field -->
          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">📧</span>
              Email Address
            </label>
            <div class="input-wrapper">
              <input
                v-model="loginForm.email"
                type="email"
                required
                class="form-input"
                placeholder="Enter your email"
                @focus="inputFocused = 'email'"
                @blur="inputFocused = null"
              />
              <div class="input-border" :class="{ active: inputFocused === 'email' }"></div>
            </div>
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">🔒</span>
              Password
            </label>
            <div class="input-wrapper">
              <input
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="form-input"
                placeholder="Enter your password"
                @focus="inputFocused = 'password'"
                @blur="inputFocused = null"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="password-toggle"
                :class="{ active: showPassword }"
              >
                <span class="toggle-icon">{{ showPassword ? '👁️' : '👁️‍🗨️' }}</span>
              </button>
              <div class="input-border" :class="{ active: inputFocused === 'password' }"></div>
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="form-options">
            <label class="checkbox-wrapper">
              <input
                v-model="loginForm.rememberMe"
                type="checkbox"
                class="checkbox-input"
              />
              <span class="checkbox-custom"></span>
              <span class="checkbox-label">Remember me</span>
            </label>
            <button
              type="button"
              @click="showForgotPassword = true"
              class="forgot-link"
            >
              Forgot password?
            </button>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="login-button"
            :class="{ loading: isLoading }"
          >
            <span v-if="!isLoading" class="button-text">
              <span class="button-icon">🚀</span>
              Sign In
            </span>
            <span v-else class="button-loading">
              <div class="loading-spinner"></div>
              <span>Signing in...</span>
            </span>
          </button>

          <!-- Divider -->
          <div class="form-divider">
            <div class="divider-line"></div>
            <span class="divider-text">Or continue with</span>
            <div class="divider-line"></div>
          </div>

          <!-- Social Login -->
          <div class="social-login">
            <button
              @click="loginWithTelegram"
              type="button"
              class="social-button telegram"
            >
              <span class="social-icon">📱</span>
              <span class="social-text">Telegram</span>
              <div class="button-glow"></div>
            </button>
            <button
              @click="loginWithWeb3"
              type="button"
              class="social-button web3"
            >
              <span class="social-icon">₿</span>
              <span class="social-text">Web3</span>
              <div class="button-glow"></div>
            </button>
          </div>

          <!-- Register Link -->
          <div class="register-section">
            <span class="register-text">Don't have an account? </span>
            <router-link to="/register" class="register-link">
              <span class="link-text">Sign up</span>
              <span class="link-arrow">→</span>
            </router-link>
          </div>
        </form>
      </div>

      <!-- Forgot Password Modal -->
      <div
        v-if="showForgotPassword"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click="showForgotPassword = false"
      >
        <div
          class="bg-gray-800 border border-red-500/30 rounded-lg p-6 max-w-md w-full"
          @click.stop
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-white font-semibold">Reset Password</h3>
            <button
              @click="showForgotPassword = false"
              class="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <p class="text-gray-300 text-sm mb-4">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          <div class="space-y-4">
            <input
              v-model="resetEmail"
              type="email"
              placeholder="Enter your email"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
            />
            <div class="flex gap-2">
              <button
                @click="showForgotPassword = false"
                class="flex-1 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                @click="resetPassword"
                class="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Send Reset Link
              </button>
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
import { useTelegram } from '@/services/telegram'

const router = useRouter()
const { tg, user } = useTelegram()

// State
const isLoading = ref(false)
const showPassword = ref(false)
const showForgotPassword = ref(false)
const resetEmail = ref('')
const inputFocused = ref(null)

const loginForm = reactive({
  email: '',
  password: '',
  rememberMe: false
})

// Methods
const getShapeStyle = (index) => {
  const delay = Math.random() * 5
  const duration = 8 + Math.random() * 4
  const size = 20 + Math.random() * 40
  const x = Math.random() * 100
  const y = Math.random() * 100
  
  return {
    left: x + '%',
    top: y + '%',
    width: size + 'px',
    height: size + 'px',
    animationDelay: delay + 's',
    animationDuration: duration + 's'
  }
}

const handleLogin = async () => {
  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock successful login
    const mockUser = {
      id: 1,
      email: loginForm.email,
      username: loginForm.email.split('@')[0],
      avatar: null,
      telegram_id: user?.id || null,
      telegram_username: user?.username || null
    }
    
    // Save user data
    localStorage.setItem('marketplace_token', 'mock_jwt_token_' + Date.now())
    localStorage.setItem('user_data', JSON.stringify(mockUser))
    
    // Redirect to dashboard
    router.push('/dashboard')
  } catch (error) {
    console.error('Login error:', error)
    alert('Login failed. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const loginWithTelegram = async () => {
  try {
    if (tg && tg.initDataUnsafe?.user) {
      // User is already authenticated via Telegram
      const telegramUser = tg.initDataUnsafe.user
      const mockUser = {
        id: telegramUser.id,
        email: `${telegramUser.username}@telegram.local`,
        username: telegramUser.username,
        avatar: null,
        telegram_id: telegramUser.id,
        telegram_username: telegramUser.username
      }
      
      localStorage.setItem('marketplace_token', 'telegram_token_' + telegramUser.id)
      localStorage.setItem('user_data', JSON.stringify(mockUser))
      
      router.push('/dashboard')
    } else {
      // Open Telegram login
      tg?.openTelegramLink('https://t.me/your_bot_username?start=login')
    }
  } catch (error) {
    console.error('Telegram login error:', error)
    alert('Telegram login failed. Please try again.')
  }
}

const loginWithWeb3 = async () => {
  try {
    // Simulate Web3 login
    const mockUser = {
      id: 2,
      email: 'web3@wallet.local',
      username: 'Web3User',
      avatar: null,
      wallet_address: '0x1234567890abcdef',
      telegram_id: null,
      telegram_username: null
    }
    
    localStorage.setItem('marketplace_token', 'web3_token_' + Date.now())
    localStorage.setItem('user_data', JSON.stringify(mockUser))
    
    router.push('/dashboard')
  } catch (error) {
    console.error('Web3 login error:', error)
    alert('Web3 login failed. Please try again.')
  }
}

const resetPassword = async () => {
  try {
    // Simulate password reset
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Password reset link sent to your email!')
    showForgotPassword.value = false
  } catch (error) {
    console.error('Password reset error:', error)
    alert('Failed to send reset link. Please try again.')
  }
}
</script>

<style scoped>
/* Main Container */
.login-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Animated Background */
.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.gradient-mesh {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.mesh-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.2;
  animation: meshFloat 12s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #dc2626 0%, transparent 70%);
  top: -10%;
  left: -10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #7c3aed 0%, transparent 70%);
  top: 40%;
  right: -5%;
  animation-delay: 4s;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, #059669 0%, transparent 70%);
  bottom: -5%;
  left: 30%;
  animation-delay: 8s;
}

@keyframes meshFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  background: linear-gradient(45deg, rgba(220, 38, 38, 0.1), rgba(124, 58, 237, 0.1));
  border-radius: 50%;
  animation: shapeFloat 10s linear infinite;
}

@keyframes shapeFloat {
  0% { 
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% { opacity: 0.3; }
  90% { opacity: 0.3; }
  100% { 
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

/* Main Content */
.login-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 450px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Header Section */
.login-header {
  text-align: center;
  margin-bottom: 3rem;
  animation: headerSlideIn 1s ease-out;
}

.logo-container {
  margin-bottom: 2rem;
}

.logo-wrapper {
  position: relative;
  display: inline-block;
}

.logo-icon {
  width: 80px;
  height: 80px;
  position: relative;
  animation: logoFloat 3s ease-in-out infinite;
}

.skull-logo {
  width: 100%;
  height: 100%;
  position: relative;
}

.skull-head {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 
    inset -8px -8px 16px rgba(0, 0, 0, 0.3),
    inset 8px 8px 16px rgba(255, 255, 255, 0.2),
    0 0 20px rgba(220, 38, 38, 0.4);
}

.skull-eye {
  width: 8px;
  height: 8px;
  background: #dc2626;
  border-radius: 50%;
  position: absolute;
  top: 20px;
  animation: eyeGlow 2s ease-in-out infinite alternate;
}

.skull-eye.left { left: 15px; }
.skull-eye.right { right: 15px; }

.skull-nose {
  width: 4px;
  height: 4px;
  background: #9ca3af;
  border-radius: 50%;
  position: absolute;
  top: 28px;
  left: 50%;
  transform: translateX(-50%);
}

.skull-mouth {
  width: 16px;
  height: 8px;
  border: 2px solid #9ca3af;
  border-top: none;
  border-radius: 0 0 8px 8px;
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
}

.logo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: glowPulse 2s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes eyeGlow {
  0% { box-shadow: 0 0 3px #dc2626; }
  100% { box-shadow: 0 0 10px #dc2626, 0 0 15px #dc2626; }
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.1); }
}

.brand-section {
  animation: brandSlideIn 1s ease-out 0.3s both;
}

.brand-title {
  font-family: 'Courier New', monospace;
  font-size: 2.5rem;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(135deg, #dc2626 0%, #f59e0b 50%, #dc2626 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: textShimmer 3s ease-in-out infinite;
  text-shadow: 0 0 20px rgba(220, 38, 38, 0.3);
}

.title-text {
  display: block;
  animation: titleSlideIn 1s ease-out;
}

.title-text:nth-child(2) {
  animation-delay: 0.2s;
  animation-fill-mode: both;
}

.brand-subtitle {
  margin-top: 0.5rem;
  position: relative;
}

.subtitle-text {
  color: #9ca3af;
  font-size: 1rem;
  font-weight: 300;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  animation: subtitleFadeIn 1s ease-out 0.6s both;
}

.subtitle-accent {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #dc2626, transparent);
  margin: 0.5rem auto 0;
  animation: accentExpand 1s ease-out 1s both;
}

@keyframes headerSlideIn {
  0% { transform: translateY(-50px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes brandSlideIn {
  0% { transform: translateY(30px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes textShimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes titleSlideIn {
  0% { transform: translateY(30px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes subtitleFadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes accentExpand {
  0% { width: 0; }
  100% { width: 60px; }
}

/* Form Container */
.login-form-container {
  width: 100%;
  background: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(220, 38, 38, 0.2);
  border-radius: 20px;
  padding: 2.5rem;
  backdrop-filter: blur(20px);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: formSlideIn 1s ease-out 0.6s both;
}

@keyframes formSlideIn {
  0% { transform: translateY(50px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Form Groups */
.form-group {
  position: relative;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #e5e7eb;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.label-icon {
  font-size: 1rem;
  opacity: 0.8;
}

.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 1rem 1.25rem;
  background: rgba(17, 24, 39, 0.8);
  border: 2px solid rgba(75, 85, 99, 0.5);
  border-radius: 12px;
  color: #f3f4f6;
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.form-input:focus {
  outline: none;
  border-color: #dc2626;
  background: rgba(17, 24, 39, 0.9);
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
  opacity: 0.7;
}

.input-border {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #dc2626, #7c3aed);
  transition: width 0.3s ease;
}

.input-border.active {
  width: 100%;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.password-toggle:hover {
  color: #f3f4f6;
  background: rgba(75, 85, 99, 0.3);
}

.password-toggle.active {
  color: #dc2626;
}

.toggle-icon {
  font-size: 1.2rem;
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(75, 85, 99, 0.5);
  border-radius: 4px;
  background: rgba(17, 24, 39, 0.8);
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-input:checked + .checkbox-custom {
  border-color: #dc2626;
  background: #dc2626;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-label {
  color: #d1d5db;
  font-size: 0.9rem;
  user-select: none;
}

.forgot-link {
  background: none;
  border: none;
  color: #dc2626;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #f59e0b;
  text-decoration: underline;
}

/* Login Button */
.login-button {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(220, 38, 38, 0.3);
}

.login-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(220, 38, 38, 0.4);
}

.login-button:disabled {
  background: #6b7280;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.login-button:hover::before {
  left: 100%;
}

.button-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.button-icon {
  font-size: 1.2rem;
}

.button-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Form Divider */
.form-divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #4b5563, transparent);
}

.divider-text {
  color: #9ca3af;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
}

/* Social Login */
.social-login {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid rgba(75, 85, 99, 0.3);
  border-radius: 12px;
  background: rgba(17, 24, 39, 0.6);
  color: #e5e7eb;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.social-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.social-button.telegram {
  border-color: rgba(59, 130, 246, 0.3);
}

.social-button.telegram:hover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.social-button.web3 {
  border-color: rgba(147, 51, 234, 0.3);
}

.social-button.web3:hover {
  border-color: #9333ea;
  background: rgba(147, 51, 234, 0.1);
}

.social-icon {
  font-size: 1.2rem;
}

.social-text {
  font-weight: 500;
}

.button-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.social-button:hover .button-glow {
  opacity: 1;
}

/* Register Section */
.register-section {
  text-align: center;
  margin-top: 1.5rem;
}

.register-text {
  color: #9ca3af;
  font-size: 0.95rem;
}

.register-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #dc2626;
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.5rem;
  transition: all 0.3s ease;
}

.register-link:hover {
  color: #f59e0b;
}

.link-text {
  position: relative;
}

.link-arrow {
  transition: transform 0.3s ease;
}

.register-link:hover .link-arrow {
  transform: translateX(4px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .login-content {
    padding: 1rem;
  }
  
  .login-form-container {
    padding: 2rem 1.5rem;
  }
  
  .brand-title {
    font-size: 2rem;
  }
  
  .subtitle-text {
    font-size: 0.9rem;
  }
  
  .logo-icon {
    width: 60px;
    height: 60px;
  }
  
  .skull-head {
    width: 45px;
    height: 45px;
  }
  
  .social-login {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .login-content {
    padding: 0.5rem;
  }
  
  .login-form-container {
    padding: 1.5rem 1rem;
  }
  
  .brand-title {
    font-size: 1.8rem;
  }
  
  .form-input {
    padding: 0.875rem 1rem;
  }
  
  .login-button {
    padding: 0.875rem 1.5rem;
  }
}
</style>