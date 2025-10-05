// Environment Configuration
export const config = {
  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here',
    serviceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key-here'
  },

  // Application Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Reaper Market',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    description: import.meta.env.VITE_APP_DESCRIPTION || 'Premium marketplace for stealer logs and digital assets',
    url: import.meta.env.VITE_APP_URL || 'http://localhost:5173'
  },

  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
    retries: parseInt(import.meta.env.VITE_API_RETRIES) || 3
  },

  // Telegram Configuration
  telegram: {
    botToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '',
    botUsername: import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'reaper_market_bot',
    webAppUrl: import.meta.env.VITE_TELEGRAM_WEBAPP_URL || 'https://your-domain.com'
  },

  // Web3 Configuration
  web3: {
    walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '',
    infuraProjectId: import.meta.env.VITE_INFURA_PROJECT_ID || '',
    networkId: parseInt(import.meta.env.VITE_NETWORK_ID) || 1, // Ethereum mainnet
    rpcUrl: import.meta.env.VITE_RPC_URL || 'https://mainnet.infura.io/v3/your-project-id'
  },

  // Payment Configuration
  payments: {
    stripe: {
      publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
      secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY || ''
    },
    paypal: {
      clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
      clientSecret: import.meta.env.VITE_PAYPAL_CLIENT_SECRET || ''
    },
    crypto: {
      bitcoin: import.meta.env.VITE_BITCOIN_ADDRESS || '',
      ethereum: import.meta.env.VITE_ETHEREUM_ADDRESS || '',
      monero: import.meta.env.VITE_MONERO_ADDRESS || ''
    }
  },

  // Security Configuration
  security: {
    jwtSecret: import.meta.env.VITE_JWT_SECRET || 'your-jwt-secret-here',
    encryptionKey: import.meta.env.VITE_ENCRYPTION_KEY || 'your-encryption-key-here',
    sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 3600000, // 1 hour
    maxLoginAttempts: parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS) || 5
  },

  // Development Configuration
  development: {
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true' || false,
    logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
    enableDevTools: import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true' || false
  },

  // Feature Flags
  features: {
    telegramIntegration: import.meta.env.VITE_ENABLE_TELEGRAM_INTEGRATION === 'true' || true,
    web3Integration: import.meta.env.VITE_ENABLE_WEB3_INTEGRATION === 'true' || true,
    paymentIntegration: import.meta.env.VITE_ENABLE_PAYMENT_INTEGRATION === 'true' || true,
    notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true' || true,
    chat: import.meta.env.VITE_ENABLE_CHAT === 'true' || true,
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true' || false
  },

  // External Services
  services: {
    sentry: {
      dsn: import.meta.env.VITE_SENTRY_DSN || '',
      environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'development'
    },
    analytics: {
      id: import.meta.env.VITE_ANALYTICS_ID || '',
      provider: import.meta.env.VITE_ANALYTICS_PROVIDER || 'google'
    }
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760, // 10MB
    allowedTypes: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,application/pdf,text/plain').split(','),
    maxFiles: parseInt(import.meta.env.VITE_MAX_FILES) || 5
  },

  // Rate Limiting
  rateLimit: {
    requests: parseInt(import.meta.env.VITE_RATE_LIMIT_REQUESTS) || 100,
    window: parseInt(import.meta.env.VITE_RATE_LIMIT_WINDOW) || 3600000, // 1 hour
    burst: parseInt(import.meta.env.VITE_RATE_LIMIT_BURST) || 10
  },

  // Cache Configuration
  cache: {
    ttl: parseInt(import.meta.env.VITE_CACHE_TTL) || 300000, // 5 minutes
    maxSize: parseInt(import.meta.env.VITE_CACHE_MAX_SIZE) || 50,
    strategy: import.meta.env.VITE_CACHE_STRATEGY || 'memory'
  },

  // UI Configuration
  ui: {
    theme: import.meta.env.VITE_THEME || 'dark',
    language: import.meta.env.VITE_LANGUAGE || 'en',
    timezone: import.meta.env.VITE_TIMEZONE || 'UTC',
    currency: import.meta.env.VITE_CURRENCY || 'USD'
  }
}

// Environment validation
export const validateConfig = () => {
  const required = [
    'supabase.url',
    'supabase.anonKey'
  ]

  const missing = required.filter(key => {
    const value = key.split('.').reduce((obj, k) => obj?.[k], config)
    return !value || value.includes('your-') || value.includes('your_')
  })

  if (missing.length > 0) {
    console.warn('Missing or invalid configuration:', missing)
    return false
  }

  return true
}

// Export individual config sections for easier imports
export const supabaseConfig = config.supabase
export const appConfig = config.app
export const apiConfig = config.api
export const telegramConfig = config.telegram
export const web3Config = config.web3
export const paymentConfig = config.payments
export const securityConfig = config.security
export const featureFlags = config.features