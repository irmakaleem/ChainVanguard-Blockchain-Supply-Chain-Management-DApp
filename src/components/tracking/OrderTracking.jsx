import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Search,
  Calendar,
  User,
  DollarSign
} from 'lucide-react';

const OrderTracking = ({ orders = [], products = [], onTrackOrder }) => {
  const [trackingId, setTrackingId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sample tracking data for demonstration
  const sampleTrackingSteps = [
    {
      id: 1,
      status: 'pending',
      title: 'Order Placed',
      description: 'Your order has been received and is being processed',
      timestamp: '2024-01-15T10:00:00Z',
      location: 'Order Processing Center',
      completed: true
    },
    {
      id: 2,
      status: 'processing',
      title: 'Order Confirmed',
      description: 'Payment confirmed and order is being prepared',
      timestamp: '2024-01-15T11:30:00Z',
      location: 'Fulfillment Center',
      completed: true
    },
    {
      id: 3,
      status: 'processing',
      title: 'Item Packed',
      description: 'Your item has been packed and ready for shipment',
      timestamp: '2024-01-15T14:20:00Z',
      location: 'Warehouse - Bay 12',
      completed: true
    },
    {
      id: 4,
      status: 'in_transit',
      title: 'In Transit',
      description: 'Package is on its way to your delivery address',
      timestamp: '2024-01-16T08:15:00Z',
      location: 'Distribution Hub - City Center',
      completed: true
    },
    {
      id: 5,
      status: 'in_transit',
      title: 'Out for Delivery',
      description: 'Package is out for delivery and will arrive today',
      timestamp: '2024-01-17T09:00:00Z',
      location: 'Local Delivery Hub',
      completed: false
    },
    {
      id: 6,
      status: 'delivered',
      title: 'Delivered',
      description: 'Package has been delivered successfully',
      timestamp: null,
      location: 'Your Address',
      completed: false
    }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return { 
          label: 'Pending', 
          variant: 'secondary',
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100'
        };
      case 'processing':
        return { 
          label: 'Processing', 
          variant: 'default',
          icon: Package,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100'
        };
      case 'in_transit':
        return { 
          label: 'In Transit', 
          variant: 'default',
          icon: Truck,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100'
        };
      case 'delivered':
        return { 
          label: 'Delivered', 
          variant: 'default',
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        };
      default:
        return { 
          label: status, 
          variant: 'outline',
          icon: Clock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100'
        };
    }
  };

  const handleTrackOrder = async () => {
    if (!trackingId.trim()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const order = orders.find(o => o.id.toLowerCase().includes(trackingId.toLowerCase()));
      if (order) {
        setTrackedOrder({
          ...order,
          trackingSteps: sampleTrackingSteps
        });
      } else {
        setTrackedOrder(null);
      }
      setLoading(false);
    }, 1000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Pending';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedDelivery = (order) => {
    const orderDate = new Date(order.orderDate);
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(orderDate.getDate() + 3); // 3 days delivery
    return estimatedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Order Tracking Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Track Your Order</span>
          </CardTitle>
          <CardDescription>
            Enter your order ID to track the current status and location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="tracking-id">Order ID</Label>
              <Input
                id="tracking-id"
                placeholder="Enter order ID (e.g., ORD001)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleTrackOrder} disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                {loading ? 'Tracking...' : 'Track Order'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracked Order Details */}
      {trackedOrder && (
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>Order ID: #{trackedOrder.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium">{formatDate(trackedOrder.orderDate)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium">${trackedOrder.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p className="font-medium">{trackedOrder.quantity} items</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Estimated Delivery</p>
                    <p className="font-medium">{getEstimatedDelivery(trackedOrder)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Tracking Timeline</CardTitle>
              <CardDescription>Follow your order's journey from processing to delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                {/* Timeline Steps */}
                <div className="space-y-6">
                  {trackedOrder.trackingSteps.map((step, index) => {
                    const statusConfig = getStatusConfig(step.status);
                    const StatusIcon = statusConfig.icon;
                    const isCompleted = step.completed;
                    const isActive = !isCompleted && index > 0 && trackedOrder.trackingSteps[index - 1].completed;
                    
                    return (
                      <div key={step.id} className="relative flex items-start space-x-4">
                        {/* Timeline Dot */}
                        <div className={`
                          relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2
                          ${isCompleted 
                            ? `${statusConfig.bgColor} border-current ${statusConfig.color}` 
                            : isActive
                              ? 'bg-blue-50 border-blue-500 text-blue-500'
                              : 'bg-gray-50 border-gray-300 text-gray-400'
                          }
                        `}>
                          <StatusIcon className="h-5 w-5" />
                        </div>
                        
                        {/* Step Content */}
                        <div className="flex-1 min-w-0 pb-6">
                          <div className="flex items-center justify-between">
                            <h3 className={`text-lg font-medium ${
                              isCompleted ? 'text-gray-900' : isActive ? 'text-blue-900' : 'text-gray-500'
                            }`}>
                              {step.title}
                            </h3>
                            {isCompleted && (
                              <Badge variant={statusConfig.variant}>
                                {statusConfig.label}
                              </Badge>
                            )}
                          </div>
                          
                          <p className={`mt-1 text-sm ${
                            isCompleted ? 'text-gray-600' : isActive ? 'text-blue-600' : 'text-gray-400'
                          }`}>
                            {step.description}
                          </p>
                          
                          {step.timestamp && (
                            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(step.timestamp)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{step.location}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* No Order Found */}
      {trackingId && !loading && !trackedOrder && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Order Not Found</h3>
            <p className="text-gray-500 mb-4">
              We couldn't find an order with ID "{trackingId}". Please check your order ID and try again.
            </p>
            <Button variant="outline" onClick={() => setTrackingId('')}>
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Orders for Quick Access */}
      {orders.length > 0 && !trackedOrder && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Click on any order to track its status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => {
                const product = products.find(p => p.id === order.productId);
                const statusConfig = getStatusConfig(order.status);
                
                return (
                  <div 
                    key={order.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setTrackingId(order.id);
                      handleTrackOrder();
                    }}
                  >
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
                        <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={statusConfig.variant}>
                        {statusConfig.label}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">
                        ${order.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderTracking;

