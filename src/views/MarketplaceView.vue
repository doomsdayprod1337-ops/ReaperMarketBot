<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="bg-card border-b border-border sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <h1 class="text-2xl font-bold gradient-text">Reaper Market</h1>
          </div>

          <!-- Wallet Connection -->
          <WalletConnection />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Navigation Tabs -->
      <div class="mb-8">
        <nav class="flex space-x-8 border-b border-border">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            ]"
          >
            <component :is="tab.icon" class="w-5 h-5 mr-2 inline" />
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="space-y-8">
        <!-- Featured Products -->
        <div v-if="activeTab === 'products'" class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-3xl font-bold">Featured Products</h2>
            <div class="flex space-x-2">
              <select 
                v-model="selectedCategory" 
                @change="loadProducts"
                class="bg-card border border-border rounded-lg px-3 py-2"
              >
                <option value="">All Categories</option>
                <option value="software">Software</option>
                <option value="tools">Tools</option>
                <option value="accounts">Accounts</option>
                <option value="credentials">Credentials</option>
              </select>
            </div>
          </div>

          <div v-if="marketplaceStore.productsLoading" class="products-grid">
            <div v-for="n in 8" :key="n" class="product-card">
              <div class="loading-skeleton h-48 w-full mb-4"></div>
              <div class="loading-skeleton h-4 w-3/4 mb-2"></div>
              <div class="loading-skeleton h-4 w-1/2"></div>
            </div>
          </div>

          <div v-else class="products-grid">
            <div 
              v-for="product in marketplaceStore.products" 
              :key="product.id"
              @click="viewProduct(product)"
              class="product-card hover-lift"
            >
              <div class="aspect-w-16 aspect-h-9 mb-4">
                <img 
                  :src="product.image || '/placeholder-product.png'" 
                  :alt="product.name"
                  class="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <h3 class="font-semibold text-lg mb-2">{{ product.name }}</h3>
              <p class="text-muted-foreground text-sm mb-4 line-clamp-2">{{ product.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-2xl font-bold text-primary">
                  {{ product.price }} {{ product.currency || 'ETH' }}
                </span>
                <button 
                  @click.stop="addToCart(product)"
                  class="btn-primary"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Bots -->
        <div v-if="activeTab === 'bots'" class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-3xl font-bold">Trading Bots</h2>
            <div class="flex space-x-2">
              <select 
                v-model="selectedBotCategory" 
                @change="loadBots"
                class="bg-card border border-border rounded-lg px-3 py-2"
              >
                <option value="">All Bots</option>
                <option value="crypto">Crypto Trading</option>
                <option value="forex">Forex Trading</option>
                <option value="stocks">Stock Trading</option>
                <option value="arbitrage">Arbitrage</option>
              </select>
            </div>
          </div>

          <div v-if="marketplaceStore.botsLoading" class="bots-grid">
            <div v-for="n in 6" :key="n" class="bot-card">
              <div class="loading-skeleton h-32 w-full mb-4"></div>
              <div class="loading-skeleton h-4 w-3/4 mb-2"></div>
              <div class="loading-skeleton h-4 w-1/2"></div>
            </div>
          </div>

          <div v-else class="bots-grid">
            <div 
              v-for="bot in marketplaceStore.bots" 
              :key="bot.id"
              @click="viewBot(bot)"
              class="bot-card hover-lift"
            >
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
                  <Bot class="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 class="font-semibold text-lg">{{ bot.name }}</h3>
                  <p class="text-muted-foreground text-sm">{{ bot.category }}</p>
                </div>
              </div>
              <p class="text-muted-foreground text-sm mb-4 line-clamp-2">{{ bot.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-2xl font-bold text-primary">
                  {{ bot.price }} {{ bot.currency || 'ETH' }}
                </span>
                <div class="flex items-center text-sm text-muted-foreground">
                  <Star class="w-4 h-4 mr-1" />
                  {{ bot.rating || '4.5' }}
                </div>
              </div>
              <button 
                @click.stop="addToCart(bot)"
                class="btn-primary w-full mt-4"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        <!-- Services -->
        <div v-if="activeTab === 'services'" class="space-y-6">
          <h2 class="text-3xl font-bold">Services</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="marketplace-card">
              <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Shield class="w-6 h-6 text-white" />
              </div>
              <h3 class="font-semibold text-lg mb-2">Security Audit</h3>
              <p class="text-muted-foreground text-sm mb-4">Professional security audit for your smart contracts</p>
              <div class="flex items-center justify-between">
                <span class="text-xl font-bold text-primary">2.5 ETH</span>
                <button class="btn-outline">Learn More</button>
              </div>
            </div>

            <div class="marketplace-card">
              <div class="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp class="w-6 h-6 text-white" />
              </div>
              <h3 class="font-semibold text-lg mb-2">Trading Signals</h3>
              <p class="text-muted-foreground text-sm mb-4">Premium trading signals and market analysis</p>
              <div class="flex items-center justify-between">
                <span class="text-xl font-bold text-primary">0.5 ETH</span>
                <button class="btn-outline">Learn More</button>
              </div>
            </div>

            <div class="marketplace-card">
              <div class="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Bot class="w-6 h-6 text-white" />
              </div>
              <h3 class="font-semibold text-lg mb-2">Custom Bot Development</h3>
              <p class="text-muted-foreground text-sm mb-4">Custom trading bot development and deployment</p>
              <div class="flex items-center justify-between">
                <span class="text-xl font-bold text-primary">5.0 ETH</span>
                <button class="btn-outline">Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useWeb3Store } from '@/stores/web3';
import { useMarketplaceStore } from '@/stores/marketplace';
import WalletConnection from '@/components/WalletConnection.vue';
import { 
  Bot, 
  Star, 
  Shield, 
  TrendingUp,
  Package
} from 'lucide-vue-next';

const router = useRouter();
const web3Store = useWeb3Store();
const marketplaceStore = useMarketplaceStore();

// State
const activeTab = ref('products');
const selectedCategory = ref('');
const selectedBotCategory = ref('');

// Tabs configuration
const tabs = [
  { id: 'products', name: 'Products', icon: Package },
  { id: 'bots', name: 'Bots', icon: Bot },
  { id: 'services', name: 'Services', icon: Shield }
];

// Methods

const loadProducts = async () => {
  await marketplaceStore.loadProducts(selectedCategory.value);
};

const loadBots = async () => {
  await marketplaceStore.loadBots(selectedBotCategory.value);
};

const viewProduct = (product) => {
  router.push(`/product/${product.id}`);
};

const viewBot = (bot) => {
  router.push(`/bot/${bot.id}`);
};

const addToCart = async (item) => {
  const result = await marketplaceStore.addToCart(item.id);
  if (result.success) {
    // Show success notification
    console.log('Added to cart successfully');
  }
};


// Lifecycle
onMounted(async () => {
  // Load initial data
  await loadProducts();
  await loadBots();
});
</script>
