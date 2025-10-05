import { defineStore } from 'pinia';
import marketplaceService from '@/services/marketplace';

export const useMarketplaceStore = defineStore('marketplace', {
  state: () => ({
    // User state
    user: null,
    isAuthenticated: false,
    profile: null,
    walletBalance: 0,

    // Products
    products: [],
    currentProduct: null,
    productsLoading: false,
    productsPagination: null,

    // Bots
    bots: [],
    currentBot: null,
    botsLoading: false,
    botsPagination: null,

    // Cart
    cart: {
      items: [],
      total: 0,
      itemCount: 0
    },
    cartLoading: false,

    // Orders
    orders: [],
    currentOrder: null,
    ordersLoading: false,
    ordersPagination: null,

    // Notifications
    notifications: [],
    unreadCount: 0,
    notificationsLoading: false,
    notificationsPagination: null,

    // Downloads
    downloads: [],
    downloadsLoading: false,
    downloadsPagination: null,

    // Dashboard
    dashboardStats: null,
    statsLoading: false,

    // UI state
    loading: false,
    error: null
  }),

  getters: {
    // Cart getters
    cartItemCount: (state) => state.cart.itemCount,
    cartTotal: (state) => state.cart.total,
    isCartEmpty: (state) => state.cart.items.length === 0,

    // Product getters
    featuredProducts: (state) => state.products.filter(product => product.featured),
    newProducts: (state) => state.products.filter(product => product.isNew),

    // Bot getters
    featuredBots: (state) => state.bots.filter(bot => bot.featured),
    popularBots: (state) => state.bots.filter(bot => bot.popular),

    // Notification getters
    unreadNotifications: (state) => state.notifications.filter(notification => !notification.read),
    recentNotifications: (state) => state.notifications.slice(0, 5),

    // User getters
    userDisplayName: (state) => {
      if (!state.user) return 'Guest';
      return state.user.username || state.user.email || 'User';
    },

    // Loading states
    isLoading: (state) => state.loading || state.productsLoading || state.botsLoading || state.cartLoading,
  },

  actions: {
    // Authentication
    async login(walletAddress, signature) {
      this.loading = true;
      this.error = null;

      try {
        const result = await marketplaceService.login(walletAddress, signature);
        if (result.success) {
          this.user = result.user;
          this.isAuthenticated = true;
          
          // Load user data
          await this.loadUserProfile();
          await this.loadWalletBalance();
        } else {
          this.error = result.error;
        }

        this.loading = false;
        return result;
      } catch (error) {
        this.error = error.message;
        this.loading = false;
        return { success: false, error: error.message };
      }
    },

    async register(walletAddress, username, email) {
      this.loading = true;
      this.error = null;

      try {
        const result = await marketplaceService.register(walletAddress, username, email);
        if (result.success) {
          this.user = result.user;
          this.isAuthenticated = true;
        } else {
          this.error = result.error;
        }

        this.loading = false;
        return result;
      } catch (error) {
        this.error = error.message;
        this.loading = false;
        return { success: false, error: error.message };
      }
    },

    async logout() {
      marketplaceService.logout();
      this.user = null;
      this.isAuthenticated = false;
      this.profile = null;
      this.walletBalance = 0;
      this.cart = { items: [], total: 0, itemCount: 0 };
      this.orders = [];
      this.notifications = [];
      this.downloads = [];
      this.error = null;
    },

    // User Profile
    async loadUserProfile() {
      try {
        const result = await marketplaceService.getUserProfile();
        if (result.success) {
          this.profile = result.profile;
        }
        return result;
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async updateProfile(profileData) {
      this.loading = true;
      this.error = null;

      try {
        const result = await marketplaceService.updateProfile(profileData);
        if (result.success) {
          this.profile = result.profile;
        } else {
          this.error = result.error;
        }

        this.loading = false;
        return result;
      } catch (error) {
        this.error = error.message;
        this.loading = false;
        return { success: false, error: error.message };
      }
    },

    // Wallet
    async loadWalletBalance() {
      try {
        const result = await marketplaceService.getWalletBalance();
        if (result.success) {
          this.walletBalance = result.balance;
        }
        return result;
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async syncWallet(walletAddress) {
      try {
        const result = await marketplaceService.syncWallet(walletAddress);
        if (result.success) {
          this.walletBalance = result.balance;
        }
        return result;
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Products
    async loadProducts(category = null, page = 1, limit = 20) {
      this.productsLoading = true;
      this.error = null;

      try {
        const result = await marketplaceService.getProducts(category, page, limit);
        if (result.success) {
          this.products = result.products;
          this.productsPagination = result.pagination;
        } else {
          this.error = result.error;
        }

        this.productsLoading = false;
        return result;
      } catch (error) {
        this.error = error.message;
        this.productsLoading = false;
        return { success: false, error: error.message };
      }
    },

    async loadProduct(id) {
      this.loading = true;
      this.error = null;

      try {
        const result = await marketplaceService.getProduct(id);
        if (result.success) {
          this.currentProduct = result.product;
        } else {
          this.error = result.error;
        }

        this.loading = false;
        return result;
      } catch (error) {
        this.error = error.message;
        this.loading = false;
        return { success: false, error: error.message };
      }
    },

    // Bots
    async loadBots(category = null, page = 1, limit = 20) {
      this.botsLoading = true;
      this.error = null;

      try {
        const result = await marketplaceService.getBots(category, page, limit);
        if (result.success) {
          this.bots = result.bots;
          this.botsPagination = result.pagination;
        } else {
          this.error = result.error;
        }

        this.botsLoading = false;
        return result;
      } catch (error) {
        this.error = error.message;
        this.botsLoading = false;
        return { success: false, error: error.message };
      }
    },

    async loadBot(id) {
      this.loading = true;
      this.error = null;

      try {
        const result = await marketplaceService.getBot(id);
        if (result.success) {
          this.currentBot = result.bot;
        } else {
          this.error = result.error;
        }

        this.loading = false;
        return result;
      } catch (error) {
        this.error = error.message;
        this.loading = false;
        return { success: false, error: error.message };
      }
    },

    // Cart
    async loadCart() {
      this.cartLoading = true;

      try {
        const result = await marketplaceService.getCart();
        if (result.success) {
          this.cart = result.cart;
        }

        this.cartLoading = false;
        return result;
      } catch (error) {
        this.cartLoading = false;
        return { success: false, error: error.message };
      }
    },

    async addToCart(productId, quantity = 1) {
      this.cartLoading = true;

      try {
        const result = await marketplaceService.addToCart(productId, quantity);
        if (result.success) {
          this.cart = result.cart;
        }

        this.cartLoading = false;
        return result;
      } catch (error) {
        this.cartLoading = false;
        return { success: false, error: error.message };
      }
    },

    async removeFromCart(productId) {
      this.cartLoading = true;

      try {
        const result = await marketplaceService.removeFromCart(productId);
        if (result.success) {
          this.cart = result.cart;
        }

        this.cartLoading = false;
        return result;
      } catch (error) {
        this.cartLoading = false;
        return { success: false, error: error.message };
      }
    },

    async updateCartItem(productId, quantity) {
      this.cartLoading = true;

      try {
        const result = await marketplaceService.updateCartItem(productId, quantity);
        if (result.success) {
          this.cart = result.cart;
        }

        this.cartLoading = false;
        return result;
      } catch (error) {
        this.cartLoading = false;
        return { success: false, error: error.message };
      }
    },

    // Orders
    async loadOrders(page = 1, limit = 20) {
      this.ordersLoading = true;
      this.error = null;

      try {
        const result = await marketplaceService.getOrders(page, limit);
        if (result.success) {
          this.orders = result.orders;
          this.ordersPagination = result.pagination;
        } else {
          this.error = result.error;
        }

        this.ordersLoading = false;
        return result;
      } catch (error) {
        this.error = error.message;
        this.ordersLoading = false;
        return { success: false, error: error.message };
      }
    },

    async createOrder(cartData, paymentMethod = 'crypto') {
      this.loading = true;
      this.error = null;

      try {
        const result = await marketplaceService.createOrder(cartData, paymentMethod);
        if (result.success) {
          this.currentOrder = result.order;
          // Clear cart after successful order
          this.cart = { items: [], total: 0, itemCount: 0 };
        } else {
          this.error = result.error;
        }

        this.loading = false;
        return result;
      } catch (error) {
        this.error = error.message;
        this.loading = false;
        return { success: false, error: error.message };
      }
    },

    // Notifications
    async loadNotifications(page = 1, limit = 20) {
      this.notificationsLoading = true;
      this.error = null;

      try {
        const result = await marketplaceService.getNotifications(page, limit);
        if (result.success) {
          this.notifications = result.notifications;
          this.unreadCount = result.notifications.filter(n => !n.read).length;
          this.notificationsPagination = result.pagination;
        } else {
          this.error = result.error;
        }

        this.notificationsLoading = false;
        return result;
      } catch (error) {
        this.error = error.message;
        this.notificationsLoading = false;
        return { success: false, error: error.message };
      }
    },

    async markNotificationAsRead(notificationId) {
      try {
        const result = await marketplaceService.markNotificationAsRead(notificationId);
        if (result.success) {
          const notification = this.notifications.find(n => n.id === notificationId);
          if (notification) {
            notification.read = true;
            this.unreadCount = Math.max(0, this.unreadCount - 1);
          }
        }
        return result;
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async markAllNotificationsAsRead() {
      try {
        const result = await marketplaceService.markAllNotificationsAsRead();
        if (result.success) {
          this.notifications.forEach(notification => {
            notification.read = true;
          });
          this.unreadCount = 0;
        }
        return result;
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Downloads
    async loadDownloads(page = 1, limit = 20) {
      this.downloadsLoading = true;
      this.error = null;

      try {
        const result = await marketplaceService.getDownloads(page, limit);
        if (result.success) {
          this.downloads = result.downloads;
          this.downloadsPagination = result.pagination;
        } else {
          this.error = result.error;
        }

        this.downloadsLoading = false;
        return result;
      } catch (error) {
        this.error = error.message;
        this.downloadsLoading = false;
        return { success: false, error: error.message };
      }
    },

    // Dashboard
    async loadDashboardStats() {
      this.statsLoading = true;
      this.error = null;

      try {
        const result = await marketplaceService.getDashboardStats();
        if (result.success) {
          this.dashboardStats = result.stats;
        } else {
          this.error = result.error;
        }

        this.statsLoading = false;
        return result;
      } catch (error) {
        this.error = error.message;
        this.statsLoading = false;
        return { success: false, error: error.message };
      }
    },

    // Error handling
    clearError() {
      this.error = null;
    },

    // Initialize marketplace
    async initialize() {
      try {
        // Check if user is already authenticated
        const token = localStorage.getItem('marketplace_token');
        if (token) {
          this.isAuthenticated = true;
          await this.loadUserProfile();
          await this.loadWalletBalance();
          await this.loadCart();
        }
      } catch (error) {
        console.error('Failed to initialize marketplace:', error);
      }
    },

    // Check authentication status
    isAuthenticated() {
      const token = localStorage.getItem('marketplace_token');
      return !!token && this.isAuthenticated;
    },

    // Get authentication token
    getAuthToken() {
      return localStorage.getItem('marketplace_token');
    },

    // Set authentication token
    setAuthToken(token) {
      localStorage.setItem('marketplace_token', token);
    },

    // Clear authentication token
    clearAuthToken() {
      localStorage.removeItem('marketplace_token');
    }
  }
});
