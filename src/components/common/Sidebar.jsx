import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '@/lib/utils';
import { 
  Home,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Truck,
  History,
  Shield,
  Database,
  Activity,
  Lock,
  AlertTriangle
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const userRole = user?.role || 'customer';

  const getNavigationItems = (role) => {
    const baseItems = [
      { name: 'Dashboard', href: `/dashboard/${role}`, icon: Home }
    ];

    switch (role) {
      case 'supplier':
        return [
          ...baseItems,
          { name: 'Products', href: '/products', icon: Package },
          { name: 'Inventory', href: '/inventory', icon: Database },
          { name: 'Transactions', href: '/transactions', icon: History },
          { name: 'Vendors', href: '/vendors', icon: Users },
          { name: 'Analytics', href: '/analytics', icon: BarChart3 }
        ];
      
      case 'vendor':
        return [
          ...baseItems,
          { name: 'Add Product', href: '/add-product', icon: Package },
          { name: 'My Products', href: '/my-products', icon: Database },
          { name: 'Orders', href: '/orders', icon: ShoppingCart },
          { name: 'Customers', href: '/customers', icon: Users },
          { name: 'Analytics', href: '/analytics', icon: BarChart3 },
          { name: 'Sales History', href: '/sales-history', icon: History }
        ];
      
      case 'customer':
        return [
          ...baseItems,
          { name: 'Browse Products', href: '/browse', icon: Package },
          { name: 'My Cart', href: '/cart', icon: ShoppingCart },
          { name: 'Order History', href: '/order-history', icon: History },
          { name: 'Track Orders', href: '/track-orders', icon: Truck }
        ];
      
      case 'expert':
        return [
          ...baseItems,
          { name: 'All Transactions', href: '/all-transactions', icon: Database },
          { name: 'Blockchain Logs', href: '/blockchain-logs', icon: Activity },
          { name: 'Consensus', href: '/consensus', icon: Shield },
          { name: 'Security', href: '/security', icon: Lock },
          { name: 'Fault Tolerance', href: '/fault-tolerance', icon: AlertTriangle },
          { name: 'System Health', href: '/system-health', icon: BarChart3 }
        ];
      
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems(userRole);

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Role Badge */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gray-100 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-gray-600" />
            <div>
              <p className="text-xs text-gray-500">Current Role</p>
              <p className="text-sm font-medium text-gray-900 capitalize">
                {userRole}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

