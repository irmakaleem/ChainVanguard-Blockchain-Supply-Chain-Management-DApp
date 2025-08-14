import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';
import { useData } from '../../context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, Package } from 'lucide-react';
import { toast } from 'sonner';

const Cart = () => {
  const { user } = useAuth();
  const { sendTransaction, balance } = useWallet();
  const { createOrder } = useData();
  const [cart, setCart] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    loadCart();
  }, [user]);

  const loadCart = () => {
    if (user?.id) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  };

  const saveCart = (updatedCart) => {
    if (user?.id) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedCart));
      setCart(updatedCart);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = cart.find(item => item.id === productId);
    if (newQuantity > product.quantity) {
      toast.error('Cannot exceed available stock');
      return;
    }

    const updatedCart = cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    saveCart(updatedCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);
    toast.success('Item removed from cart');
  };

  const clearCart = () => {
    saveCart([]);
    toast.success('Cart cleared');
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.08; // 8% tax
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 100 ? 0 : 10; // Free shipping over $100
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const shipping = calculateShipping();
    return subtotal + tax + shipping;
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const total = calculateTotal();
    if (balance < total) {
      toast.error('Insufficient wallet balance');
      return;
    }

    setIsCheckingOut(true);
    try {
      // Create order using DataContext
      const order = await createOrder({
        customerId: user.id,
        customerName: user.name,
        items: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          vendorId: item.supplierId,
          vendor: item.supplier
        })),
        subtotal: calculateSubtotal(),
        tax: calculateTax(calculateSubtotal()),
        shipping: calculateShipping(),
        total: total,
        status: 'pending',
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });

      // Process payment via blockchain transaction
      await sendTransaction('vendor_wallet_address', total, order.id);

      // Update product quantities
      const savedProducts = localStorage.getItem('supply_chain_products');
      if (savedProducts) {
        const allProducts = JSON.parse(savedProducts);
        const updatedProducts = allProducts.map(product => {
          const cartItem = cart.find(item => item.id === product.id);
          if (cartItem) {
            return {
              ...product,
              quantity: product.quantity - cartItem.quantity
            };
          }
          return product;
        });
        localStorage.setItem('supply_chain_products', JSON.stringify(updatedProducts));
      }

      // Clear cart
      saveCart([]);
      
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process order. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping();
  const total = calculateTotal();

  if (cart.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600">Review items in your cart</p>
        </div>
        
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-4">
              Start shopping to add items to your cart
            </p>
            <Button onClick={() => window.location.href = '/browse'}>
              Browse Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600">Review items in your cart</p>
        </div>
        <Button variant="outline" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items ({cart.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary">{item.category}</Badge>
                      <span className="text-sm text-gray-500">by {item.supplier}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                      className="w-16 text-center"
                      min="1"
                      max={item.quantity}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.quantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                    <div className="text-sm text-gray-500">${item.price.toFixed(2)} each</div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping === 0 && (
                <div className="text-sm text-green-600">
                  🎉 Free shipping on orders over $100!
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${balance.toFixed(2)}
              </div>
              {balance < total && (
                <div className="text-sm text-red-600 mt-2">
                  Insufficient balance for this order
                </div>
              )}
            </CardContent>
          </Card>

          <Button 
            className="w-full" 
            size="lg"
            onClick={handleCheckout}
            disabled={isCheckingOut || balance < total}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {isCheckingOut ? 'Processing...' : `Checkout $${total.toFixed(2)}`}
          </Button>

          <div className="text-xs text-gray-500 text-center">
            <Package className="h-4 w-4 inline mr-1" />
            Estimated delivery: 7 business days
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

