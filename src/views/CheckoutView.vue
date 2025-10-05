<template>
  <div class="min-h-screen bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 font-mono">Checkout</h1>
        <p class="text-gray-300 text-lg">Complete your bot purchase</p>
      </div>

      <!-- Checkout Component -->
      <Checkout />
    </div>
  </div>
</template>

<script setup>
import Checkout from '@/components/Checkout.vue'
</script>

<style scoped>
.font-reaper {
  font-family: 'Reaper', sans-serif;
}
</style>