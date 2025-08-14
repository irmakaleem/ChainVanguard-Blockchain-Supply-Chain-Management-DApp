import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Database,
  Shield,
  Activity,
  Lock,
  AlertTriangle,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

const BlockchainExpertDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalTransactions: 15847,
      networkHealth: 99.8,
      securityScore: 95,
      activeNodes: 24,
    },
    recentTransactions: [],
    systemAlerts: [],
    consensusSettings: {
      algorithm: "Proof of Authority",
      blockTime: 15,
    },
    securitySettings: {
      encryptionLevel: "AES-256",
      accessControl: "Role-Based",
    },
    faultTolerance: {
      redundancyLevel: "3x Replication",
      recoveryTime: "&lt; 30 seconds",
    },
  });

  const [showConsensusModal, setShowConsensusModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showFaultModal, setShowFaultModal] = useState(false);
  const [showSystemSettings, setShowSystemSettings] = useState(false);

  // Initialize data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("blockchain_expert_dashboard");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setDashboardData((prev) => ({ ...prev, ...parsedData }));
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    } else {
      // Initialize with default data
      initializeDefaultData();
    }
  }, []);

  // Save data to localStorage whenever dashboardData changes
  useEffect(() => {
    localStorage.setItem(
      "blockchain_expert_dashboard",
      JSON.stringify(dashboardData)
    );
  }, [dashboardData]);

  const initializeDefaultData = () => {
    const defaultTransactions = [
      {
        id: "block-15847",
        blockNumber: 15847,
        type: "Vendor → Customer",
        status: "Confirmed",
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      },
      {
        id: "block-15846",
        blockNumber: 15846,
        type: "Supplier → Vendor",
        status: "Confirmed",
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
      {
        id: "block-15845",
        blockNumber: 15845,
        type: "Ministry → Supplier",
        status: "Pending",
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      },
    ];

    const defaultAlerts = [
      {
        id: "alert-1",
        type: "warning",
        title: "High Transaction Volume",
        message: "Network experiencing 20% above normal load",
        timestamp: new Date().toISOString(),
      },
      {
        id: "alert-2",
        type: "success",
        title: "Security Update Applied",
        message: "Consensus protocol updated successfully",
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        id: "alert-3",
        type: "info",
        title: "Node Sync Complete",
        message: "All nodes synchronized with latest block",
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      },
    ];

    setDashboardData((prev) => ({
      ...prev,
      recentTransactions: defaultTransactions,
      systemAlerts: defaultAlerts,
    }));
  };

  const addNewTransaction = () => {
    const newTransaction = {
      id: `block-${dashboardData.stats.totalTransactions + 1}`,
      blockNumber: dashboardData.stats.totalTransactions + 1,
      type: ["Vendor → Customer", "Supplier → Vendor", "Ministry → Supplier"][
        Math.floor(Math.random() * 3)
      ],
      status: Math.random() > 0.8 ? "Pending" : "Confirmed",
      timestamp: new Date().toISOString(),
    };

    setDashboardData((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        totalTransactions: prev.stats.totalTransactions + 1,
      },
      recentTransactions: [
        newTransaction,
        ...prev.recentTransactions.slice(0, 4),
      ],
    }));
  };

  const addSystemAlert = (type, title, message) => {
    const newAlert = {
      id: `alert-${Date.now()}`,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
    };

    setDashboardData((prev) => ({
      ...prev,
      systemAlerts: [newAlert, ...prev.systemAlerts.slice(0, 4)],
    }));
  };

  const updateConsensusSettings = (newSettings) => {
    setDashboardData((prev) => ({
      ...prev,
      consensusSettings: { ...prev.consensusSettings, ...newSettings },
    }));
    addSystemAlert(
      "info",
      "Consensus Updated",
      "Consensus settings have been modified"
    );
    setShowConsensusModal(false);
  };

  const updateSecuritySettings = (newSettings) => {
    setDashboardData((prev) => ({
      ...prev,
      securitySettings: { ...prev.securitySettings, ...newSettings },
    }));
    addSystemAlert(
      "success",
      "Security Updated",
      "Security settings have been modified"
    );
    setShowSecurityModal(false);
  };

  const updateFaultTolerance = (newSettings) => {
    setDashboardData((prev) => ({
      ...prev,
      faultTolerance: { ...prev.faultTolerance, ...newSettings },
    }));
    addSystemAlert(
      "info",
      "Fault Tolerance Updated",
      "Fault tolerance settings have been modified"
    );
    setShowFaultModal(false);
  };

  const generateHealthReport = () => {
    const newHealth = Math.max(95, Math.random() * 100);
    const newSecurity = Math.max(90, Math.random() * 100);

    setDashboardData((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        networkHealth: parseFloat(newHealth.toFixed(1)),
        securityScore: Math.floor(newSecurity),
      },
    }));

    addSystemAlert(
      "info",
      "Health Report Generated",
      "System health metrics have been refreshed"
    );
  };

  const stats = [
    {
      title: "Total Transactions",
      value: dashboardData.stats.totalTransactions.toLocaleString(),
      description: "All blockchain transactions",
      icon: Database,
      color: "text-blue-600",
    },
    {
      title: "Network Health",
      value: `${dashboardData.stats.networkHealth}%`,
      description: "System uptime",
      icon: Activity,
      color: "text-green-600",
    },
    {
      title: "Security Score",
      value: `${dashboardData.stats.securityScore}/100`,
      description: "Security assessment",
      icon: Shield,
      color: "text-purple-600",
    },
    {
      title: "Active Nodes",
      value: dashboardData.stats.activeNodes.toString(),
      description: "Consensus participants",
      icon: Lock,
      color: "text-orange-600",
    },
  ];

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const getStatusBadge = (status) => {
    const variants = {
      Confirmed: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Failed: "bg-red-100 text-red-800",
    };
    return variants[status] || variants.Pending;
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-600 mt-0.5" />;
      default:
        return <Activity className="h-5 w-5 text-blue-600 mt-0.5" />;
    }
  };

  const getAlertStyle = (type) => {
    switch (type) {
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Blockchain Expert Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor and manage blockchain infrastructure
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowSystemSettings(true)}>
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
          <Button onClick={generateHealthReport}>
            <Shield className="h-4 w-4 mr-2" />
            Generate Report
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
              <CardDescription>
                Latest blockchain transactions across all users
              </CardDescription>
            </div>
            <Button size="sm" onClick={addNewTransaction}>
              Add Transaction
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      Block #{transaction.blockNumber}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.type}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs px-2 py-1 rounded ${getStatusBadge(
                        transaction.status
                      )}`}
                    >
                      {transaction.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimeAgo(transaction.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>
              Security and performance notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.systemAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg border ${getAlertStyle(
                    alert.type
                  )}`}
                >
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm opacity-80">{alert.message}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {formatTimeAgo(alert.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Consensus Control</CardTitle>
            <CardDescription>Manage blockchain consensus</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Consensus Algorithm</span>
              <span className="text-sm font-medium">
                {dashboardData.consensusSettings.algorithm}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Block Time</span>
              <span className="text-sm font-medium">
                {dashboardData.consensusSettings.blockTime} seconds
              </span>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowConsensusModal(true)}
            >
              Configure Consensus
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Privacy and security controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Encryption Level</span>
              <span className="text-sm font-medium">
                {dashboardData.securitySettings.encryptionLevel}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Access Control</span>
              <span className="text-sm font-medium">
                {dashboardData.securitySettings.accessControl}
              </span>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowSecurityModal(true)}
            >
              Security Panel
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fault Tolerance</CardTitle>
            <CardDescription>System resilience monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Redundancy Level</span>
              <span className="text-sm font-medium">
                {dashboardData.faultTolerance.redundancyLevel}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Recovery Time</span>
              <span className="text-sm font-medium">
                {dashboardData.faultTolerance.recoveryTime}
              </span>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowFaultModal(true)}
            >
              Fault Monitor
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {showConsensusModal && (
        <ConsensusModal
          onClose={() => setShowConsensusModal(false)}
          onUpdate={updateConsensusSettings}
          currentSettings={dashboardData.consensusSettings}
        />
      )}
      {showSecurityModal && (
        <SecurityModal
          onClose={() => setShowSecurityModal(false)}
          onUpdate={updateSecuritySettings}
          currentSettings={dashboardData.securitySettings}
        />
      )}
      {showFaultModal && (
        <FaultModal
          onClose={() => setShowFaultModal(false)}
          onUpdate={updateFaultTolerance}
          currentSettings={dashboardData.faultTolerance}
        />
      )}
      {showSystemSettings && (
        <SystemSettingsModal
          onClose={() => setShowSystemSettings(false)}
          dashboardData={dashboardData}
          setDashboardData={setDashboardData}
        />
      )}
    </div>
  );
};

// Modal Components
const ConsensusModal = ({ onClose, onUpdate, currentSettings }) => {
  const [algorithm, setAlgorithm] = useState(currentSettings.algorithm);
  const [blockTime, setBlockTime] = useState(currentSettings.blockTime);

  const handleUpdate = () => {
    onUpdate({ algorithm, blockTime: parseInt(blockTime) });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Configure Consensus</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Consensus Algorithm</Label>
            <select
              className="w-full p-2 border rounded mt-1"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
            >
              <option>Proof of Authority</option>
              <option>Proof of Stake</option>
              <option>Proof of Work</option>
            </select>
          </div>
          <div>
            <Label>Block Time (seconds)</Label>
            <Input
              type="number"
              value={blockTime}
              onChange={(e) => setBlockTime(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex space-x-2 pt-4">
            <Button onClick={handleUpdate} className="flex-1">
              Update
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SecurityModal = ({ onClose, onUpdate, currentSettings }) => {
  const [encryptionLevel, setEncryptionLevel] = useState(
    currentSettings.encryptionLevel
  );
  const [accessControl, setAccessControl] = useState(
    currentSettings.accessControl
  );

  const handleUpdate = () => {
    onUpdate({ encryptionLevel, accessControl });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Encryption Level</Label>
            <select
              className="w-full p-2 border rounded mt-1"
              value={encryptionLevel}
              onChange={(e) => setEncryptionLevel(e.target.value)}
            >
              <option>AES-128</option>
              <option>AES-256</option>
              <option>AES-512</option>
            </select>
          </div>
          <div>
            <Label>Access Control</Label>
            <select
              className="w-full p-2 border rounded mt-1"
              value={accessControl}
              onChange={(e) => setAccessControl(e.target.value)}
            >
              <option>Role-Based</option>
              <option>Attribute-Based</option>
              <option>Multi-Factor</option>
            </select>
          </div>
          <div className="flex space-x-2 pt-4">
            <Button onClick={handleUpdate} className="flex-1">
              Update
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const FaultModal = ({ onClose, onUpdate, currentSettings }) => {
  const [redundancyLevel, setRedundancyLevel] = useState(
    currentSettings.redundancyLevel
  );
  const [recoveryTime, setRecoveryTime] = useState(
    currentSettings.recoveryTime
  );

  const handleUpdate = () => {
    onUpdate({ redundancyLevel, recoveryTime });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Fault Tolerance Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Redundancy Level</Label>
            <select
              className="w-full p-2 border rounded mt-1"
              value={redundancyLevel}
              onChange={(e) => setRedundancyLevel(e.target.value)}
            >
              <option>2x Replication</option>
              <option>3x Replication</option>
              <option>5x Replication</option>
            </select>
          </div>
          <div>
            <Label>Recovery Time</Label>
            <select
              className="w-full p-2 border rounded mt-1"
              value={recoveryTime}
              onChange={(e) => setRecoveryTime(e.target.value)}
            >
              <option>&lt; 15 seconds</option>
              <option>&lt; 30 seconds</option>
              <option>&lt; 60 seconds</option>
            </select>
          </div>
          <div className="flex space-x-2 pt-4">
            <Button onClick={handleUpdate} className="flex-1">
              Update
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SystemSettingsModal = ({ onClose, dashboardData, setDashboardData }) => {
  const clearAllData = () => {
    if (
      confirm("Are you sure you want to clear all data? This cannot be undone.")
    ) {
      localStorage.removeItem("blockchain_expert_dashboard");
      setDashboardData({
        stats: {
          totalTransactions: 0,
          networkHealth: 100,
          securityScore: 100,
          activeNodes: 0,
        },
        recentTransactions: [],
        systemAlerts: [],
        consensusSettings: { algorithm: "Proof of Authority", blockTime: 15 },
        securitySettings: {
          encryptionLevel: "AES-256",
          accessControl: "Role-Based",
        },
        faultTolerance: {
          redundancyLevel: "3x Replication",
          recoveryTime: "< 30 seconds",
        },
      });
      onClose();
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(dashboardData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "blockchain-dashboard-data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={exportData} className="w-full" variant="outline">
            Export Dashboard Data
          </Button>
          <Button
            onClick={clearAllData}
            className="w-full"
            variant="destructive"
          >
            Clear All Data
          </Button>
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockchainExpertDashboard;
