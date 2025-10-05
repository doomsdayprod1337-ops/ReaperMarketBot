<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <!-- Background Pattern -->
    <div class="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
    
    <!-- Main Layout -->
    <div class="relative z-10">
      <TheMenu />
      <!-- Main Content -->
      <div class="lg:pl-64">
        <RouterView />
      </div>
      <!-- Cart Component -->
      <Cart />
    </div>
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import TheMenu from "./components/TheMenu.vue";
import Cart from "./components/Cart.vue";
import { onMounted, ref, computed } from "vue";
import { useTelegram } from "@/services/telegram";
import { useAppStore } from "@/stores/app";

const { tg } = useTelegram();
const appStore = useAppStore();

// Check if user is authenticated
const isAuthenticated = computed(() => {
    return !!localStorage.getItem('marketplace_token');
});

onMounted(async () => {
    // Only call Telegram methods if they exist
    if (tg && typeof tg.ready === 'function') {
        tg.ready();
    }
    if (tg && typeof tg.expand === 'function') {
        tg.expand();
    }

    // Initialize app store if user is authenticated
    if (isAuthenticated.value) {
        try {
            await appStore.init();
        } catch (error) {
            console.warn('App initialization failed:', error);
        }
    }
});
</script>
