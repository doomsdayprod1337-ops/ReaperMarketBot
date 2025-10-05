<template>
  <!-- Cart Sidebar -->
  <div
    v-if="cartStore.isOpen"
    class="fixed inset-0 z-50 overflow-hidden"
    @click="cartStore.closeCart"
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
    
    <!-- Cart Panel -->
    <div
      class="absolute right-0 top-0 h-full w-full max-w-md bg-gray-900 border-l border-red-500/30 shadow-xl transform transition-transform duration-300 ease-in-out"
      @click.stop
    >
      <div class="flex flex-col h-full">
        <!-- Cart Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 class="text-xl font-bold text-white font-reaper">Shopping Cart</h2>
          <button
            @click="cartStore.closeCart"
            class="text-gray-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto p-6">
          <div v-if="cartStore.isEmpty" class="text-center py-12">
            <div class="text-6xl mb-4">🛒</div>
            <h3 class="text-xl font-semibold text-white mb-2">Your cart is empty</h3>
            <p class="text-gray-400 mb-6">Add some bots to get started!</p>
            <button
              @click="cartStore.closeCart"
              class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Browse Bots
            </button>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="bg-gray-800/80 border border-gray-700 rounded-lg p-4"
            >
              <!-- Item Header -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <h4 class="text-white font-medium text-sm">{{ item.bot_id }}</h4>
                  <div class="text-gray-400 text-xs mt-1">
                    {{ item.country }} • {{ item.os }}
                  </div>
                </div>
                <button
                  @click="cartStore.removeFromCart(item.id)"
                  class="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <!-- Item Data Preview -->
              <div class="grid grid-cols-2 gap-2 mb-3">
                <div class="bg-gray-700/50 p-2 rounded text-center">
                  <div class="text-red-400 text-xs">🔑</div>
                  <div class="text-white text-xs font-medium">{{ item.logins_count }}</div>
                </div>
                <div class="bg-gray-700/50 p-2 rounded text-center">
                  <div class="text-red-400 text-xs">🍪</div>
                  <div class="text-white text-xs font-medium">{{ item.cookies_count }}</div>
                </div>
                <div class="bg-gray-700/50 p-2 rounded text-center">
                  <div class="text-red-400 text-xs">💳</div>
                  <div class="text-white text-xs font-medium">{{ item.creditCardCount }}</div>
                </div>
                <div class="bg-gray-700/50 p-2 rounded text-center">
                  <div class="text-red-400 text-xs">₿</div>
                  <div class="text-white text-xs font-medium">{{ item.cryptoWalletCount }}</div>
                </div>
              </div>

              <!-- Quantity and Price -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <button
                    @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                    class="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    -
                  </button>
                  <span class="text-white font-medium w-8 text-center">{{ item.quantity }}</span>
                  <button
                    @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                    class="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <div class="text-right">
                  <div class="text-white font-bold">${{ (item.price * item.quantity).toFixed(2) }}</div>
                  <div class="text-gray-400 text-xs">${{ item.price }} each</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Footer -->
        <div v-if="!cartStore.isEmpty" class="border-t border-gray-700 p-6">
          <!-- Cart Summary -->
          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Items ({{ cartStore.itemCount }})</span>
              <span class="text-white">${{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Processing Fee</span>
              <span class="text-white">${{ (cartStore.totalPrice * 0.05).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Security Fee</span>
              <span class="text-white">${{ (cartStore.totalPrice * 0.03).toFixed(2) }}</span>
            </div>
            <div class="border-t border-gray-700 pt-3">
              <div class="flex justify-between text-lg font-bold">
                <span class="text-white">Total</span>
                <span class="text-red-400">${{ (cartStore.totalPrice * 1.08).toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <button
              @click="cartStore.proceedToCheckout"
              :disabled="cartStore.isLoading"
              class="w-full py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
            >
              <span v-if="!cartStore.isLoading">Proceed to Checkout</span>
              <span v-else class="flex items-center justify-center gap-2">
                <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </span>
            </button>
            <button
              @click="cartStore.clearCart"
              class="w-full py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
</script>

<style scoped>
.font-reaper {
  font-family: 'Reaper', sans-serif;
}
</style>
