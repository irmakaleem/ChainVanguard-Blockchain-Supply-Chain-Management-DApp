import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, Plus, ArrowLeft, Shield } from 'lucide-react';

const WalletConnection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { createNewWallet } = useWallet();
  const selectedRole = location.state?.role || 'customer';
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cnic: '',
    address: '',
    email: '',
    phone: ''
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const wallet = await createNewWallet(formData);
      const userData = {
        id: wallet.id,
        role: selectedRole,
        walletAddress: wallet.address,
        name: formData.name,
        email: formData.email,
        cnic: formData.cnic,
        address: formData.address,
        phone: formData.phone,
        loginAt: new Date().toISOString()
      };
      login(userData);
      navigate(`/dashboard/${selectedRole}`);
    } catch (error) {
      console.error('Error creating wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Role Selection
          </Button>
          
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Create Your Wallet
          </h1>
          <p className="text-gray-600">
            Selected role: <span className="font-medium capitalize">{selectedRole}</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            All users must create a new wallet to ensure security and proper authentication
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Create New Wallet</CardTitle>
                <CardDescription>
                  Fill in your details to create a secure wallet as {selectedRole}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <Label htmlFor="cnic">CNIC</Label>
                <Input
                  id="cnic"
                  name="cnic"
                  type="text"
                  required
                  value={formData.cnic}
                  onChange={handleInputChange}
                  placeholder="12345-6789012-3"
                />
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+92 300 1234567"
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating Wallet...' : 'Create Wallet & Continue'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Your wallet information is encrypted and secure.
            <br />
            This is a demo with simulated blockchain functionality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletConnection;

