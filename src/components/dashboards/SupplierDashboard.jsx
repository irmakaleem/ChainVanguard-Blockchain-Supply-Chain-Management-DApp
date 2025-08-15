import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Truck,
  Users,
  Database,
  ArrowUpDown,
  Plus,
  X,
  Edit,
} from "lucide-react";

const SupplierDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalInventory: 0,
      vendorPartners: 0,
      totalTransactions: 0,
      supplyValue: 0,
    },
    recentTransactions: [],
    vendorPerformance: [],
    inventory: [],
  });

  const [showNewShipmentModal, setShowNewShipmentModal] = useState(false);
  const [showAddInventoryModal, setShowAddInventoryModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);

  // Calculate stats dynamically from actual data
  const calculateStats = (data) => {
    const totalInventory = data.inventory.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const vendorPartners = data.vendorPerformance.length;
    const totalTransactions = data.recentTransactions.length;
    const supplyValue = data.inventory.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    return {
      totalInventory,
      vendorPartners,
      totalTransactions,
      supplyValue,
    };
  };

  // Update stats whenever data changes
  useEffect(() => {
    const newStats = calculateStats(dashboardData);
    if (JSON.stringify(newStats) !== JSON.stringify(dashboardData.stats)) {
      setDashboardData((prev) => ({
        ...prev,
        stats: newStats,
      }));
    }
  }, [
    dashboardData.inventory,
    dashboardData.vendorPerformance,
    dashboardData.recentTransactions,
  ]);

  // Initialize data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("supplier_dashboard");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setDashboardData((prev) => ({ ...prev, ...parsedData }));
      } catch (error) {
        console.error("Error loading supplier dashboard data:", error);
      }
    } else {
      initializeDefaultData();
    }
  }, []);

  // Save data to localStorage whenever dashboardData changes
  useEffect(() => {
    localStorage.setItem("supplier_dashboard", JSON.stringify(dashboardData));
  }, [dashboardData]);

  const initializeDefaultData = () => {
    const defaultTransactions = [
      {
        id: "tx-1",
        type: "sale",
        vendor: "Vendor ABC",
        product: "Electronics",
        units: 50,
        amount: 15000,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "tx-2",
        type: "purchase",
        vendor: "Ministry",
        product: "Raw Materials",
        units: 200,
        amount: -8500,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "tx-3",
        type: "sale",
        vendor: "TechVendor Pro",
        product: "Components",
        units: 75,
        amount: 12000,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    const defaultVendors = [
      {
        id: "v-1",
        name: "TechVendor Pro",
        category: "Electronics",
        monthlyRevenue: 25400,
        growth: 12,
        totalOrders: 45,
      },
      {
        id: "v-2",
        name: "Fashion Hub",
        category: "Textiles",
        monthlyRevenue: 18200,
        growth: 8,
        totalOrders: 32,
      },
      {
        id: "v-3",
        name: "Home Essentials",
        category: "Home & Garden",
        monthlyRevenue: 15600,
        growth: 5,
        totalOrders: 28,
      },
    ];

    const defaultInventory = [
      {
        id: "inv-1",
        name: "Electronic Components",
        category: "Electronics",
        quantity: 350,
        unitPrice: 25,
        supplier: "Ministry Supply Co.",
      },
      {
        id: "inv-2",
        name: "Textile Materials",
        category: "Textiles",
        quantity: 500,
        unitPrice: 15,
        supplier: "Cotton Industries",
      },
      {
        id: "inv-3",
        name: "Raw Plastics",
        category: "Manufacturing",
        quantity: 200,
        unitPrice: 30,
        supplier: "Polymer Solutions",
      },
    ];

    setDashboardData((prev) => ({
      ...prev,
      recentTransactions: defaultTransactions,
      vendorPerformance: defaultVendors,
      inventory: defaultInventory,
    }));
  };

  const addNewShipment = (shipmentData) => {
    const newTransaction = {
      id: `tx-${Date.now()}`,
      type: "sale",
      vendor: shipmentData.vendor,
      product: shipmentData.product,
      units: parseInt(shipmentData.units),
      amount: parseFloat(shipmentData.amount),
      timestamp: new Date().toISOString(),
    };

    // Update inventory quantity
    const updatedInventory = dashboardData.inventory.map((item) => {
      if (
        item.name.toLowerCase().includes(shipmentData.product.toLowerCase())
      ) {
        return {
          ...item,
          quantity: Math.max(0, item.quantity - parseInt(shipmentData.units)),
        };
      }
      return item;
    });

    setDashboardData((prev) => ({
      ...prev,
      recentTransactions: [
        newTransaction,
        ...prev.recentTransactions.slice(0, 9),
      ],
      inventory: updatedInventory,
    }));

    setShowNewShipmentModal(false);
  };

  const addInventory = (inventoryData) => {
    const newInventoryItem = {
      id: `inv-${Date.now()}`,
      name: inventoryData.name,
      category: inventoryData.category,
      quantity: parseInt(inventoryData.quantity),
      unitPrice: parseFloat(inventoryData.unitPrice),
      supplier: inventoryData.supplier,
    };

    const newTransaction = {
      id: `tx-${Date.now()}`,
      type: "purchase",
      vendor: inventoryData.supplier,
      product: inventoryData.name,
      units: parseInt(inventoryData.quantity),
      amount: -(
        parseInt(inventoryData.quantity) * parseFloat(inventoryData.unitPrice)
      ),
      timestamp: new Date().toISOString(),
    };

    // Check if item already exists, if so, add to quantity
    const existingItemIndex = dashboardData.inventory.findIndex(
      (item) => item.name.toLowerCase() === inventoryData.name.toLowerCase()
    );

    let updatedInventory;
    if (existingItemIndex !== -1) {
      updatedInventory = dashboardData.inventory.map((item, index) => {
        if (index === existingItemIndex) {
          return {
            ...item,
            quantity: item.quantity + parseInt(inventoryData.quantity),
          };
        }
        return item;
      });
    } else {
      updatedInventory = [...dashboardData.inventory, newInventoryItem];
    }

    const totalInventoryCount = updatedInventory.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const totalInventoryValue = updatedInventory.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    setDashboardData((prev) => ({
      ...prev,
      recentTransactions: [
        newTransaction,
        ...prev.recentTransactions.slice(0, 9),
      ],
      inventory: updatedInventory,
    }));

    setShowAddInventoryModal(false);
  };

  const addVendor = (vendorData) => {
    const newVendor = {
      id: `v-${Date.now()}`,
      name: vendorData.name,
      category: vendorData.category,
      monthlyRevenue: 0,
      growth: 0,
      totalOrders: 0,
    };

    setDashboardData((prev) => ({
      ...prev,
      vendorPerformance: [...prev.vendorPerformance, newVendor],
    }));

    setShowVendorModal(false);
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const stats = [
    {
      title: "Total Inventory",
      value: dashboardData.stats.totalInventory.toLocaleString(),
      description: "Products in stock",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Vendor Partners",
      value: dashboardData.stats.vendorPartners.toString(),
      description: "Active vendor relationships",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Transactions",
      value: dashboardData.stats.totalTransactions.toLocaleString(),
      description: "Total transactions",
      icon: ArrowUpDown,
      color: "text-purple-600",
    },
    {
      title: "Supply Value",
      value: formatCurrency(dashboardData.stats.supplyValue),
      description: "Total inventory value",
      icon: Database,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Supplier Dashboard
          </h1>
          <p className="text-gray-600">
            Manage inventory and vendor relationships
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowNewShipmentModal(true)}
          >
            <Truck className="h-4 w-4 mr-2" />
            New Shipment
          </Button>
          <Button onClick={() => setShowAddInventoryModal(true)}>
            <Package className="h-4 w-4 mr-2" />
            Add Inventory
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (confirm("Clear all data? This cannot be undone.")) {
                localStorage.removeItem("supplier_dashboard");
                setDashboardData({
                  stats: {
                    totalInventory: 0,
                    vendorPartners: 0,
                    totalTransactions: 0,
                    supplyValue: 0,
                  },
                  recentTransactions: [],
                  vendorPerformance: [],
                  inventory: [],
                });
              }
            }}
          >
            Clear Data
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
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest supply chain activities</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {transaction.type === "sale"
                        ? `Sold to ${transaction.vendor}`
                        : `Bought from ${transaction.vendor}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.product} - {transaction.units} units
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        transaction.amount > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTimeAgo(transaction.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Vendor Performance</CardTitle>
              <CardDescription>Top performing vendor partners</CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowVendorModal(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.vendorPerformance.map((vendor) => (
                <div
                  key={vendor.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{vendor.name}</p>
                      <p className="text-sm text-gray-500">{vendor.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(vendor.monthlyRevenue)}
                    </p>
                    <p
                      className={`text-xs ${
                        vendor.growth > 0 ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {vendor.growth > 0
                        ? `+${vendor.growth}%`
                        : `${vendor.growth}%`}{" "}
                      this month
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Inventory */}
      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
          <CardDescription>Overview of available stock</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dashboardData.inventory.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{item.name}</h4>
                  <Badge variant="outline">{item.category}</Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    Quantity:{" "}
                    <span className="font-medium">{item.quantity}</span>
                  </p>
                  <p>
                    Unit Price:{" "}
                    <span className="font-medium">
                      {formatCurrency(item.unitPrice)}
                    </span>
                  </p>
                  <p>
                    Total Value:{" "}
                    <span className="font-medium">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </span>
                  </p>
                  <p className="text-xs">Supplier: {item.supplier}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showNewShipmentModal && (
        <NewShipmentModal
          onClose={() => setShowNewShipmentModal(false)}
          onAdd={addNewShipment}
          inventory={dashboardData.inventory}
          vendors={dashboardData.vendorPerformance}
        />
      )}

      {showAddInventoryModal && (
        <AddInventoryModal
          onClose={() => setShowAddInventoryModal(false)}
          onAdd={addInventory}
        />
      )}

      {showVendorModal && (
        <AddVendorModal
          onClose={() => setShowVendorModal(false)}
          onAdd={addVendor}
        />
      )}
    </div>
  );
};

// Modal Components
const NewShipmentModal = ({ onClose, onAdd, inventory, vendors }) => {
  const [formData, setFormData] = useState({
    vendor: "",
    product: "",
    units: "",
    amount: "",
  });

  const handleSubmit = () => {
    if (
      formData.vendor &&
      formData.product &&
      formData.units &&
      formData.amount
    ) {
      onAdd(formData);
    }
  };

  const handleProductChange = (product) => {
    const inventoryItem = inventory.find((item) => item.name === product);
    if (inventoryItem) {
      setFormData((prev) => ({
        ...prev,
        product,
        amount: (parseInt(prev.units) || 0) * inventoryItem.unitPrice * 1.2, // 20% markup
      }));
    } else {
      setFormData((prev) => ({ ...prev, product }));
    }
  };

  const handleUnitsChange = (units) => {
    const inventoryItem = inventory.find(
      (item) => item.name === formData.product
    );
    if (inventoryItem && units) {
      setFormData((prev) => ({
        ...prev,
        units,
        amount: parseInt(units) * inventoryItem.unitPrice * 1.2, // 20% markup
      }));
    } else {
      setFormData((prev) => ({ ...prev, units }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96 max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Create New Shipment
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Vendor</Label>
              <select
                className="w-full p-2 border rounded mt-1"
                value={formData.vendor}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, vendor: e.target.value }))
                }
              >
                <option value="">Select Vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.name}>
                    {vendor.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Product</Label>
              <select
                className="w-full p-2 border rounded mt-1"
                value={formData.product}
                onChange={(e) => handleProductChange(e.target.value)}
              >
                <option value="">Select Product</option>
                {inventory.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name} (Available: {item.quantity})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Units to Ship</Label>
              <Input
                type="number"
                value={formData.units}
                onChange={(e) => handleUnitsChange(e.target.value)}
                className="mt-1"
                min="1"
              />
            </div>

            <div>
              <Label>Sale Amount ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
                className="mt-1"
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button onClick={handleSubmit} className="flex-1">
                Create Shipment
              </Button>
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AddInventoryModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    unitPrice: "",
    supplier: "",
  });

  const handleSubmit = () => {
    if (Object.values(formData).every((value) => value)) {
      onAdd(formData);
    }
  };

  const categories = [
    "Electronics",
    "Textiles",
    "Manufacturing",
    "Home & Garden",
    "Food & Beverage",
    "Other",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Add New Inventory
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Product Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label>Category</Label>
              <select
                className="w-full p-2 border rounded mt-1"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, quantity: e.target.value }))
                }
                className="mt-1"
                min="1"
              />
            </div>

            <div>
              <Label>Unit Price ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    unitPrice: e.target.value,
                  }))
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label>Supplier</Label>
              <Input
                value={formData.supplier}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, supplier: e.target.value }))
                }
                className="mt-1"
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button onClick={handleSubmit} className="flex-1">
                Add Inventory
              </Button>
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AddVendorModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
  });

  const handleSubmit = () => {
    if (formData.name && formData.category) {
      onAdd(formData);
    }
  };

  const categories = [
    "Electronics",
    "Textiles",
    "Manufacturing",
    "Home & Garden",
    "Food & Beverage",
    "Other",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Add New Vendor
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Vendor Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label>Category</Label>
              <select
                className="w-full p-2 border rounded mt-1"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button onClick={handleSubmit} className="flex-1">
                Add Vendor
              </Button>
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierDashboard;
