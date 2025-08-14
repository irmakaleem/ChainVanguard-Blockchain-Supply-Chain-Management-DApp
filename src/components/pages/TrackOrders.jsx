import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import OrderTracking from '../tracking/OrderTracking';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const TrackOrders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getOrdersByCustomer, products } = useData();

  // Get customer's orders
  const customerOrders = getOrdersByCustomer(user?.id || 'customer1');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard/customer')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Track Your Orders</h1>
            <p className="text-gray-600 mt-2">
              Monitor the status and location of your orders in real-time.
            </p>
          </div>
        </div>

        {/* Order Tracking Component */}
        <OrderTracking 
          orders={customerOrders}
          products={products}
        />
      </div>
    </div>
  );
};

export default TrackOrders;

