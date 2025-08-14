import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package, Truck, History, Search } from 'lucide-react';

const CustomerDashboard = () => {
  const stats = [
    {
      title: 'Cart Items',
      value: '3',
      description: 'Items ready to purchase',
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      title: 'Orders',
      value: '12',
      description: 'Total orders placed',
      icon: Package,
      color: 'text-green-600'
    },
    {
      title: 'In Transit',
      value: '2',
      description: 'Orders being delivered',
      icon: Truck,
      color: 'text-purple-600'
    },
    {
      title: 'Total Spent',
      value: '$2,340',
      description: 'Lifetime purchases',
      icon: History,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
          <p className="text-gray-600">Browse products and track your orders</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Browse Products
          </Button>
          <Button>
            <ShoppingCart className="h-4 w-4 mr-2" />
            View Cart (3)
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest purchases and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Smartphone X1</p>
                    <p className="text-sm text-gray-500">Order #1234</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Delivered
                  </span>
                  <p className="text-xs text-gray-500 mt-1">$299</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Cotton T-Shirt</p>
                    <p className="text-sm text-gray-500">Order #1235</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                    In Transit
                  </span>
                  <p className="text-xs text-gray-500 mt-1">$29</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shopping Cart</CardTitle>
            <CardDescription>Items ready for checkout</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div>
                    <p className="font-medium">Laptop Pro</p>
                    <p className="text-sm text-gray-500">Qty: 1</p>
                  </div>
                </div>
                <p className="font-medium">$899</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div>
                    <p className="font-medium">Wireless Headphones</p>
                    <p className="text-sm text-gray-500">Qty: 2</p>
                  </div>
                </div>
                <p className="font-medium">$158</p>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Total:</p>
                  <p className="text-lg font-bold">$1,057</p>
                </div>
                <Button className="w-full mt-3">
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Order Tracking</CardTitle>
          <CardDescription>Track your current orders in real-time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Truck className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium">Order #1235 - Cotton T-Shirt</p>
                <p className="text-sm text-gray-500">Expected delivery: Tomorrow</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDashboard;

