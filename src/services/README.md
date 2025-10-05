# API Services Integration

This directory contains the complete API integration system for the Vue.js application, based on the Reaper Market source code patterns.

## 📁 File Structure

```
src/services/
├── apiClient.js          # Core API client with fetch-based requests
├── apiServices.js        # Comprehensive API service modules
├── webhookService.js     # Real-time webhook and subscription handling
├── apiInit.js           # API initialization and error handling service
└── README.md            # This documentation
```

## 🚀 Quick Start

The API services are automatically initialized when the Vue.js app starts. No manual setup required!

```javascript
// Services are available in any Vue component
import { creditCardsAPI, authAPI, webhookService } from '@/services/apiServices.js'
```

## 🔧 Core Components

### 1. API Client (`apiClient.js`)

The foundation of all API communication:

- **Fetch-based**: Uses modern fetch API instead of axios
- **Auto-authentication**: Automatically includes auth tokens
- **Error handling**: Comprehensive error handling and retry logic
- **Timeout support**: Configurable request timeouts
- **Public endpoints**: Smart detection of public vs protected endpoints

```javascript
import apiClient from './apiClient.js'

// Make authenticated requests
const response = await apiClient.get('/credit-cards')
const response = await apiClient.post('/purchases', { cardId: '123' })
```

### 2. API Services (`apiServices.js`)

Comprehensive service modules for all features:

#### Available Services:
- `authAPI` - Authentication and user management
- `adminAPI` - Admin panel functionality
- `creditCardsAPI` - Credit card marketplace
- `documentsAPI` - Document marketplace
- `financeDocumentsAPI` - Financial documents
- `checkerAPI` - Checker configuration files
- `servicesAPI` - Service marketplace
- `botsAPI` - Bot marketplace
- `cartAPI` - Shopping cart functionality
- `ticketsAPI` - Support ticket system
- `referralsAPI` - Referral program
- `transactionsAPI` - Transaction history
- `inboxRequestsAPI` - Inbox search requests
- `binAPI` - BIN checker service
- `profileAPI` - User profile management
- `purchasesAPI` - Purchase history
- `webhooksAPI` - Payment webhooks
- `notificationAPI` - Notification system
- `healthAPI` - API health checks

#### Usage Example:
```javascript
import { creditCardsAPI, authAPI } from '@/services/apiServices.js'

// Get credit cards
const cards = await creditCardsAPI.getCards({
  page: 1,
  limit: 20,
  type: 'Visa',
  status: 'available'
})

// Purchase a card
const result = await creditCardsAPI.purchase('card-id-123')

// Login
const auth = await authAPI.login('user@example.com', 'password')
```

### 3. Webhook Service (`webhookService.js`)

Real-time updates via Supabase subscriptions:

- **Auto-subscription**: Automatically subscribes to all relevant tables
- **Event handling**: Dispatches custom events for UI updates
- **Local storage sync**: Keeps local data in sync with database
- **Browser notifications**: Shows notifications for new updates
- **Reconnection**: Automatic reconnection on connection loss

#### Supported Tables:
- `credit_cards` - Credit card updates
- `documents` - Document changes
- `finance_documents` - Finance document updates
- `checker_files` - Checker file changes
- `inbox_requests` - Inbox request updates
- `support_tickets` - Ticket system updates
- `referrals` - Referral program updates
- `transactions` - Transaction updates
- `notifications` - Notification updates

#### Usage in Components:
```javascript
import { onMounted, onUnmounted } from 'vue'

// Listen for real-time updates
const handleCardUpdate = (event) => {
  console.log('Credit card updated:', event.detail)
  // Refresh your data
}

onMounted(() => {
  window.addEventListener('credit-card-updated', handleCardUpdate)
})

onUnmounted(() => {
  window.removeEventListener('credit-card-updated', handleCardUpdate)
})
```

### 4. API Initialization (`apiInit.js`)

Centralized API service management:

- **Auto-initialization**: Automatically starts when app loads
- **Health checks**: Verifies API connectivity
- **Error handling**: Global error handling and recovery
- **Authentication**: Automatic token refresh
- **Cleanup**: Proper cleanup on app shutdown

## 🔄 Real-time Updates

The webhook service provides real-time updates for all data changes:

### Event Types:
- `credit-card-updated` - Credit card changes
- `document-updated` - Document changes
- `finance-document-updated` - Finance document changes
- `checker-file-updated` - Checker file changes
- `inbox-request-updated` - Inbox request changes
- `ticket-updated` - Support ticket changes
- `referral-updated` - Referral changes
- `transaction-updated` - Transaction changes
- `notification-updated` - Notification changes

### Usage in Vue Components:
```javascript
<template>
  <div>
    <!-- Your component content -->
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const handleUpdate = (event) => {
  // Handle the update
  console.log('Update received:', event.detail)
}

onMounted(() => {
  window.addEventListener('credit-card-updated', handleUpdate)
})

onUnmounted(() => {
  window.removeEventListener('credit-card-updated', handleUpdate)
})
</script>
```

## 🛡️ Error Handling

Comprehensive error handling across all services:

### Global Error Handling:
- Network connectivity issues
- Authentication errors
- Server errors (5xx)
- Request timeouts
- Invalid responses

### Automatic Recovery:
- Token refresh on expiration
- Webhook reconnection
- Retry logic for failed requests
- Graceful degradation with fallback data

### Error Events:
```javascript
// Listen for authentication errors
window.addEventListener('auth-token-removed', () => {
  // Redirect to login or show login modal
})
```

## 🔐 Authentication

Automatic authentication handling:

- **Token management**: Automatic token inclusion in requests
- **Token refresh**: Automatic session refresh
- **Logout handling**: Proper cleanup on logout
- **Public endpoints**: Smart detection of public vs protected endpoints

## 📊 Data Flow

1. **Component** makes API call using service
2. **API Service** formats request and calls API client
3. **API Client** makes authenticated fetch request
4. **Response** is processed and returned to component
5. **Webhook Service** receives real-time updates
6. **Local Storage** is updated with new data
7. **Components** receive update events and refresh

## 🧪 Testing

The services include comprehensive error handling and fallback mechanisms:

- **Mock data fallbacks** when API calls fail
- **Network error handling** with user-friendly messages
- **Timeout handling** for slow requests
- **Graceful degradation** when services are unavailable

## 🔧 Configuration

API services are configured through environment variables:

```javascript
// In your .env file
VITE_API_BASE_URL=/api
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key
```

## 📈 Performance

Optimized for performance:

- **Request caching** for frequently accessed data
- **Lazy loading** of service modules
- **Efficient webhook subscriptions** with minimal overhead
- **Background processing** for heavy operations

## 🚨 Troubleshooting

### Common Issues:

1. **API calls failing**: Check network connectivity and API endpoint
2. **Authentication errors**: Verify token is valid and not expired
3. **Webhook not working**: Check Supabase connection and table permissions
4. **Slow responses**: Check API server status and network latency

### Debug Mode:
Enable debug logging by setting `localStorage.debug = 'api:*'`

## 📝 API Reference

For detailed API documentation, refer to the individual service files:

- Each service exports functions with JSDoc comments
- Error responses include detailed error messages
- All functions return consistent response formats

## 🔄 Migration from Supabase Direct

If you're migrating from direct Supabase calls:

1. Replace `supabase.from('table').select()` with `tableAPI.getItems()`
2. Replace `supabase.from('table').insert()` with `tableAPI.createItem()`
3. Replace `supabase.from('table').update()` with `tableAPI.updateItem()`
4. Replace `supabase.from('table').delete()` with `tableAPI.deleteItem()`

The new API services provide the same functionality with better error handling and real-time updates.
