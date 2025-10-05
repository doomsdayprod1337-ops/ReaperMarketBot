import axios from 'axios';
import config from '@/config/environment';

// Configure axios instance for marketplace API
const marketplaceAPI = axios.create({
  baseURL: config.marketplace.apiUrl,
  timeout: config.marketplace.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
marketplaceAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('marketplace_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
marketplaceAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('marketplace_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class MarketplaceService {
  // User Authentication
  async login(walletAddress, signature) {
    try {
      const response = await marketplaceAPI.post('/auth/wallet-login', {
        walletAddress,
        signature,
      });
      
      if (response.data.token) {
        localStorage.setItem('marketplace_token', response.data.token);
      }
      
      return {
        success: true,
        user: response.data.user,
        token: response.data.token,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  }

  async register(walletAddress, username, email) {
    try {
      const response = await marketplaceAPI.post('/auth/wallet-register', {
        walletAddress,
        username,
        email,
      });
      
      return {
        success: true,
        user: response.data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  }

  // User Profile
  async getUserProfile() {
    try {
      const response = await marketplaceAPI.get('/user/profile');
      return {
        success: true,
        profile: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch profile',
      };
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await marketplaceAPI.put('/user/profile', profileData);
      return {
        success: true,
        profile: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update profile',
      };
    }
  }

  // Wallet Balance
  async getWalletBalance() {
    try {
      const response = await marketplaceAPI.get('/user/wallet-balance');
      return {
        success: true,
        balance: response.data.balance,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch balance',
      };
    }
  }

  async syncWallet(walletAddress) {
    try {
      const response = await marketplaceAPI.post('/user/sync-wallet', {
        walletAddress,
      });
      return {
        success: true,
        balance: response.data.balance,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to sync wallet',
      };
    }
  }

  // Products/Services
  async getProducts(category = null, page = 1, limit = 20) {
    try {
      const params = { page, limit };
      if (category) params.category = category;
      
      const response = await marketplaceAPI.get('/products', { params });
      return {
        success: true,
        products: response.data.products,
        pagination: response.data.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch products',
      };
    }
  }

  async getProduct(id) {
    try {
      const response = await marketplaceAPI.get(`/products/${id}`);
      return {
        success: true,
        product: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch product',
      };
    }
  }

  // Bots
  async getBots(category = null, page = 1, limit = 20) {
    try {
      const params = { page, limit };
      if (category) params.category = category;
      
      const response = await marketplaceAPI.get('/bots', { params });
      return {
        success: true,
        bots: response.data.bots,
        pagination: response.data.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch bots',
      };
    }
  }

  async getBot(id) {
    try {
      const response = await marketplaceAPI.get(`/bots/${id}`);
      return {
        success: true,
        bot: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch bot',
      };
    }
  }

  // Cart
  async getCart() {
    try {
      const response = await marketplaceAPI.get('/cart');
      return {
        success: true,
        cart: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch cart',
      };
    }
  }

  async addToCart(productId, quantity = 1) {
    try {
      const response = await marketplaceAPI.post('/cart/add', {
        productId,
        quantity,
      });
      return {
        success: true,
        cart: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add to cart',
      };
    }
  }

  async removeFromCart(productId) {
    try {
      const response = await marketplaceAPI.delete(`/cart/remove/${productId}`);
      return {
        success: true,
        cart: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to remove from cart',
      };
    }
  }

  async updateCartItem(productId, quantity) {
    try {
      const response = await marketplaceAPI.put(`/cart/update/${productId}`, {
        quantity,
      });
      return {
        success: true,
        cart: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update cart',
      };
    }
  }

  // Orders/Purchases
  async createOrder(cartData, paymentMethod = 'crypto') {
    try {
      const response = await marketplaceAPI.post('/orders', {
        cartData,
        paymentMethod,
      });
      return {
        success: true,
        order: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create order',
      };
    }
  }

  async getOrders(page = 1, limit = 20) {
    try {
      const response = await marketplaceAPI.get('/orders', {
        params: { page, limit },
      });
      return {
        success: true,
        orders: response.data.orders,
        pagination: response.data.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch orders',
      };
    }
  }

  async getOrder(id) {
    try {
      const response = await marketplaceAPI.get(`/orders/${id}`);
      return {
        success: true,
        order: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch order',
      };
    }
  }

  // Payments
  async processCryptoPayment(orderId, transactionHash) {
    try {
      const response = await marketplaceAPI.post('/payments/crypto', {
        orderId,
        transactionHash,
      });
      return {
        success: true,
        payment: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Payment failed',
      };
    }
  }

  // Notifications
  async getNotifications(page = 1, limit = 20) {
    try {
      const response = await marketplaceAPI.get('/notifications', {
        params: { page, limit },
      });
      return {
        success: true,
        notifications: response.data.notifications,
        pagination: response.data.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch notifications',
      };
    }
  }

  async markNotificationAsRead(notificationId) {
    try {
      const response = await marketplaceAPI.put(`/notifications/${notificationId}/read`);
      return {
        success: true,
        notification: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to mark notification as read',
      };
    }
  }

  async markAllNotificationsAsRead() {
    try {
      const response = await marketplaceAPI.put('/notifications/read-all');
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to mark all notifications as read',
      };
    }
  }

  // Downloads
  async getDownloads(page = 1, limit = 20) {
    try {
      const response = await marketplaceAPI.get('/downloads', {
        params: { page, limit },
      });
      return {
        success: true,
        downloads: response.data.downloads,
        pagination: response.data.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch downloads',
      };
    }
  }

  async downloadFile(downloadId) {
    try {
      const response = await marketplaceAPI.get(`/downloads/${downloadId}/download`, {
        responseType: 'blob',
      });
      return {
        success: true,
        blob: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Download failed',
      };
    }
  }

  // Analytics
  async getDashboardStats() {
    try {
      const response = await marketplaceAPI.get('/dashboard/stats');
      return {
        success: true,
        stats: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch dashboard stats',
      };
    }
  }

  // Logout
  logout() {
    localStorage.removeItem('marketplace_token');
    return { success: true };
  }

  // Search functionality
  async search(query, type = 'all', page = 1, limit = 20) {
    try {
      const response = await marketplaceAPI.get('/search', {
        params: { query, type, page, limit }
      });
      return {
        success: true,
        results: response.data.results,
        pagination: response.data.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Search failed',
      };
    }
  }

  // Favorites/Wishlist
  async getFavorites(page = 1, limit = 20) {
    try {
      const response = await marketplaceAPI.get('/favorites', {
        params: { page, limit }
      });
      return {
        success: true,
        favorites: response.data.favorites,
        pagination: response.data.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch favorites',
      };
    }
  }

  async addToFavorites(itemId, itemType) {
    try {
      const response = await marketplaceAPI.post('/favorites', {
        itemId,
        itemType,
      });
      return {
        success: true,
        favorite: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add to favorites',
      };
    }
  }

  async removeFromFavorites(itemId) {
    try {
      const response = await marketplaceAPI.delete(`/favorites/${itemId}`);
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to remove from favorites',
      };
    }
  }

  // Reviews and Ratings
  async getReviews(itemId, page = 1, limit = 20) {
    try {
      const response = await marketplaceAPI.get(`/reviews/${itemId}`, {
        params: { page, limit }
      });
      return {
        success: true,
        reviews: response.data.reviews,
        pagination: response.data.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch reviews',
      };
    }
  }

  async addReview(itemId, rating, comment) {
    try {
      const response = await marketplaceAPI.post('/reviews', {
        itemId,
        rating,
        comment,
      });
      return {
        success: true,
        review: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add review',
      };
    }
  }

  // Support and Help
  async createSupportTicket(subject, message, priority = 'medium') {
    try {
      const response = await marketplaceAPI.post('/support/tickets', {
        subject,
        message,
        priority,
      });
      return {
        success: true,
        ticket: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create support ticket',
      };
    }
  }

  async getSupportTickets(page = 1, limit = 20) {
    try {
      const response = await marketplaceAPI.get('/support/tickets', {
        params: { page, limit }
      });
      return {
        success: true,
        tickets: response.data.tickets,
        pagination: response.data.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch support tickets',
      };
    }
  }
}

// Create singleton instance
const marketplaceService = new MarketplaceService();

export default marketplaceService;
