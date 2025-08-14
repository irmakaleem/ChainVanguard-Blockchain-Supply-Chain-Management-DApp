import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Package, ShoppingCart, Database } from 'lucide-react';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');

  const roles = [
    {
      id: 'supplier',
      title: 'Supplier/Ministry',
      description: 'Manage inventory, buy from vendors, sell to vendors, view full product history',
      icon: Shield,
      permissions: 'Read & Write',
      color: 'bg-blue-500'
    },
    {
      id: 'vendor',
      title: 'Vendor',
      description: 'Add products, sell to customers, view transaction history and analytics',
      icon: Package,
      permissions: 'Write (Add Products)',
      color: 'bg-green-500'
    },
    {
      id: 'customer',
      title: 'Customer',
      description: 'Browse products, add to cart, purchase items, track orders',
      icon: ShoppingCart,
      permissions: 'Read Only',
      color: 'bg-purple-500'
    },
    {
      id: 'expert',
      title: 'Blockchain Expert',
      description: 'View all transactions, manage consensus, security settings, fault tolerance',
      icon: Database,
      permissions: 'Read & Write (Admin)',
      color: 'bg-red-500'
    }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleContinue = () => {
    if (selectedRole) {
      navigate('/wallet-connection', { state: { role: selectedRole } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Blockchain Supply Chain Management
          </h1>
          <p className="text-lg text-gray-600">
            Select your role to access the appropriate dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {roles.map((role) => {
            const IconComponent = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <Card 
                key={role.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected 
                    ? 'ring-2 ring-blue-500 shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleRoleSelect(role.id)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`${role.color} p-2 rounded-lg`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{role.title}</CardTitle>
                      <div className="text-sm text-gray-500">
                        {role.permissions}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {role.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button 
            onClick={handleContinue}
            disabled={!selectedRole}
            size="lg"
            className="px-8"
          >
            Continue with {selectedRole ? roles.find(r => r.id === selectedRole)?.title : 'Selected Role'}
          </Button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            This is a demo application with mock blockchain functionality.
            <br />
            All transactions are simulated for demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;

