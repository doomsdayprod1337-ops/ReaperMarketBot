<template>
  <div class="min-h-screen bg-gray-900">
    <TheMenu />
    <!-- Main Content -->
    <div class="lg:pl-64">
      <RouterView />
    </div>
    <!-- Cart Component -->
    <Cart />
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
