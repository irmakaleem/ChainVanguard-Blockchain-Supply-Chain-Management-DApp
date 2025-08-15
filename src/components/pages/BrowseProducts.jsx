import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ShoppingCart,
  Search,
  Filter,
  Package,
  Star,
  Eye,
  Image,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

const BrowseProducts = () => {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, selectedCategory, sortBy]);

  const loadProducts = () => {
    const savedProducts = localStorage.getItem("supply_chain_products");
    if (savedProducts) {
      const allProducts = JSON.parse(savedProducts);
      // Only show products with quantity > 0
      const availableProducts = allProducts.filter(
        (product) => product.quantity > 0
      );
      setProducts(availableProducts);
    }
  };

  const loadCart = () => {
    const savedCart = localStorage.getItem(`cart_${user?.id}`);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCart = (updatedCart) => {
    localStorage.setItem(`cart_${user?.id}`, JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const filterAndSortProducts = () => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    let updatedCart;

    if (existingItem) {
      if (existingItem.quantity >= product.quantity) {
        toast.error("Cannot add more items. Stock limit reached.");
        return;
      }
      updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    saveCart(updatedCart);
    toast.success(`${product.name} added to cart!`);
  };

  const getCartQuantity = (productId) => {
    const cartItem = cart.find((item) => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const openPreview = (product) => {
    setSelectedProduct(product);
    setIsPreviewOpen(true);
  };

  // Generate placeholder image based on product category
  const getProductImage = (product) => {
    if (product.image) {
      return product.image;
    }

    // Generate a placeholder based on category
    const colors = {
      electronics: "bg-blue-500",
      clothing: "bg-purple-500",
      food: "bg-green-500",
      books: "bg-orange-500",
      home: "bg-red-500",
      sports: "bg-indigo-500",
      beauty: "bg-pink-500",
      automotive: "bg-gray-500",
    };

    const categoryKey = product.category.toLowerCase();
    const colorClass = colors[categoryKey] || "bg-gray-400";

    return { placeholder: true, colorClass };
  };

  const categories = [...new Set(products.map((product) => product.category))];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Browse Products</h1>
          <p className="text-gray-600">
            Discover products from various vendors
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            <ShoppingCart className="h-4 w-4 mr-1" />
            {cart.reduce((sum, item) => sum + item.quantity, 0)} items
          </Badge>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-500 flex items-center">
              <Package className="h-4 w-4 mr-1" />
              {filteredProducts.length} products found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const cartQuantity = getCartQuantity(product.id);
          const canAddMore = cartQuantity < product.quantity;
          const productImage = getProductImage(product);

          return (
            <Card
              key={product.id}
              className="hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gray-100">
                {productImage.placeholder ? (
                  <div
                    className={`w-full h-full ${productImage.colorClass} flex items-center justify-center`}
                  >
                    <Image className="h-12 w-12 text-white/70" />
                  </div>
                ) : (
                  <img
                    src={productImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <button
                  onClick={() => openPreview(product)}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                >
                  <Eye className="h-4 w-4 text-gray-700" />
                </button>
              </div>

              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm ml-1">4.5</span>
                  </div>
                </div>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${product.price.toFixed(2)}
                  </div>
                  <Badge
                    variant={product.quantity > 10 ? "default" : "destructive"}
                  >
                    {product.quantity} in stock
                  </Badge>
                </div>

                <div className="text-sm text-gray-600">
                  <div>Vendor: {product.supplier}</div>
                  <div>
                    Added: {new Date(product.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {cartQuantity > 0 && (
                  <div className="bg-blue-50 p-2 rounded-lg text-center">
                    <span className="text-sm text-blue-600">
                      {cartQuantity} in cart
                    </span>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    className="flex-1"
                    onClick={() => addToCart(product)}
                    disabled={!canAddMore}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {!canAddMore ? "Max Reached" : "Add to Cart"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => openPreview(product)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filters."
                : "No products are currently available."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Product Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {(() => {
                    const productImage = getProductImage(selectedProduct);
                    return productImage.placeholder ? (
                      <div
                        className={`w-full h-full ${productImage.colorClass} flex items-center justify-center`}
                      >
                        <Image className="h-24 w-24 text-white/70" />
                      </div>
                    ) : (
                      <img
                        src={productImage}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    );
                  })()}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">
                      {selectedProduct.category}
                    </Badge>
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm ml-1">4.5</span>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-gray-600">{selectedProduct.description}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-green-600">
                    ${selectedProduct.price.toFixed(2)}
                  </div>
                  <Badge
                    variant={
                      selectedProduct.quantity > 10 ? "default" : "destructive"
                    }
                  >
                    {selectedProduct.quantity} in stock
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Vendor:</span>{" "}
                    {selectedProduct.supplier}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Added:</span>{" "}
                    {new Date(selectedProduct.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Product ID:</span>{" "}
                    {selectedProduct.id}
                  </div>
                </div>

                {(() => {
                  const cartQuantity = getCartQuantity(selectedProduct.id);
                  const canAddMore = cartQuantity < selectedProduct.quantity;

                  return (
                    <div className="space-y-3">
                      {cartQuantity > 0 && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <span className="text-blue-600 font-medium">
                            {cartQuantity} items in cart
                          </span>
                        </div>
                      )}

                      <Button
                        className="w-full"
                        onClick={() => {
                          addToCart(selectedProduct);
                          setIsPreviewOpen(false);
                        }}
                        disabled={!canAddMore}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {!canAddMore
                          ? "Maximum Quantity in Cart"
                          : "Add to Cart"}
                      </Button>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrowseProducts;
