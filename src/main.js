import './assets/main.css'
import './assets/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Import environment configuration
import { config, validateConfig } from './config/environment'

// Import API initialization service
import apiInitService from './services/apiInit.js'

// Import splash utilities
import './utils/splashUtils.js'

// Initialize environment
const isConfigValid = validateConfig()
if (!isConfigValid) {
  console.warn('Some environment variables are missing or invalid. Please check your configuration.')
}

// Create app
const app = createApp(App)
const pinia = createPinia()

// Provide global configuration
app.provide('config', config)

// Use plugins
app.use(pinia)
app.use(router)

// Initialize API services
apiInitService.initialize().then(() => {
  console.log('🎉 Vue.js app ready with API services initialized')
}).catch((error) => {
  console.error('❌ Failed to initialize API services:', error)
  // Continue app startup even if API init fails
})

// Mount app
app.mount('#app')

// Export configuration and API service for use in components
export { config, apiInitService }
