import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Package, Users } from 'lucide-react';

const SalesChart = ({ data = [], type = 'bar', title = 'Sales Analytics' }) => {
  // Sample data if none provided
  const defaultData = [
    { month: 'Jan', sales: 4000, orders: 24, customers: 18 },
    { month: 'Feb', sales: 3000, orders: 18, customers: 15 },
    { month: 'Mar', sales: 5000, orders: 32, customers: 25 },
    { month: 'Apr', sales: 4500, orders: 28, customers: 22 },
    { month: 'May', sales: 6000, orders: 38, customers: 30 },
    { month: 'Jun', sales: 5500, orders: 35, customers: 28 }
  ];

  const chartData = data.length > 0 ? data : defaultData;

  // Colors for different chart elements
  const colors = {
    primary: '#3b82f6',
    secondary: '#10b981',
    tertiary: '#f59e0b',
    quaternary: '#ef4444'
  };

  const pieColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip 
          formatter={(value, name) => [
            name === 'sales' ? `$${value.toLocaleString()}` : value,
            name.charAt(0).toUpperCase() + name.slice(1)
          ]}
        />
        <Legend />
        <Bar dataKey="sales" fill={colors.primary} name="Sales ($)" />
        <Bar dataKey="orders" fill={colors.secondary} name="Orders" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip 
          formatter={(value, name) => [
            name === 'sales' ? `$${value.toLocaleString()}` : value,
            name.charAt(0).toUpperCase() + name.slice(1)
          ]}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="sales" 
          stroke={colors.primary} 
          strokeWidth={3}
          name="Sales ($)"
        />
        <Line 
          type="monotone" 
          dataKey="orders" 
          stroke={colors.secondary} 
          strokeWidth={3}
          name="Orders"
        />
        <Line 
          type="monotone" 
          dataKey="customers" 
          stroke={colors.tertiary} 
          strokeWidth={3}
          name="Customers"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => {
    // Transform data for pie chart (showing sales distribution)
    const pieData = chartData.map((item, index) => ({
      name: item.month,
      value: item.sales,
      fill: pieColors[index % pieColors.length]
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return renderLineChart();
      case 'pie':
        return renderPieChart();
      case 'bar':
      default:
        return renderBarChart();
    }
  };

  // Calculate summary statistics
  const totalSales = chartData.reduce((sum, item) => sum + item.sales, 0);
  const totalOrders = chartData.reduce((sum, item) => sum + item.orders, 0);
  const totalCustomers = chartData.reduce((sum, item) => sum + item.customers, 0);
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold">${totalSales.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <p className="text-2xl font-bold">{totalCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>{title}</span>
          </CardTitle>
          <CardDescription>
            {type === 'bar' && 'Monthly sales and order comparison'}
            {type === 'line' && 'Sales, orders, and customer trends over time'}
            {type === 'pie' && 'Sales distribution by month'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesChart;

