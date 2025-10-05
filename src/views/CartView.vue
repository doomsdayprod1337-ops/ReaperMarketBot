<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="bg-card border-b border-border sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <button @click="$router.back()" class="mr-4 p-2 hover:bg-muted rounded-lg">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-2xl font-bold">Shopping Cart</h1>
          </div>
          <div class="flex items-center space-x-4">
            <button 
              v-if="!marketplaceStore.isCartEmpty"
              @click="clearCart"
              class="btn-outline text-red-600 hover:bg-red-50"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="marketplaceStore.isCartEmpty" class="text-center py-12">
        <ShoppingCart class="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 class="text-lg font-semibold mb-2">Your cart is empty</h3>
        <p class="text-muted-foreground mb-4">Add some items to get started.</p>
        <button @click="$router.push('/marketplace')" class="btn-primary">
          Continue Shopping
        </button>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2">
          <div class="space-y-4">
            <div 
              v-for="item in marketplaceStore.cart.items" 
              :key="item.id"
              class="marketplace-card"
            >
              <div class="flex items-center space-x-4">
                <!-- Item Image/Icon -->
                <div class="w-16 h-16 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <component :is="getItemIcon(item.type)" class="w-8 h-8 text-white" />
                </div>

                <!-- Item Details -->
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-lg mb-1">{{ item.name }}</h3>
                  <p class="text-muted-foreground text-sm mb-2">{{ item.description }}</p>
                  <div class="flex items-center space-x-4">
                    <span class="text-sm text-muted-foreground">{{ item.category }}</span>
                    <span v-if="item.type" class="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {{ item.type }}
                    </span>
                  </div>
                </div>

                <!-- Price and Controls -->
                <div class="flex items-center space-x-4">
                  <div class="text-right">
                    <div class="text-lg font-bold">{{ item.price }} {{ item.currency }}</div>
                    <div class="text-sm text-muted-foreground">per item</div>
                  </div>

                  <!-- Quantity Controls -->
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="updateQuantity(item.id, item.quantity - 1)"
                      :disabled="item.quantity <= 1"
                      class="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus class="w-4 h-4" />
                    </button>
                    <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                    <button 
                      @click="updateQuantity(item.id, item.quantity + 1)"
                      class="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted"
                    >
                      <Plus class="w-4 h-4" />
                    </button>
                  </div>

                  <!-- Remove Button -->
                  <button 
                    @click="removeFromCart(item.id)"
                    class="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="marketplace-card sticky top-24">
            <h3 class="text-lg font-semibold mb-4">Order Summary</h3>
            
            <!-- Cart Totals -->
            <div class="space-y-3 mb-6">
              <div class="flex justify-between">
                <span>Subtotal ({{ marketplaceStore.cart.itemCount }} items)</span>
                <span>{{ marketplaceStore.cart.total }} ETH</span>
              </div>
              <div class="flex justify-between">
                <span>Service Fee</span>
                <span>0.001 ETH</span>
              </div>
              <div class="flex justify-between">
                <span>Network Fee</span>
                <span>~0.002 ETH</span>
              </div>
              <div class="border-t border-border pt-3">
                <div class="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{{ (parseFloat(marketplaceStore.cart.total) + 0.003).toFixed(3) }} ETH</span>
                </div>
              </div>
            </div>

            <!-- Wallet Info -->
            <div v-if="web3Store.isConnected" class="mb-6 p-4 bg-muted rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium">Wallet Balance</span>
                <span class="text-sm font-mono">{{ web3Store.formattedBalance }} {{ getCurrentNetworkSymbol() }}</span>
              </div>
              <div class="text-xs text-muted-foreground">
                {{ web3Store.shortAddress }}
              </div>
            </div>

            <!-- Checkout Button -->
            <button 
              @click="proceedToCheckout"
              :disabled="!web3Store.isConnected || marketplaceStore.cartLoading"
              class="btn-primary w-full mb-4"
            >
              {{ marketplaceStore.cartLoading ? 'Processing...' : 'Proceed to Checkout' }}
            </button>

            <!-- Continue Shopping -->
            <button 
              @click="$router.push('/marketplace')"
              class="btn-outline w-full"
            >
              Continue Shopping
            </button>

            <!-- Security Notice -->
            <div class="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-start space-x-2">
                <Shield class="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div class="text-xs text-blue-800">
                  <div class="font-medium mb-1">Secure Checkout</div>
                  <div>All transactions are secured by blockchain technology and processed through your connected wallet.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useWeb3Store } from '@/stores/web3';
import { useMarketplaceStore } from '@/stores/marketplace';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Package, 
  Bot, 
  Shield,
  Minus,
  Plus,
  Trash2,
  Shield as SecurityShield
} from 'lucide-vue-next';

const router = useRouter();
const web3Store = useWeb3Store();
const marketplaceStore = useMarketplaceStore();

// Methods
const updateQuantity = async (itemId, newQuantity) => {
  if (newQuantity < 1) return;
  await marketplaceStore.updateCartItem(itemId, newQuantity);
};

const removeFromCart = async (itemId) => {
  await marketplaceStore.removeFromCart(itemId);
};

const clearCart = async () => {
  if (confirm('Are you sure you want to clear your cart?')) {
    // Clear all items from cart
    for (const item of marketplaceStore.cart.items) {
      await marketplaceStore.removeFromCart(item.id);
    }
  }
};

const proceedToCheckout = () => {
  if (!web3Store.isConnected) {
    alert('Please connect your wallet to proceed with checkout');
    return;
  }
  router.push('/checkout');
};

const getItemIcon = (type) => {
  const icons = {
    product: Package,
    bot: Bot,
    service: Shield
  };
  return icons[type] || Package;
};

const getCurrentNetworkSymbol = () => {
  const network = web3Store.currentNetworkInfo;
  return network ? network.nativeCurrency.symbol : 'ETH';
};

// Lifecycle
onMounted(async () => {
  await marketplaceStore.loadCart();
});
</script>

<style scoped>
.marketplace-card {
  @apply bg-card border border-border rounded-lg p-6;
}

.btn-primary {
  @apply bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-outline {
  @apply border border-border text-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors;
}
</style>
