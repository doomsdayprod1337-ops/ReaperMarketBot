import { web3Config } from '@/config/environment'

// Web3 Service for wallet connections and transactions
export class Web3Service {
  constructor() {
    this.providers = {}
    this.accounts = []
    this.chainId = null
    this.isConnected = false
  }

  // Initialize Web3 providers
  async initialize() {
    try {
      // MetaMask provider
      if (window.ethereum) {
        this.providers.metamask = window.ethereum
        await this.setupMetaMask()
      }

      // WalletConnect provider
      if (web3Config.walletConnectProjectId) {
        await this.setupWalletConnect()
      }

      return { success: true }
    } catch (error) {
      console.error('Web3 initialization failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Setup MetaMask
  async setupMetaMask() {
    if (!window.ethereum) return

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      this.accounts = accounts
      this.isConnected = accounts.length > 0

      // Get chain ID
      this.chainId = await window.ethereum.request({
        method: 'eth_chainId'
      })

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        this.accounts = accounts
        this.isConnected = accounts.length > 0
        this.onAccountsChanged?.(accounts)
      })

      // Listen for chain changes
      window.ethereum.on('chainChanged', (chainId) => {
        this.chainId = chainId
        this.onChainChanged?.(chainId)
      })

      return { success: true }
    } catch (error) {
      console.error('MetaMask setup failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Setup WalletConnect
  async setupWalletConnect() {
    try {
      // Dynamic import for WalletConnect
      const { WalletConnectConnector } = await import('@walletconnect/web3-provider')
      
      const connector = new WalletConnectConnector({
        rpc: {
          [web3Config.networkId]: web3Config.rpcUrl
        },
        bridge: 'https://bridge.walletconnect.org',
        qrcode: true,
        pollingInterval: 12000
      })

      this.providers.walletconnect = connector
      return { success: true }
    } catch (error) {
      console.error('WalletConnect setup failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Connect to wallet
  async connect(provider = 'metamask') {
    try {
      if (provider === 'metamask') {
        return await this.connectMetaMask()
      } else if (provider === 'walletconnect') {
        return await this.connectWalletConnect()
      }
      
      throw new Error(`Unsupported provider: ${provider}`)
    } catch (error) {
      console.error('Wallet connection failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Connect MetaMask
  async connectMetaMask() {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed')
    }

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    })

    this.accounts = accounts
    this.isConnected = true

    return {
      success: true,
      accounts,
      provider: 'metamask'
    }
  }

  // Connect WalletConnect
  async connectWalletConnect() {
    if (!this.providers.walletconnect) {
      throw new Error('WalletConnect not initialized')
    }

    const accounts = await this.providers.walletconnect.enable()
    this.accounts = accounts
    this.isConnected = true

    return {
      success: true,
      accounts,
      provider: 'walletconnect'
    }
  }

  // Disconnect wallet
  async disconnect() {
    try {
      this.accounts = []
      this.isConnected = false
      this.chainId = null

      // Disconnect WalletConnect if connected
      if (this.providers.walletconnect) {
        await this.providers.walletconnect.close()
      }

      return { success: true }
    } catch (error) {
      console.error('Wallet disconnection failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Get account balance
  async getBalance(address = null) {
    try {
      const account = address || this.accounts[0]
      if (!account) throw new Error('No account connected')

      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [account, 'latest']
      })

      return {
        success: true,
        balance: parseInt(balance, 16),
        balanceHex: balance
      }
    } catch (error) {
      console.error('Get balance failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Send transaction
  async sendTransaction(transaction) {
    try {
      if (!this.isConnected) {
        throw new Error('No wallet connected')
      }

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transaction]
      })

      return {
        success: true,
        txHash
      }
    } catch (error) {
      console.error('Send transaction failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Sign message
  async signMessage(message) {
    try {
      if (!this.isConnected) {
        throw new Error('No wallet connected')
      }

      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, this.accounts[0]]
      })

      return {
        success: true,
        signature
      }
    } catch (error) {
      console.error('Sign message failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Switch network
  async switchNetwork(chainId) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      })

      return { success: true }
    } catch (error) {
      console.error('Switch network failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Add network
  async addNetwork(networkConfig) {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkConfig]
      })

      return { success: true }
    } catch (error) {
      console.error('Add network failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Event handlers
  onAccountsChanged = null
  onChainChanged = null

  // Set event handlers
  setOnAccountsChanged(handler) {
    this.onAccountsChanged = handler
  }

  setOnChainChanged(handler) {
    this.onChainChanged = handler
  }
}

// Create global Web3 service instance
export const web3Service = new Web3Service()

// Export utility functions
export const formatAddress = (address) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatBalance = (balance, decimals = 18) => {
  if (!balance) return '0'
  return (parseInt(balance, 16) / Math.pow(10, decimals)).toFixed(4)
}

export const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export const getNetworkName = (chainId) => {
  const networks = {
    1: 'Ethereum Mainnet',
    3: 'Ropsten Testnet',
    4: 'Rinkeby Testnet',
    5: 'Goerli Testnet',
    42: 'Kovan Testnet',
    137: 'Polygon Mainnet',
    80001: 'Polygon Mumbai Testnet'
  }
  return networks[chainId] || `Chain ${chainId}`
}

export default web3Service
