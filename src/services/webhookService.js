// Webhook and Real-time Update Service
// Based on Reaper Market webhook patterns

import { supabase } from '@/lib/supabase.js'

class WebhookService {
  constructor() {
    this.subscriptions = new Map()
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000
    this.isConnected = false
  }

  // Initialize webhook service
  async initialize() {
    try {
      await this.setupSupabaseSubscriptions()
      this.isConnected = true
      console.log('✅ Webhook service initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize webhook service:', error)
      this.handleReconnection()
    }
  }

  // Setup Supabase real-time subscriptions
  async setupSupabaseSubscriptions() {
    // Subscribe to credit cards table changes
    const creditCardsSubscription = supabase
      .channel('credit-cards-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'credit_cards' },
        (payload) => {
          this.handleCreditCardChange(payload)
        }
      )
      .subscribe()

    // Subscribe to documents table changes
    const documentsSubscription = supabase
      .channel('documents-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'documents' },
        (payload) => {
          this.handleDocumentChange(payload)
        }
      )
      .subscribe()

    // Subscribe to finance documents table changes
    const financeDocsSubscription = supabase
      .channel('finance-docs-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'finance_documents' },
        (payload) => {
          this.handleFinanceDocumentChange(payload)
        }
      )
      .subscribe()

    // Subscribe to checker files table changes
    const checkerFilesSubscription = supabase
      .channel('checker-files-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'checker_files' },
        (payload) => {
          this.handleCheckerFileChange(payload)
        }
      )
      .subscribe()

    // Subscribe to inbox requests table changes
    const inboxRequestsSubscription = supabase
      .channel('inbox-requests-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'inbox_requests' },
        (payload) => {
          this.handleInboxRequestChange(payload)
        }
      )
      .subscribe()

    // Subscribe to support tickets table changes
    const ticketsSubscription = supabase
      .channel('tickets-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'support_tickets' },
        (payload) => {
          this.handleTicketChange(payload)
        }
      )
      .subscribe()

    // Subscribe to referrals table changes
    const referralsSubscription = supabase
      .channel('referrals-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'referrals' },
        (payload) => {
          this.handleReferralChange(payload)
        }
      )
      .subscribe()

    // Subscribe to transactions table changes
    const transactionsSubscription = supabase
      .channel('transactions-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        (payload) => {
          this.handleTransactionChange(payload)
        }
      )
      .subscribe()

    // Subscribe to notifications table changes
    const notificationsSubscription = supabase
      .channel('notifications-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        (payload) => {
          this.handleNotificationChange(payload)
        }
      )
      .subscribe()

    // Store subscriptions for cleanup
    this.subscriptions.set('credit-cards', creditCardsSubscription)
    this.subscriptions.set('documents', documentsSubscription)
    this.subscriptions.set('finance-docs', financeDocsSubscription)
    this.subscriptions.set('checker-files', checkerFilesSubscription)
    this.subscriptions.set('inbox-requests', inboxRequestsSubscription)
    this.subscriptions.set('tickets', ticketsSubscription)
    this.subscriptions.set('referrals', referralsSubscription)
    this.subscriptions.set('transactions', transactionsSubscription)
    this.subscriptions.set('notifications', notificationsSubscription)
  }

  // Handle credit card changes
  handleCreditCardChange(payload) {
    const event = payload.eventType
    const data = payload.new || payload.old

    console.log('💳 Credit card change:', event, data)

    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('credit-card-updated', {
      detail: { event, data, payload }
    }))

    // Update local storage if needed
    if (event === 'INSERT' || event === 'UPDATE') {
      this.updateLocalCreditCardData(data)
    } else if (event === 'DELETE') {
      this.removeLocalCreditCardData(data.id)
    }
  }

  // Handle document changes
  handleDocumentChange(payload) {
    const event = payload.eventType
    const data = payload.new || payload.old

    console.log('📄 Document change:', event, data)

    window.dispatchEvent(new CustomEvent('document-updated', {
      detail: { event, data, payload }
    }))

    if (event === 'INSERT' || event === 'UPDATE') {
      this.updateLocalDocumentData(data)
    } else if (event === 'DELETE') {
      this.removeLocalDocumentData(data.id)
    }
  }

  // Handle finance document changes
  handleFinanceDocumentChange(payload) {
    const event = payload.eventType
    const data = payload.new || payload.old

    console.log('💰 Finance document change:', event, data)

    window.dispatchEvent(new CustomEvent('finance-document-updated', {
      detail: { event, data, payload }
    }))

    if (event === 'INSERT' || event === 'UPDATE') {
      this.updateLocalFinanceDocumentData(data)
    } else if (event === 'DELETE') {
      this.removeLocalFinanceDocumentData(data.id)
    }
  }

  // Handle checker file changes
  handleCheckerFileChange(payload) {
    const event = payload.eventType
    const data = payload.new || payload.old

    console.log('⚙️ Checker file change:', event, data)

    window.dispatchEvent(new CustomEvent('checker-file-updated', {
      detail: { event, data, payload }
    }))

    if (event === 'INSERT' || event === 'UPDATE') {
      this.updateLocalCheckerFileData(data)
    } else if (event === 'DELETE') {
      this.removeLocalCheckerFileData(data.id)
    }
  }

  // Handle inbox request changes
  handleInboxRequestChange(payload) {
    const event = payload.eventType
    const data = payload.new || payload.old

    console.log('📧 Inbox request change:', event, data)

    window.dispatchEvent(new CustomEvent('inbox-request-updated', {
      detail: { event, data, payload }
    }))

    if (event === 'INSERT' || event === 'UPDATE') {
      this.updateLocalInboxRequestData(data)
    } else if (event === 'DELETE') {
      this.removeLocalInboxRequestData(data.id)
    }
  }

  // Handle ticket changes
  handleTicketChange(payload) {
    const event = payload.eventType
    const data = payload.new || payload.old

    console.log('🎫 Ticket change:', event, data)

    window.dispatchEvent(new CustomEvent('ticket-updated', {
      detail: { event, data, payload }
    }))

    if (event === 'INSERT' || event === 'UPDATE') {
      this.updateLocalTicketData(data)
    } else if (event === 'DELETE') {
      this.removeLocalTicketData(data.id)
    }
  }

  // Handle referral changes
  handleReferralChange(payload) {
    const event = payload.eventType
    const data = payload.new || payload.old

    console.log('👥 Referral change:', event, data)

    window.dispatchEvent(new CustomEvent('referral-updated', {
      detail: { event, data, payload }
    }))

    if (event === 'INSERT' || event === 'UPDATE') {
      this.updateLocalReferralData(data)
    } else if (event === 'DELETE') {
      this.removeLocalReferralData(data.id)
    }
  }

  // Handle transaction changes
  handleTransactionChange(payload) {
    const event = payload.eventType
    const data = payload.new || payload.old

    console.log('💸 Transaction change:', event, data)

    window.dispatchEvent(new CustomEvent('transaction-updated', {
      detail: { event, data, payload }
    }))

    if (event === 'INSERT' || event === 'UPDATE') {
      this.updateLocalTransactionData(data)
    } else if (event === 'DELETE') {
      this.removeLocalTransactionData(data.id)
    }
  }

  // Handle notification changes
  handleNotificationChange(payload) {
    const event = payload.eventType
    const data = payload.new || payload.old

    console.log('🔔 Notification change:', event, data)

    window.dispatchEvent(new CustomEvent('notification-updated', {
      detail: { event, data, payload }
    }))

    // Show browser notification for new notifications
    if (event === 'INSERT' && data && document.hidden) {
      this.showBrowserNotification(data)
    }
  }

  // Update local storage data helpers
  updateLocalCreditCardData(data) {
    const localData = JSON.parse(localStorage.getItem('credit_cards') || '[]')
    const index = localData.findIndex(item => item.id === data.id)
    
    if (index >= 0) {
      localData[index] = { ...localData[index], ...data }
    } else {
      localData.push(data)
    }
    
    localStorage.setItem('credit_cards', JSON.stringify(localData))
  }

  removeLocalCreditCardData(id) {
    const localData = JSON.parse(localStorage.getItem('credit_cards') || '[]')
    const filteredData = localData.filter(item => item.id !== id)
    localStorage.setItem('credit_cards', JSON.stringify(filteredData))
  }

  updateLocalDocumentData(data) {
    const localData = JSON.parse(localStorage.getItem('documents') || '[]')
    const index = localData.findIndex(item => item.id === data.id)
    
    if (index >= 0) {
      localData[index] = { ...localData[index], ...data }
    } else {
      localData.push(data)
    }
    
    localStorage.setItem('documents', JSON.stringify(localData))
  }

  removeLocalDocumentData(id) {
    const localData = JSON.parse(localStorage.getItem('documents') || '[]')
    const filteredData = localData.filter(item => item.id !== id)
    localStorage.setItem('documents', JSON.stringify(filteredData))
  }

  updateLocalFinanceDocumentData(data) {
    const localData = JSON.parse(localStorage.getItem('finance_documents') || '[]')
    const index = localData.findIndex(item => item.id === data.id)
    
    if (index >= 0) {
      localData[index] = { ...localData[index], ...data }
    } else {
      localData.push(data)
    }
    
    localStorage.setItem('finance_documents', JSON.stringify(localData))
  }

  removeLocalFinanceDocumentData(id) {
    const localData = JSON.parse(localStorage.getItem('finance_documents') || '[]')
    const filteredData = localData.filter(item => item.id !== id)
    localStorage.setItem('finance_documents', JSON.stringify(filteredData))
  }

  updateLocalCheckerFileData(data) {
    const localData = JSON.parse(localStorage.getItem('checker_files') || '[]')
    const index = localData.findIndex(item => item.id === data.id)
    
    if (index >= 0) {
      localData[index] = { ...localData[index], ...data }
    } else {
      localData.push(data)
    }
    
    localStorage.setItem('checker_files', JSON.stringify(localData))
  }

  removeLocalCheckerFileData(id) {
    const localData = JSON.parse(localStorage.getItem('checker_files') || '[]')
    const filteredData = localData.filter(item => item.id !== id)
    localStorage.setItem('checker_files', JSON.stringify(filteredData))
  }

  updateLocalInboxRequestData(data) {
    const localData = JSON.parse(localStorage.getItem('inbox_requests') || '[]')
    const index = localData.findIndex(item => item.id === data.id)
    
    if (index >= 0) {
      localData[index] = { ...localData[index], ...data }
    } else {
      localData.push(data)
    }
    
    localStorage.setItem('inbox_requests', JSON.stringify(localData))
  }

  removeLocalInboxRequestData(id) {
    const localData = JSON.parse(localStorage.getItem('inbox_requests') || '[]')
    const filteredData = localData.filter(item => item.id !== id)
    localStorage.setItem('inbox_requests', JSON.stringify(filteredData))
  }

  updateLocalTicketData(data) {
    const localData = JSON.parse(localStorage.getItem('support_tickets') || '[]')
    const index = localData.findIndex(item => item.id === data.id)
    
    if (index >= 0) {
      localData[index] = { ...localData[index], ...data }
    } else {
      localData.push(data)
    }
    
    localStorage.setItem('support_tickets', JSON.stringify(localData))
  }

  removeLocalTicketData(id) {
    const localData = JSON.parse(localStorage.getItem('support_tickets') || '[]')
    const filteredData = localData.filter(item => item.id !== id)
    localStorage.setItem('support_tickets', JSON.stringify(filteredData))
  }

  updateLocalReferralData(data) {
    const localData = JSON.parse(localStorage.getItem('referrals') || '[]')
    const index = localData.findIndex(item => item.id === data.id)
    
    if (index >= 0) {
      localData[index] = { ...localData[index], ...data }
    } else {
      localData.push(data)
    }
    
    localStorage.setItem('referrals', JSON.stringify(localData))
  }

  removeLocalReferralData(id) {
    const localData = JSON.parse(localStorage.getItem('referrals') || '[]')
    const filteredData = localData.filter(item => item.id !== id)
    localStorage.setItem('referrals', JSON.stringify(filteredData))
  }

  updateLocalTransactionData(data) {
    const localData = JSON.parse(localStorage.getItem('transactions') || '[]')
    const index = localData.findIndex(item => item.id === data.id)
    
    if (index >= 0) {
      localData[index] = { ...localData[index], ...data }
    } else {
      localData.push(data)
    }
    
    localStorage.setItem('transactions', JSON.stringify(localData))
  }

  removeLocalTransactionData(id) {
    const localData = JSON.parse(localStorage.getItem('transactions') || '[]')
    const filteredData = localData.filter(item => item.id !== id)
    localStorage.setItem('transactions', JSON.stringify(filteredData))
  }

  // Show browser notification
  showBrowserNotification(notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title || 'New Notification', {
        body: notification.message || notification.content,
        icon: '/favicon.ico',
        tag: notification.id
      })
    }
  }

  // Request notification permission
  async requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return Notification.permission === 'granted'
  }

  // Handle reconnection
  handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`🔄 Attempting to reconnect webhook service (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      
      setTimeout(() => {
        this.initialize()
      }, this.reconnectDelay * this.reconnectAttempts)
    } else {
      console.error('❌ Max reconnection attempts reached for webhook service')
    }
  }

  // Cleanup subscriptions
  cleanup() {
    console.log('🧹 Cleaning up webhook subscriptions')
    
    this.subscriptions.forEach((subscription, name) => {
      try {
        supabase.removeChannel(subscription)
        console.log(`✅ Removed subscription: ${name}`)
      } catch (error) {
        console.error(`❌ Failed to remove subscription ${name}:`, error)
      }
    })
    
    this.subscriptions.clear()
    this.isConnected = false
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      subscriptionCount: this.subscriptions.size
    }
  }
}

// Create and export singleton instance
const webhookService = new WebhookService()
export default webhookService

// Export for use in components
export const initializeWebhooks = () => webhookService.initialize()
export const cleanupWebhooks = () => webhookService.cleanup()
export const getWebhookStatus = () => webhookService.getConnectionStatus()
export const requestNotificationPermission = () => webhookService.requestNotificationPermission()
