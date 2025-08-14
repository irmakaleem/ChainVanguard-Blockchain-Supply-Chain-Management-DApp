import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize data from localStorage
  useEffect(() => {
    loadDataFromStorage();
  }, []);

  const loadDataFromStorage = () => {
    try {
      // Load products
      const savedProducts = localStorage.getItem('supply_chain_products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        initializeSampleData();
      }

      // Load orders
      const savedOrders = localStorage.getItem('supply_chain_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }

      // Load transactions
      const savedTransactions = localStorage.getItem('supply_chain_transactions');
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }

      // Load users
      const savedUsers = localStorage.getItem('supply_chain_users');
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading data from storage:', error);
      initializeSampleData();
    }
  };

  const initializeSampleData = () => {
    // Only initialize if no data exists
    const existingProducts = localStorage.getItem('supply_chain_products');
    if (existingProducts) return;

    // Sample products for demonstration
    const sampleProducts = [
      {
        id: uuidv4(),
        name: 'Smartphone X1',
        description: 'Latest smartphone with advanced features',
        price: 299,
        quantity: 50,
        category: 'Electronics',
        supplier: 'TechSupplier Inc',
        supplierId: 'sample_vendor_1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Cotton T-Shirt',
        description: 'Premium quality cotton t-shirt',
        price: 29,
        quantity: 100,
        category: 'Textiles',
        supplier: 'Fashion Hub',
        supplierId: 'sample_vendor_1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Organic Coffee Beans',
        description: 'Premium organic coffee beans',
        price: 15,
        quantity: 200,
        category: 'Food & Beverages',
        supplier: 'Coffee Co',
        supplierId: 'sample_vendor_2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Save sample data
    localStorage.setItem('supply_chain_products', JSON.stringify(sampleProducts));
    setProducts(sampleProducts);
    setLoading(false);
  };

  const saveProductsToStorage = (updatedProducts) => {
    localStorage.setItem('supply_chain_products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
  };

  const saveOrdersToStorage = (updatedOrders) => {
    localStorage.setItem('supply_chain_orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
  };

  const saveTransactionsToStorage = (updatedTransactions) => {
    localStorage.setItem('supply_chain_transactions', JSON.stringify(updatedTransactions));
    setTransactions(updatedTransactions);
  };

  const addProduct = (productData) => {
    const newProduct = {
      id: uuidv4(),
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedProducts = [...products, newProduct];
    saveProductsToStorage(updatedProducts);
    return newProduct;
  };

  const updateProduct = (productId, updates) => {
    const updatedProducts = products.map(product => 
      product.id === productId 
        ? { ...product, ...updates, updatedAt: new Date().toISOString() }
        : product
    );
    saveProductsToStorage(updatedProducts);
  };

  const deleteProduct = (productId) => {
    const updatedProducts = products.filter(product => product.id !== productId);
    saveProductsToStorage(updatedProducts);
  };

  const createOrder = (orderData) => {
    const newOrder = {
      id: uuidv4(),
      ...orderData,
      createdAt: new Date().toISOString(),
      status: orderData.status || 'pending'
    };
    const updatedOrders = [...orders, newOrder];
    saveOrdersToStorage(updatedOrders);
    
    // Create corresponding transaction
    const transaction = {
      id: uuidv4(),
      type: 'purchase',
      orderId: newOrder.id,
      customerId: orderData.customerId,
      items: orderData.items || [],
      totalAmount: orderData.total || 0,
      timestamp: new Date().toISOString(),
      blockHash: '0x' + Math.random().toString(16).substr(2, 8) + '...',
      status: 'confirmed'
    };
    const updatedTransactions = [...transactions, transaction];
    saveTransactionsToStorage(updatedTransactions);
    
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, status, updatedAt: new Date().toISOString() }
        : order
    );
    saveOrdersToStorage(updatedOrders);
  };

  const getProductsByVendor = (vendorId) => {
    return products.filter(product => product.supplierId === vendorId);
  };

  const getOrdersByCustomer = (customerId) => {
    return orders.filter(order => order.customerId === customerId);
  };

  const getOrdersByVendor = (vendorId) => {
    return orders.filter(order => 
      order.items && order.items.some(item => item.vendorId === vendorId)
    );
  };

  const getTransactionsByUser = (userId) => {
    return transactions.filter(tx => 
      tx.customerId === userId || 
      (tx.items && tx.items.some(item => item.vendorId === userId))
    );
  };

  const refreshData = () => {
    loadDataFromStorage();
  };

  const value = {
    products,
    orders,
    transactions,
    users,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    createOrder,
    updateOrderStatus,
    getProductsByVendor,
    getOrdersByCustomer,
    getOrdersByVendor,
    getTransactionsByUser,
    refreshData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;

