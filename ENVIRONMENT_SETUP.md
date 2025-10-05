# Environment Setup Guide

This guide will help you set up the environment variables needed for the Reaper Market application.

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

### Supabase Configuration
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Application Configuration
```env
VITE_APP_NAME=Reaper Market
VITE_APP_VERSION=1.0.0
VITE_APP_URL=https://your-domain.com
```

### API Configuration
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_API_TIMEOUT=10000
VITE_API_RETRIES=3
```

### Telegram Configuration
```env
VITE_TELEGRAM_BOT_TOKEN=your-telegram-bot-token
VITE_TELEGRAM_BOT_USERNAME=reaper_market_bot
VITE_TELEGRAM_WEBAPP_URL=https://your-domain.com
```

### Web3 Configuration
```env
VITE_WALLET_CONNECT_PROJECT_ID=your-walletconnect-project-id
VITE_INFURA_PROJECT_ID=your-infura-project-id
VITE_NETWORK_ID=1
VITE_RPC_URL=https://mainnet.infura.io/v3/your-project-id
```

### Payment Configuration
```env
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
VITE_STRIPE_SECRET_KEY=your-stripe-secret-key
VITE_PAYPAL_CLIENT_ID=your-paypal-client-id
VITE_PAYPAL_CLIENT_SECRET=your-paypal-client-secret
```

### Security Configuration
```env
VITE_JWT_SECRET=your-jwt-secret-key
VITE_ENCRYPTION_KEY=your-encryption-key
VITE_SESSION_TIMEOUT=3600000
VITE_MAX_LOGIN_ATTEMPTS=5
```

### Feature Flags
```env
VITE_ENABLE_TELEGRAM_INTEGRATION=true
VITE_ENABLE_WEB3_INTEGRATION=true
VITE_ENABLE_PAYMENT_INTEGRATION=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_CHAT=true
VITE_ENABLE_ANALYTICS=false
```

### Development Configuration
```env
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
VITE_ENABLE_DEV_TOOLS=true
```

### External Services
```env
VITE_SENTRY_DSN=your-sentry-dsn
VITE_ANALYTICS_ID=your-analytics-id
VITE_ANALYTICS_PROVIDER=google
```

## Setup Instructions

### 1. Supabase Setup
1. Go to [Supabase](https://supabase.com) and create a new project
2. Copy your project URL and anon key from the API settings
3. Create the following tables in your Supabase database:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  telegram_id BIGINT UNIQUE,
  telegram_username TEXT,
  balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bots table
CREATE TABLE bots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id TEXT UNIQUE NOT NULL,
  country TEXT NOT NULL,
  country_code TEXT NOT NULL,
  ip TEXT NOT NULL,
  os TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  service_type TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  item_type TEXT NOT NULL,
  item_id UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Telegram Bot Setup
1. Create a new bot with [@BotFather](https://t.me/botfather)
2. Get your bot token and username
3. Set up webhook: `https://your-domain.com/api/telegram/webhook`
4. Configure bot commands:
   ```
   start - Start using the bot
   help - Get help
   balance - Check your balance
   profile - View your profile
   support - Contact support
   ```

### 3. Web3 Setup
1. Get a WalletConnect Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Get an Infura Project ID from [Infura](https://infura.io)
3. Configure your RPC endpoints

### 4. Payment Setup
1. **Stripe**: Get your publishable and secret keys from [Stripe Dashboard](https://dashboard.stripe.com)
2. **PayPal**: Get your client ID and secret from [PayPal Developer](https://developer.paypal.com)

### 5. Security Setup
1. Generate a strong JWT secret (32+ characters)
2. Generate an encryption key for sensitive data
3. Configure rate limiting and session timeouts

## Environment Validation

The application will automatically validate your environment variables on startup. Missing or invalid variables will be logged as warnings.

## Development vs Production

### Development
- Set `VITE_DEBUG_MODE=true`
- Use local API endpoints
- Enable dev tools
- Use test payment methods

### Production
- Set `VITE_DEBUG_MODE=false`
- Use production API endpoints
- Disable dev tools
- Use live payment methods
- Enable analytics and monitoring

## Security Best Practices

1. **Never commit `.env` files to version control**
2. **Use strong, unique secrets for JWT and encryption**
3. **Rotate secrets regularly**
4. **Use HTTPS in production**
5. **Implement proper CORS policies**
6. **Use environment-specific configurations**

## Troubleshooting

### Common Issues

1. **Supabase connection failed**
   - Check your URL and keys
   - Ensure your project is active
   - Verify database permissions

2. **Telegram bot not responding**
   - Check bot token and username
   - Verify webhook URL is accessible
   - Check bot permissions

3. **Web3 connection issues**
   - Ensure MetaMask is installed
   - Check network configuration
   - Verify RPC endpoints

4. **Payment integration problems**
   - Verify API keys are correct
   - Check webhook configurations
   - Ensure proper SSL certificates

### Getting Help

If you encounter issues:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Test API endpoints independently
4. Check service-specific documentation

## Support

For additional help, please refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Web3 Documentation](https://docs.ethers.io)
- [Stripe Documentation](https://stripe.com/docs)
