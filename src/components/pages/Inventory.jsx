import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Package, TrendingUp, TrendingDown, AlertTriangle, Search, RefreshCw } from 'lucide-react';

const Inventory = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryMovements, setInventoryMovements] = useState([]);

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = () => {
    // Load products
    const savedProducts = localStorage.getItem('supply_chain_products');
    if (savedProducts) {
      const allProducts = JSON.parse(savedProducts);
      const userProducts = allProducts.filter(product => product.supplierId === user?.id);
      setProducts(userProducts);
    }

    // Load or generate inventory movements
    const savedMovements = localStorage.getItem('inventory_movements');
    if (savedMovements) {
      const allMovements = JSON.parse(savedMovements);
      const userMovements = allMovements.filter(movement => movement.supplierId === user?.id);
      setInventoryMovements(userMovements);
    } else {
      generateSampleMovements();
    }
  };

  const generateSampleMovements = () => {
    const movements = [];
    const movementTypes = ['IN', 'OUT', 'ADJUSTMENT'];
    const reasons = {
      'IN': ['Purchase', 'Return', 'Production'],
      'OUT': ['Sale', 'Damage', 'Transfer'],
      'ADJUSTMENT': ['Count Correction', 'Loss', 'Found']
    };

    // Generate 20 sample movements
    for (let i = 0; i < 20; i++) {
      const type = movementTypes[Math.floor(Math.random() * movementTypes.length)];
      const movement = {
        id: Date.now() + i,
        productId: `product_${Math.floor(Math.random() * 5) + 1}`,
        productName: `Sample Product ${Math.floor(Math.random() * 5) + 1}`,
        type,
        quantity: Math.floor(Math.random() * 50) + 1,
        reason: reasons[type][Math.floor(Math.random() * reasons[type].length)],
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        supplierId: user?.id,
        reference: `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      };
      movements.push(movement);
    }

    const allMovements = movements;
    localStorage.setItem('inventory_movements', JSON.stringify(allMovements));
    setInventoryMovements(movements);
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { status: 'Out of Stock', variant: 'destructive' };
    if (quantity < 10) return { status: 'Low Stock', variant: 'destructive' };
    if (quantity < 50) return { status: 'Medium Stock', variant: 'secondary' };
    return { status: 'In Stock', variant: 'default' };
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const lowStockItems = products.filter(product => product.quantity < 10).length;
  const outOfStockItems = products.filter(product => product.quantity === 0).length;
  const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);

  const recentMovements = inventoryMovements
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Track your inventory levels and movements</p>
        </div>
        <Button onClick={loadInventoryData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Inventory Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Across {products.length} products
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Current inventory value
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Items below 10 units
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Items with 0 units
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Inventory */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Current Inventory</CardTitle>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.quantity);
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.category}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.quantity}</TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.variant}>
                          {stockStatus.status}
                        </Badge>
                      </TableCell>
                      <TableCell>${(product.price * product.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'No products found matching your search.' : 'No products in inventory.'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Movements */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Inventory Movements</CardTitle>
            <CardDescription>Latest inventory changes and adjustments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMovements.map((movement) => (
                <div key={movement.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      movement.type === 'IN' ? 'bg-green-100 text-green-600' :
                      movement.type === 'OUT' ? 'bg-red-100 text-red-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {movement.type === 'IN' ? <TrendingUp className="h-4 w-4" /> :
                       movement.type === 'OUT' ? <TrendingDown className="h-4 w-4" /> :
                       <RefreshCw className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="font-medium">{movement.productName}</div>
                      <div className="text-sm text-gray-500">{movement.reason}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${
                      movement.type === 'IN' ? 'text-green-600' :
                      movement.type === 'OUT' ? 'text-red-600' :
                      'text-blue-600'
                    }`}>
                      {movement.type === 'IN' ? '+' : movement.type === 'OUT' ? '-' : '±'}{movement.quantity}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(movement.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              {recentMovements.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No recent inventory movements.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Inventory;

