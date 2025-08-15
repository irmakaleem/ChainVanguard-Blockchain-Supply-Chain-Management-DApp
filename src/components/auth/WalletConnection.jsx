import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Wallet, Plus } from "lucide-react";
import { toast } from "sonner";

// --- helpers to read/write users in localStorage (keeps DataContext compatible)
const readUsers = () => {
  try {
    const raw = localStorage.getItem("supply_chain_users");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeUsers = (users) => {
  localStorage.setItem("supply_chain_users", JSON.stringify(users));
};

// simple validators (demo level)
const isEmail = (v) => /\S+@\S+\.\S+/.test(v);
const isCNIC = (v) => /^\d{5}-\d{7}-\d$/.test(v); // 12345-1234567-1
const isPhone = (v) => /^\+?\d[\d\s-]{7,}$/.test(v);

export default function WalletConnection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { connectExistingWallet, createNewWallet } = useWallet();

  // Role comes from RoleSelection via location.state.role
  // Fallbacks so the page never bounces back
  const selectedRole = useMemo(() => {
    const navRole = location.state?.role;
    if (navRole) {
      localStorage.setItem("last_selected_role", navRole);
      return navRole;
    }
    return (
      localStorage.getItem("last_selected_role") ||
      JSON.parse(localStorage.getItem("blockchain_user") || "null")?.role ||
      "customer"
    );
  }, [location.state]);

  // UI state (kept exactly like your layout)
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Create Wallet form data
  const [createData, setCreateData] = useState({
    name: "",
    cnic: "",
    address: "",
    email: "",
    phone: "",
    password: "",
  });

  // Connect Existing form data
  const [connectData, setConnectData] = useState({
    identifier: "", // CNIC or Email
    password: "",
  });

  useEffect(() => {
    // never auto-navigate away from this page
  }, []);

  // ---------- CREATE WALLET FLOW ----------
  const handleCreateWallet = () => {
    setShowCreateForm(true);
    setShowConnectForm(false);
  };

  const handleCreateChange = (e) => {
    setCreateData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateCreate = () => {
    const { name, cnic, address, email, phone, password } = createData;
    if (!name.trim() || !address.trim() || !password.trim()) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    if (!isCNIC(cnic)) {
      toast.error("Please enter a valid CNIC (12345-1234567-1).");
      return false;
    }
    if (!isEmail(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (!isPhone(phone)) {
      toast.error("Please enter a valid phone number.");
      return false;
    }
    // unique by email or cnic within same role
    const users = readUsers();
    const exists = users.find(
      (u) =>
        u.role === selectedRole &&
        (u.email?.toLowerCase() === email.toLowerCase() || u.cnic === cnic)
    );
    if (exists) {
      toast.error(
        "An account with this CNIC or email already exists for this role."
      );
      return false;
    }
    return true;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!validateCreate()) return;

    setLoading(true);
    try {
      // 1) Create the wallet via WalletContext (gives us id/address, sets balance)
      const wallet = await createNewWallet({
        name: createData.name,
        role: selectedRole,
      });

      // 2) Register user into localStorage registry (stable user.id for vendor products, etc.)
      const users = readUsers();
      const newUser = {
        id: wallet.id, // keep id stable == wallet.id (so vendor products link to this id)
        role: selectedRole,
        walletAddress: wallet.address,
        name: createData.name,
        email: createData.email,
        cnic: createData.cnic,
        address: createData.address,
        phone: createData.phone,
        password: createData.password, // demo only
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      users.push(newUser);
      writeUsers(users);

      // 3) Log user into AuthContext (used across app)
      login({
        ...newUser,
        loginAt: new Date().toISOString(),
      });

      toast.success("Wallet created and linked to your account.");
      navigate(`/dashboard/${selectedRole}`);
    } catch (err) {
      console.error("Error creating wallet:", err);
      toast.error("Failed to create wallet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- CONNECT EXISTING FLOW ----------
  const handleConnectExisting = () => {
    setShowConnectForm(true);
    setShowCreateForm(false);
  };

  const handleConnectChange = (e) => {
    setConnectData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleConnectSubmit = async (e) => {
    e.preventDefault();
    const { identifier, password } = connectData;

    if (!identifier.trim() || !password.trim()) {
      toast.error("Please enter your CNIC/Email and password.");
      return;
    }

    const users = readUsers();
    const user = users.find((u) => {
      const idMatch =
        u.cnic === identifier ||
        u.email?.toLowerCase() === identifier.toLowerCase();
      return u.role === selectedRole && idMatch;
    });

    if (!user) {
      toast.error("No account found. Please create a wallet first.");
      return;
    }
    if (user.password !== password) {
      toast.error("Invalid credentials.");
      return;
    }

    setLoading(true);
    try {
      // Initialize WalletContext connection so balance/tx work.
      // (It returns a mock wallet; we keep user's stable id from registry)
      const wallet = await connectExistingWallet();

      // Optionally sync the latest connected address back to the user record
      // (not required for your product/vendor link which uses user.id)
      user.walletAddress = wallet.address;
      user.updatedAt = new Date().toISOString();
      writeUsers(users.map((u) => (u.id === user.id ? user : u)));

      // Log in (keeps user.id stable so vendor/customer/expert data stays linked)
      login({
        ...user,
        loginAt: new Date().toISOString(),
      });

      toast.success("Wallet connected.");
      navigate(`/dashboard/${selectedRole}`);
    } catch (err) {
      console.error("Wallet connection failed:", err);
      toast.error("Failed to connect wallet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- UI (unchanged layout) ----------
  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateForm(false)}
                  disabled={loading}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle>Create New Wallet</CardTitle>
                  <CardDescription>
                    Fill in your details to create a new wallet as{" "}
                    {selectedRole}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={createData.name}
                    onChange={handleCreateChange}
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
                    value={createData.cnic}
                    onChange={handleCreateChange}
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
                    value={createData.address}
                    onChange={handleCreateChange}
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
                    value={createData.email}
                    onChange={handleCreateChange}
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
                    value={createData.phone}
                    onChange={handleCreateChange}
                    placeholder="+92 300 1234567"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={createData.password}
                    onChange={handleCreateChange}
                    placeholder="Choose a strong password"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating..." : "Create Wallet & Continue"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showConnectForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConnectForm(false)}
                  disabled={loading}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle>Connect Existing Wallet</CardTitle>
                  <CardDescription>
                    Enter your CNIC or Email and password to continue as{" "}
                    {selectedRole}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleConnectSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="identifier">CNIC or Email</Label>
                  <Input
                    id="identifier"
                    name="identifier"
                    type="text"
                    required
                    value={connectData.identifier}
                    onChange={handleConnectChange}
                    placeholder="12345-6789012-3 or your@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="cx_password">Password</Label>
                  <Input
                    id="cx_password"
                    name="password"
                    type="password"
                    required
                    value={connectData.password}
                    onChange={handleConnectChange}
                    placeholder="Your password"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Connecting..." : "Connect Wallet & Continue"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Default (your original UI unchanged)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Role Selection
          </Button>

          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Wallet className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Connect Your Wallet
          </h1>
          <p className="text-gray-600">
            Selected role:{" "}
            <span className="font-medium capitalize">{selectedRole}</span>
          </p>
        </div>

        <div className="space-y-4">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleConnectExisting}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Wallet className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    Connect Existing Wallet
                  </CardTitle>
                  <CardDescription>
                    Use your existing blockchain wallet
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Connect with MetaMask, WalletConnect, or other supported wallets
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleCreateWallet}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Create New Wallet</CardTitle>
                  <CardDescription>Set up a new wallet account</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Create a new wallet with your personal information
              </p>
            </CardContent>
          </Card>
        </div>

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
}
