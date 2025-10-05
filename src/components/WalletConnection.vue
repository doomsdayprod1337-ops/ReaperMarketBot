<template>
  <div class="wallet-connection">
    <!-- Not Connected State -->
    <div v-if="!web3Store.isConnected" class="flex items-center space-x-4">
      <button 
        @click="showWalletModal = true"
        :disabled="web3Store.isLoading"
        class="wallet-connect-btn"
      >
        <Wallet class="w-5 h-5 mr-2" />
        {{ web3Store.isLoading ? 'Connecting...' : 'Connect Wallet' }}
      </button>
    </div>

    <!-- Connected State -->
    <div v-else class="flex items-center space-x-4">
      <!-- Network Indicator -->
      <div class="network-indicator" :class="getNetworkClass()">
        <div class="w-2 h-2 rounded-full mr-2" :class="getNetworkDotClass()"></div>
        {{ getCurrentNetworkName() }}
      </div>

      <!-- Balance -->
      <div class="crypto-balance">
        {{ web3Store.formattedBalance }} {{ getCurrentNetworkSymbol() }}
      </div>

      <!-- User Menu -->
      <div class="relative">
        <button 
          @click="showUserMenu = !showUserMenu"
          class="user-menu-btn"
        >
          <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User class="w-4 h-4 text-white" />
          </div>
          <span class="ml-2 text-sm font-medium">{{ web3Store.shortAddress }}</span>
          <ChevronDown class="w-4 h-4 ml-2" />
        </button>

        <!-- User Dropdown Menu -->
        <div 
          v-if="showUserMenu"
          @click.away="showUserMenu = false"
          class="user-dropdown"
        >
          <div class="px-4 py-3 border-b border-border">
            <div class="text-sm font-medium">{{ web3Store.shortAddress }}</div>
            <div class="text-xs text-muted-foreground">{{ getCurrentNetworkName() }}</div>
          </div>
          
          <div class="py-2">
            <button 
              @click="viewProfile"
              class="dropdown-item"
            >
              <User class="w-4 h-4 mr-3" />
              Profile
            </button>
            <button 
              @click="viewWallet"
              class="dropdown-item"
            >
              <Wallet class="w-4 h-4 mr-3" />
              Wallet
            </button>
            <button 
              @click="viewTransactions"
              class="dropdown-item"
            >
              <Activity class="w-4 h-4 mr-3" />
              Transactions
            </button>
            <button 
              @click="switchNetwork"
              class="dropdown-item"
            >
              <Globe class="w-4 h-4 mr-3" />
              Switch Network
            </button>
          </div>
          
          <div class="border-t border-border py-2">
            <button 
              @click="disconnectWallet"
              class="dropdown-item text-red-600 hover:bg-red-50"
            >
              <LogOut class="w-4 h-4 mr-3" />
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Wallet Selection Modal -->
    <div v-if="showWalletModal" class="modal-overlay" @click="showWalletModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="text-lg font-semibold">Connect Wallet</h3>
          <button @click="showWalletModal = false" class="modal-close">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="modal-body">
          <p class="text-sm text-muted-foreground mb-6">
            Choose a wallet to connect to Reaper Market
          </p>
          
          <div class="space-y-3">
            <button 
              @click="connectMetaMask"
              :disabled="web3Store.isLoading"
              class="wallet-option"
            >
              <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                <Wallet class="w-6 h-6 text-white" />
              </div>
              <div class="text-left">
                <div class="font-medium">MetaMask</div>
                <div class="text-sm text-muted-foreground">Connect using MetaMask</div>
              </div>
            </button>

            <button 
              @click="connectWalletConnect"
              :disabled="web3Store.isLoading"
              class="wallet-option"
            >
              <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                <Globe class="w-6 h-6 text-white" />
              </div>
              <div class="text-left">
                <div class="font-medium">WalletConnect</div>
                <div class="text-sm text-muted-foreground">Connect using WalletConnect</div>
              </div>
            </button>

            <button 
              @click="connectCoinbase"
              :disabled="web3Store.isLoading"
              class="wallet-option"
            >
              <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <Shield class="w-6 h-6 text-white" />
              </div>
              <div class="text-left">
                <div class="font-medium">Coinbase Wallet</div>
                <div class="text-sm text-muted-foreground">Connect using Coinbase</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Network Selection Modal -->
    <div v-if="showNetworkModal" class="modal-overlay" @click="showNetworkModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="text-lg font-semibold">Switch Network</h3>
          <button @click="showNetworkModal = false" class="modal-close">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="modal-body">
          <p class="text-sm text-muted-foreground mb-6">
            Select a network to switch to
          </p>
          
          <div class="space-y-3">
            <button 
              v-for="network in availableNetworks" 
              :key="network.chainId"
              @click="switchToNetwork(network)"
              :disabled="web3Store.isLoading"
              :class="[
                'network-option',
                isCurrentNetwork(network) ? 'border-primary bg-primary/5' : ''
              ]"
            >
              <div class="flex items-center">
                <div :class="getNetworkColorClass(network.chainId)" class="w-3 h-3 rounded-full mr-3"></div>
                <div class="text-left">
                  <div class="font-medium">{{ network.name }}</div>
                  <div class="text-sm text-muted-foreground">{{ network.nativeCurrency.symbol }}</div>
                </div>
              </div>
              <div v-if="isCurrentNetwork(network)" class="text-primary">
                <Check class="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useWeb3Store } from '@/stores/web3';
import { 
  Wallet, 
  User, 
  ChevronDown, 
  X, 
  Globe, 
  Shield,
  Activity,
  LogOut,
  Check
} from 'lucide-vue-next';

const router = useRouter();
const web3Store = useWeb3Store();

// State
const showWalletModal = ref(false);
const showUserMenu = ref(false);
const showNetworkModal = ref(false);

// Computed
const availableNetworks = computed(() => Object.values(web3Store.networks));

// Methods
const connectMetaMask = async () => {
  const result = await web3Store.connectWallet();
  if (result.success) {
    showWalletModal.value = false;
    // Auto-login to marketplace
    await loginToMarketplace();
  }
};

const connectWalletConnect = async () => {
  // Implement WalletConnect integration
  console.log('WalletConnect integration not implemented yet');
};

const connectCoinbase = async () => {
  // Implement Coinbase Wallet integration
  console.log('Coinbase Wallet integration not implemented yet');
};

const loginToMarketplace = async () => {
  if (web3Store.isConnected && web3Store.signer) {
    try {
      // Sign a message to authenticate with the marketplace
      const message = `Sign this message to authenticate with Reaper Market: ${Date.now()}`;
      const signature = await web3Store.signer.signMessage(message);
      
      // Login to marketplace (implement this in marketplace store)
      console.log('Marketplace login with signature:', signature);
    } catch (error) {
      console.error('Failed to login to marketplace:', error);
    }
  }
};

const disconnectWallet = async () => {
  await web3Store.disconnectWallet();
  showUserMenu.value = false;
};

const switchNetwork = () => {
  showNetworkModal.value = true;
  showUserMenu.value = false;
};

const switchToNetwork = async (network) => {
  await web3Store.switchNetwork(network.chainId);
  showNetworkModal.value = false;
};

const viewProfile = () => {
  router.push('/profile');
  showUserMenu.value = false;
};

const viewWallet = () => {
  router.push('/wallet');
  showUserMenu.value = false;
};

const viewTransactions = () => {
  router.push('/wallet');
  showUserMenu.value = false;
};

const getCurrentNetworkName = () => {
  const network = web3Store.currentNetworkInfo;
  return network ? network.name : 'Unknown';
};

const getCurrentNetworkSymbol = () => {
  const network = web3Store.currentNetworkInfo;
  return network ? network.nativeCurrency.symbol : 'ETH';
};

const getNetworkClass = () => {
  if (!web3Store.chainId) return '';
  
  const chainId = parseInt(web3Store.chainId, 16);
  switch (chainId) {
    case 1: return 'network-ethereum';
    case 137: return 'network-polygon';
    case 56: return 'network-bsc';
    default: return '';
  }
};

const getNetworkDotClass = () => {
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
</script>

<style scoped>
.wallet-connect-btn {
  @apply bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center;
}

.network-indicator {
  @apply px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium flex items-center;
}

.network-ethereum {
  @apply border-blue-200 bg-blue-50 text-blue-800;
}

.network-polygon {
  @apply border-purple-200 bg-purple-50 text-purple-800;
}

.network-bsc {
  @apply border-yellow-200 bg-yellow-50 text-yellow-800;
}

.crypto-balance {
  @apply px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium;
}

.user-menu-btn {
  @apply flex items-center px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted transition-colors;
}

.user-dropdown {
  @apply absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50;
}

.dropdown-item {
  @apply w-full flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors;
}

.modal-overlay {
  @apply fixed inset-0 bg-black/50 flex items-center justify-center z-50;
}

.modal-content {
  @apply bg-card border border-border rounded-lg shadow-lg max-w-md w-full mx-4;
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b border-border;
}

.modal-close {
  @apply p-1 hover:bg-muted rounded-lg transition-colors;
}

.modal-body {
  @apply p-6;
}

.wallet-option {
  @apply w-full flex items-center p-4 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}

.network-option {
  @apply w-full flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>
