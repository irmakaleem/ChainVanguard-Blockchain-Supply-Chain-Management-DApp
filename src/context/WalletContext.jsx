import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  // Initialize wallet state from localStorage
  useEffect(() => {
    const savedWallet = localStorage.getItem('blockchain_wallet');
    if (savedWallet) {
      try {
        const walletData = JSON.parse(savedWallet);
        setWallet(walletData);
        setIsConnected(true);
        // Load balance and transactions for this wallet
        loadWalletData(walletData.address);
      } catch (error) {
        console.error('Error parsing saved wallet data:', error);
        localStorage.removeItem('blockchain_wallet');
      }
    }
  }, []);

  const generateWalletAddress = () => {
    // Generate a mock blockchain address
    const prefix = '0x';
    const address = Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    return prefix + address;
  };

  const connectExistingWallet = async () => {
    // Simulate connecting to an existing wallet
    const mockWallet = {
      id: uuidv4(),
      address: generateWalletAddress(),
      type: 'existing',
      connectedAt: new Date().toISOString()
    };

    setWallet(mockWallet);
    setIsConnected(true);
    setBalance(Math.floor(Math.random() * 10000) + 1000); // Random balance
    localStorage.setItem('blockchain_wallet', JSON.stringify(mockWallet));
    
    return mockWallet;
  };

  const createNewWallet = async (userInfo) => {
    // Simulate creating a new wallet
    const newWallet = {
      id: uuidv4(),
      address: generateWalletAddress(),
      type: 'new',
      userInfo,
      createdAt: new Date().toISOString()
    };

    setWallet(newWallet);
    setIsConnected(true);
    setBalance(5000); // Starting balance for new wallets
    localStorage.setItem('blockchain_wallet', JSON.stringify(newWallet));
    
    return newWallet;
  };

  const disconnectWallet = () => {
    setWallet(null);
    setIsConnected(false);
    setBalance(0);
    setTransactions([]);
    localStorage.removeItem('blockchain_wallet');
  };

  const loadWalletData = (address) => {
    // Load mock transaction data for the wallet
    const mockTransactions = [
      {
        id: uuidv4(),
        type: 'receive',
        amount: 1000,
        from: '0x1234...5678',
        to: address,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'confirmed'
      },
      {
        id: uuidv4(),
        type: 'send',
        amount: 250,
        from: address,
        to: '0x9876...5432',
        timestamp: new Date(Date.now() - 43200000).toISOString(),
        status: 'confirmed'
      }
    ];
    setTransactions(mockTransactions);
  };

  const sendTransaction = async (to, amount, productId = null) => {
    if (!wallet || balance < amount) {
      throw new Error('Insufficient balance or wallet not connected');
    }

    const transaction = {
      id: uuidv4(),
      type: 'send',
      amount,
      from: wallet.address,
      to,
      productId,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    // Add to transactions
    setTransactions(prev => [transaction, ...prev]);
    
    // Update balance
    setBalance(prev => prev - amount);

    // Simulate transaction confirmation after 2 seconds
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === transaction.id 
            ? { ...tx, status: 'confirmed' }
            : tx
        )
      );
    }, 2000);

    return transaction;
  };

  const value = {
    wallet,
    isConnected,
    balance,
    transactions,
    connectExistingWallet,
    createNewWallet,
    disconnectWallet,
    sendTransaction
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;

