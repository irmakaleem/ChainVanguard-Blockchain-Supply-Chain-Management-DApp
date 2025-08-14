import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import ProductList from '../products/ProductList';
import ProductForm from '../products/ProductForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, ArrowLeft } from 'lucide-react';

const MyProducts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getProductsByVendor, updateProduct } = useData();
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Get vendor's products
  const vendorProducts = getProductsByVendor(user?.id || 'vendor1');

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowEditDialog(true);
  };

  const handleDelete = (product) => {
    // In a real app, you would show a confirmation dialog
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      // Implement delete functionality
      console.log('Deleting product:', product.id);
    }
  };

  const handleView = (product) => {
    // Navigate to product details page or show modal
    console.log('Viewing product:', product);
  };

  const handleSaveEdit = () => {
    setShowEditDialog(false);
    setEditingProduct(null);
  };

  const handleCancelEdit = () => {
    setShowEditDialog(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard/vendor')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
              <p className="text-gray-600 mt-2">
                Manage your product inventory and track performance.
              </p>
            </div>
            <Button onClick={() => navigate('/add-product')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Products List */}
        <ProductList
          products={vendorProducts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          title="Your Products"
          description={`You have ${vendorProducts.length} products in your inventory`}
        />

        {/* Edit Product Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            {editingProduct && (
              <ProductForm
                product={editingProduct}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MyProducts;

