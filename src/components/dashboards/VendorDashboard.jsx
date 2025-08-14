import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, Users, TrendingUp, Plus } from 'lucide-react';

const VendorDashboard = () => {
  const { user } = useAuth();
  const { products, orders, getProductsByVendor, getOrdersByVendor } = useData();
  
  // Get vendor-specific data
  const vendorProducts = getProductsByVendor(user?.id || 'vendor1');
  const vendorOrders = getOrdersByVendor(user?.id || 'vendor1');
  
  // Calculate stats
  const totalProducts = vendorProducts.length;
  const totalSales = vendorOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalOrders = vendorOrders.length;
  const uniqueCustomers = new Set(vendorOrders.map(order => order.customerId)).size;

  const stats = [
    {
      title: 'Total Products',
      value: totalProducts.toString(),
      description: 'Active products in inventory',
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'Total Sales',
      value: `$${totalSales.toLocaleString()}`,
      description: 'Revenue this month',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Orders',
      value: totalOrders.toString(),
      description: 'Orders processed',
      icon: ShoppingCart,
      color: 'text-purple-600'
    },
    {
      title: 'Customers',
      value: uniqueCustomers.toString(),
      description: 'Active customers',
      icon: Users,
      color: 'text-orange-600'
    }
  ];

  // Get recent orders (last 5)
  const recentOrders = vendorOrders
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    .slice(0, 5);

  // Get top products by sales
  const productSales = vendorProducts.map(product => {
    const productOrders = vendorOrders.filter(order => order.productId === product.id);
    const totalSold = productOrders.reduce((sum, order) => sum + order.quantity, 0);
    const revenue = productOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    return { ...product, totalSold, revenue };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
          <p className="text-gray-600">Manage your products and track sales performance</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </Button>
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => {
                  const product = products.find(p => p.id === order.productId);
                  return (
                    <div key={order.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-500">
                          {product?.name} - ${order.totalPrice}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        order.status === 'delivered' 
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'in_transit'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center py-4">No recent orders</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productSales.length > 0 ? (
                productSales.map((product) => (
                  <div key={product.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.totalSold} sold</p>
                    </div>
                    <span className="text-green-600 font-medium">
                      ${product.revenue.toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No sales data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Package className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <ShoppingCart className="h-4 w-4 mr-2" />
              View All Orders
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              Sales Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorDashboard;

