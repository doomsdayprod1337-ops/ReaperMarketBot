import { apiConfig, securityConfig } from '@/config/environment'

// API Service for backend communication
export class ApiService {
  constructor() {
    this.baseUrl = apiConfig.baseUrl
    this.timeout = apiConfig.timeout
    this.retries = apiConfig.retries
  }

  // Get authentication headers
  getAuthHeaders() {
    const token = localStorage.getItem('marketplace_token')
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      'X-Client-Info': 'reaper-market-vue'
    }
  }

  // Make HTTP request
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const config = {
      method: 'GET',
      headers: this.getAuthHeaders(),
      timeout: this.timeout,
      ...options
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('API request failed:', error)
      return { success: false, error: error.message }
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint
    
    return await this.request(url, { method: 'GET' })
  }

  // POST request
  async post(endpoint, data = {}) {
    return await this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // PUT request
  async put(endpoint, data = {}) {
    return await this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  // DELETE request
  async delete(endpoint) {
    return await this.request(endpoint, { method: 'DELETE' })
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    return await this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  }

  // Upload file
  async uploadFile(endpoint, file, progressCallback = null) {
    const formData = new FormData()
    formData.append('file', file)

    const token = localStorage.getItem('marketplace_token')
    const headers = {
      'Authorization': token ? `Bearer ${token}` : ''
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
        onUploadProgress: progressCallback
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('File upload failed:', error)
      return { success: false, error: error.message }
    }
  }
}

// Create global API service instance
export const apiService = new ApiService()

// API endpoints
export const apiEndpoints = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email'
  },

  // User endpoints
  user: {
    profile: '/user/profile',
    updateProfile: '/user/profile',
    changePassword: '/user/change-password',
    deleteAccount: '/user/delete-account',
    preferences: '/user/preferences'
  },

  // Bots endpoints
  bots: {
    list: '/bots',
    get: '/bots/:id',
    create: '/bots',
    update: '/bots/:id',
    delete: '/bots/:id',
    search: '/bots/search',
    filters: '/bots/filters'
  },

  // Services endpoints
  services: {
    list: '/services',
    get: '/services/:id',
    create: '/services',
    update: '/services/:id',
    delete: '/services/:id',
    categories: '/services/categories'
  },

  // Cart endpoints
  cart: {
    get: '/cart',
    add: '/cart/add',
    remove: '/cart/remove',
    update: '/cart/update',
    clear: '/cart/clear'
  },

  // Orders endpoints
  orders: {
    list: '/orders',
    get: '/orders/:id',
    create: '/orders',
    update: '/orders/:id',
    cancel: '/orders/:id/cancel'
  },

  // Payments endpoints
  payments: {
    create: '/payments/create',
    process: '/payments/process',
    status: '/payments/:id/status',
    methods: '/payments/methods'
  },

  // Wallet endpoints
  wallet: {
    balance: '/wallet/balance',
    transactions: '/wallet/transactions',
    deposit: '/wallet/deposit',
    withdraw: '/wallet/withdraw',
    history: '/wallet/history'
  },

  // Notifications endpoints
  notifications: {
    list: '/notifications',
    markRead: '/notifications/:id/read',
    markAllRead: '/notifications/read-all',
    delete: '/notifications/:id',
    settings: '/notifications/settings'
  },

  // Support endpoints
  support: {
    tickets: '/support/tickets',
    createTicket: '/support/tickets',
    getTicket: '/support/tickets/:id',
    updateTicket: '/support/tickets/:id',
    messages: '/support/tickets/:id/messages'
  }
}

// API helper functions
export const apiHelpers = {
  // Build URL with parameters
  buildUrl(endpoint, params = {}) {
    let url = endpoint
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value)
    })
    return url
  },

  // Handle API errors
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || 'Server error',
        status: error.response.status,
        code: error.response.data?.code
      }
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Network error - please check your connection',
        status: 0,
        code: 'NETWORK_ERROR'
      }
    } else {
      // Something else happened
      return {
        message: error.message || 'Unknown error occurred',
        status: 0,
        code: 'UNKNOWN_ERROR'
      }
    }
  },

  // Retry failed requests
  async retry(fn, maxRetries = apiConfig.retries) {
    let lastError
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error
        if (i === maxRetries - 1) throw error
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
    throw lastError
  }
}

export default apiService
