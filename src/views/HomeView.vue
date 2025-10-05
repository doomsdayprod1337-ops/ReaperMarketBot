<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900">
      <div class="container mx-auto px-4 py-16">
        <div class="text-center">
          <h1 class="text-5xl font-bold text-white mb-6 font-mono">
            REAPER MARKET
          </h1>
          <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Premium marketplace for stealer logs, compromised systems, and digital assets
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <router-link 
              to="/bots" 
              class="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Bots
            </router-link>
            <router-link 
              to="/services" 
              class="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View Services
            </router-link>
            <router-link 
              to="/marketplace" 
              class="border border-red-600 text-red-400 hover:bg-red-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Explore Marketplace
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="bg-gray-800 py-16">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-4xl font-bold text-red-500 mb-2">1,247</div>
            <div class="text-gray-300">Active Bots</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-red-500 mb-2">$2.4M</div>
            <div class="text-gray-300">Total Volume</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-red-500 mb-2">89</div>
            <div class="text-gray-300">Countries</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-red-500 mb-2">24/7</div>
            <div class="text-gray-300">Support</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="bg-gray-900 py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-white text-center mb-12">Marketplace Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div class="text-red-500 text-4xl mb-4">🤖</div>
            <h3 class="text-xl font-semibold text-white mb-3">Stealer Logs</h3>
            <p class="text-gray-300">
              Premium stealer logs with detailed system information, browser data, and financial credentials.
            </p>
          </div>
          <div class="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div class="text-red-500 text-4xl mb-4">⚡</div>
            <h3 class="text-xl font-semibold text-white mb-3">Services</h3>
            <p class="text-gray-300">
              Professional development services including custom software, bots, and security solutions.
            </p>
          </div>
          <div class="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div class="text-red-500 text-4xl mb-4">🔒</div>
            <h3 class="text-xl font-semibold text-white mb-3">Secure</h3>
            <p class="text-gray-300">
              End-to-end encryption, secure payments, and anonymous transactions for maximum privacy.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-gray-800 py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-white text-center mb-12">Recent Activity</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <span class="text-green-400 text-sm font-mono">NEW</span>
              <span class="text-gray-400 text-sm">2 min ago</span>
            </div>
            <h4 class="text-white font-semibold mb-2">Bot #US4P34LPGC2PY0WJPA0OHMCU3ZMP75935</h4>
            <p class="text-gray-300 text-sm mb-3">Windows 11 • United States • $89.99</p>
            <div class="flex items-center gap-4 text-xs text-gray-400">
              <span>🔑 47 logins</span>
              <span>🍪 1,234 cookies</span>
              <span>💳 3 cards</span>
            </div>
          </div>
          <div class="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <span class="text-green-400 text-sm font-mono">NEW</span>
              <span class="text-gray-400 text-sm">5 min ago</span>
            </div>
            <h4 class="text-white font-semibold mb-2">Bot #US4RI1BRG3Z2EYRHR43RBXTTKUI0OEOOI</h4>
            <p class="text-gray-300 text-sm mb-3">Windows 10 • Canada • $124.99</p>
            <div class="flex items-center gap-4 text-xs text-gray-400">
              <span>🔑 23 logins</span>
              <span>🍪 892 cookies</span>
              <span>₿ 2 wallets</span>
            </div>
          </div>
          <div class="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <span class="text-blue-400 text-sm font-mono">SERVICE</span>
              <span class="text-gray-400 text-sm">1 hour ago</span>
            </div>
            <h4 class="text-white font-semibold mb-2">Custom Telegram Bot Development</h4>
            <p class="text-gray-300 text-sm mb-3">Professional bot development • $299.99</p>
            <div class="flex items-center gap-4 text-xs text-gray-400">
              <span>⚡ Fast delivery</span>
              <span>🔒 Secure</span>
              <span>⭐ 5.0 rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-gradient-to-r from-red-900/30 to-gray-900 py-16">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
        <p class="text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of users who trust Reaper Market for their digital asset needs.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link 
            v-if="!isAuthenticated"
            to="/register" 
            class="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Create Account
          </router-link>
          <router-link 
            v-if="!isAuthenticated"
            to="/login" 
            class="border border-red-600 text-red-400 hover:bg-red-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Sign In
          </router-link>
          <router-link 
            v-if="isAuthenticated"
            to="/profile" 
            class="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            View Profile
          </router-link>
          <router-link 
            v-if="isAuthenticated"
            to="/bots" 
            class="border border-red-600 text-red-400 hover:bg-red-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Browse Bots
          </router-link>
        </div>
      </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

// Check if user is authenticated
const isAuthenticated = computed(() => {
    return !!localStorage.getItem('marketplace_token');
});
</script>
