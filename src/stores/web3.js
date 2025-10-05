import { defineStore } from 'pinia';
import web3Service, { NETWORKS } from '@/services/web3';

export const useWeb3Store = defineStore('web3', {
  state: () => ({
    isConnected: false,
    account: null,
    chainId: null,
    balance: '0',
    isLoading: false,
    error: null,
    provider: null,
    signer: null,
    networks: NETWORKS,
    currentNetwork: null
  }),

  getters: {
    // Get current network info
    currentNetworkInfo: (state) => {
      if (!state.chainId) return null;
      return Object.values(state.networks).find(network => 
        network.chainId === parseInt(state.chainId, 16)
      );
    },

    // Check if connected to supported network
    isSupportedNetwork: (state) => {
      if (!state.chainId) return false;
      const supportedChainIds = Object.values(state.networks).map(n => n.chainId);
      return supportedChainIds.includes(parseInt(state.chainId, 16));
    },

    // Get formatted balance
    formattedBalance: (state) => {
      if (!state.balance || state.balance === '0') return '0.000';
      return parseFloat(state.balance).toFixed(4);
    },

    // Get short address
    shortAddress: (state) => {
      if (!state.account) return '';
      return `${state.account.slice(0, 6)}...${state.account.slice(-4)}`;
    }
  },

  actions: {
    // Initialize Web3
    async initialize() {
      this.isLoading = true;
      this.error = null;

      try {
        const result = await web3Service.initialize();
        if (!result.success) {
          throw new Error(result.error);
        }

        // Set up event listeners
        web3Service.addListener(this.handleWeb3Event.bind(this));

        // Check if already connected
        const state = web3Service.getState();
        if (state.isConnected) {
          this.isConnected = state.isConnected;
          this.account = state.account;
          this.chainId = state.chainId;
          this.provider = state.provider;
          this.signer = state.signer;
          
          // Get balance
          await this.getBalance();
        }

        this.isLoading = false;
        return { success: true };
      } catch (error) {
        console.warn("Web3 initialization failed, continuing without Web3:", error);
        this.error = null; // Don't show error for Web3 initialization failure
        this.isLoading = false;
        return { success: true }; // Return success to allow app to continue
      }
    },

    // Connect wallet
    async connectWallet() {
      this.isLoading = true;
      this.error = null;

      try {
        const result = await web3Service.connectWallet();
        if (!result.success) {
          throw new Error(result.error);
        }

        this.isConnected = true;
        this.account = result.account;
        this.chainId = result.chainId;
        
        // Get provider and signer
        const state = web3Service.getState();
        this.provider = state.provider;
        this.signer = state.signer;

        // Get balance
        await this.getBalance();

        this.isLoading = false;
        return { success: true };
      } catch (error) {
        this.error = error.message;
        this.isLoading = false;
        return { success: false, error: error.message };
      }
    },

    // Disconnect wallet
    async disconnectWallet() {
      this.isLoading = true;

      try {
        await web3Service.disconnectWallet();
        
        this.isConnected = false;
        this.account = null;
        this.chainId = null;
        this.balance = '0';
        this.provider = null;
        this.signer = null;
        this.currentNetwork = null;

        this.isLoading = false;
        return { success: true };
      } catch (error) {
        this.error = error.message;
        this.isLoading = false;
        return { success: false, error: error.message };
      }
    },

    // Get wallet balance
    async getBalance() {
      try {
        const result = await web3Service.getBalance();
        if (result.success) {
          this.balance = result.balance;
        }
        return result;
      } catch (error) {
        console.error('Failed to get balance:', error);
        return { success: false, error: error.message };
      }
    },

    // Send transaction
    async sendTransaction(to, amount, data = null) {
      this.isLoading = true;
      this.error = null;

      try {
        const result = await web3Service.sendTransaction(to, amount, data);
        if (!result.success) {
          throw new Error(result.error);
        }

        // Refresh balance after transaction
        await this.getBalance();

        this.isLoading = false;
        return result;
      } catch (error) {
        this.error = error.message;
        this.isLoading = false;
        return { success: false, error: error.message };
      }
    },

    // Switch network
    async switchNetwork(chainId) {
      this.isLoading = true;
      this.error = null;

      try {
        const result = await web3Service.switchNetwork(chainId);
        if (!result.success) {
          throw new Error(result.error);
        }

        this.chainId = `0x${chainId.toString(16)}`;
        this.currentNetwork = this.networks[Object.keys(this.networks).find(
          key => this.networks[key].chainId === chainId
        )];

        // Refresh balance for new network
        await this.getBalance();

        this.isLoading = false;
        return { success: true };
      } catch (error) {
        this.error = error.message;
        this.isLoading = false;
        return { success: false, error: error.message };
      }
    },

    // Add network
    async addNetwork(networkConfig) {
      this.isLoading = true;
      this.error = null;

      try {
        const result = await web3Service.addNetwork(networkConfig);
        if (!result.success) {
          throw new Error(result.error);
        }

        this.isLoading = false;
        return { success: true };
      } catch (error) {
        this.error = error.message;
        this.isLoading = false;
        return { success: false, error: error.message };
      }
    },

    // Handle Web3 events
    handleWeb3Event(event, data) {
      switch (event) {
        case 'connected':
          this.isConnected = true;
          this.account = data.account;
          this.chainId = data.chainId;
          this.getBalance();
          break;

        case 'disconnected':
          this.isConnected = false;
          this.account = null;
          this.chainId = null;
          this.balance = '0';
          break;

        case 'accountsChanged':
          this.account = data.account;
          if (data.account) {
            this.getBalance();
          } else {
            this.isConnected = false;
            this.balance = '0';
          }
          break;

        case 'chainChanged':
          this.chainId = data.chainId;
          this.getBalance();
          break;

        default:
          console.log('Unhandled Web3 event:', event, data);
      }
    },

    // Clear error
    clearError() {
      this.error = null;
    }
  }
});
