// API Initialization Service
// Initializes all API services and webhooks for the Vue.js application

import apiClient from './apiClient.js'
import webhookService from './webhookService.js'
import { authAPI } from './apiServices.js'

class ApiInitService {
  constructor() {
    this.isInitialized = false
    this.initializationPromise = null
  }

  // Initialize all API services
  async initialize() {
    if (this.isInitialized) {
      return this.initializationPromise
    }

    if (this.initializationPromise) {
      return this.initializationPromise
    }

    this.initializationPromise = this._doInitialize()
    return this.initializationPromise
  }

  async _doInitialize() {
    try {
      console.log('🚀 Initializing API services...')

      // 1. Check API health
      await this.checkApiHealth()

      // 2. Initialize webhook service
      await webhookService.initialize()

      // 3. Setup authentication refresh
      await this.setupAuthRefresh()

      // 4. Setup global error handling
      this.setupGlobalErrorHandling()

      // 5. Setup request interceptors
      this.setupRequestInterceptors()

      this.isInitialized = true
      console.log('✅ API services initialized successfully')

      // Dispatch initialization event
      window.dispatchEvent(new CustomEvent('api-initialized'))

    } catch (error) {
      console.error('❌ Failed to initialize API services:', error)
      this.isInitialized = false
      this.initializationPromise = null
      throw error
    }
  }

  // Check API health
  async checkApiHealth() {
    try {
      console.log('🏥 Checking API health...')
      
      // Simple health check - try to make a basic request
      const token = localStorage.getItem('marketplace_token')
      if (token) {
        await authAPI.refreshSession()
      }
      
      console.log('✅ API health check passed')
    } catch (error) {
      console.warn('⚠️ API health check failed:', error.message)
      // Don't throw here - we want to continue initialization even if health check fails
    }
  }

  // Setup authentication refresh
  async setupAuthRefresh() {
    try {
      console.log('🔐 Setting up authentication refresh...')
      
      const token = localStorage.getItem('marketplace_token')
      if (token) {
        // Try to refresh the session
        const response = await authAPI.refreshSession()
        
        if (response.success === false) {
          console.log('🔄 Token expired, clearing authentication')
          localStorage.removeItem('marketplace_token')
          localStorage.removeItem('token')
          localStorage.removeItem('reaper_market_session')
        }
      }
      
      console.log('✅ Authentication refresh setup complete')
    } catch (error) {
      console.warn('⚠️ Authentication refresh setup failed:', error.message)
    }
  }

  // Setup global error handling
  setupGlobalErrorHandling() {
    console.log('🛡️ Setting up global error handling...')

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      
      // Handle common API errors
      if (event.reason?.message?.includes('Network connection failed')) {
        this.handleNetworkError()
      } else if (event.reason?.message?.includes('Request timeout')) {
        this.handleTimeoutError()
      } else if (event.reason?.response?.status === 401) {
        this.handleAuthError()
      }
    })

    // Handle fetch errors globally
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args)
        
        // Handle common HTTP errors
        if (response.status === 401) {
          this.handleAuthError()
        } else if (response.status === 403) {
          this.handleForbiddenError()
        } else if (response.status >= 500) {
          this.handleServerError(response.status)
        }
        
        return response
      } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          this.handleNetworkError()
        }
        throw error
      }
    }

    console.log('✅ Global error handling setup complete')
  }

  // Setup request interceptors
  setupRequestInterceptors() {
    console.log('🔄 Setting up request interceptors...')

    // Intercept authentication token removal events
    window.addEventListener('auth-token-removed', () => {
      console.log('🔓 Authentication token removed, redirecting to login')
      
      // Clear all local data
      localStorage.clear()
      sessionStorage.clear()
      
      // Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    })

    // Intercept API initialization events
    window.addEventListener('api-initialized', () => {
      console.log('🎉 API initialization complete - all services ready')
    })

    console.log('✅ Request interceptors setup complete')
  }

  // Error handlers
  handleNetworkError() {
    console.error('🌐 Network error detected')
    
    // Show user-friendly message
    this.showErrorMessage('Network connection failed. Please check your internet connection.')
    
    // Attempt to reconnect webhooks
    setTimeout(() => {
      webhookService.initialize().catch(err => {
        console.error('Failed to reconnect webhooks:', err)
      })
    }, 5000)
  }

  handleTimeoutError() {
    console.error('⏱️ Request timeout detected')
    this.showErrorMessage('Request timed out. Please try again.')
  }

  handleAuthError() {
    console.error('🔒 Authentication error detected')
    
    // Clear authentication data
    localStorage.removeItem('marketplace_token')
    localStorage.removeItem('token')
    localStorage.removeItem('reaper_market_session')
    
    // Dispatch auth token removed event
    window.dispatchEvent(new CustomEvent('auth-token-removed'))
  }

  handleForbiddenError() {
    console.error('🚫 Forbidden error detected')
    this.showErrorMessage('Access denied. You do not have permission to perform this action.')
  }

  handleServerError(status) {
    console.error(`🔥 Server error detected: ${status}`)
    this.showErrorMessage(`Server error (${status}). Please try again later.`)
  }

  // Show error message to user
  showErrorMessage(message) {
    // Create a simple toast notification
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
    toast.textContent = message
    
    document.body.appendChild(toast)
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 5000)
  }

  // Cleanup all services
  async cleanup() {
    console.log('🧹 Cleaning up API services...')
    
    try {
      // Cleanup webhook service
      webhookService.cleanup()
      
      // Clear initialization state
      this.isInitialized = false
      this.initializationPromise = null
      
      console.log('✅ API services cleanup complete')
    } catch (error) {
      console.error('❌ Error during API cleanup:', error)
    }
  }

  // Get initialization status
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      webhookStatus: webhookService.getConnectionStatus()
    }
  }

  // Reinitialize services (useful for recovery)
  async reinitialize() {
    console.log('🔄 Reinitializing API services...')
    
    await this.cleanup()
    await this.initialize()
  }
}

// Create and export singleton instance
const apiInitService = new ApiInitService()

// Auto-initialize when imported (for main app)
if (typeof window !== 'undefined') {
  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      apiInitService.initialize().catch(err => {
        console.error('Failed to auto-initialize API services:', err)
      })
    })
  } else {
    apiInitService.initialize().catch(err => {
      console.error('Failed to auto-initialize API services:', err)
    })
  }
}

export default apiInitService

// Export convenience functions
export const initializeAPI = () => apiInitService.initialize()
export const cleanupAPI = () => apiInitService.cleanup()
export const getAPIStatus = () => apiInitService.getStatus()
export const reinitializeAPI = () => apiInitService.reinitialize()
