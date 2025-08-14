import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import SalesChart from '../charts/SalesChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ArrowLeft, BarChart3, TrendingUp, Calendar } from 'lucide-react';

const Analytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getOrdersByVendor, getProductsByVendor } = useData();
  const [chartType, setChartType] = useState('bar');
  const [timeRange, setTimeRange] = useState('6months');

  // Get vendor's data
  const vendorOrders = getOrdersByVendor(user?.id || 'vendor1');
  const vendorProducts = getProductsByVendor(user?.id || 'vendor1');

  // Process data for charts
  const processAnalyticsData = () => {
    // Group orders by month
    const monthlyData = {};
    const now = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      monthlyData[monthKey] = {
        month: monthName,
        sales: 0,
        orders: 0,
        customers: new Set(),
        revenue: 0
      };
    }

    // Process actual orders
    vendorOrders.forEach(order => {
      const orderDate = new Date(order.orderDate);
      const monthKey = orderDate.toISOString().slice(0, 7);
      
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].sales += order.totalPrice;
        monthlyData[monthKey].orders += 1;
        monthlyData[monthKey].customers.add(order.customerId);
        monthlyData[monthKey].revenue += order.totalPrice;
      }
    });

    // Convert to array and add customer count
    return Object.values(monthlyData).map(data => ({
      ...data,
      customers: data.customers.size
    }));
  };

  const analyticsData = processAnalyticsData();

  // Calculate key metrics
  const totalRevenue = vendorOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalOrders = vendorOrders.length;
  const totalProducts = vendorProducts.length;
  const uniqueCustomers = new Set(vendorOrders.map(order => order.customerId)).size;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Get top performing products
  const productPerformance = {};
  vendorOrders.forEach(order => {
    const product = vendorProducts.find(p => p.id === order.productId);
    if (product) {
      if (!productPerformance[product.id]) {
        productPerformance[product.id] = {
          product,
          orders: 0,
          revenue: 0,
          quantity: 0
        };
      }
      productPerformance[product.id].orders += 1;
      productPerformance[product.id].revenue += order.totalPrice;
      productPerformance[product.id].quantity += order.quantity;
    }
  });

  const topProducts = Object.values(productPerformance)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard/vendor')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sales Analytics</h1>
              <p className="text-gray-600 mt-2">
                Track your sales performance and business insights.
              </p>
            </div>
            
            {/* Chart Controls */}
            <div className="flex space-x-4">
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Products</p>
                  <p className="text-2xl font-bold">{totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Customers</p>
                  <p className="text-2xl font-bold">{uniqueCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Order</p>
                  <p className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Chart */}
        <div className="mb-8">
          <SalesChart 
            data={analyticsData} 
            type={chartType}
            title={`Sales Analytics - ${timeRange.replace('months', ' Months').replace('year', ' Year')}`}
          />
        </div>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>Your best-selling products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((item, index) => (
                  <div key={item.product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                      </div>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">{item.product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${item.revenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{item.orders} orders • {item.quantity} sold</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Sales Data</h3>
                <p className="text-gray-500">Start selling products to see analytics here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;

