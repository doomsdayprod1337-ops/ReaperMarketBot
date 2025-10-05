// Comprehensive API Services for Vue.js Application
// Based on Reaper Market API patterns

import apiClient from './apiClient.js'

// Auth API
export const authAPI = {
  // Admin login
  adminLogin: async (email, password) => {
    const response = await apiClient.post('/login', { email, password })
    return response.data
  },

  // Refresh session
  refreshSession: async () => {
    try {
      const token = localStorage.getItem('marketplace_token')
      const response = await apiClient.post('/refresh-session', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Refresh session error:', error)
      return {
        success: false,
        error: error.message || 'Failed to refresh session'
      }
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await apiClient.post('/change-password', {
      currentPassword,
      newPassword
    })
    return response.data
  },

  // Login
  login: async (identifier, password) => {
    const response = await apiClient.post('/login', {
      email: identifier.includes('@') ? identifier : undefined,
      username: !identifier.includes('@') ? identifier : undefined,
      password
    })
    return response.data
  },

  // Register
  register: async (data) => {
    const response = await apiClient.post('/register', data)
    return response.data
  },

  // Logout
  logout: async () => {
    const response = await apiClient.post('/logout')
    return response.data
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await apiClient.post('/reset-password', { token, password })
    return response.data
  }
}

// Admin API
export const adminAPI = {
  // Get admin stats
  getStats: async () => {
    try {
      const response = await apiClient.get('/admin-stats')
      return response.data
    } catch (error) {
      console.error('Admin stats error:', error)
      throw error
    }
  },

  // Get admin logs
  getLogs: async (params = {}) => {
    try {
      const queryString = apiClient.buildQuery(params)
      const response = await apiClient.get(`/admin-logs${queryString}`)
      return response.data
    } catch (error) {
      console.warn('Admin logs API not available:', error)
      return {
        success: false,
        logs: [],
        stats: { admin_logs: 0, security_events: 0, audit_logs: 0, total: 0 },
        pagination: { page: 1, limit: 25, pages: 0, total: 0 },
        message: 'Activity logs are being set up. Please check back later.'
      }
    }
  },

  // Get users
  getUsers: async () => {
    try {
      const response = await apiClient.get('/admin-users')
      return response.data
    } catch (error) {
      console.error('Admin users error:', error)
      throw error
    }
  },

  // Update user
  updateUser: async (userId, updates) => {
    const response = await apiClient.put('/admin-users', { userId, ...updates })
    return response.data
  },

  // Get admin settings
  getSettings: async () => {
    const response = await apiClient.get('/admin-settings')
    return response.data
  },

  // Update admin settings
  updateSettings: async (settings) => {
    const response = await apiClient.post('/admin-settings', { settings })
    return response.data
  },

  // Get resource counts
  getResourceCounts: async () => {
    try {
      const response = await apiClient.get('/resource-counts')
      return response.data
    } catch (error) {
      console.error('Resource counts error:', error)
      return {
        success: true,
        counts: {
          services: 0,
          software: 0,
          bots: 0,
          credit_cards: 0,
          documents: 0,
          finance_docs: 0,
          config_files: 0
        }
      }
    }
  }
}

// Credit Cards API
export const creditCardsAPI = {
  // Get available cards
  getAvailableCards: async (params = {}) => {
    const queryString = apiClient.buildQuery(params)
    const response = await apiClient.get(`/credit-cards${queryString}`)
    return response.data
  },

  // Get cards list
  getCards: async (params = {}) => {
    const queryString = apiClient.buildQuery(params)
    const response = await apiClient.get(`/credit-cards/list${queryString}`)
    return response.data
  },

  // Import cards
  importCards: async (cards, delimiter) => {
    try {
      const response = await apiClient.post('/credit-cards/import', { cards, delimiter })
      return response.data
    } catch (error) {
      console.error('Import cards error:', error)
      return {
        success: false,
        error: error.message || 'Failed to import cards',
        summary: { total: 0, valid: 0, invalid: 0, duplicates: 0 }
      }
    }
  },

  // Get stats
  getStats: async () => {
    const response = await apiClient.get('/credit-cards/stats')
    return response.data
  },

  // Update card
  updateCard: async (cardId, updates) => {
    try {
      const response = await apiClient.put('/credit-cards/update', { id: cardId, updates })
      return response.data
    } catch (error) {
      console.error('Update card error:', error)
      return {
        success: false,
        error: error.message || 'Failed to update card'
      }
    }
  },

  // Bulk update prices
  bulkUpdatePrices: async (cardIds, price) => {
    try {
      const response = await apiClient.put('/credit-cards/bulk-update-prices', { cardIds, price })
      return response.data
    } catch (error) {
      console.error('Bulk update prices error:', error)
      return {
        success: false,
        error: error.message || 'Failed to update prices'
      }
    }
  }
}

// Documents API
export const documentsAPI = {
  // Get documents
  getDocuments: async () => {
    const response = await apiClient.get('/documents')
    return response.data
  },

  // Get public documents
  getPublicDocuments: async (params = {}) => {
    const queryString = apiClient.buildQuery(params)
    const response = await apiClient.get(`/documents/public${queryString}`)
    return response.data
  },

  // Upload document
  uploadDocument: async (documentData) => {
    const response = await apiClient.post('/documents/upload', documentData)
    return response.data
  },

  // Batch upload
  batchUpload: async (batchData) => {
    const response = await apiClient.post('/documents/batch-upload', batchData)
    return response.data
  },

  // Delete document
  deleteDocument: async (id) => {
    const response = await apiClient.delete(`/documents/${id}`)
    return response.data
  },

  // Get count
  getCount: async () => {
    const response = await apiClient.get('/documents/count')
    return response.data
  }
}

// Finance Documents API
export const financeDocumentsAPI = {
  // Get all finance documents
  getAll: async () => {
    const response = await apiClient.get('/finance-documents')
    return response.data
  },

  // Get user view
  getUserView: async () => {
    const response = await apiClient.get('/finance-documents/user-view')
    return response.data
  },

  // Bulk create
  bulkCreate: async (data) => {
    const response = await apiClient.post('/finance-documents/bulk-create', { data })
    return response.data
  },

  // Bulk create finance docs
  bulkCreateFinanceDocs: async (data) => {
    const response = await apiClient.post('/finance-documents/bulk-create-finance-docs', { data })
    return response.data
  },

  // Delete
  delete: async (id) => {
    const response = await apiClient.delete(`/finance-documents/${id}`)
    return response.data
  },

  // Get count
  getCount: async () => {
    const response = await apiClient.get('/finance-documents/count')
    return response.data
  }
}

// Checker Files API
export const checkerAPI = {
  // Get files
  getFiles: async (params = {}) => {
    const queryString = apiClient.buildQuery(params)
    const response = await apiClient.get(`/checker-file-config${queryString}`)
    return response.data
  },

  // Create config
  createConfig: async (fileId, configuration) => {
    const response = await apiClient.post('/checker-file-config', { file_id: fileId, configuration })
    return response.data
  },

  // Update config
  updateConfig: async (fileId, configuration) => {
    const response = await apiClient.put('/checker-file-config', { file_id: fileId, configuration })
    return response.data
  },

  // Delete file
  deleteFile: async (fileId) => {
    const response = await apiClient.delete(`/checker-file-config?file_id=${fileId}`)
    return response.data
  }
}

// Services API
export const servicesAPI = {
  // Get services
  getServices: async (params = {}) => {
    const queryString = apiClient.buildQuery(params)
    const response = await apiClient.get(`/services${queryString}`)
    return response.data
  },

  // Get service details
  getServiceDetails: async (serviceId) => {
    const response = await apiClient.get(`/services/details?serviceId=${serviceId}`)
    return response.data
  },

  // Get categories
  getCategories: async () => {
    const response = await apiClient.get('/services/categories')
    return response.data
  },

  // Get filters
  getFilters: async () => {
    const response = await apiClient.get('/services/filters')
    return response.data
  },

  // Add to cart
  addToCart: async (serviceId, quantity, customRequirements) => {
    const response = await apiClient.post('/services/add-to-cart', {
      serviceId,
      quantity,
      customRequirements
    })
    return response.data
  },

  // Remove from cart
  removeFromCart: async (serviceId) => {
    const response = await apiClient.post('/services/remove-from-cart', { serviceId })
    return response.data
  },

  // Purchase
  purchase: async (serviceId) => {
    const response = await apiClient.post('/services/purchase', { serviceId })
    return response.data
  }
}

// Bots API
export const botsAPI = {
  // Get bots
  getBots: async (params = {}) => {
    const queryString = apiClient.buildQuery(params)
    const response = await apiClient.get(`/bots${queryString}`)
    return response.data
  },

  // Get bot details
  getBotDetails: async (botId) => {
    const response = await apiClient.get(`/bots/details?botId=${botId}`)
    return response.data
  },

  // Get filters
  getFilters: async () => {
    const response = await apiClient.get('/bots/filters')
    return response.data
  },

  // Add to cart
  addToCart: async (botId) => {
    const response = await apiClient.post('/bots/add-to-cart', { botId })
    return response.data
  },

  // Remove from cart
  removeFromCart: async (botId) => {
    const response = await apiClient.post('/bots/remove-from-cart', { botId })
    return response.data
  },

  // Purchase
  purchase: async (botId) => {
    const response = await apiClient.post('/bots/purchase', { botId })
    return response.data
  }
}

// Cart API
export const cartAPI = {
  // Get cart
  getCart: async () => {
    const response = await apiClient.get('/cart')
    return response.data
  },

  // Add to cart
  addToCart: async (itemType, itemId, quantity = 1, customData = {}) => {
    const response = await apiClient.post('/cart/add', {
      itemType,
      itemId,
      quantity,
      customData
    })
    return response.data
  },

  // Remove from cart
  removeFromCart: async (cartItemId) => {
    const response = await apiClient.post('/cart/remove', { cartItemId })
    return response.data
  },

  // Update cart
  updateCart: async (cartItemId, updates) => {
    const response = await apiClient.post('/cart/update', { cartItemId, ...updates })
    return response.data
  },

  // Clear cart
  clearCart: async () => {
    const response = await apiClient.post('/cart/clear')
    return response.data
  },

  // Checkout
  checkout: async (options = {}) => {
    const response = await apiClient.post('/cart/checkout', options)
    return response.data
  }
}

// Support Tickets API
export const ticketsAPI = {
  // Get tickets
  getTickets: async (params = {}) => {
    const queryString = apiClient.buildQuery(params)
    const response = await apiClient.get(`/tickets${queryString}`)
    return response.data
  },

  // Get ticket
  getTicket: async (ticketId) => {
    const response = await apiClient.get(`/tickets/${ticketId}`)
    return response.data
  },

  // Create ticket
  createTicket: async (ticketData) => {
    const response = await apiClient.post('/tickets', ticketData)
    return response.data
  },

  // Update ticket
  updateTicket: async (ticketId, updates) => {
    const response = await apiClient.put(`/tickets/${ticketId}`, updates)
    return response.data
  },

  // Delete ticket
  deleteTicket: async (ticketId) => {
    const response = await apiClient.delete(`/tickets/${ticketId}`)
    return response.data
  },

  // Get replies
  getReplies: async (ticketId) => {
    const response = await apiClient.get(`/tickets/${ticketId}/replies`)
    return response.data
  },

  // Create reply
  createReply: async (ticketId, replyData) => {
    const response = await apiClient.post(`/tickets/${ticketId}/replies`, replyData)
    return response.data
  }
}

// Referrals API
export const referralsAPI = {
  // Get referrals
  getReferrals: async () => {
    const response = await apiClient.get('/referrals')
    return response.data
  },

  // Get referral stats
  getStats: async () => {
    const response = await apiClient.get('/referrals/stats')
    return response.data
  },

  // Generate referral link
  generateLink: async () => {
    const response = await apiClient.post('/referrals/generate-link')
    return response.data
  },

  // Get leaderboard
  getLeaderboard: async () => {
    const response = await apiClient.get('/referrals/leaderboard')
    return response.data
  }
}

// Transactions API
export const transactionsAPI = {
  // Get transactions
  getTransactions: async (params = {}) => {
    const queryString = apiClient.buildQuery(params)
    const response = await apiClient.get(`/transactions${queryString}`)
    return response.data
  },

  // Get transaction details
  getTransactionDetails: async (transactionId) => {
    const response = await apiClient.get(`/transactions/${transactionId}`)
    return response.data
  },

  // Get stats
  getStats: async () => {
    const response = await apiClient.get('/transactions/stats')
    return response.data
  }
}

// Inbox Requests API
export const inboxRequestsAPI = {
  // Get inbox requests
  getRequests: async (params = {}) => {
    const queryString = apiClient.buildQuery(params)
    const response = await apiClient.get(`/inbox-requests${queryString}`)
    return response.data
  },

  // Get request details
  getRequestDetails: async (requestId) => {
    const response = await apiClient.get(`/inbox-requests/${requestId}`)
    return response.data
  },

  // Purchase request
  purchaseRequest: async (requestId) => {
    const response = await apiClient.post(`/inbox-requests/${requestId}/purchase`)
    return response.data
  },

  // Get stats
  getStats: async () => {
    const response = await apiClient.get('/inbox-requests/stats')
    return response.data
  }
}

// BIN Checker API
export const binAPI = {
  // Check BIN
  check: async (bin) => {
    const response = await apiClient.post('/bin-check/check', { bin })
    
    // Handle JSON string response
    let data = response.data
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data)
      } catch (parseError) {
        console.error('Failed to parse BIN check response:', parseError)
        throw new Error('Invalid JSON response from BIN API')
      }
    }
    
    return data
  },

  // Bulk check
  bulkCheck: async (bins) => {
    const response = await apiClient.post('/bin-check/bulk-check', { bins })
    return response.data
  },

  // Get history
  getHistory: async () => {
    const response = await apiClient.get('/bin-check/history')
    return response.data
  },

  // Get stats
  getStats: async () => {
    const response = await apiClient.get('/bin-check/stats')
    return response.data
  }
}

// Profile API
export const profileAPI = {
  // Get profile
  getProfile: async () => {
    const response = await apiClient.get('/profile')
    return response.data
  },

  // Update profile
  updateProfile: async (data) => {
    const response = await apiClient.put('/profile', data)
    return response.data
  }
}

// Purchases API
export const purchasesAPI = {
  // Get purchases
  getPurchases: async () => {
    const response = await apiClient.get('/purchases')
    return response.data
  },

  // Get order history
  getOrderHistory: async (params = {}) => {
    const queryString = apiClient.buildQuery(params)
    const response = await apiClient.get(`/order-history${queryString}`)
    return response.data
  },

  // Get order details
  getOrderDetails: async (orderId) => {
    const response = await apiClient.get(`/order-history/order-details/${orderId}`)
    return response.data
  }
}

// Webhooks API
export const webhooksAPI = {
  // NowPayments IPN
  nowpaymentsIPN: async (data) => {
    const response = await apiClient.post('/nowpayments-ipn', data)
    return response.data
  },

  // Generic webhook
  genericWebhook: async (data) => {
    const response = await apiClient.post('/payment-webhook', data)
    return response.data
  }
}

// Notification API
export const notificationAPI = {
  // Get notifications
  getNotifications: async (params = {}) => {
    const queryString = apiClient.buildQuery(params)
    const response = await apiClient.get(`/notifications${queryString}`)
    return response.data
  },

  // Create notification
  createNotification: async (data) => {
    const response = await apiClient.post('/notifications', data)
    return response.data
  },

  // Mark as read
  markAsRead: async (id) => {
    const response = await apiClient.patch(`/notifications/${id}/read`)
    return response.data
  },

  // Mark all as read
  markAllAsRead: async (userId) => {
    const response = await apiClient.patch('/notifications/mark-all-read', { user_id: userId })
    return response.data
  },

  // Get notification count
  getNotificationCount: async (userId, status) => {
    const params = new URLSearchParams()
    params.append('user_id', userId)
    if (status) params.append('status', status)

    const response = await apiClient.get(`/notifications/count?${params.toString()}`)
    return response.data
  }
}

// Health API
export const healthAPI = {
  // Check health
  check: async () => {
    const response = await apiClient.get('/health')
    return response.data
  }
}

// API Helper functions
export const apiHelpers = {
  // Handle API errors consistently
  handleError: (error) => {
    if (error?.response?.data?.error) {
      return error.response.data.error
    }
    if (error?.response?.data?.message) {
      return error.response.data.message
    }
    if (error?.message) {
      return error.message
    }
    return 'An unexpected error occurred'
  },

  // Format dates consistently
  formatDate: (dateString) => {
    return new Date(dateString).toLocaleString()
  },

  // Format currency
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  },

  // Validate BIN format
  validateBIN: (bin) => {
    return /^\d{6,8}$/.test(bin)
  },

  // Generate download URL
  generateDownloadUrl: (filename) => {
    return `${apiClient.baseURL}/download/${filename}`
  }
}

export default {
  authAPI,
  adminAPI,
  creditCardsAPI,
  documentsAPI,
  financeDocumentsAPI,
  checkerAPI,
  servicesAPI,
  botsAPI,
  cartAPI,
  ticketsAPI,
  referralsAPI,
  transactionsAPI,
  inboxRequestsAPI,
  binAPI,
  profileAPI,
  purchasesAPI,
  webhooksAPI,
  notificationAPI,
  healthAPI,
  apiHelpers
}
