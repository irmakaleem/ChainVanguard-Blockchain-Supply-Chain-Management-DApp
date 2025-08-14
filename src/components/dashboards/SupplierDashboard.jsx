import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Truck, Users, Database, ArrowUpDown } from 'lucide-react';

const SupplierDashboard = () => {
  const stats = [
    {
      title: 'Total Inventory',
      value: '1,247',
      description: 'Products in stock',
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'Vendor Partners',
      value: '34',
      description: 'Active vendor relationships',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Transactions',
      value: '892',
      description: 'Total transactions',
      icon: ArrowUpDown,
      color: 'text-purple-600'
    },
    {
      title: 'Supply Value',
      value: '$45,230',
      description: 'Total inventory value',
      icon: Database,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Supplier Dashboard</h1>
          <p className="text-gray-600">Manage inventory and vendor relationships</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Truck className="h-4 w-4 mr-2" />
            New Shipment
          </Button>
          <Button>
            <Package className="h-4 w-4 mr-2" />
            Add Inventory
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
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest supply chain activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Sold to Vendor ABC</p>
                  <p className="text-sm text-gray-500">Electronics - 50 units</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+$15,000</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Bought from Ministry</p>
                  <p className="text-sm text-gray-500">Raw Materials - 200 units</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">-$8,500</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vendor Performance</CardTitle>
            <CardDescription>Top performing vendor partners</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">TechVendor Pro</p>
                    <p className="text-sm text-gray-500">Electronics</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">$25,400</p>
                  <p className="text-xs text-green-600">+12% this month</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Fashion Hub</p>
                    <p className="text-sm text-gray-500">Textiles</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">$18,200</p>
                  <p className="text-xs text-green-600">+8% this month</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplierDashboard;

