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
            <h1 class="text-2xl font-bold">Wallet</h1>
          </div>
          <div class="flex items-center space-x-4">
            <button 
              v-if="!web3Store.isConnected"
              @click="connectWallet"
              :disabled="web3Store.isLoading"
              class="btn-primary"
            >
              <Wallet class="w-4 h-4 mr-2" />
              {{ web3Store.isLoading ? 'Connecting...' : 'Connect Wallet' }}
            </button>
            <button 
              v-else
              @click="disconnectWallet"
              class="btn-outline"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Connection Status -->
      <div v-if="!web3Store.isConnected" class="text-center py-12">
        <Wallet class="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 class="text-lg font-semibold mb-2">Connect Your Wallet</h3>
        <p class="text-muted-foreground mb-6">Connect your Web3 wallet to view your balance and manage transactions.</p>
        <button @click="connectWallet" class="btn-primary">
          <Wallet class="w-4 h-4 mr-2" />
          Connect Wallet
        </button>
      </div>

      <div v-else class="space-y-8">
        <!-- Wallet Overview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Balance Card -->
          <div class="marketplace-card">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">Balance</h3>
              <button @click="refreshBalance" :disabled="web3Store.isLoading" class="p-2 hover:bg-muted rounded-lg">
                <RefreshCw :class="['w-4 h-4', web3Store.isLoading ? 'animate-spin' : '']" />
              </button>
            </div>
            <div class="text-3xl font-bold mb-2">
              {{ web3Store.formattedBalance }} {{ getCurrentNetworkSymbol() }}
            </div>
            <div class="text-sm text-muted-foreground">
              ≈ ${{ (parseFloat(web3Store.formattedBalance) * 2000).toFixed(2) }} USD
            </div>
          </div>

          <!-- Network Card -->
          <div class="marketplace-card">
            <h3 class="text-lg font-semibold mb-4">Network</h3>
            <div class="flex items-center space-x-3">
              <div :class="getNetworkIndicatorClass()" class="w-3 h-3 rounded-full"></div>
              <span class="font-medium">{{ getCurrentNetworkName() }}</span>
            </div>
            <div class="text-sm text-muted-foreground mt-2">
              Chain ID: {{ parseInt(web3Store.chainId, 16) }}
            </div>
          </div>

          <!-- Address Card -->
          <div class="marketplace-card">
            <h3 class="text-lg font-semibold mb-4">Address</h3>
            <div class="flex items-center space-x-2">
              <span class="font-mono text-sm">{{ web3Store.shortAddress }}</span>
              <button @click="copyAddress" class="p-1 hover:bg-muted rounded">
                <Copy class="w-4 h-4" />
              </button>
            </div>
            <button @click="viewOnExplorer" class="text-sm text-primary hover:text-primary/80 mt-2">
              View on Explorer
            </button>
          </div>
        </div>

        <!-- Transaction History -->
        <div class="marketplace-card">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold">Transaction History</h3>
            <button @click="refreshTransactions" :disabled="loadingTransactions" class="btn-outline">
              <RefreshCw :class="['w-4 h-4 mr-2', loadingTransactions ? 'animate-spin' : '']" />
              Refresh
            </button>
          </div>

          <div v-if="loadingTransactions" class="space-y-4">
            <div v-for="n in 3" :key="n" class="animate-pulse">
              <div class="flex items-center justify-between p-4 border border-border rounded-lg">
                <div class="flex items-center space-x-4">
                  <div class="w-10 h-10 bg-muted rounded-full"></div>
                  <div class="space-y-2">
                    <div class="h-4 bg-muted rounded w-32"></div>
                    <div class="h-3 bg-muted rounded w-24"></div>
                  </div>
                </div>
                <div class="h-4 bg-muted rounded w-20"></div>
              </div>
            </div>
          </div>

          <div v-else-if="transactions.length === 0" class="text-center py-8">
            <FileText class="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 class="font-medium mb-2">No transactions yet</h4>
            <p class="text-sm text-muted-foreground">Your transaction history will appear here.</p>
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="tx in transactions" 
              :key="tx.hash"
              class="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div class="flex items-center space-x-4">
                <div :class="getTransactionIconClass(tx.type)" class="w-10 h-10 rounded-full flex items-center justify-center">
                  <component :is="getTransactionIcon(tx.type)" class="w-5 h-5 text-white" />
                </div>
                <div>
                  <div class="font-medium">{{ tx.type === 'send' ? 'Sent' : 'Received' }}</div>
                  <div class="text-sm text-muted-foreground">{{ formatDate(tx.timestamp) }}</div>
                </div>
              </div>
              <div class="text-right">
                <div :class="getTransactionAmountClass(tx.type)" class="font-medium">
                  {{ tx.type === 'send' ? '-' : '+' }}{{ tx.amount }} {{ tx.currency }}
                </div>
                <button @click="viewTransaction(tx.hash)" class="text-sm text-primary hover:text-primary/80">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Network Management -->
        <div class="marketplace-card">
          <h3 class="text-lg font-semibold mb-6">Network Management</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button 
              v-for="network in availableNetworks" 
              :key="network.chainId"
              @click="switchNetwork(network)"
              :disabled="web3Store.isLoading"
              :class="[
                'p-4 border border-border rounded-lg text-left hover:bg-muted transition-colors',
                isCurrentNetwork(network) ? 'border-primary bg-primary/5' : ''
              ]"
            >
              <div class="flex items-center space-x-3">
                <div :class="getNetworkColorClass(network.chainId)" class="w-3 h-3 rounded-full"></div>
                <div>
                  <div class="font-medium">{{ network.name }}</div>
                  <div class="text-sm text-muted-foreground">{{ network.nativeCurrency.symbol }}</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useWeb3Store } from '@/stores/web3';
import { 
  ArrowLeft, 
  Wallet, 
  RefreshCw, 
  Copy, 
  ExternalLink,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  Send
} from 'lucide-vue-next';

const web3Store = useWeb3Store();

// State
const loadingTransactions = ref(false);
const transactions = ref([]);

// Computed
const availableNetworks = computed(() => Object.values(web3Store.networks));

// Methods
const connectWallet = async () => {
  const result = await web3Store.connectWallet();
  if (result.success) {
    await loadTransactions();
  }
};

const disconnectWallet = async () => {
  await web3Store.disconnectWallet();
  transactions.value = [];
};

const refreshBalance = async () => {
  await web3Store.getBalance();
};

const copyAddress = async () => {
  try {
    await navigator.clipboard.writeText(web3Store.account);
    // Show success message
    console.log('Address copied to clipboard');
  } catch (error) {
    console.error('Failed to copy address:', error);
  }
};

const viewOnExplorer = () => {
  const network = web3Store.currentNetworkInfo;
  if (network && network.blockExplorer) {
    window.open(`${network.blockExplorer}/address/${web3Store.account}`, '_blank');
  }
};

const loadTransactions = async () => {
  loadingTransactions.value = true;
  try {
    // Mock transaction data - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    transactions.value = [
      {
        hash: '0x123...abc',
        type: 'send',
        amount: '0.5',
        currency: 'ETH',
        timestamp: new Date(Date.now() - 86400000),
        status: 'confirmed'
      },
      {
        hash: '0x456...def',
        type: 'receive',
        amount: '1.2',
        currency: 'ETH',
        timestamp: new Date(Date.now() - 172800000),
        status: 'confirmed'
      }
    ];
  } catch (error) {
    console.error('Failed to load transactions:', error);
  } finally {
    loadingTransactions.value = false;
  }
};

const refreshTransactions = async () => {
  await loadTransactions();
};

const switchNetwork = async (network) => {
  await web3Store.switchNetwork(network.chainId);
  await loadTransactions();
};

const viewTransaction = (hash) => {
  const network = web3Store.currentNetworkInfo;
  if (network && network.blockExplorer) {
    window.open(`${network.blockExplorer}/tx/${hash}`, '_blank');
  }
};

const getCurrentNetworkName = () => {
  const network = web3Store.currentNetworkInfo;
  return network ? network.name : 'Unknown';
};

const getCurrentNetworkSymbol = () => {
  const network = web3Store.currentNetworkInfo;
  return network ? network.nativeCurrency.symbol : 'ETH';
};

const getNetworkIndicatorClass = () => {
  if (!web3Store.chainId) return 'bg-gray-400';
  
  const chainId = parseInt(web3Store.chainId, 16);
  switch (chainId) {
    case 1: return 'bg-blue-500';
    case 137: return 'bg-purple-500';
    case 56: return 'bg-yellow-500';
    default: return 'bg-gray-400';
  }
};

const getNetworkColorClass = (chainId) => {
  switch (chainId) {
    case 1: return 'bg-blue-500';
    case 137: return 'bg-purple-500';
    case 56: return 'bg-yellow-500';
    default: return 'bg-gray-400';
  }
};

const isCurrentNetwork = (network) => {
  return web3Store.chainId && parseInt(web3Store.chainId, 16) === network.chainId;
};

const getTransactionIcon = (type) => {
  return type === 'send' ? Send : ArrowDownLeft;
};

const getTransactionIconClass = (type) => {
  return type === 'send' ? 'bg-red-500' : 'bg-green-500';
};

const getTransactionAmountClass = (type) => {
  return type === 'send' ? 'text-red-600' : 'text-green-600';
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Lifecycle
onMounted(async () => {
  if (web3Store.isConnected) {
    await loadTransactions();
  }
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
  @apply border border-border text-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>
