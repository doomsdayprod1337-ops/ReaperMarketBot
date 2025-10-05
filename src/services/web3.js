import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import config from '@/config/environment';

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.account = null;
    this.chainId = null;
    this.isConnected = false;
    this.listeners = [];
  }

  // Initialize Web3 connection
  async initialize() {
    try {
      const provider = await detectEthereumProvider();
      if (!provider) {
        throw new Error('No Ethereum provider found. Please install MetaMask or another Web3 wallet.');
      }

      this.provider = new ethers.BrowserProvider(provider);
      
      // Listen for account changes
      provider.on('accountsChanged', this.handleAccountsChanged.bind(this));
      provider.on('chainChanged', this.handleChainChanged.bind(this));

      return { success: true };
    } catch (error) {
      console.error('Failed to initialize Web3:', error);
      return { success: false, error: error.message };
    }
  }

  // Connect wallet
  async connectWallet() {
    try {
      if (!this.provider) {
        const initResult = await this.initialize();
        if (!initResult.success) {
          return initResult;
        }
      }

      // Request account access
      const accounts = await this.provider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      this.account = accounts[0];
      this.signer = await this.provider.getSigner();
      this.chainId = await this.provider.send('eth_chainId', []);
      this.isConnected = true;

      this.notifyListeners('connected', {
        account: this.account,
        chainId: this.chainId
      });

      return { 
        success: true, 
        account: this.account,
        chainId: this.chainId
      };
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return { success: false, error: error.message };
    }
  }

  // Disconnect wallet
  async disconnectWallet() {
    this.account = null;
    this.signer = null;
    this.chainId = null;
    this.isConnected = false;
    
    this.notifyListeners('disconnected', {});
    
    return { success: true };
  }

  // Get wallet balance
  async getBalance(address = null) {
    try {
      if (!this.provider) {
        throw new Error('Web3 not initialized');
      }

      const targetAddress = address || this.account;
      if (!targetAddress) {
        throw new Error('No account connected');
      }

      const balance = await this.provider.getBalance(targetAddress);
      return {
        success: true,
        balance: ethers.formatEther(balance),
        wei: balance.toString()
      };
    } catch (error) {
      console.error('Failed to get balance:', error);
      return { success: false, error: error.message };
    }
  }

  // Send transaction
  async sendTransaction(to, amount, data = null) {
    try {
      if (!this.signer) {
        throw new Error('No signer available');
      }

      const tx = {
        to,
        value: ethers.parseEther(amount.toString()),
        ...(data && { data })
      };

      const transaction = await this.signer.sendTransaction(tx);
      await transaction.wait();

      return {
        success: true,
        hash: transaction.hash,
        transaction
      };
    } catch (error) {
      console.error('Failed to send transaction:', error);
      return { success: false, error: error.message };
    }
  }

  // Switch network
  async switchNetwork(chainId) {
    try {
      if (!this.provider) {
        throw new Error('Web3 not initialized');
      }

      await this.provider.send('wallet_switchEthereumChain', [
        { chainId: `0x${chainId.toString(16)}` }
      ]);

      this.chainId = chainId;
      this.notifyListeners('chainChanged', { chainId });

      return { success: true };
    } catch (error) {
      console.error('Failed to switch network:', error);
      return { success: false, error: error.message };
    }
  }

  // Add network
  async addNetwork(networkConfig) {
    try {
      if (!this.provider) {
        throw new Error('Web3 not initialized');
      }

      await this.provider.send('wallet_addEthereumChain', [networkConfig]);
      return { success: true };
    } catch (error) {
      console.error('Failed to add network:', error);
      return { success: false, error: error.message };
    }
  }

  // Event listeners
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  notifyListeners(event, data) {
    this.listeners.forEach(listener => {
      try {
        listener(event, data);
      } catch (error) {
        console.error('Error in Web3 listener:', error);
      }
    });
  }

  // Handle account changes
  handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      this.disconnectWallet();
    } else {
      this.account = accounts[0];
      this.notifyListeners('accountsChanged', { account: this.account });
    }
  }

  // Handle chain changes
  handleChainChanged(chainId) {
    this.chainId = chainId;
    this.notifyListeners('chainChanged', { chainId });
  }

  // Get current state
  getState() {
    return {
      isConnected: this.isConnected,
      account: this.account,
      chainId: this.chainId,
      provider: this.provider,
      signer: this.signer
    };
  }
}

// Create singleton instance
const web3Service = new Web3Service();

// Network configurations from environment
export const NETWORKS = config.web3.networks;

export default web3Service;
