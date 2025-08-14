import { 
  AreaChart,
  Area,
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
import { Activity, Database, Shield, Clock } from 'lucide-react';

const TransactionChart = ({ 
  transactions = [], 
  type = 'area', 
  title = 'Blockchain Transaction Analytics' 
}) => {
  // Process transaction data for charts
  const processTransactionData = () => {
    if (transactions.length === 0) {
      // Sample data for demonstration
      return [
        { date: '2024-01-01', confirmed: 45, pending: 12, failed: 3, volume: 125000 },
        { date: '2024-01-02', confirmed: 52, pending: 8, failed: 2, volume: 142000 },
        { date: '2024-01-03', confirmed: 38, pending: 15, failed: 5, volume: 98000 },
        { date: '2024-01-04', confirmed: 61, pending: 10, failed: 1, volume: 167000 },
        { date: '2024-01-05', confirmed: 49, pending: 18, failed: 4, volume: 134000 },
        { date: '2024-01-06', confirmed: 55, pending: 6, failed: 2, volume: 156000 },
        { date: '2024-01-07', confirmed: 43, pending: 14, failed: 3, volume: 118000 }
      ];
    }

    // Group transactions by date and status
    const groupedData = {};
    
    transactions.forEach(tx => {
      const date = new Date(tx.timestamp).toISOString().split('T')[0];
      if (!groupedData[date]) {
        groupedData[date] = { 
          date, 
          confirmed: 0, 
          pending: 0, 
          failed: 0, 
          volume: 0 
        };
      }
      
      groupedData[date][tx.status]++;
      groupedData[date].volume += tx.price;
    });

    return Object.values(groupedData).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const chartData = processTransactionData();

  // Colors for different chart elements
  const colors = {
    confirmed: '#10b981',
    pending: '#f59e0b',
    failed: '#ef4444',
    volume: '#3b82f6'
  };

  const renderAreaChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis />
        <Tooltip 
          labelFormatter={(date) => new Date(date).toLocaleDateString()}
          formatter={(value, name) => [
            name === 'volume' ? `$${value.toLocaleString()}` : value,
            name.charAt(0).toUpperCase() + name.slice(1)
          ]}
        />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="confirmed" 
          stackId="1"
          stroke={colors.confirmed} 
          fill={colors.confirmed}
          fillOpacity={0.6}
          name="Confirmed"
        />
        <Area 
          type="monotone" 
          dataKey="pending" 
          stackId="1"
          stroke={colors.pending} 
          fill={colors.pending}
          fillOpacity={0.6}
          name="Pending"
        />
        <Area 
          type="monotone" 
          dataKey="failed" 
          stackId="1"
          stroke={colors.failed} 
          fill={colors.failed}
          fillOpacity={0.6}
          name="Failed"
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis />
        <Tooltip 
          labelFormatter={(date) => new Date(date).toLocaleDateString()}
          formatter={(value, name) => [
            name === 'volume' ? `$${value.toLocaleString()}` : value,
            name.charAt(0).toUpperCase() + name.slice(1)
          ]}
        />
        <Legend />
        <Bar dataKey="confirmed" fill={colors.confirmed} name="Confirmed" />
        <Bar dataKey="pending" fill={colors.pending} name="Pending" />
        <Bar dataKey="failed" fill={colors.failed} name="Failed" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis />
        <Tooltip 
          labelFormatter={(date) => new Date(date).toLocaleDateString()}
          formatter={(value, name) => [
            name === 'volume' ? `$${value.toLocaleString()}` : value,
            name.charAt(0).toUpperCase() + name.slice(1)
          ]}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="volume" 
          stroke={colors.volume} 
          strokeWidth={3}
          name="Transaction Volume ($)"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => {
    // Calculate status distribution
    const totalConfirmed = chartData.reduce((sum, item) => sum + item.confirmed, 0);
    const totalPending = chartData.reduce((sum, item) => sum + item.pending, 0);
    const totalFailed = chartData.reduce((sum, item) => sum + item.failed, 0);

    const pieData = [
      { name: 'Confirmed', value: totalConfirmed, fill: colors.confirmed },
      { name: 'Pending', value: totalPending, fill: colors.pending },
      { name: 'Failed', value: totalFailed, fill: colors.failed }
    ].filter(item => item.value > 0);

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart();
      case 'line':
        return renderLineChart();
      case 'pie':
        return renderPieChart();
      case 'area':
      default:
        return renderAreaChart();
    }
  };

  // Calculate summary statistics
  const totalTransactions = chartData.reduce((sum, item) => sum + item.confirmed + item.pending + item.failed, 0);
  const totalConfirmed = chartData.reduce((sum, item) => sum + item.confirmed, 0);
  const totalPending = chartData.reduce((sum, item) => sum + item.pending, 0);
  const totalFailed = chartData.reduce((sum, item) => sum + item.failed, 0);
  const totalVolume = chartData.reduce((sum, item) => sum + item.volume, 0);
  const successRate = totalTransactions > 0 ? (totalConfirmed / totalTransactions * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold">{totalTransactions.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">{successRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{totalPending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Volume</p>
                <p className="text-2xl font-bold">${totalVolume.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>{title}</span>
          </CardTitle>
          <CardDescription>
            {type === 'area' && 'Transaction status distribution over time'}
            {type === 'bar' && 'Daily transaction counts by status'}
            {type === 'line' && 'Transaction volume trends'}
            {type === 'pie' && 'Overall transaction status distribution'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionChart;

