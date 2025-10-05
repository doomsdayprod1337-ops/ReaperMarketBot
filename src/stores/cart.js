// src/stores/cart.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref([])
  const isOpen = ref(false)
  const isLoading = ref(false)
  const checkoutStep = ref('cart') // 'cart', 'shipping', 'payment', 'confirmation'
  
  // Getters
  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })
  
  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })
  
  const totalItems = computed(() => {
    return items.value.length
  })
  
  const isEmpty = computed(() => {
    return items.value.length === 0
  })
  
  const cartSummary = computed(() => {
    return {
      itemCount: itemCount.value,
      totalPrice: totalPrice.value,
      totalItems: totalItems.value,
      isEmpty: isEmpty.value
    }
  })
  
  // Actions
  const addToCart = (product) => {
    const existingItem = items.value.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      items.value.push({
        id: product.id,
        bot_id: product.bot_id,
        name: product.bot_id,
        price: product.price,
        quantity: 1,
        country: product.country,
        os: product.os,
        ip: product.ip,
        logins_count: product.logins_count,
        cookies_count: product.cookies_count,
        creditCardCount: product.creditCardCount || 0,
        cryptoWalletCount: product.cryptoWalletCount || 0,
        created_at: product.created_at,
        status: product.status
      })
    }
    
    // Show success notification
    showNotification('Item added to cart!', 'success')
  }
  
  const removeFromCart = (itemId) => {
    const index = items.value.findIndex(item => item.id === itemId)
    if (index > -1) {
      items.value.splice(index, 1)
      showNotification('Item removed from cart!', 'info')
    }
  }
  
  const updateQuantity = (itemId, quantity) => {
    const item = items.value.find(item => item.id === itemId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(itemId)
      } else {
        item.quantity = quantity
      }
    }
  }
  
  const clearCart = () => {
    items.value = []
    showNotification('Cart cleared!', 'info')
  }
  
  const toggleCart = () => {
    isOpen.value = !isOpen.value
  }
  
  const openCart = () => {
    isOpen.value = true
  }
  
  const closeCart = () => {
    isOpen.value = false
  }
  
  const proceedToCheckout = () => {
    if (isEmpty.value) {
      showNotification('Your cart is empty!', 'warning')
      return
    }
    checkoutStep.value = 'shipping'
    isOpen.value = false
  }
  
  const processCheckout = async (checkoutData) => {
    isLoading.value = true
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create order
      const order = {
        id: Date.now(),
        items: [...items.value],
        total: totalPrice.value,
        status: 'pending',
        created_at: new Date().toISOString(),
        ...checkoutData
      }
      
      // Save order to localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      orders.push(order)
      localStorage.setItem('orders', JSON.stringify(orders))
      
      // Clear cart
      clearCart()
      
      // Move to confirmation step
      checkoutStep.value = 'confirmation'
      
      showNotification('Order placed successfully!', 'success')
      
      return order
    } catch (error) {
      console.error('Checkout error:', error)
      showNotification('Checkout failed. Please try again.', 'error')
      throw error
    } finally {
      isLoading.value = false
    }
  }
  
  const resetCheckout = () => {
    checkoutStep.value = 'cart'
  }
  
  const getCartItem = (itemId) => {
    return items.value.find(item => item.id === itemId)
  }
  
  const isInCart = (productId) => {
    return items.value.some(item => item.id === productId)
  }
  
  const getCartItemQuantity = (productId) => {
    const item = items.value.find(item => item.id === productId)
    return item ? item.quantity : 0
  }
  
  // Notification helper
  const showNotification = (message, type = 'info') => {
    // Create notification element
    const notification = document.createElement('div')
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      type === 'warning' ? 'bg-yellow-500 text-black' :
      'bg-blue-500 text-white'
    }`
    notification.textContent = message
    
    document.body.appendChild(notification)
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.remove()
    }, 3000)
  }
  
  // Persist cart to localStorage
  const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }
  
  const loadCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      items.value = JSON.parse(savedCart)
    }
  }
  
  // Initialize cart from localStorage
  loadCart()
  
  // Save cart whenever items change
  const unwatch = computed(() => items.value)
  unwatch.value && saveCart()
  
  return {
    // State
    items,
    isOpen,
    isLoading,
    checkoutStep,
    
    // Getters
    itemCount,
    totalPrice,
    totalItems,
    isEmpty,
    cartSummary,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    proceedToCheckout,
    processCheckout,
    resetCheckout,
    getCartItem,
    isInCart,
    getCartItemQuantity,
    saveCart,
    loadCart
  }
})
