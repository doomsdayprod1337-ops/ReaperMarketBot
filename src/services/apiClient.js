// Vue.js API Client based on Reaper Market patterns
class ApiClient {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || '/api'
    this.timeout = 30000 // 30 seconds default
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  // Get authentication token
  getAuthToken() {
    return localStorage.getItem('marketplace_token') || localStorage.getItem('token')
  }

  // Build query string from parameters
  buildQuery(params = {}) {
    if (!params || Object.keys(params).length === 0) return ''
    
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value))
      }
    })
    
    const queryString = searchParams.toString()
    return queryString ? `?${queryString}` : ''
  }

  // Handle API response
  async handleResponse(response) {
    const contentType = response.headers.get('content-type') || ''
    
    let data
    try {
      if (contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }
    } catch (error) {
      console.error('Response parsing error:', error)
      data = null
    }

    // Handle authentication errors
    if (response.status === 401) {
      try {
        const responseText = typeof data === 'string' ? data : JSON.stringify(data)
        if (responseText.includes('Invalid') || 
            responseText.includes('expired') || 
            responseText.includes('malformed') ||
            responseText.includes('No valid authorization token')) {
          localStorage.removeItem('marketplace_token')
          localStorage.removeItem('token')
          localStorage.removeItem('reaper_market_session')
          // Dispatch event for auth state change
          window.dispatchEvent(new CustomEvent('auth-token-removed'))
        }
      } catch (e) {
        console.log('Could not parse 401 response')
      }
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    }
  }

  // Core request method
  async request(endpoint, options = {}) {
    const token = this.getAuthToken()
    const headers = { ...this.defaultHeaders, ...options.headers }

    // Add authorization header for protected endpoints
    const isPublicEndpoint = this.isPublicEndpoint(endpoint)
    if (token && !isPublicEndpoint) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Set up abort controller for timeout
    const controller = new AbortController()
    const timeout = options.timeout || this.timeout
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const fullUrl = `${this.baseURL}${endpoint}`
      
      const response = await fetch(fullUrl, {
        ...options,
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      return await this.handleResponse(response)

    } catch (error) {
      clearTimeout(timeoutId)

      if (error.name === 'AbortError') {
        throw new Error('Request timeout')
      }

      console.error('Network error:', error)
      throw new Error('Network connection failed')
    }
  }

  // Check if endpoint is public (doesn't require auth)
  isPublicEndpoint(endpoint) {
    const publicEndpoints = [
      'admin-stats',
      'resource-counts', 
      'users',
      'admin-user-control',
      'health',
      'bin-check',
      'services',
      'bots',
      'products',
      'credit-cards',
      'documents',
      'finance-documents'
    ]
    
    return publicEndpoints.some(publicEndpoint => endpoint.includes(publicEndpoint))
  }

  // HTTP Methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options })
  }

  async post(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options
    })
  }

  async put(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options
    })
  }

  async patch(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options
    })
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options })
  }
}

// Create and export API client instance
const apiClient = new ApiClient()
export default apiClient

// Export helper functions
export const buildQuery = (params) => apiClient.buildQuery(params)
export const isPublicEndpoint = (endpoint) => apiClient.isPublicEndpoint(endpoint)
