import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  ShoppingCart, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Truck,
  CheckCircle,
  Clock,
  Package
} from 'lucide-react';

const OrderList = ({ 
  orders = [], 
  products = [],
  onView, 
  onUpdateStatus,
  showActions = true,
  title = "Orders",
  description = "Manage customer orders"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const product = products.find(p => p.id === order.productId);
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Get unique statuses
  const statuses = ['all', ...new Set(orders.map(order => order.status))];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return { 
          label: 'Pending', 
          variant: 'secondary',
          icon: Clock,
          color: 'text-yellow-600'
        };
      case 'processing':
        return { 
          label: 'Processing', 
          variant: 'default',
          icon: Package,
          color: 'text-blue-600'
        };
      case 'in_transit':
        return { 
          label: 'In Transit', 
          variant: 'default',
          icon: Truck,
          color: 'text-purple-600'
        };
      case 'delivered':
        return { 
          label: 'Delivered', 
          variant: 'default',
          icon: CheckCircle,
          color: 'text-green-600'
        };
      default:
        return { 
          label: status, 
          variant: 'outline',
          icon: Clock,
          color: 'text-gray-600'
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdate = (order, newStatus) => {
    if (onUpdateStatus) {
      onUpdateStatus(order.id, newStatus);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ShoppingCart className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Statuses' : status.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Orders Table */}
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  {showActions && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const product = products.find(p => p.id === order.productId);
                  const statusConfig = getStatusConfig(order.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">
                        #{order.id.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {product && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium">{product?.name || 'Unknown Product'}</p>
                            <p className="text-sm text-gray-500">{product?.category}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {order.customerId.slice(0, 8)}...
                      </TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell className="font-medium">
                        ${order.totalPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(order.orderDate)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                          <Badge variant={statusConfig.variant}>
                            {statusConfig.label}
                          </Badge>
                        </div>
                      </TableCell>
                      {showActions && (
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {onView && (
                                <DropdownMenuItem onClick={() => onView(order)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                              )}
                              {onUpdateStatus && order.status !== 'delivered' && (
                                <>
                                  {order.status === 'pending' && (
                                    <DropdownMenuItem 
                                      onClick={() => handleStatusUpdate(order, 'processing')}
                                    >
                                      <Package className="h-4 w-4 mr-2" />
                                      Mark as Processing
                                    </DropdownMenuItem>
                                  )}
                                  {order.status === 'processing' && (
                                    <DropdownMenuItem 
                                      onClick={() => handleStatusUpdate(order, 'in_transit')}
                                    >
                                      <Truck className="h-4 w-4 mr-2" />
                                      Mark as In Transit
                                    </DropdownMenuItem>
                                  )}
                                  {order.status === 'in_transit' && (
                                    <DropdownMenuItem 
                                      onClick={() => handleStatusUpdate(order, 'delivered')}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Mark as Delivered
                                    </DropdownMenuItem>
                                  )}
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Orders will appear here once customers start purchasing.'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderList;

