import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // Import useAuth
import { AuthProvider } from "./context/AuthContext";
import { WalletProvider } from "./context/WalletContext";
import { DataProvider } from "./context/DataContext";
import Layout from "./components/common/Layout";
import RoleSelection from "./components/auth/RoleSelection";
import WalletConnection from "./components/auth/WalletConnection";
import SupplierDashboard from "./components/dashboards/SupplierDashboard";
import VendorDashboard from "./components/dashboards/VendorDashboard";
import CustomerDashboard from "./components/dashboards/CustomerDashboard";
import BlockchainExpertDashboard from "./components/dashboards/BlockchainExpertDashboard";
import AddProduct from "./components/pages/AddProduct";
import MyProducts from "./components/pages/MyProducts";
import Analytics from "./components/pages/Analytics";
import TrackOrders from "./components/pages/TrackOrders";
import Products from "./components/pages/Products";
import Inventory from "./components/pages/Inventory";
import BrowseProducts from "./components/pages/BrowseProducts";
import Cart from "./components/pages/Cart";
import "./App.css";

// Placeholder components for additional routes
const PlaceholderPage = ({ title, description }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
      <p className="text-sm text-gray-500 mt-4">
        This page is under development
      </p>
    </div>
  </div>
);

// Component to handle role-based dashboard redirect
const DashboardRedirect = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // Redirect based on user role
  switch (user.role?.toLowerCase()) {
    case "supplier":
      return <Navigate to="/dashboard/supplier" replace />;
    case "vendor":
      return <Navigate to="/dashboard/vendor" replace />;
    case "customer":
      return <Navigate to="/dashboard/customer" replace />;
    case "expert":
    case "blockchain-expert":
      return <Navigate to="/dashboard/expert" replace />;
    default:
      return <Navigate to="/dashboard/vendor" replace />;
  }
};

function AppContent() {
  const { user, isAuthenticated } = useAuth();

  return (
    <WalletProvider>
      <DataProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Authentication Routes */}
              <Route path="/" element={<RoleSelection />} />
              <Route path="/wallet-connection" element={<WalletConnection />} />

              {/* Dashboard Routes with Layout */}
              <Route path="/dashboard" element={<Layout />}>
                <Route index element={<DashboardRedirect />} />
                <Route path="supplier" element={<SupplierDashboard />} />
                <Route path="vendor" element={<VendorDashboard />} />
                <Route path="customer" element={<CustomerDashboard />} />
                <Route path="expert" element={<BlockchainExpertDashboard />} />
              </Route>

              {/* Supplier Routes */}
              <Route path="/products" element={<Layout />}>
                <Route index element={<Products />} />
              </Route>
              <Route path="/inventory" element={<Layout />}>
                <Route index element={<Inventory />} />
              </Route>
              <Route path="/transactions" element={<Layout />}>
                <Route
                  index
                  element={
                    <PlaceholderPage
                      title="Transactions"
                      description="View all your transactions"
                    />
                  }
                />
              </Route>
              <Route path="/vendors" element={<Layout />}>
                <Route
                  index
                  element={
                    <PlaceholderPage
                      title="Vendors"
                      description="Manage vendor relationships"
                    />
                  }
                />
              </Route>

              {/* Vendor Routes */}
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/my-products" element={<MyProducts />} />
              <Route path="/orders" element={<Layout />}>
                <Route
                  index
                  element={
                    <PlaceholderPage
                      title="Orders"
                      description="Manage customer orders"
                    />
                  }
                />
              </Route>
              <Route path="/customers" element={<Layout />}>
                <Route
                  index
                  element={
                    <PlaceholderPage
                      title="Customers"
                      description="View your customer base"
                    />
                  }
                />
              </Route>
              <Route path="/sales-history" element={<Layout />}>
                <Route
                  index
                  element={
                    <PlaceholderPage
                      title="Sales History"
                      description="Track your sales performance"
                    />
                  }
                />
              </Route>
              <Route path="/analytics" element={<Analytics />} />

              {/* Customer Routes */}
              <Route path="/browse" element={<Layout />}>
                <Route index element={<BrowseProducts />} />
              </Route>
              <Route path="/cart" element={<Layout />}>
                <Route index element={<Cart />} />
              </Route>
              <Route path="/purchase-history" element={<Layout />}>
                <Route
                  index
                  element={
                    <PlaceholderPage
                      title="Purchase History"
                      description="View your past purchases"
                    />
                  }
                />
              </Route>
              <Route path="/track-orders" element={<TrackOrders />} />

              {/* Blockchain Expert Routes */}
              <Route path="/all-transactions" element={<Layout />}>
                <Route
                  index
                  element={
                    <PlaceholderPage
                      title="All Transactions"
                      description="Monitor all blockchain transactions"
                    />
                  }
                />
              </Route>
              <Route path="/blockchain-logs" element={<Layout />}>
                <Route
                  index
                  element={
                    <PlaceholderPage
                      title="Blockchain Logs"
                      description="View detailed system logs"
                    />
                  }
                />
              </Route>
              <Route path="/consensus" element={<Layout />}>
                <Route
                  index
                  element={
                    <PlaceholderPage
                      title="Consensus Management"
                      description="Configure consensus protocol"
                    />
                  }
                />
              </Route>
              <Route path="/security" element={<Layout />}>
                <Route
                  index
                  element={
                    <PlaceholderPage
                      title="Security Settings"
                      description="Manage privacy and security"
                    />
                  }
                />
              </Route>
              <Route path="/fault-tolerance" element={<Layout />}>
                <Route
                  index
                  element={
                    <PlaceholderPage
                      title="Fault Tolerance"
                      description="Monitor system resilience"
                    />
                  }
                />
              </Route>
              <Route path="/system-health" element={<Layout />}>
                <Route
                  index
                  element={
                    <PlaceholderPage
                      title="System Health"
                      description="Overall system performance metrics"
                    />
                  }
                />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </DataProvider>
    </WalletProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
