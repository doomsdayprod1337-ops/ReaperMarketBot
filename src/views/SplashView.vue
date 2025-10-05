<template>
  <div class="splash-screen">
    <!-- Animated Background -->
    <div class="splash-background">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
      <div class="gradient-orb orb-4"></div>
      <div class="particle-field">
        <div v-for="i in 50" :key="i" class="particle" :style="getParticleStyle(i)"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="splash-content">
      <!-- Logo Section -->
      <div class="logo-section">
        <div class="logo-container">
          <div class="logo-inner">
            <div class="logo-icon">
              <div class="skull-icon">
                <div class="skull-head">
                  <div class="skull-eye left"></div>
                  <div class="skull-eye right"></div>
                  <div class="skull-nose"></div>
                  <div class="skull-mouth"></div>
                </div>
                <div class="skull-crossbones">
                  <div class="bone bone-1"></div>
                  <div class="bone bone-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="logo-text">
          <h1 class="brand-title">
            <span class="title-line">REAPER</span>
            <span class="title-line">MARKET</span>
          </h1>
          <div class="brand-subtitle">
            <span class="subtitle-text">Elite Digital Marketplace</span>
            <div class="subtitle-underline"></div>
          </div>
        </div>
      </div>

      <!-- Loading Section -->
      <div class="loading-section">
        <div class="loading-spinner">
          <div class="spinner-ring">
            <div class="ring-segment"></div>
            <div class="ring-segment"></div>
            <div class="ring-segment"></div>
            <div class="ring-segment"></div>
          </div>
          <div class="spinner-center">
            <div class="center-dot"></div>
          </div>
        </div>
        
        <div class="loading-text">
          <p class="loading-message">{{ loadingMessage }}</p>
          <div class="loading-dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </div>

      <!-- Status Messages -->
      <div class="status-section">
        <div class="status-item" v-for="(status, index) in statusMessages" :key="index" 
             :class="{ active: currentStatus >= index }">
          <div class="status-icon">
            <div class="status-check" v-if="currentStatus > index">✓</div>
            <div class="status-spinner" v-else-if="currentStatus === index">
              <div class="mini-spinner"></div>
            </div>
            <div class="status-number" v-else>{{ index + 1 }}</div>
          </div>
          <div class="status-text">{{ status }}</div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="progress-section">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="progress-text">{{ Math.round(progress) }}%</div>
      </div>
    </div>

    <!-- Version Info -->
    <div class="version-info">
      <div class="version-text">v2.0.1</div>
      <div class="version-subtitle">Powered by Supabase</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// State
const progress = ref(0)
const currentStatus = ref(0)
const loadingMessage = ref('Initializing...')
const isLoading = ref(true)

const statusMessages = [
  'Connecting to servers...',
  'Loading marketplace data...',
  'Initializing security protocols...',
  'Preparing user interface...',
  'Finalizing setup...'
]

const loadingMessages = [
  'Initializing...',
  'Loading marketplace...',
  'Connecting to database...',
  'Setting up security...',
  'Almost ready...',
  'Welcome to Reaper Market!'
]

// Methods
const getParticleStyle = (index) => {
  const delay = Math.random() * 5
  const duration = 3 + Math.random() * 4
  const size = 2 + Math.random() * 3
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

const updateProgress = () => {
  const totalSteps = statusMessages.length
  const stepDuration = 1500 // 1.5 seconds per step
  
  let currentStep = 0
  
  const interval = setInterval(() => {
    currentStep++
    currentStatus.value = currentStep - 1
    progress.value = (currentStep / totalSteps) * 100
    
    // Update loading message
    if (currentStep <= loadingMessages.length) {
      loadingMessage.value = loadingMessages[currentStep - 1]
    }
    
    if (currentStep >= totalSteps) {
      clearInterval(interval)
      
      // Final loading message
      setTimeout(() => {
        loadingMessage.value = 'Welcome to Reaper Market!'
        progress.value = 100
      }, 500)
      
      // Redirect to login after completion
      setTimeout(() => {
        isLoading.value = false
        router.push('/login')
      }, 2000)
    }
  }, stepDuration)
  
  return interval
}

// Lifecycle
let progressInterval

onMounted(() => {
  // Start the loading animation
  progressInterval = updateProgress()
  
  // Add some random particle movement
  const particleInterval = setInterval(() => {
    const particles = document.querySelectorAll('.particle')
    particles.forEach(particle => {
      const newX = Math.random() * 100
      const newY = Math.random() * 100
      particle.style.left = newX + '%'
      particle.style.top = newY + '%'
    })
  }, 5000)
  
  // Cleanup on unmount
  onUnmounted(() => {
    if (progressInterval) clearInterval(progressInterval)
    if (particleInterval) clearInterval(particleInterval)
  })
})
</script>

<style scoped>
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%);
  overflow: hidden;
  z-index: 9999;
}

/* Animated Background */
.splash-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
  animation: float 8s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #dc2626 0%, transparent 70%);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, #7c3aed 0%, transparent 70%);
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.orb-3 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #059669 0%, transparent 70%);
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

.orb-4 {
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, #ea580c 0%, transparent 70%);
  top: 30%;
  right: 30%;
  animation-delay: 6s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-30px) rotate(120deg); }
  66% { transform: translateY(20px) rotate(240deg); }
}

/* Particle Field */
.particle-field {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: particleFloat 6s linear infinite;
}

@keyframes particleFloat {
  0% { 
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { 
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

/* Main Content */
.splash-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
}

/* Logo Section */
.logo-section {
  text-align: center;
  margin-bottom: 4rem;
}

.logo-container {
  margin-bottom: 2rem;
}

.logo-inner {
  position: relative;
  display: inline-block;
}

.logo-icon {
  width: 120px;
  height: 120px;
  position: relative;
  animation: logoPulse 2s ease-in-out infinite;
}

.skull-icon {
  width: 100%;
  height: 100%;
  position: relative;
}

.skull-head {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 
    inset -10px -10px 20px rgba(0, 0, 0, 0.3),
    inset 10px 10px 20px rgba(255, 255, 255, 0.2),
    0 0 30px rgba(220, 38, 38, 0.3);
}

.skull-eye {
  width: 12px;
  height: 12px;
  background: #dc2626;
  border-radius: 50%;
  position: absolute;
  top: 25px;
  animation: eyeGlow 1.5s ease-in-out infinite alternate;
}

.skull-eye.left { left: 20px; }
.skull-eye.right { right: 20px; }

.skull-nose {
  width: 8px;
  height: 8px;
  background: #9ca3af;
  border-radius: 50%;
  position: absolute;
  top: 35px;
  left: 50%;
  transform: translateX(-50%);
}

.skull-mouth {
  width: 20px;
  height: 10px;
  border: 2px solid #9ca3af;
  border-top: none;
  border-radius: 0 0 10px 10px;
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
}

.skull-crossbones {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
}

.bone {
  position: absolute;
  background: linear-gradient(45deg, #f3f4f6, #e5e7eb);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.bone-1 {
  width: 60px;
  height: 8px;
  top: 45px;
  left: 30px;
  transform: rotate(45deg);
}

.bone-2 {
  width: 60px;
  height: 8px;
  top: 45px;
  right: 30px;
  transform: rotate(-45deg);
}

@keyframes logoPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes eyeGlow {
  0% { box-shadow: 0 0 5px #dc2626; }
  100% { box-shadow: 0 0 15px #dc2626, 0 0 25px #dc2626; }
}

/* Brand Text */
.brand-title {
  font-family: 'Courier New', monospace;
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(135deg, #dc2626 0%, #f59e0b 50%, #dc2626 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: textShimmer 3s ease-in-out infinite;
  text-shadow: 0 0 30px rgba(220, 38, 38, 0.5);
}

.title-line {
  display: block;
  animation: titleSlideIn 1s ease-out;
}

.title-line:nth-child(2) {
  animation-delay: 0.3s;
  animation-fill-mode: both;
}

.brand-subtitle {
  margin-top: 1rem;
  position: relative;
}

.subtitle-text {
  color: #9ca3af;
  font-size: 1.2rem;
  font-weight: 300;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  animation: subtitleFadeIn 1s ease-out 0.6s both;
}

.subtitle-underline {
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #dc2626, transparent);
  margin: 0.5rem auto 0;
  animation: underlineExpand 1s ease-out 1s both;
}

@keyframes textShimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes titleSlideIn {
  0% { 
    transform: translateY(50px);
    opacity: 0;
  }
  100% { 
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes subtitleFadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes underlineExpand {
  0% { width: 0; }
  100% { width: 100px; }
}

/* Loading Section */
.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3rem;
}

.loading-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 2rem;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.ring-segment {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #dc2626;
  animation: spin 1.5s linear infinite;
}

.ring-segment:nth-child(1) { animation-delay: 0s; }
.ring-segment:nth-child(2) { 
  animation-delay: 0.375s; 
  border-top-color: #7c3aed;
}
.ring-segment:nth-child(3) { 
  animation-delay: 0.75s; 
  border-top-color: #059669;
}
.ring-segment:nth-child(4) { 
  animation-delay: 1.125s; 
  border-top-color: #ea580c;
}

.spinner-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
}

.center-dot {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, #dc2626, #991b1b);
  border-radius: 50%;
  animation: dotPulse 1s ease-in-out infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes dotPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

.loading-text {
  text-align: center;
}

.loading-message {
  color: #e5e7eb;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 1rem;
  animation: messageFade 0.5s ease-in-out;
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.dot {
  width: 8px;
  height: 8px;
  background: #dc2626;
  border-radius: 50%;
  animation: dotBounce 1.4s ease-in-out infinite both;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }
.dot:nth-child(3) { animation-delay: 0s; }

@keyframes dotBounce {
  0%, 80%, 100% { 
    transform: scale(0);
    opacity: 0.5;
  }
  40% { 
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes messageFade {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Status Section */
.status-section {
  width: 100%;
  max-width: 400px;
  margin-bottom: 2rem;
}

.status-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  opacity: 0.5;
  transition: all 0.5s ease;
}

.status-item.active {
  opacity: 1;
}

.status-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #374151, #1f2937);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  border: 2px solid #4b5563;
  transition: all 0.3s ease;
}

.status-item.active .status-icon {
  border-color: #dc2626;
  background: linear-gradient(135deg, #dc2626, #991b1b);
}

.status-check {
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
}

.status-spinner {
  width: 16px;
  height: 16px;
}

.mini-spinner {
  width: 100%;
  height: 100%;
  border: 2px solid transparent;
  border-top-color: white;
  border-radius: 50%;
  animation: miniSpin 1s linear infinite;
}

.status-number {
  color: #9ca3af;
  font-weight: bold;
  font-size: 0.9rem;
}

.status-item.active .status-number {
  color: white;
}

.status-text {
  color: #d1d5db;
  font-size: 0.95rem;
}

.status-item.active .status-text {
  color: #f3f4f6;
}

@keyframes miniSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Progress Section */
.progress-section {
  width: 100%;
  max-width: 300px;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #374151;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #dc2626, #7c3aed, #059669);
  border-radius: 3px;
  transition: width 0.5s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: progressShine 2s ease-in-out infinite;
}

.progress-text {
  color: #9ca3af;
  font-size: 0.9rem;
  font-weight: 500;
}

@keyframes progressShine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Version Info */
.version-info {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  text-align: right;
}

.version-text {
  color: #6b7280;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.version-subtitle {
  color: #4b5563;
  font-size: 0.7rem;
  font-weight: 300;
}

/* Responsive Design */
@media (max-width: 768px) {
  .brand-title {
    font-size: 2.5rem;
  }
  
  .subtitle-text {
    font-size: 1rem;
  }
  
  .logo-icon {
    width: 100px;
    height: 100px;
  }
  
  .skull-head {
    width: 60px;
    height: 60px;
  }
  
  .loading-spinner {
    width: 60px;
    height: 60px;
  }
}
</style>
